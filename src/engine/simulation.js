// 2D Cellular Automata Physics Engine for Antigravity Sand: Kinetic Chain
import { GRID_WIDTH, GRID_HEIGHT, ELEMENT } from './constants.js';
import { SFX } from '../audio/sfx.js';

export class SimulationEngine {
  constructor() {
    this.width = GRID_WIDTH;
    this.height = GRID_HEIGHT;
    this.grid = new Uint8Array(this.width * this.height);
    this.updated = new Uint8Array(this.width * this.height);
    
    this.vesselCapacity = 1000;
    this.innerMask = null; // Bitset of cells inside vessel interior
    this.filledParticleCount = 0;

    this.portalA = null;
    this.portalB = null;
    this.magnetites = [];
    this.tickCount = 0;
  }

  reset() {
    this.grid.fill(ELEMENT.EMPTY);
    this.updated.fill(0);
    this.filledParticleCount = 0;
    this.innerMask = null;
    this.portalA = null;
    this.portalB = null;
    this.magnetites = [];
    this.tickCount = 0;
  }

  getIndex(x, y) {
    return y * this.width + x;
  }

  get(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return ELEMENT.BOTTLE;
    }
    return this.grid[y * this.width + x];
  }

  set(x, y, type) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = y * this.width + x;
    this.grid[idx] = type;

    if (type === ELEMENT.PORTAL_A) this.portalA = { x, y };
    if (type === ELEMENT.PORTAL_B) this.portalB = { x, y };
    if (type === ELEMENT.MAGNETITE) {
      if (!this.magnetites.some(m => m.x === x && m.y === y)) {
        this.magnetites.push({ x, y });
      }
    }
  }

  isEmpty(x, y) {
    return this.get(x, y) === ELEMENT.EMPTY;
  }

  swap(x1, y1, x2, y2) {
    const idx1 = this.getIndex(x1, y1);
    const idx2 = this.getIndex(x2, y2);
    const temp = this.grid[idx1];
    this.grid[idx1] = this.grid[idx2];
    this.grid[idx2] = temp;
    this.updated[idx2] = 1;
  }

  loadBottleMask(mask, capacity = 2000, innerMask = null) {
    this.vesselCapacity = capacity;
    this.innerMask = innerMask;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (mask[y] && mask[y][x]) {
          this.set(x, y, mask[y][x]);
        }
      }
    }
  }

  // Calculate filled percentage strictly for particles inside the vessel interior
  getFillPercentage() {
    let filled = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;

        // ONLY count particles located inside the vessel interior mask!
        if (this.innerMask && this.innerMask[idx] === 1) {
          const t = this.grid[idx];
          if (
            t !== ELEMENT.EMPTY &&
            t !== ELEMENT.BOTTLE &&
            t !== ELEMENT.RAMP_LEFT &&
            t !== ELEMENT.RAMP_RIGHT &&
            t !== ELEMENT.CONDUCTOR
          ) {
            filled++;
          }
        }
      }
    }

    this.filledParticleCount = filled;
    return Math.min(100, Math.floor((filled / this.vesselCapacity) * 100));
  }

  step() {
    this.updated.fill(0);
    this.tickCount++;

    for (let y = this.height - 1; y >= 0; y--) {
      const leftToRight = (y + this.tickCount) % 2 === 0;
      const startX = leftToRight ? 0 : this.width - 1;
      const endX = leftToRight ? this.width : -1;
      const stepX = leftToRight ? 1 : -1;

      for (let x = startX; x !== endX; x += stepX) {
        const idx = this.getIndex(x, y);
        if (this.updated[idx]) continue;

        const type = this.grid[idx];
        if (type === ELEMENT.EMPTY || type === ELEMENT.BOTTLE) continue;

        this.updateParticle(x, y, type, idx);
      }
    }
  }

  updateParticle(x, y, type, idx) {
    switch (type) {
      case ELEMENT.SAND_GOLD:
      case ELEMENT.SAND_BLUE:
      case ELEMENT.SAND_PINK:
      case ELEMENT.SAND_GREEN:
      case ELEMENT.LAVA:
      case ELEMENT.ACID:
        this.updateGravSand(x, y);
        break;

      case ELEMENT.ANTI_GRAV:
        this.updateAntiGravSand(x, y);
        break;

      case ELEMENT.LASER_SAND:
        this.updateLaserSand(x, y);
        break;

      case ELEMENT.LASER_BEAM_L:
      case ELEMENT.LASER_BEAM_R:
      case ELEMENT.LASER_BEAM_U:
      case ELEMENT.LASER_BEAM_D:
        this.updateLaserBeam(x, y, type);
        break;

      case ELEMENT.ANTI_MATTER:
        this.updateAntiMatter(x, y);
        break;

      case ELEMENT.ELECTRICITY:
        this.updateElectricity(x, y);
        break;

      case ELEMENT.STEAM:
        this.updateSteam(x, y);
        break;
    }
  }

  updateGravSand(x, y) {
    if (this.magnetites.length > 0) {
      const mag = this.magnetites[0];
      const dx = mag.x - x;
      const dy = mag.y - y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 1600 && distSq > 4) {
        const stepX = Math.sign(dx);
        const stepY = Math.sign(dy);
        if (this.isEmpty(x + stepX, y + stepY)) {
          this.swap(x, y, x + stepX, y + stepY);
          return;
        }
      }
    }

    if (this.portalA && this.portalB) {
      if (Math.abs(x - this.portalA.x) <= 1 && Math.abs(y - this.portalA.y) <= 1) {
        const targetX = this.portalB.x;
        const targetY = this.portalB.y + 2;
        if (this.isEmpty(targetX, targetY)) {
          this.set(x, y, ELEMENT.EMPTY);
          this.set(targetX, targetY, this.get(x, y));
          SFX.sfxPortalWarp();
          return;
        }
      }
    }

    const below = this.get(x, y + 1);
    if (this.isEmpty(x, y + 1)) {
      this.swap(x, y, x, y + 1);
    } else if (below === ELEMENT.RAMP_LEFT && this.isEmpty(x - 1, y + 1)) {
      this.swap(x, y, x - 1, y + 1);
    } else if (below === ELEMENT.RAMP_RIGHT && this.isEmpty(x + 1, y + 1)) {
      this.swap(x, y, x + 1, y + 1);
    } else {
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.isEmpty(x + dir, y + 1)) {
        this.swap(x, y, x + dir, y + 1);
      } else if (this.isEmpty(x - dir, y + 1)) {
        this.swap(x, y, x - dir, y + 1);
      }
    }
  }

  updateAntiGravSand(x, y) {
    if (this.isEmpty(x, y - 1)) {
      this.swap(x, y, x, y - 1);
    } else {
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.isEmpty(x + dir, y - 1)) {
        this.swap(x, y, x + dir, y - 1);
      } else if (this.isEmpty(x - dir, y - 1)) {
        this.swap(x, y, x - dir, y - 1);
      }
    }
  }

  updateLaserSand(x, y) {
    if (this.isEmpty(x - 1, y)) {
      this.set(x - 1, y, ELEMENT.LASER_BEAM_L);
    }
    if (this.isEmpty(x + 1, y)) {
      this.set(x + 1, y, ELEMENT.LASER_BEAM_R);
    }

    const below = this.get(x, y + 1);
    if (this.isEmpty(x, y + 1)) {
      this.swap(x, y, x, y + 1);
    } else if (below === ELEMENT.RAMP_LEFT && this.isEmpty(x - 1, y + 1)) {
      this.swap(x, y, x - 1, y + 1);
    } else if (below === ELEMENT.RAMP_RIGHT && this.isEmpty(x + 1, y + 1)) {
      this.swap(x, y, x + 1, y + 1);
    } else {
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.isEmpty(x + dir, y + 1)) {
        this.swap(x, y, x + dir, y + 1);
      } else if (this.isEmpty(x - dir, y + 1)) {
        this.swap(x, y, x - dir, y + 1);
      }
    }
  }

  updateLaserBeam(x, y, type) {
    let dx = 0;
    let dy = 0;
    if (type === ELEMENT.LASER_BEAM_L) dx = -1;
    if (type === ELEMENT.LASER_BEAM_R) dx = 1;
    if (type === ELEMENT.LASER_BEAM_U) dy = -1;
    if (type === ELEMENT.LASER_BEAM_D) dy = 1;

    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) {
      this.set(x, y, ELEMENT.EMPTY);
      return;
    }

    const target = this.get(nx, ny);

    if (target === ELEMENT.EMPTY) {
      this.swap(x, y, nx, ny);
    } else if (target === ELEMENT.RAMP_LEFT) {
      let nextType = ELEMENT.LASER_BEAM_U;
      if (type === ELEMENT.LASER_BEAM_L) nextType = ELEMENT.LASER_BEAM_D;
      if (type === ELEMENT.LASER_BEAM_R) nextType = ELEMENT.LASER_BEAM_U;
      if (type === ELEMENT.LASER_BEAM_U) nextType = ELEMENT.LASER_BEAM_L;
      if (type === ELEMENT.LASER_BEAM_D) nextType = ELEMENT.LASER_BEAM_R;

      this.set(x, y, nextType);
    } else if (target === ELEMENT.RAMP_RIGHT) {
      let nextType = ELEMENT.LASER_BEAM_U;
      if (type === ELEMENT.LASER_BEAM_L) nextType = ELEMENT.LASER_BEAM_U;
      if (type === ELEMENT.LASER_BEAM_R) nextType = ELEMENT.LASER_BEAM_D;
      if (type === ELEMENT.LASER_BEAM_U) nextType = ELEMENT.LASER_BEAM_R;
      if (type === ELEMENT.LASER_BEAM_D) nextType = ELEMENT.LASER_BEAM_L;

      this.set(x, y, nextType);
    } else {
      this.set(x, y, ELEMENT.EMPTY);
    }
  }

  updateAntiMatter(x, y) {
    let exploded = false;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const type = this.get(nx, ny);

        if (
          type !== ELEMENT.EMPTY &&
          type !== ELEMENT.BOTTLE &&
          type !== ELEMENT.ANTI_MATTER
        ) {
          this.set(nx, ny, ELEMENT.STEAM);
          exploded = true;
        }
      }
    }

    if (exploded) {
      this.set(x, y, ELEMENT.STEAM);
      SFX.sfxAntiMatterExplode();
      return;
    }

    const below = this.get(x, y + 1);
    if (this.isEmpty(x, y + 1)) {
      this.swap(x, y, x, y + 1);
    } else if (below === ELEMENT.RAMP_LEFT && this.isEmpty(x - 1, y + 1)) {
      this.swap(x, y, x - 1, y + 1);
    } else if (below === ELEMENT.RAMP_RIGHT && this.isEmpty(x + 1, y + 1)) {
      this.swap(x, y, x + 1, y + 1);
    } else {
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.isEmpty(x + dir, y + 1)) {
        this.swap(x, y, x + dir, y + 1);
      } else if (this.isEmpty(x - dir, y + 1)) {
        this.swap(x, y, x - dir, y + 1);
      }
    }
  }

  updateElectricity(x, y) {
    const neighbors = [
      { x: x + 1, y }, { x: x - 1, y },
      { x, y: y + 1 }, { x, y: y - 1 }
    ];

    for (const n of neighbors) {
      const type = this.get(n.x, n.y);
      if (type === ELEMENT.CONDUCTOR && Math.random() < 0.3) {
        this.set(n.x, n.y, ELEMENT.ELECTRICITY);
        SFX.sfxElectricitySpark();
      }
    }

    if (Math.random() < 0.4) {
      this.set(x, y, ELEMENT.EMPTY);
    }
  }

  updateSteam(x, y) {
    if (this.isEmpty(x, y - 1)) {
      this.swap(x, y, x, y - 1);
    }
    if (Math.random() < 0.1) {
      this.set(x, y, ELEMENT.EMPTY);
    }
  }
}
