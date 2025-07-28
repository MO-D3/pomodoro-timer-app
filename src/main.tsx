import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import './app.css';

// Mount the root React component
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
