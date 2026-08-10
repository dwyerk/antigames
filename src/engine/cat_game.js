// 2D Co-Op Platformer Engine for Super Mario Cat (Antigames #4)
import { CAT_LEVELS, TILE } from '../levels/cat_levels.js';
import { SFX } from '../audio/sfx.js';

const TILE_SIZE = 32;
const GRAVITY = 0.5;

export class CatGameEngine {
  constructor(canvas, ctx, callbacks) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.callbacks = callbacks || {};

    this.levelIndex = 0;
    this.level = null;

    this.keys = {};

    this.players = [];
    this.mice = [];
    this.dogs = [];
    this.laserDot = null;
    this.laserTimer = 0;
    this.laserActive = false;

    this.cameraX1 = 0;
    this.cameraX2 = 0;
    this.isSplitScreen = false;
    this.isGameOver = false;
    this.isStageComplete = false;

    this.bindInputs();
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  loadLevel(index = 0) {
    this.levelIndex = index % CAT_LEVELS.length;
    this.level = CAT_LEVELS[this.levelIndex];

    const p1SpawnX = this.level.spawnP1.tileX * TILE_SIZE;
    const p1SpawnY = this.level.spawnP1.tileY * TILE_SIZE;
    const p2SpawnX = this.level.spawnP2.tileX * TILE_SIZE;
    const p2SpawnY = this.level.spawnP2.tileY * TILE_SIZE;

    this.players = [
      {
        id: 1,
        name: 'Orange Tabby',
        x: p1SpawnX,
        y: p1SpawnY,
        vx: 0,
        vy: 0,
        w: 24,
        h: 28,
        isBig: false,
        isGrounded: false,
        invulnerableTimer: 0,
        color: '#ff9900',
        earColor: '#cc6600',
        score: 0,
      },
      {
        id: 2,
        name: 'Shadow Cat',
        x: p2SpawnX,
        y: p2SpawnY,
        vx: 0,
        vy: 0,
        w: 24,
        h: 28,
        isBig: false,
        isGrounded: false,
        invulnerableTimer: 0,
        color: '#333b48',
        earColor: '#1a202c',
        score: 0,
      }
    ];

    // Spawn Mice
    this.mice = this.level.mice.map(m => ({
      x: m.tileX * TILE_SIZE + 4,
      y: m.tileY * TILE_SIZE + 8,
      w: 20,
      h: 16,
      eaten: false,
    }));

    // Spawn Dog Enemies
    this.dogs = this.level.dogs.map(d => ({
      type: d.type,
      x: d.tileX * TILE_SIZE,
      y: d.tileY * TILE_SIZE,
      startX: d.tileX * TILE_SIZE,
      w: d.type === 'bulldog' ? 36 : 28,
      h: d.type === 'bulldog' ? 32 : 24,
      vx: d.speed,
      range: d.range * TILE_SIZE,
      defeated: false,
    }));

    // Reset Laser Dot & State
    this.laserDot = null;
    this.laserTimer = 0;
    this.laserActive = false;
    this.isStageComplete = false;
    this.isGameOver = false;
  }

  update() {
    if (this.isGameOver || this.isStageComplete || !this.level) return;

    this.updateLaserFrenzy();
    this.updatePlayers();
    this.updateDogs();
    this.updateCollisions();
    this.updateCameras();
  }

  updateLaserFrenzy() {
    this.laserTimer++;
    if (!this.laserActive && this.laserTimer > 400 && Math.random() < 0.02) {
      this.laserActive = true;
      this.laserTimer = 0;
      const p1 = this.players[0];
      this.laserDot = { x: p1.x + 200, y: 350, vx: 2.5 };
      SFX.sfxElectricitySpark();
    }

    if (this.laserActive && this.laserDot) {
      this.laserDot.x += this.laserDot.vx;
      if (this.laserDot.x > (this.level.width - 5) * TILE_SIZE || this.laserDot.x < 100) {
        this.laserDot.vx *= -1;
      }

      if (this.laserTimer > 300) {
        this.laserActive = false;
        this.laserDot = null;
      }
    }
  }

