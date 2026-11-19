import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirebaseConfig, isFirebaseConfigured } from './firebase';

export const getFirebaseApp = () => {
  const config = getFirebaseConfig();
  if (!isFirebaseConfigured()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(config);
};
