import { api } from './client';

const headers = (token) => ({ Authorization: `Bearer ${token}` });
export async function getEquipos(token) {
  const { data } = await api.get('/equipos', { headers: headers(token) });
  return data;
}
export async function crearEquipo(token, equipo) {
  const { data } = await api.post('/equipos', equipo, { headers: headers(token) });
  return data;
}
export async function actualizarEquipo(token, id, equipo) {
  const { data } = await api.put(`/equipos/${id}`, equipo, { headers: headers(token) });
  return data;
}
export async function eliminarEquipo(token, id) {
  await api.delete(`/equipos/${id}`, { headers: headers(token) });
}
export async function listarPrestamos(token) {
  const { data } = await api.get('/prestamos', { headers: headers(token) });
  return data;
}
export async function registrarPrestamo(token, prestamo) {
  const { data } = await api.post('/prestamos', prestamo, { headers: headers(token) });
  return data;
}
export async function devolverPrestamo(token, id) {
  const { data } = await api.put(`/prestamos/${id}/devolver`, {}, { headers: headers(token) });
  return data;
}
