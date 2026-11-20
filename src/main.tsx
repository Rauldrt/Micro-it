import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyDynamicFavicon } from './utils/dynamicFavicon';

// Aplica el favicon del día de forma sincrónica e inmediata en el arranque
applyDynamicFavicon();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
