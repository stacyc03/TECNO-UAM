import { useEffect, useState } from 'react';
import { getEquipos } from '../api/equipos';

export function useEquipos(token) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    setError('');
    getEquipos(token)
      .then((data) => { if (active) setItems(data); })
      .catch((err) => {
        if (!active) return;
        setItems([]);
        setError(err.response?.status === 401
          ? 'Tu sesión expiró. Cierra sesión e ingresa de nuevo.'
          : 'No se pudieron cargar los equipos. Comprueba que la API esté disponible.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, revision]);

  return { items, loading, error, reload: () => setRevision((value) => value + 1) };
}
