import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { v4 as uuidv4 } from 'uuid';

// Simple polyfill if needed, but modern browsers support crypto.randomUUID
// We are using uuid package in components, but ensuring environment is sound.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
