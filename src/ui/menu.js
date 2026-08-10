// Main Menu & Arcade Game Selector for Antigames Hub
export class MainMenuController {
  constructor(onSelectGame) {
    this.onSelectGame = onSelectGame;
    this.menuView = document.getElementById('main-menu-view');
    this.gameView = document.getElementById('game-play-view');
    this.init();
  }

  init() {
    this.bindMenuEvents();
  }

  bindMenuEvents() {
    document.querySelectorAll('.game-card-btn').forEach(btn => {
      btn.onclick = () => {
        const gameId = btn.dataset.gameId;
        if (gameId) {
          this.launchGame(gameId);
        }
      };
    });

    const menuReturnBtn = document.getElementById('btn-main-menu');
    if (menuReturnBtn) {
      menuReturnBtn.onclick = () => this.showMenu();
    }
  }

  showMenu() {
    this.gameView.classList.add('hidden');
    this.menuView.classList.remove('hidden');
  }

  launchGame(gameId) {
    this.menuView.classList.add('hidden');
    this.gameView.classList.remove('hidden');
    this.onSelectGame(gameId);
  }
}
