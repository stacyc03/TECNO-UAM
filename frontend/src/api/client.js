import axios from 'axios';

// Las solicitudes se envían a Vite (/api), que las redirige a Spring Boot.
// Se puede sobrescribir con VITE_API_URL en caso de despliegue.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});
