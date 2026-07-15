const API_SERVER_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');

export const getSdsUrl = (storageKey) => {
  if (!storageKey) return null;

  if (/^https?:\/\//i.test(storageKey)) {
    return storageKey;
  }

  const filename = String(storageKey).split(/[\\/]/).filter(Boolean).pop();

  return filename ? `${API_SERVER_URL}/uploads/sds/${encodeURIComponent(filename)}` : null;
};
