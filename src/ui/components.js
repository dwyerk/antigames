// UI Components for Sand Bottle Fill Arcade & Sand Art Gallery
import { Storage } from '../storage.js';

export class UIController {
  constructor(appCallbacks) {
    this.callbacks = appCallbacks;
    this.initDOM();
    this.isModalOpen = false;
  }

  initDOM() {
    this.overlayContainer = document.getElementById('modal-overlay');
  }

  showSealedBottleModal(stageNum, scoreEarned, totalScore, accuracyPct, stars, canvasElement) {
    const dataURL = canvasElement.toDataURL('image/png');
    this.isModalOpen = true;

    // Auto-save sealed sand art bottle to gallery
    Storage.saveSandboxBottle(`Stage ${stageNum} Sand Art`, dataURL);

    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const gradeLetter = accuracyPct >= 90 ? 'S' : accuracyPct >= 75 ? 'A' : accuracyPct >= 50 ? 'B' : 'C';

    this.overlayContainer.innerHTML = `
      <div class="modal-box retro-border victory-box">
        <h2 class="victory-title">🍾 BOTTLE SEALED! 🍾</h2>
        <div class="victory-stars">${starStr}</div>
        <p class="victory-desc">Stage ${stageNum} Complete • Grade ${gradeLetter} (${accuracyPct}% Match)</p>

        <div class="snapshot-preview">
          <img src="${dataURL}" alt="Sealed Sand Bottle" class="trophy-img retro-border" />
          <p class="trophy-label">Saved to Sand Art Gallery</p>
        </div>

        <div class="stats-row">
          <span>Stage Score: <strong>+${scoreEarned}</strong></span>
          <span>Total Score: <strong>${totalScore}</strong></span>
        </div>

        <div class="modal-buttons">
          <button id="btn-next-stage" class="retro-btn primary">Next Stage ➔ [SPACEBAR]</button>
        </div>
      </div>
    `;
    this.overlayContainer.classList.remove('hidden');

    document.getElementById('btn-next-stage').onclick = () => {
      this.hideModal();
      this.callbacks.nextStage();
    };
  }

  showGalleryModal() {
    const saves = Storage.getSandboxSaves();
    this.isModalOpen = true;

    let gridHTML = '';
    if (saves.length === 0) {
      gridHTML = '<p class="modal-info">No sealed sand art bottles yet! Play arcade mode to fill and seal bottles.</p>';
    } else {
      gridHTML = saves.map(s => `
        <div class="level-card">
          <img src="${s.data}" alt="${s.name}" class="trophy-img retro-border" style="width:100%; height:120px;" />
          <div class="level-title">${s.name}</div>
        </div>
      `).join('');
    }

    this.overlayContainer.innerHTML = `
      <div class="modal-box retro-border">
        <h2>🖼️ Sealed Sand Art Gallery</h2>
        <div class="level-grid" style="grid-template-columns: repeat(2, 1fr);">${gridHTML}</div>
        <div class="modal-buttons">
          <button id="btn-close-gallery" class="retro-btn">Close [SPACEBAR]</button>
        </div>
      </div>
    `;
    this.overlayContainer.classList.remove('hidden');

    document.getElementById('btn-close-gallery').onclick = () => this.hideModal();
  }

  hideModal() {
    this.isModalOpen = false;
    this.overlayContainer.classList.add('hidden');
    this.overlayContainer.innerHTML = '';
  }
}
