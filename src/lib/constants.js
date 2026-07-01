export const MAX_FILE_SIZE_MB = 9999; // Pas de limite — compression automatique côté client
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const UPLOAD_BUCKET = 'diagnostics';

export const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  ANALYZING: 'analyzing',
  SUCCESS: 'success',
  ERROR: 'error',
};
