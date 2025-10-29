import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./context/Authcontext";
import { ShopProvider } from "./context/ShopContext";
import { AdminProvider } from "./context/AdminContext";
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <AdminProvider>
      <ShopProvider>
        <App />
      </ShopProvider>
      </AdminProvider>
    </AuthProvider>
  </StrictMode>
);

registerSW(); // ✅ keep this after rendering