  updatePlayers() {
    // Player 1 Controls (WASD)
    const p1 = this.players[0];
    let speed1 = p1.isBig ? 4.5 : 3.8;
    if (this.laserActive) speed1 *= 1.4; // Laser Frenzy speed boost

    p1.vx = 0;
    if (this.keys['KeyA']) p1.vx = -speed1;
    if (this.keys['KeyD']) p1.vx = speed1;
    if (this.keys['KeyW'] && p1.isGrounded) {
      p1.vy = p1.isBig ? -12.5 : -11.0;
      p1.isGrounded = false;
      SFX.sfxDropSand();
    }

    // Player 2 Controls (Arrow Keys)
    const p2 = this.players[1];
    let speed2 = p2.isBig ? 4.5 : 3.8;
    if (this.laserActive) speed2 *= 1.4;

    p2.vx = 0;
    if (this.keys['ArrowLeft']) p2.vx = -speed2;
    if (this.keys['ArrowRight']) p2.vx = speed2;
    if (this.keys['ArrowUp'] && p2.isGrounded) {
      p2.vy = p2.isBig ? -12.5 : -11.0;
      p2.isGrounded = false;
      SFX.sfxDropSand();
    }

    // Apply gravity & physics to both cats
    this.players.forEach(p => {
      if (p.invulnerableTimer > 0) p.invulnerableTimer--;

      p.vy += GRAVITY;
      p.x += p.vx;
      this.handleHorizontalCollision(p);

      p.y += p.vy;
      this.handleVerticalCollision(p);

      // Check level goal post (Golden Collar)
      const goalX = this.level.goalX * TILE_SIZE;
      if (p.x >= goalX) {
        this.triggerStageComplete();
      }

      // Check bottom pit death
      if (p.y > this.canvas.height + 100) {
        this.handlePlayerDamage(p);
      }
    });
  }

  handleHorizontalCollision(p) {
    const minTileX = Math.floor(p.x / TILE_SIZE);
    const maxTileX = Math.floor((p.x + p.w) / TILE_SIZE);
    const minTileY = Math.floor(p.y / TILE_SIZE);
    const maxTileY = Math.floor((p.y + p.h - 1) / TILE_SIZE);

    for (let ty = minTileY; ty <= maxTileY; ty++) {
      for (let tx = minTileX; tx <= maxTileX; tx++) {
        if (this.isSolidTile(tx, ty, p.isBig)) {
          if (p.vx > 0) {
            p.x = tx * TILE_SIZE - p.w;
          } else if (p.vx < 0) {
            p.x = (tx + 1) * TILE_SIZE;
          }
        }
      }
    }
  }

  handleVerticalCollision(p) {
    const minTileX = Math.floor(p.x / TILE_SIZE);
    const maxTileX = Math.floor((p.x + p.w - 1) / TILE_SIZE);
    const minTileY = Math.floor(p.y / TILE_SIZE);
    const maxTileY = Math.floor((p.y + p.h) / TILE_SIZE);

    for (let ty = minTileY; ty <= maxTileY; ty++) {
      for (let tx = minTileX; tx <= maxTileX; tx++) {
        if (this.isSolidTile(tx, ty, p.isBig)) {
          if (p.vy > 0) {
            p.y = ty * TILE_SIZE - p.h;
            p.vy = 0;
            p.isGrounded = true;
          } else if (p.vy < 0) {
            p.y = (ty + 1) * TILE_SIZE;
            p.vy = 0;
            this.handleHeadbuttBlock(tx, ty, p);
          }
        }
      }
    }
  }

  handleHeadbuttBlock(tx, ty, player) {
    for (const plat of this.level.platforms) {
      if (tx >= plat.x && tx < plat.x + plat.w && ty >= plat.y && ty < plat.y + plat.h) {
        if (plat.type === TILE.BLOCK_ITEM) {
          plat.type = TILE.BLOCK_USED; // Change to used block
          SFX.sfxGoalTriggered(2); // Play powerup chime sound!

          // Spawn Mouse Power-Up right on top of the block!
          this.mice.push({
            x: tx * TILE_SIZE + 4,
            y: (ty - 1) * TILE_SIZE + 8,
            w: 20,
            h: 16,
            eaten: false,
          });
        }
      }
    }
  }

  isSolidTile(tx, ty, isBigCat = false) {
    if (tx < 0 || tx >= this.level.width || ty < 0 || ty >= this.level.height) return false;

    // Check platform arrays
    for (const plat of this.level.platforms) {
      if (tx >= plat.x && tx < plat.x + plat.w && ty >= plat.y && ty < plat.y + plat.h) {
        if (plat.type === TILE.BRICK && isBigCat) {
          // Big Cat breaks bricks!
          plat.w = 0; // destroyed
          SFX.sfxAntiMatterExplode();
          return false;
        }
        return plat.type !== TILE.WATER;
      }
    }
    return false;
  }

  updateDogs() {
    this.dogs.forEach(d => {
      if (d.defeated) return;

      d.x += d.vx;
      if (d.x > d.startX + d.range || d.x < d.startX) {
        d.vx *= -1;
      }
    });
  }

