// Main Bootloader & Multi-Game Arcade Hub for Antigames
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, ELEMENT, ELEMENT_COLORS, ELEMENT_GLOW, ELEMENT_INFO } from './engine/constants.js';
import { SimulationEngine } from './engine/simulation.js';
import { generateVesselMask, VESSEL_TYPES } from './levels/bottles.js';
import { generateTargetDesign, evaluateAccuracy } from './modes/procedural.js';
import { CatGameEngine } from './engine/cat_game.js';
import { Storage } from './storage.js';
import { SFX } from './audio/sfx.js';
import { UIController } from './ui/components.js';
import { MainMenuController } from './ui/menu.js';
import { OverworldMapController } from './ui/overworld.js';

class AntigamesApp {
  constructor() {
    this.canvas = document.getElementById('sim-canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.engine = new SimulationEngine();
    this.catEngine = null;

    // App & Game Mode State
    this.activeGameMode = 'pattern-arcade'; // 'pattern-arcade' | 'sandbox' | 'laser-puzzle' | 'mario-cat'

    this.stageNumber = 1;
    this.score = 0;
    this.bottlesSealed = 0;
    this.targetFillPct = 70;
    this.currentFillPct = 0;
    this.accuracyPct = 0;
    this.vesselType = VESSEL_TYPES.JAR;
    this.targetDesign = null;
    this.isStageComplete = false;

    this.selectedElement = ELEMENT.SAND_GOLD;

    this.isPlaying = true;
    this.streamEnabled = true;
    this.simSpeed = 1;
    this.animFrameId = null;

    this.cursorPos = { x: 120, y: 30 };
    this.isHoveringCanvas = false;
    this.brushRadius = 1;
    this.sfxCounter = 0;

    this.ui = new UIController({
      nextStage: () => this.advanceToNextStage(),
      restartArcade: () => this.startArcade(),
    });

    this.overworldController = new OverworldMapController(
      document.getElementById('overworld-map-overlay'),
      (worldIdx, levelIdx, playerCount, equippedPowerup, isBigCat, isInvincibleMode, isSpeedrunMode, speedrunTotalTime) => {
        if (!this.catEngine) {
          this.catEngine = new CatGameEngine(this.canvas, this.ctx, {
            onLevelComplete: (completedWorld, nextLvl, playerWasBig, totalLevelTime) => {
              this.overworldController.unlockNextLevel(completedWorld, nextLvl, playerWasBig, totalLevelTime);
              this.overworldController.show();
            }
          });
        }
        this.catEngine.loadLevel(
          worldIdx,
          levelIdx,
          playerCount,
          equippedPowerup,
          isBigCat,
          isInvincibleMode,
          isSpeedrunMode,
          speedrunTotalTime
        );
      }
    );

    this.menuController = new MainMenuController((gameId) => {
      this.switchGameMode(gameId);
    });

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderToolbar();
    this.startLoop();
  }

  switchGameMode(gameId) {
    this.activeGameMode = gameId;
    const badge = document.getElementById('game-mode-badge');
    const bpCard = document.getElementById('blueprint-card');
    const accCard = document.getElementById('accuracy-card');
    const streamCard = document.getElementById('stream-card');
    const paletteCard = document.getElementById('palette-card');
    const marioCard = document.getElementById('mario-cat-card');

    const sandHud = document.getElementById('hud-sand-stats');
    const marioHud = document.getElementById('hud-mario-stats');
    const sandControls = document.getElementById('sim-sand-controls');
    const marioControls = document.getElementById('sim-mario-controls');
    const galleryBtn = document.getElementById('btn-gallery');

    if (gameId === 'mario-cat') {
      badge.textContent = 'SUPER MARIO CAT CO-OP';
      if (sandHud) sandHud.classList.add('hidden');
      if (marioHud) marioHud.classList.remove('hidden');
      if (sandControls) sandControls.classList.add('hidden');
      if (marioControls) marioControls.classList.remove('hidden');
      if (galleryBtn) galleryBtn.classList.add('hidden');

      bpCard.classList.add('hidden');
      accCard.classList.add('hidden');
      streamCard.classList.add('hidden');
      paletteCard.classList.add('hidden');
      if (marioCard) marioCard.classList.remove('hidden');

      if (!this.catEngine) {
        this.catEngine = new CatGameEngine(this.canvas, this.ctx, {
          onLevelComplete: (completedWorld, nextLvl, playerWasBig, totalLevelTime) => {
            this.overworldController.unlockNextLevel(completedWorld, nextLvl, playerWasBig, totalLevelTime);
            this.overworldController.show();
          }
        });
      }
      this.overworldController.show();
    } else {
      if (sandHud) sandHud.classList.remove('hidden');
      if (marioHud) marioHud.classList.add('hidden');
      if (sandControls) sandControls.classList.remove('hidden');
      if (marioControls) marioControls.classList.add('hidden');
      if (galleryBtn) galleryBtn.classList.remove('hidden');

      if (marioCard) marioCard.classList.add('hidden');
      streamCard.classList.remove('hidden');
      paletteCard.classList.remove('hidden');

      if (gameId === 'sandbox') {
        badge.textContent = 'KINETIC SAND SANDBOX';
        bpCard.classList.add('hidden');
        accCard.classList.add('hidden');
        this.stageNumber = 1;
        this.loadStage(1);
      } else if (gameId === 'laser-puzzle') {
        badge.textContent = 'LASER BOUNCE CHALLENGE';
        bpCard.classList.remove('hidden');
        accCard.classList.remove('hidden');
        this.selectedElement = ELEMENT.LASER_SAND;
        this.selectElement(ELEMENT.LASER_SAND);
        this.stageNumber = 3;
        this.loadStage(3);
      } else {
        // Pattern Arcade
        badge.textContent = 'SAND ART PATTERN ARCADE';
        bpCard.classList.remove('hidden');
        accCard.classList.remove('hidden');
        this.startArcade();
      }
    }
  }

  bindEvents() {
    const crtBtn = document.getElementById('btn-crt');
    crtBtn.onclick = () => {
      document.getElementById('app').classList.toggle('crt-enabled');
    };

    const soundBtn = document.getElementById('btn-sound');
    soundBtn.onclick = () => {
      const isMuted = SFX.toggleMute();
      soundBtn.textContent = isMuted ? '🔇 Mute' : '🔊 Sound';
    };

    document.getElementById('btn-gallery').onclick = () => {
      this.ui.showGalleryModal();
    };

    const flowBtn = document.getElementById('btn-toggle-stream');
    const playBtn = document.getElementById('btn-play');
    const pauseBtn = document.getElementById('btn-pause');
    const speedBtn = document.getElementById('btn-speed');
    const resetBtn = document.getElementById('btn-reset');
    const openMapBtn = document.getElementById('btn-open-map');
    const restartCatBtn = document.getElementById('btn-restart-cat-level');
    const catPlayPauseBtn = document.getElementById('btn-cat-play-pause');

    if (catPlayPauseBtn) {
      catPlayPauseBtn.onclick = () => {
        this.isPlaying = !this.isPlaying;
        catPlayPauseBtn.textContent = this.isPlaying ? '▶ Play' : '⏸ Pause';
        catPlayPauseBtn.classList.toggle('active', this.isPlaying);
      };
    }

    if (openMapBtn) {
      openMapBtn.onclick = () => this.overworldController.show();
    }

    if (restartCatBtn) {
      restartCatBtn.onclick = () => {
        if (this.catEngine) {
          this.catEngine.loadLevel(this.catEngine.worldIndex, this.catEngine.levelIndex, this.catEngine.playerCount);
        }
      };
    }

    flowBtn.onclick = () => {
      this.streamEnabled = !this.streamEnabled;
      flowBtn.textContent = this.streamEnabled ? '🌊 Flow: ON' : '⏸ Flow: OFF';
      flowBtn.classList.toggle('active', this.streamEnabled);
    };

    playBtn.onclick = () => {
      this.isPlaying = true;
      playBtn.classList.add('active');
      pauseBtn.classList.remove('active');
    };

    pauseBtn.onclick = () => {
      this.isPlaying = false;
      pauseBtn.classList.add('active');
      playBtn.classList.remove('active');
    };

    speedBtn.onclick = () => {
      this.simSpeed = this.simSpeed === 1 ? 2 : 1;
      speedBtn.textContent = `⏩ ${this.simSpeed}x`;
    };

    resetBtn.onclick = () => {
      if (this.activeGameMode === 'mario-cat') {
        this.catEngine.loadLevel(this.catEngine.worldIndex, this.catEngine.levelIndex, this.catEngine.playerCount);
      } else {
        this.resetVessel();
      }
    };

    // Canvas Mouse & Touch Pointer Drag Listeners
    this.canvas.addEventListener('mouseenter', () => this.isHoveringCanvas = true);
    this.canvas.addEventListener('mouseleave', () => this.isHoveringCanvas = false);

    this.canvas.addEventListener('mousemove', (e) => this.updateCursorPos(e));
    
    this.canvas.addEventListener('touchstart', (e) => {
      this.isHoveringCanvas = true;
      if (e.touches.length > 0) this.updateCursorPos(e.touches[0]);
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      this.isHoveringCanvas = true;
      if (e.touches.length > 0) this.updateCursorPos(e.touches[0]);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isHoveringCanvas = false;
    });

    window.addEventListener('keydown', (e) => {
      if (this.activeGameMode === 'mario-cat') return; // Handled by CatGameEngine

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (this.ui.isModalOpen || this.isStageComplete) {
          this.ui.hideModal();
          this.advanceToNextStage();
        } else {
          this.isPlaying = !this.isPlaying;
          playBtn.classList.toggle('active', this.isPlaying);
          pauseBtn.classList.toggle('active', !this.isPlaying);
        }
      } else if (e.key >= '1' && e.key <= '8') {
        const paletteKeys = [
          ELEMENT.SAND_GOLD,
          ELEMENT.SAND_BLUE,
          ELEMENT.SAND_PINK,
          ELEMENT.SAND_GREEN,
          ELEMENT.ANTI_GRAV,
          ELEMENT.LASER_SAND,
          ELEMENT.LAVA,
          ELEMENT.ACID,
        ];
        const idx = parseInt(e.key, 10) - 1;
        if (paletteKeys[idx]) {
          this.selectElement(paletteKeys[idx]);
        }
      } else if (e.key.toUpperCase() === 'Q') {
        this.cyclePalette(-1);
      } else if (e.key.toUpperCase() === 'E') {
        this.cyclePalette(1);
      } else if (e.key.toUpperCase() === 'R') {
        this.resetVessel();
      }
    });
  }

