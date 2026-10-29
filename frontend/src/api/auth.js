import { api } from './client';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
}