  updateCollisions() {
    this.players.forEach(p => {
      // 1. Mouse catching -> Grow Big Cat!
      this.mice.forEach(m => {
        if (!m.eaten && this.checkAABB(p, m)) {
          m.eaten = true;
          p.score += 500;
          if (!p.isBig) {
            p.isBig = true;
            p.h = 44; // Grow to Big Cat!
            p.y -= 16;
            SFX.sfxGoalTriggered(2);
          }
        }
      });

      // 2. Dog Enemy Collisions
      this.dogs.forEach(d => {
        if (!d.defeated && this.checkAABB(p, d)) {
          // Check if cat jumped on top of dog's head
          const jumpedOnHead = (p.vy > 0 && p.y + p.h - p.vy <= d.y + 12);

          if (jumpedOnHead || p.isBig || this.laserActive) {
            // Stomp/Defeat dog!
            d.defeated = true;
            p.vy = -7.0; // Bounce up!
            p.score += 300;
            SFX.sfxGoalTriggered(1);
          } else {
            // Cat takes damage!
            this.handlePlayerDamage(p);
          }
        }
      });
    });
  }

  handlePlayerDamage(p) {
    if (p.invulnerableTimer > 0) return;

    if (p.isBig) {
      // Shrink back to Small Cat
      p.isBig = false;
      p.h = 28;
      p.invulnerableTimer = 60; // 1 second invulnerability
      SFX.sfxAntiMatterExplode();
    } else {
      // Small Cat dies -> Reset position
      SFX.sfxAntiMatterExplode();
      const spawnX = (p.id === 1 ? this.level.spawnP1.tileX : this.level.spawnP2.tileX) * TILE_SIZE;
      const spawnY = (p.id === 1 ? this.level.spawnP1.tileY : this.level.spawnP2.tileY) * TILE_SIZE;
      p.x = spawnX;
      p.y = spawnY;
      p.vx = 0;
      p.vy = 0;
      p.invulnerableTimer = 60;
    }
  }

  checkAABB(r1, r2) {
    return (
      r1.x < r2.x + r2.w &&
      r1.x + r1.w > r2.x &&
      r1.y < r2.y + r2.h &&
      r1.y + r1.h > r2.y
    );
  }

  updateCameras() {
    const p1 = this.players[0];
    const p2 = this.players[1];

    const dist = Math.abs(p1.x - p2.x);
    this.isSplitScreen = dist > 450; // Enable split screen if cats move far apart

    this.cameraX1 = Math.max(0, Math.min((this.level.width * TILE_SIZE) - this.canvas.width, p1.x - 300));
    this.cameraX2 = Math.max(0, Math.min((this.level.width * TILE_SIZE) - this.canvas.width, p2.x - 300));
  }

  triggerStageComplete() {
    if (this.isStageComplete) return;
    this.isStageComplete = true;

    SFX.sfxVictoryFanfare();
    if (this.callbacks.onLevelComplete) {
      this.callbacks.onLevelComplete(this.levelIndex + 1);
    }
  }

  render() {
    if (!this.level) return;

    if (this.isSplitScreen) {
      // Draw Dual Split-Screen (P1 Left, P2 Right)
      const halfW = this.canvas.width / 2;

      // P1 Viewport
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(0, 0, halfW - 2, this.canvas.height);
      this.ctx.clip();
      this.renderViewport(this.cameraX1, 0, halfW);
      this.ctx.restore();

      // P2 Viewport
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(halfW + 2, 0, halfW - 2, this.canvas.height);
      this.ctx.clip();
      this.renderViewport(this.cameraX2, halfW + 2, halfW);
      this.ctx.restore();

      // Draw Split-Screen Divider Line
      this.ctx.fillStyle = '#ff00aa';
      this.ctx.fillRect(halfW - 2, 0, 4, this.canvas.height);
    } else {
      // Single Shared Camera
      const avgX = (this.players[0].x + this.players[1].x) / 2;
      const camX = Math.max(0, Math.min((this.level.width * TILE_SIZE) - this.canvas.width, avgX - 450));
      this.renderViewport(camX, 0, this.canvas.width);
    }
  }

