import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from '../lib/firebase';

export interface VideoProcessingProgress {
  step: 'reading' | 'extracting-poster' | 'compressing' | 'uploading' | 'completed' | 'error';
  percent: number;
  message: string;
}

/**
 * Extrae un fotograma del video en formato Blob JPEG para usar como póster de alta definición
 */
export const extractVideoPoster = (videoFile: File, seekTime: number = 0.5): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(videoFile);
    video.src = url;

    video.onloadedmetadata = () => {
      // Ajustar el tiempo de captura (dentro del rango del video)
      const targetTime = Math.min(seekTime, Math.max(0, video.duration - 0.1));
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          return reject(new Error('No se pudo inicializar el lienzo para extraer la portada.'));
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error al generar la imagen póster.'));
            }
          },
          'image/jpeg',
          0.85
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo decodificar el archivo de video.'));
    };
  });
};

/**
 * Procesa y sube el video y su póster a Firebase Storage con reporte de progreso
 */
export const uploadSolutionMedia = async (
  solutionId: string,
  videoFile: File,
  onProgress?: (p: VideoProcessingProgress) => void
): Promise<{ videoUrl: string; posterUrl: string }> => {
  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error('Firebase Storage no está disponible o no se encuentra inicializado.');
  }

  // 1. Extracción del fotograma póster
  if (onProgress) {
    onProgress({
      step: 'extracting-poster',
      percent: 15,
      message: 'Extrayendo fotograma de portada en alta definición...'
    });
  }

  let posterBlob: Blob;
  try {
    posterBlob = await extractVideoPoster(videoFile, 1.0);
  } catch (err) {
    console.warn('Fallback al poster en t=0:', err);
    posterBlob = await extractVideoPoster(videoFile, 0.0);
  }

  const timestamp = Date.now();
  const cleanId = solutionId.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Subir Póster
  if (onProgress) {
    onProgress({
      step: 'uploading',
      percent: 25,
      message: 'Subiendo portada optimizada a la nube...'
    });
  }

  const posterRef = ref(storage, `solutions/${cleanId}/poster_${timestamp}.jpg`);
  const posterUploadTask = await uploadBytesResumable(posterRef, posterBlob, {
    contentType: 'image/jpeg',
    cacheControl: 'public,max-age=31536000'
  });
  const posterUrl = await getDownloadURL(posterUploadTask.ref);

  // Subir Video
  const fileExt = videoFile.name.split('.').pop()?.toLowerCase() || 'mp4';
  const videoRef = ref(storage, `solutions/${cleanId}/video_${timestamp}.${fileExt}`);

  const videoUploadTask = uploadBytesResumable(videoRef, videoFile, {
    contentType: videoFile.type || 'video/mp4',
    cacheControl: 'public,max-age=31536000'
  });

  return new Promise((resolve, reject) => {
    videoUploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          25 + (snapshot.bytesTransferred / snapshot.totalBytes) * 70
        );
        if (onProgress) {
          const mbTransferred = (snapshot.bytesTransferred / (1024 * 1024)).toFixed(1);
          const mbTotal = (snapshot.totalBytes / (1024 * 1024)).toFixed(1);
          onProgress({
            step: 'uploading',
            percent,
            message: `Subiendo video optimizado (${mbTransferred} MB / ${mbTotal} MB)...`
          });
        }
      },
      (error) => {
        if (onProgress) {
          onProgress({
            step: 'error',
            percent: 0,
            message: `Error al subir: ${error.message}`
          });
        }
        reject(error);
      },
      async () => {
        try {
          const videoUrl = await getDownloadURL(videoUploadTask.snapshot.ref);
          if (onProgress) {
            onProgress({
              step: 'completed',
              percent: 100,
              message: '¡Video y portada subidos y vinculados exitosamente!'
            });
          }
          resolve({ videoUrl, posterUrl });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};
