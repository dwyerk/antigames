// Authentic Super Mario Bros 3 Style Overworld Map Controller
import { WORLDS } from '../levels/cat_levels.js';

export class OverworldMapController {
  constructor(container, onSelectLevel) {
    this.container = container;
    this.onSelectLevel = onSelectLevel;

    this.playerCount = 1; // 1 or 2 Players
    this.currentWorldIdx = 0;
    this.currentNodeIdx = 0;

    // Highest unlocked level per world: { 0: 0, 1: 0, 2: 0, 3: 0 }
    this.unlockedLevels = { 0: 0, 1: 0, 2: 0, 3: 0 };

    // Persistent Active Powerup inventory: 'MOUSE_BIG' | 'LASER_BELL' | 'CATNIP_SHIELD' | 'SUPER_WHISKERS'
    this.activePowerup = null;

    this.isVisible = false;
  }

  init() {
    this.bindEvents();
  }

  unlockNextLevel(worldIdx, levelNum) {
    if (levelNum >= 10 && worldIdx < 3) {
      // Completed World Fortress -> Unlock next World!
      this.unlockedLevels[worldIdx + 1] = Math.max(this.unlockedLevels[worldIdx + 1] || 0, 0);
      this.currentWorldIdx = worldIdx + 1;
      this.currentNodeIdx = 0;
    } else {
      this.unlockedLevels[worldIdx] = Math.max(this.unlockedLevels[worldIdx] || 0, levelNum);
      const world = WORLDS[worldIdx];
      // Automatically advance map cursor to newly unlocked level node!
      this.currentNodeIdx = Math.min(world.nodes.length - 1, levelNum);
    }

    this.render();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isVisible) return;

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.navigate(-1);
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.navigate(1);
      } else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.launchSelectedLevel();
      }
    });
  }

  navigate(dir) {
    const world = WORLDS[this.currentWorldIdx];
    const maxUnlocked = this.unlockedLevels[this.currentWorldIdx] || 0;

    const nextIdx = this.currentNodeIdx + dir;
    if (nextIdx >= 0 && nextIdx < world.nodes.length) {
      const node = world.nodes[nextIdx];
      if (node.levelNum <= maxUnlocked + 1) {
        this.currentNodeIdx = nextIdx;
        this.render();
      }
    }
  }

  switchWorld(worldIdx) {
    if (worldIdx >= 0 && worldIdx < WORLDS.length) {
      this.currentWorldIdx = worldIdx;
      this.currentNodeIdx = 0;
      this.render();
    }
  }

  launchSelectedLevel() {
    const world = WORLDS[this.currentWorldIdx];
    const node = world.nodes[this.currentNodeIdx];

    if (node.type === 'bonus') {
      this.showCatnipHouseModal();
      return;
    }

    this.hide();

    if (this.onSelectLevel) {
      this.onSelectLevel(this.currentWorldIdx, node.levelNum - 1, this.playerCount, this.activePowerup);
    }
  }

  showCatnipHouseModal() {
    const powerups = [
      { id: 'MOUSE_BIG', name: '🧀 Giant Cheese Mouse', desc: 'Grow into Big Cat standing on two legs!' },
      { id: 'LASER_BELL', name: '🔔 Super Laser Bell', desc: 'Emits a laser pulse that scares away dogs!' },
      { id: 'CATNIP_SHIELD', name: '🌿 Golden Catnip Shield', desc: 'Invulnerability shield protecting against dog bites!' },
      { id: 'SUPER_WHISKERS', name: '🐾 Super Whiskers', desc: 'High double-jump spring boost!' },
    ];

    const randomP = powerups[Math.floor(Math.random() * powerups.length)];

    const modalHTML = `
      <div class="modal-box retro-border" style="max-width:520px; text-align:center;">
        <h2 style="color:var(--neon-yellow); font-size:18px;">🌿 CATNIP HOUSE BONUS GIFT</h2>
        <p style="font-size:15px; color:var(--text-muted); margin-top:6px;">
          Pick a mystery box to reveal a cat powerup!
        </p>

        <div style="display:flex; justify-content:center; gap:16px; margin:20px 0;">
          <button class="retro-btn gift-box-btn" data-box="1">🎁 BOX 1</button>
          <button class="retro-btn gift-box-btn" data-box="2">🎁 BOX 2</button>
          <button class="retro-btn gift-box-btn" data-box="3">🎁 BOX 3</button>
        </div>

        <div id="gift-result-box" class="hidden card" style="background:#1c2444; border:1px solid var(--neon-cyan); padding:12px;">
          <h3 id="gift-title" style="color:var(--neon-green); font-size:16px;">${randomP.name}</h3>
          <p id="gift-desc" style="font-size:14px; color:#fff; margin-top:4px;">${randomP.desc}</p>
        </div>

        <div style="margin-top:16px;">
          <button id="btn-close-catnip-house" class="retro-btn primary">CONTINUE ON MAP ➔</button>
        </div>
      </div>
    `;

    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = modalHTML;
    overlay.classList.remove('hidden');

    document.querySelectorAll('.gift-box-btn').forEach(btn => {
      btn.onclick = () => {
        this.activePowerup = randomP.id;
        document.getElementById('gift-result-box').classList.remove('hidden');
        document.querySelectorAll('.gift-box-btn').forEach(b => b.disabled = true);
      };
    });

    document.getElementById('btn-close-catnip-house').onclick = () => {
      overlay.classList.add('hidden');
      this.render();
    };
  }

  show() {
    this.isVisible = true;
    this.container.classList.remove('hidden');
    this.render();
  }

  hide() {
    this.isVisible = false;
    this.container.classList.add('hidden');
  }

  render() {
    const world = WORLDS[this.currentWorldIdx];
    const maxUnlocked = this.unlockedLevels[this.currentWorldIdx] || 0;

    // World Selector Tabs
    const tabsHTML = WORLDS.map((w, idx) => {
      const isWorldUnlocked = (idx === 0 || (this.unlockedLevels[idx - 1] && this.unlockedLevels[idx - 1] >= 10));
      const isActive = idx === this.currentWorldIdx;

      return `
        <button class="world-tab ${isActive ? 'active' : ''} ${isWorldUnlocked ? '' : 'disabled'}" data-world-idx="${idx}">
          ${w.name}
        </button>
      `;
    }).join('');

    // SMB3 8x4 Grid Map
    const gridCols = 8;
    const gridRows = 4;
    let gridHTML = '';

    for (let r = 1; r <= gridRows; r++) {
      for (let c = 1; c <= gridCols; c++) {
        const nodeIdx = world.nodes.findIndex(n => n.gridX === c && n.gridY === r);

        if (nodeIdx !== -1) {
          const node = world.nodes[nodeIdx];
          const isUnlocked = node.levelNum <= maxUnlocked + 1;
          const isSelected = nodeIdx === this.currentNodeIdx;

          let icon = '⭐';
          if (node.type === 'fortress') icon = '🏰';
          if (node.type === 'bonus') icon = '📦';

          gridHTML += `
            <div class="smb3-grid-cell node-cell ${isSelected ? 'selected' : isUnlocked ? 'unlocked' : 'locked'}" data-node-idx="${nodeIdx}">
              <span class="cell-icon">${isSelected ? '🐱' : isUnlocked ? icon : '🔒'}</span>
              <span class="cell-num">${node.name}</span>
              ${isSelected ? '<span class="cell-pointer">▼</span>' : ''}
            </div>
          `;
        } else {
          gridHTML += `<div class="smb3-grid-cell path-cell">▪</div>`;
        }
      }
    }

    const currentNode = world.nodes[this.currentNodeIdx];

    const powerupNames = {
      'MOUSE_BIG': '🧀 Giant Cheese Mouse (Big Cat)',
      'LASER_BELL': '🔔 Super Laser Bell',
      'CATNIP_SHIELD': '🌿 Golden Catnip Shield',
      'SUPER_WHISKERS': '🐾 Super Whiskers',
    };

    this.container.innerHTML = `
      <div class="overworld-box retro-border smb3-map-box">
        <div class="overworld-header">
          <span class="brand-badge">SUPER MARIO BROS 3 WORLD MAP</span>
          <h2 style="font-size:18px; color:var(--neon-yellow);">${world.name}</h2>
        </div>

        <!-- Player Count Selector (1P Solo vs 2P Local Co-Op) -->
        <div class="player-mode-toggle">
          <button id="btn-mode-1p" class="retro-btn ${this.playerCount === 1 ? 'primary active' : ''}">🐱 1-PLAYER SOLO</button>
          <button id="btn-mode-2p" class="retro-btn ${this.playerCount === 2 ? 'primary active' : ''}">🐱🐱 2-PLAYER LOCAL CO-OP</button>
        </div>

        <!-- World Selection Tabs -->
        <div class="world-tabs-bar">
          ${tabsHTML}
        </div>

        <!-- Authentic SMB3 8x4 Grid Map Track -->
        <div class="smb3-map-grid retro-border">
          ${gridHTML}
        </div>

        <div class="overworld-details card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>SELECTED: <span style="color:var(--neon-yellow);">${currentNode ? currentNode.name : 'Level 1'}</span></h3>
            <span style="font-size:13px; color:var(--neon-cyan);">EQUIPPED: ${this.activePowerup ? powerupNames[this.activePowerup] : 'None'}</span>
          </div>
          <p style="font-size:15px; color:var(--text-muted); margin-top:4px;">
            Mode: <strong>${this.playerCount === 1 ? '1-Player Solo Cat (WASD / Arrows)' : '2-Player Local Co-Op (P1: WASD | P2: Arrows)'}</strong>
          </p>
          <div class="modal-buttons" style="margin-top:10px;">
            <button id="btn-start-map-level" class="retro-btn primary">ENTER LEVEL ➔ [SPACEBAR]</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-mode-1p').onclick = () => {
      this.playerCount = 1;
      this.render();
    };

    document.getElementById('btn-mode-2p').onclick = () => {
      this.playerCount = 2;
      this.render();
    };

    document.querySelectorAll('.world-tab').forEach(tab => {
      tab.onclick = () => {
        const wIdx = parseInt(tab.dataset.worldIdx, 10);
        this.switchWorld(wIdx);
      };
    });

    document.querySelectorAll('.node-cell.unlocked, .node-cell.selected').forEach(cell => {
      cell.onclick = () => {
        const nIdx = parseInt(cell.dataset.nodeIdx, 10);
        this.currentNodeIdx = nIdx;
        this.render();
      };
    });

    const startBtn = document.getElementById('btn-start-map-level');
    if (startBtn) {
      startBtn.onclick = () => this.launchSelectedLevel();
    }
  }
}
