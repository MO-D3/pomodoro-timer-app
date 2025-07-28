import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import './app.css';

// Mount the root React component
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
