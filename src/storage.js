// LocalStorage Management for Antigames: Antigravity Sand

const STORAGE_KEYS = {
  STARS: 'antigames_sand_stars',
  UNLOCKED_LEVEL: 'antigames_sand_unlocked_level',
  HIGH_SCORES: 'antigames_sand_scores',
  DAILY_STREAK: 'antigames_sand_daily_streak',
  LAST_DAILY: 'antigames_sand_last_daily',
  CUSTOM_SANDBOX: 'antigames_sand_custom_saves',
};

class GameStorage {
  // Get stars earned per campaign level { levelId: starCount }
  getStars() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STARS)) || {};
    } catch {
      return {};
    }
  }

  saveStars(levelId, stars) {
    const current = this.getStars();
    if (!current[levelId] || stars > current[levelId]) {
      current[levelId] = stars;
      localStorage.setItem(STORAGE_KEYS.STARS, JSON.stringify(current));
    }
  }

  getUnlockedLevel() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL) || '1', 10);
  }

  setUnlockedLevel(levelId) {
    const current = this.getUnlockedLevel();
    if (levelId > current) {
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, levelId.toString());
    }
  }

  getArcadeHighScore() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORES) || '0', 10);
  }

  saveArcadeHighScore(score) {
    const current = this.getArcadeHighScore();
    if (score > current) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, score.toString());
    }
  }

  getDailyStreak() {
    const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DAILY);
    const streak = parseInt(localStorage.getItem(STORAGE_KEYS.DAILY_STREAK) || '0', 10);
    const today = new Date().toISOString().slice(0, 10);

    if (!lastDate) return { streak: 0, completedToday: false };
    
    if (lastDate === today) {
      return { streak, completedToday: true };
    }

    // Check if yesterday was completed to preserve streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (lastDate === yesterday) {
      return { streak, completedToday: false };
    }

    // Streak broken
    return { streak: 0, completedToday: false };
  }

  recordDailyCompletion() {
    const { streak, completedToday } = this.getDailyStreak();
    if (completedToday) return;

    const today = new Date().toISOString().slice(0, 10);
    const newStreak = streak + 1;

    localStorage.setItem(STORAGE_KEYS.DAILY_STREAK, newStreak.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_DAILY, today);
  }

  // Save custom sandbox creation
  saveSandboxBottle(name, gridData) {
    try {
      const saves = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_SANDBOX)) || [];
      saves.push({ id: Date.now(), name, data: gridData });
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SANDBOX, JSON.stringify(saves));
    } catch (e) {
      console.warn('Could not save sandbox creation:', e);
    }
  }

  getSandboxSaves() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_SANDBOX)) || [];
    } catch {
      return [];
    }
  }
}

export const Storage = new GameStorage();
