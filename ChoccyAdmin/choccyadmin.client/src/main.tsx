import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getRoutes } from './!autogen/Router';
import { AppRouterConfig } from './config/AppConfig';

const router = createBrowserRouter(getRoutes(AppRouterConfig));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
