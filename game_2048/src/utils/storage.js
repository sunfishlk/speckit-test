const STORAGE_KEY = 'game2048_bestScore';

export const loadBestScore = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (err) {
    console.warn('localStorage unavailable:', err);
    return 0;
  }
};

export const saveBestScore = (score) => {
  try {
    localStorage.setItem(STORAGE_KEY, score.toString());
  } catch (err) {
    console.warn('Failed to save best score:', err);
  }
};
