import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirebaseApp } from './firebaseApp';

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
};

export const getFirebaseStorage = () => {
  const app = getFirebaseApp();
  return app ? getStorage(app) : null;
};
