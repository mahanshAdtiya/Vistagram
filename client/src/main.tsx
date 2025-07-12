import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css'
import { ToastProvider } from './providers/toast-provider';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ToastProvider />
    <App />
  </React.StrictMode>
);