  cyclePalette(dir) {
    const palette = [
      ELEMENT.SAND_GOLD,
      ELEMENT.SAND_BLUE,
      ELEMENT.SAND_PINK,
      ELEMENT.SAND_GREEN,
      ELEMENT.ANTI_GRAV,
      ELEMENT.LASER_SAND,
      ELEMENT.LAVA,
      ELEMENT.ACID,
    ];
    const currentIdx = palette.indexOf(this.selectedElement);
    let newIdx = (currentIdx + dir) % palette.length;
    if (newIdx < 0) newIdx += palette.length;
    this.selectElement(palette[newIdx]);
  }

  updateCursorPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = GRID_WIDTH / rect.width;
    const scaleY = GRID_HEIGHT / rect.height;

    const gx = Math.floor((e.clientX - rect.left) * scaleX);
    const gy = Math.floor((e.clientY - rect.top) * scaleY);

    this.cursorPos = {
      x: Math.max(2, Math.min(GRID_WIDTH - 3, gx)),
      y: Math.max(2, Math.min(GRID_HEIGHT - 3, gy))
    };
  }

  renderToolbar() {
    const toolbar = document.getElementById('element-toolbar');
    toolbar.innerHTML = '';

    const palette = [
      ELEMENT.SAND_GOLD,
      ELEMENT.SAND_BLUE,
      ELEMENT.SAND_PINK,
      ELEMENT.SAND_GREEN,
      ELEMENT.ANTI_GRAV,
      ELEMENT.LASER_SAND,
      ELEMENT.LAVA,
      ELEMENT.ACID,
    ];

    palette.forEach((typeId, index) => {
      const info = ELEMENT_INFO[typeId];
      if (!info) return;

      const shortName = info.name.replace(' Sand', '').replace('ic Solvent', '').replace('en ', '');

      const btn = document.createElement('button');
      btn.className = `elem-btn ${typeId === this.selectedElement ? 'selected' : ''}`;
      btn.dataset.type = typeId;
      btn.title = info.name;
      btn.innerHTML = `
        <span class="elem-swatch" style="background-color: ${ELEMENT_COLORS[typeId]};"></span>
        <span class="elem-icon">${info.icon}</span>
        <span class="elem-name">${shortName}</span>
        <span class="elem-key">${index + 1}</span>
      `;
      btn.onclick = () => this.selectElement(typeId);
      toolbar.appendChild(btn);
    });
  }

  selectElement(typeId) {
    this.selectedElement = typeId;
    document.querySelectorAll('.elem-btn').forEach(b => {
      b.classList.toggle('selected', parseInt(b.dataset.type, 10) === typeId);
    });

    const info = ELEMENT_INFO[typeId] || { icon: '⏳', name: 'Sand', desc: '' };
    document.getElementById('stream-icon').textContent = info.icon;
    document.getElementById('stream-name').textContent = info.name;
    document.getElementById('stream-desc').textContent = info.desc;
  }

  startArcade() {
    this.stageNumber = 1;
    this.score = 0;
    this.bottlesSealed = 0;
    this.loadStage(this.stageNumber);
  }

  loadStage(stageNum) {
    this.isStageComplete = false;
    this.isPlaying = true;

    const vesselList = Object.values(VESSEL_TYPES);
    this.vesselType = vesselList[(stageNum - 1) % vesselList.length];

    this.targetDesign = generateTargetDesign(stageNum);
    this.targetFillPct = this.targetDesign.targetTotalPct;

    this.engine.reset();
    const { mask, capacity, innerMask } = generateVesselMask(this.vesselType);
    this.engine.loadBottleMask(mask, capacity, innerMask);

    if (this.activeGameMode === 'laser-puzzle') {
      this.engine.set(70, 80, ELEMENT.RAMP_RIGHT);
      this.engine.set(170, 100, ELEMENT.RAMP_LEFT);
    }

    this.renderBlueprintStack();
    this.updateHUD();
  }

  renderBlueprintStack() {
    const stackContainer = document.getElementById('blueprint-stack');
    stackContainer.innerHTML = '';
    document.getElementById('blueprint-layer-count').textContent = `${this.targetDesign.layers.length} Layers`;

    this.targetDesign.layers.forEach((layer) => {
      const div = document.createElement('div');
      div.className = 'blueprint-layer-bar';
      div.style.backgroundColor = layer.colorHex;
      div.style.flex = `${layer.pct}`;
      div.innerHTML = `
        <span>${layer.icon} ${layer.name}</span>
        <span>${Math.round(layer.pct)}%</span>
      `;
      stackContainer.appendChild(div);
    });
  }

  resetVessel() {
    this.loadStage(this.stageNumber);
  }

  advanceToNextStage() {
    this.stageNumber++;
    this.loadStage(this.stageNumber);
  }

  updateHUD() {
    if (this.activeGameMode === 'mario-cat' && this.catEngine) {
      const p1 = this.catEngine.players[0];
      const miceCaught = this.catEngine.mice.filter(m => m.eaten).length;
      const dogsDefeated = this.catEngine.dogs.filter(d => d.defeated).length;

      const wIdx = this.catEngine.worldIndex + 1;
      const lIdx = this.catEngine.levelIndex + 1;

      const lvlElem = document.getElementById('mario-stat-level');
      const scoreElem = document.getElementById('mario-stat-score');
      const miceElem = document.getElementById('mario-stat-mice');
      const dogsElem = document.getElementById('mario-stat-dogs');
      const modeElem = document.getElementById('mario-mode-indicator');

      if (lvlElem) lvlElem.textContent = `${wIdx}-${lIdx}`;
      if (scoreElem) scoreElem.textContent = (p1 ? p1.score : 0).toString().padStart(5, '0');
      if (miceElem) miceElem.textContent = `🧀 x ${miceCaught}`;
      if (dogsElem) dogsElem.textContent = `🐶 x ${dogsDefeated}`;
      if (modeElem) modeElem.textContent = this.catEngine.playerCount === 1 ? '🐱 1P Solo' : '🐱🐱 2P Co-Op';

      const lvlName = this.catEngine?.level?.name || 'Cat World';
      document.getElementById('vessel-hint').textContent = `Super Mario Cat - Stage ${wIdx}-${lIdx}: ${lvlName}! (Reach the Golden Collar Goal Post)`;
    } else {
      document.getElementById('stat-stage').textContent = this.stageNumber;
      document.getElementById('stat-score').textContent = this.score;
      document.getElementById('stat-bottles').textContent = `🏆 ${this.bottlesSealed}`;

      document.getElementById('vessel-fill-pct').textContent = `${this.currentFillPct}% / ${this.targetFillPct}%`;

      const gradeLetter = this.accuracyPct >= 90 ? 'S' : this.accuracyPct >= 75 ? 'A' : this.accuracyPct >= 50 ? 'B' : 'C';
      document.getElementById('accuracy-score-text').textContent = `${this.accuracyPct}% (Grade ${gradeLetter})`;
      document.getElementById('accuracy-progress-bar').style.width = `${this.accuracyPct}%`;

      const vesselNames = {
        [VESSEL_TYPES.JAR]: 'Square Glass Jar',
        [VESSEL_TYPES.CYLINDER]: 'Tall Cylinder Flask',
        [VESSEL_TYPES.FUNNEL]: 'Tapered Funnel Vessel',
        [VESSEL_TYPES.BOWL]: 'Wide Sand Bowl',
        [VESSEL_TYPES.FLASK]: 'Erlenmeyer Beaker',
        [VESSEL_TYPES.HOURGLASS]: 'Hourglass Chamber'
      };

      if (this.activeGameMode === 'sandbox') {
        document.getElementById('vessel-hint').textContent = `Sandbox Mode: Create freeform sand art inside the ${vesselNames[this.vesselType] || 'Vessel'}!`;
      } else {
        document.getElementById('vessel-hint').textContent = `Stage ${this.stageNumber}: Emulate the target blueprint layers in the ${vesselNames[this.vesselType] || 'Vessel'}!`;
      }
    }
  }

  emitContinuousStream() {
    if (!this.isPlaying || !this.streamEnabled || !this.isHoveringCanvas || this.isStageComplete) return;

    const { x: gx, y: gy } = this.cursorPos;
    let placedAny = false;

    for (let dy = -this.brushRadius; dy <= this.brushRadius; dy++) {
      for (let dx = -this.brushRadius; dx <= this.brushRadius; dx++) {
        const targetX = gx + dx;
        const targetY = gy + dy;

        if (this.engine.isEmpty(targetX, targetY)) {
          this.engine.set(targetX, targetY, this.selectedElement);
          placedAny = true;
        }
      }
    }

    if (placedAny) {
      this.sfxCounter++;
      if (this.sfxCounter % 4 === 0) {
        SFX.sfxDropSand();
      }
    }
  }

  startLoop() {
    const renderFrame = () => {
      if (this.activeGameMode === 'mario-cat') {
        if (this.catEngine) {
          if (this.isPlaying) {
            this.catEngine.update();
          }
          this.catEngine.render();
          this.updateHUD();
        }
      } else {
        if (this.isPlaying) {
          this.emitContinuousStream();

          for (let i = 0; i < this.simSpeed; i++) {
            this.engine.step();
          }

          this.currentFillPct = this.engine.getFillPercentage();
          this.accuracyPct = evaluateAccuracy(this.engine.grid, GRID_WIDTH, GRID_HEIGHT, this.engine.innerMask, this.targetDesign);
          this.updateHUD();

          if (this.activeGameMode !== 'sandbox') {
            this.checkStageCompletion();
          }
        }

        this.renderCanvas();
      }

      this.animFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }

  checkStageCompletion() {
    if (!this.isStageComplete && this.currentFillPct >= this.targetFillPct) {
      this.isStageComplete = true;
      this.isPlaying = false;

      const stars = this.accuracyPct >= 85 ? 3 : this.accuracyPct >= 65 ? 2 : 1;
      const stageScore = 500 + this.accuracyPct * 10 + stars * 250;
      this.score += stageScore;
      this.bottlesSealed++;

      SFX.sfxGoalTriggered(3);
      SFX.sfxVictoryFanfare();

      this.ui.showSealedBottleModal(this.stageNumber, stageScore, this.score, this.accuracyPct, stars, this.canvas);
    }
  }

  renderCanvas() {
    // 1. Fill background once
    this.ctx.fillStyle = ELEMENT_COLORS[ELEMENT.EMPTY];
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. High-performance batched color rendering
    const activeTypes = [
      ELEMENT.BOTTLE,
      ELEMENT.SAND_GOLD,
      ELEMENT.SAND_BLUE,
      ELEMENT.SAND_PINK,
      ELEMENT.SAND_GREEN,
      ELEMENT.ANTI_GRAV,
      ELEMENT.LAVA,
      ELEMENT.ACID,
      ELEMENT.LASER_SAND,
      ELEMENT.ANTI_MATTER,
      ELEMENT.STEAM,
      ELEMENT.RAMP_LEFT,
      ELEMENT.RAMP_RIGHT,
    ];

    for (let i = 0; i < activeTypes.length; i++) {
      const type = activeTypes[i];
      const color = ELEMENT_COLORS[type];
      if (!color) continue;

      let colorSet = false;

      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          if (this.engine.get(x, y) === type) {
            if (!colorSet) {
              this.ctx.fillStyle = color;
              colorSet = true;
            }
            this.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }
    }

    // Render Target Layer division lines & target fill line on canvas (if in Pattern Arcade mode)
    const bottomY = GRID_HEIGHT - 25;
    const totalVolumeY = 110;

    if (this.activeGameMode === 'pattern-arcade' && this.targetDesign) {
      this.targetDesign.layers.forEach((layer) => {
        const lineY = Math.floor(bottomY - (layer.endPct / 100) * totalVolumeY);

        this.ctx.save();
        this.ctx.strokeStyle = layer.colorHex;
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(35, lineY * CELL_SIZE);
        this.ctx.lineTo(this.canvas.width - 35, lineY * CELL_SIZE);
        this.ctx.stroke();
        this.ctx.restore();
      });
    }

    if (this.activeGameMode !== 'sandbox') {
      const targetY = Math.floor(GRID_HEIGHT - (this.targetFillPct / 100) * (GRID_HEIGHT - 35));
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(255, 0, 170, 0.8)';
      this.ctx.lineWidth = 2.5;
      this.ctx.setLineDash([8, 6]);
      this.ctx.beginPath();
      this.ctx.moveTo(30, targetY * CELL_SIZE);
      this.ctx.lineTo(this.canvas.width - 30, targetY * CELL_SIZE);
      this.ctx.stroke();
      this.ctx.restore();
    }

    if (this.isHoveringCanvas && this.streamEnabled && !this.isStageComplete) {
      const cx = this.cursorPos.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = this.cursorPos.y * CELL_SIZE + CELL_SIZE / 2;

      this.ctx.save();
      this.ctx.strokeStyle = ELEMENT_COLORS[this.selectedElement] || '#00f0ff';
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = ELEMENT_COLORS[this.selectedElement] || '#00f0ff';
      this.ctx.shadowBlur = 8;

      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(cx - 14, cy); this.ctx.lineTo(cx - 6, cy);
      this.ctx.moveTo(cx + 6, cy);  this.ctx.lineTo(cx + 14, cy);
      this.ctx.moveTo(cx, cy - 14); this.ctx.lineTo(cx, cy - 6);
      this.ctx.moveTo(cx, cy + 6);  this.ctx.lineTo(cx, cy + 14);
      this.ctx.stroke();

      this.ctx.restore();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AntigamesApp();
});
