import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SessionProvider } from './services/sessionStore.ts';
import { InstitutionProvider } from './services/institutionStore.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <InstitutionProvider>
        <App />
      </InstitutionProvider>
    </SessionProvider>
  </StrictMode>,
);

