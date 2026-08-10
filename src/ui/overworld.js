// Super Mario Bros 3 Style Overworld World Map Screen for Super Mario Cat
import { CAT_LEVELS } from '../levels/cat_levels.js';

export class OverworldMapController {
  constructor(container, onSelectLevel) {
    this.container = container;
    this.onSelectLevel = onSelectLevel;

    this.selectedNodeIndex = 0;
    this.unlockedIndex = 0; // Highest unlocked level (0 -> 3)
    this.isVisible = false;
  }

  init() {
    this.bindEvents();
  }

  unlockLevel(levelNum) {
    if (levelNum > this.unlockedIndex && levelNum < CAT_LEVELS.length) {
      this.unlockedIndex = levelNum;
    }
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
    const nextIdx = this.selectedNodeIndex + dir;
    if (nextIdx >= 0 && nextIdx <= this.unlockedIndex) {
      this.selectedNodeIndex = nextIdx;
      this.render();
    }
  }

  launchSelectedLevel() {
    this.hide();
    if (this.onSelectLevel) {
      this.onSelectLevel(this.selectedNodeIndex);
    }
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
    let nodesHTML = CAT_LEVELS.map((lvl, index) => {
      const isUnlocked = index <= this.unlockedIndex;
      const isSelected = index === this.selectedNodeIndex;
      const stateClass = isSelected ? 'selected' : isUnlocked ? 'unlocked' : 'locked';

      return `
        <div class="map-node ${stateClass}" data-level-idx="${index}">
          <div class="node-icon">${isSelected ? '🐱' : isUnlocked ? '⭐' : '🔒'}</div>
          <div class="node-label">${lvl.name}</div>
          ${isSelected ? '<div class="node-pointer">▼</div>' : ''}
        </div>
      `;
    }).join('<div class="map-path-line"></div>');

    const currentLvl = CAT_LEVELS[this.selectedNodeIndex];

    this.container.innerHTML = `
      <div class="overworld-box retro-border">
        <div class="overworld-header">
          <span class="brand-badge">SUPER MARIO BROS 3 MAP</span>
          <h2>🗺️ WORLD 1: CAT FANTASY OVERWORLD</h2>
        </div>

        <!-- Overworld Map Node Track -->
        <div class="map-track-container retro-border">
          ${nodesHTML}
        </div>

        <div class="overworld-details card">
          <h3>SELECTED LEVEL: <span style="color:var(--neon-yellow);">${currentLvl.name}</span></h3>
          <p style="font-size:16px; color:var(--text-muted); margin-top:4px;">
            Navigate with <strong>A / D</strong> or <strong>Arrow Keys</strong>. Press <strong>SPACEBAR</strong> to start level!
          </p>
          <div class="modal-buttons" style="margin-top:12px;">
            <button id="btn-start-map-level" class="retro-btn primary">START LEVEL ➔ [SPACEBAR]</button>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.map-node.unlocked, .map-node.selected').forEach(node => {
      node.onclick = () => {
        const idx = parseInt(node.dataset.levelIdx, 10);
        this.selectedNodeIndex = idx;
        this.render();
      };
    });

    const startBtn = document.getElementById('btn-start-map-level');
    if (startBtn) {
      startBtn.onclick = () => this.launchSelectedLevel();
    }
  }
}