  renderViewport(camX, screenOffsetX, viewportWidth) {
    // 1. Draw Background Sky
    this.ctx.fillStyle = this.level.bgColor;
    this.ctx.fillRect(screenOffsetX, 0, viewportWidth, this.canvas.height);

    // 2. Draw Level Platforms & Tiles
    this.level.platforms.forEach(plat => {
      if (plat.w === 0) return; // destroyed brick

      const px = plat.x * TILE_SIZE - camX + screenOffsetX;
      const py = plat.y * TILE_SIZE;
      const pw = plat.w * TILE_SIZE;
      const ph = plat.h * TILE_SIZE;

      if (plat.type === TILE.YARN_BALL) {
        this.ctx.fillStyle = '#ff00aa';
      } else if (plat.type === TILE.BRICK) {
        this.ctx.fillStyle = '#b85d19';
      } else if (plat.type === TILE.BLOCK_ITEM) {
        this.ctx.fillStyle = '#ffea00';
      } else if (plat.type === TILE.BLOCK_USED) {
        this.ctx.fillStyle = '#7a6644';
      } else if (plat.type === TILE.LILY_PAD) {
        this.ctx.fillStyle = '#00ff66';
      } else {
        this.ctx.fillStyle = this.level.groundColor;
      }

      this.ctx.fillRect(px, py, pw, ph);

      if (plat.type === TILE.BLOCK_ITEM) {
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillText('?', px + pw / 2 - 4, py + ph - 8);
      }

      // Top platform accent line
      this.ctx.fillStyle = this.level.platformColor;
      this.ctx.fillRect(px, py, pw, 4);
    });

    // 3. Draw Golden Collar Goal Post
    const gx = this.level.goalX * TILE_SIZE - camX + screenOffsetX;
    this.ctx.fillStyle = '#ffea00';
    this.ctx.fillRect(gx, 250, 8, 230);
    this.ctx.fillStyle = '#ff00aa';
    this.ctx.beginPath();
    this.ctx.arc(gx + 4, 250, 16, 0, Math.PI * 2);
    this.ctx.fill();

    // 4. Draw Mice
    this.mice.forEach(m => {
      if (m.eaten) return;
      const mx = m.x - camX + screenOffsetX;
      this.ctx.fillStyle = '#aaaaaa';
      this.ctx.fillRect(mx, m.y, m.w, m.h);
      // Mouse ears & tail
      this.ctx.fillStyle = '#ff88aa';
      this.ctx.fillRect(mx + 2, m.y - 4, 5, 5);
      this.ctx.fillRect(mx + 13, m.y - 4, 5, 5);
    });

    // 5. Draw Dog Enemies
    this.dogs.forEach(d => {
      if (d.defeated) return;
      const dx = d.x - camX + screenOffsetX;

      this.ctx.fillStyle = d.type === 'bulldog' ? '#8b4513' : d.type === 'corgi' ? '#d2691e' : '#cd853f';
      this.ctx.fillRect(dx, d.y, d.w, d.h);

      // Dog collar
      this.ctx.fillStyle = '#ff0000';
      this.ctx.fillRect(dx + 2, d.y + 4, d.w - 4, 4);
    });

    // 6. Draw AI Laser Frenzy Red Dot
    if (this.laserActive && this.laserDot) {
      const lx = this.laserDot.x - camX + screenOffsetX;
      this.ctx.save();
      this.ctx.fillStyle = '#ff0033';
      this.ctx.shadowColor = '#ff0033';
      this.ctx.shadowBlur = 12;
      this.ctx.beginPath();
      this.ctx.arc(lx, this.laserDot.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 7. Draw Cats (P1 & P2)
    this.players.forEach(p => {
      if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 4) % 2 === 0) return; // flash

      const cx = p.x - camX + screenOffsetX;
      const cy = p.y;

      // Cat Body
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(cx, cy, p.w, p.h);

      // Cat Ears
      this.ctx.fillStyle = p.earColor;
      this.ctx.beginPath();
      this.ctx.moveTo(cx + 2, cy);
      this.ctx.lineTo(cx + 8, cy - 8);
      this.ctx.lineTo(cx + 12, cy);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(cx + p.w - 12, cy);
      this.ctx.lineTo(cx + p.w - 8, cy - 8);
      this.ctx.lineTo(cx + p.w - 2, cy);
      this.ctx.fill();

      // Cat Eyes
      this.ctx.fillStyle = '#ffea00';
      this.ctx.fillRect(cx + (p.vx >= 0 ? p.w - 10 : 4), cy + 6, 4, 4);

      // Cat Tail
      this.ctx.strokeStyle = p.color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(cx + (p.vx >= 0 ? 2 : p.w - 2), cy + p.h - 6);
      this.ctx.lineTo(cx + (p.vx >= 0 ? -8 : p.w + 8), cy + p.h - 14);
      this.ctx.stroke();
    });
  }
}
