const API_SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const getSdsUrl = (storageKey) => {
  if (!storageKey) {
    return null;
  }
  // Construct the full URL to the SDS file on the backend
  return `${API_SERVER_URL}/uploads/sds/${storageKey}`;
};