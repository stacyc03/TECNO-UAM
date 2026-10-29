import { useState } from 'react';
import EquiposTable from '../components/EquiposTable';
import { useEquipos } from '../hooks/useEquipos';
import { crearEquipo, actualizarEquipo, eliminarEquipo, listarPrestamos, registrarPrestamo, devolverPrestamo } from '../api/equipos';

const fechaHoy = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const mensajeError = (err) => {
  const data = err.response?.data;
  if (err.response?.status === 401) return 'La sesión expiró. Sal del sistema y vuelve a ingresar.';
  if (err.response?.status === 403) return 'No tienes permiso para realizar esta acción.';
  return (typeof data?.message === 'string' && data.message) || (typeof data?.error === 'string' && data.error) || `No se pudo completar la operación${err.response?.status ? ` (HTTP ${err.response.status})` : ': comprueba la conexión'}.`;
};

export default function EquiposPage({ token, role }) {
  const admin = role === 'ADMIN';
  const { items, loading, error, reload } = useEquipos(token);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('TODOS');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');

  const disponibles = items.filter((item) => item.estado === 'DISPONIBLE').length;
  const prestados = items.filter((item) => item.estado === 'PRESTADO').length;
  const text = search.trim().toLocaleLowerCase('es');
  const filtered = items.filter((item) => {
    const matchesText = !text || [item.codigo, item.nombre, item.tipo].some((value) => String(value ?? '').toLocaleLowerCase('es').includes(text));
    return matchesText && (status === 'TODOS' || item.estado === status);
  });

  function openModal(type, equipo) {
    setActionError('');
    setNotice('');
    setModal({ type, equipo });
    setForm(type === 'edit' ? { codigo: equipo.codigo, nombre: equipo.nombre, tipo: equipo.tipo } :
      type === 'create' ? { codigo: '', nombre: '', tipo: 'PORTATIL' } :
      { solicitante: '', fechaPrestamo: fechaHoy(), fechaPrevistaDevolucion: fechaHoy() });
  }
  function closeModal() { if (!busy) { setModal(null); setActionError(''); } }

  async function submit(event) {
    event.preventDefault();
    if (!modal || !admin || busy) return;
    setBusy(true); setActionError('');
    const { type, equipo } = modal;
    try {
      if (type === 'create') await crearEquipo(token, form);
      if (type === 'edit') await actualizarEquipo(token, equipo.id, form);
      if (type === 'delete') await eliminarEquipo(token, equipo.id);
      if (type === 'loan') await registrarPrestamo(token, { ...form, equipoId: equipo.id });
      if (type === 'return') {
        const prestamos = await listarPrestamos(token);
        const activo = prestamos.find(p => p.equipo?.id === equipo.id && p.estado === 'ACTIVO');
        if (!activo) throw new Error('No se encontró un préstamo activo para este equipo.');
        await devolverPrestamo(token, activo.id);
      }
      setModal(null);
      setNotice(({ create: 'Equipo registrado.', edit: 'Equipo actualizado.', delete: 'Equipo eliminado.', loan: 'Préstamo registrado.', return: 'Devolución registrada.' })[type]);
      reload();
    } catch (err) { setActionError(err.response ? mensajeError(err) : (err.message || mensajeError(err))); }
    finally { setBusy(false); }
  }

  return (
    <div className="dashboard">
      <div className="breadcrumb">Panel <span>/</span> Inventario</div>
      <div className="page-heading">
        <div><span className="section-kicker">CONTROL DE EQUIPOS</span><h1>Inventario tecnológico</h1><p>{admin ? 'Administra los equipos, préstamos y devoluciones del centro.' : 'Consulta el estado de los equipos registrados en el centro.'}</p></div>
        <div className="heading-actions">
          {admin && <button type="button" className="button button-primary" onClick={() => openModal('create')}>+ Nuevo equipo</button>}
          <button type="button" className="button refresh-button" onClick={reload} disabled={loading}>↻ {loading ? 'Actualizando…' : 'Actualizar datos'}</button>
        </div>
      </div>
      <section className="stats-grid" aria-label="Resumen del inventario">
        <div className="stat-card"><div className="stat-top"><span>Total registrados</span><span className="stat-icon">▦</span></div><strong>{items.length}</strong><small>Equipos en el sistema</small></div>
        <div className="stat-card"><div className="stat-top"><span>Disponibles</span><span className="stat-icon stat-green">✓</span></div><strong>{disponibles}</strong><small>Listos para préstamo</small></div>
        <div className="stat-card"><div className="stat-top"><span>Prestados</span><span className="stat-icon stat-amber">↗</span></div><strong>{prestados}</strong><small>Actualmente asignados</small></div>
      </section>
      {notice && <div className="action-notice" role="status">{notice}</div>}
      <section className="inventory-panel">
        <div className="panel-heading"><div><h2>Listado de equipos</h2><p>Información consultada desde la API de TecnoUAM.</p></div><span className="live-tag"><span className="indicator-dot" /> Datos de la API</span></div>
        <div className="toolbar">
          <label className="search-wrapper" htmlFor="search-equipos"><span aria-hidden="true">⌕</span><input id="search-equipos" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por código, nombre o tipo" /></label>
          <label className="filter-wrapper" htmlFor="filter-estado"><span>Estado:</span><select id="filter-estado" value={status} onChange={(e) => setStatus(e.target.value)}><option value="TODOS">Todos</option><option value="DISPONIBLE">Disponibles</option><option value="PRESTADO">Prestados</option></select></label>
        </div>
        <EquiposTable items={filtered} loading={loading} error={error} admin={admin} onEdit={item => openModal('edit', item)} onDelete={item => openModal('delete', item)} onPrestamo={item => openModal('loan', item)} onDevolver={item => openModal('return', item)} emptyMessage={items.length === 0 ? 'No hay equipos registrados todavía.' : 'No hay equipos que coincidan con la búsqueda.'}/>
        <div className="panel-footer"><span>Mostrando {filtered.length} de {items.length} equipos</span><span>{admin ? 'Las modificaciones se guardan en la API.' : 'Datos actualizados desde el servidor.'}</span></div>
      </section>
      {admin && modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header"><h2 id="modal-title">{({ create:'Nuevo equipo', edit:'Editar equipo', delete:'Eliminar equipo', loan:'Registrar préstamo', return:'Registrar devolución' })[modal.type]}</h2><button type="button" className="close-modal" onClick={closeModal} disabled={busy} aria-label="Cerrar">×</button></div>
          <form onSubmit={submit} className="admin-form">
            {['create','edit'].includes(modal.type) && <>
              <label>Código patrimonial<input required maxLength={100} value={form.codigo || ''} onChange={e => setForm({ ...form, codigo:e.target.value })}/></label>
              <label>Nombre del equipo<input required maxLength={150} value={form.nombre || ''} onChange={e => setForm({ ...form, nombre:e.target.value })}/></label>
              <label>Tipo de equipo<input required maxLength={100} value={form.tipo || ''} onChange={e => setForm({ ...form, tipo:e.target.value })}/></label>
            </>}
            {modal.type === 'loan' && <>
              <p className="modal-intro">Equipo: <strong>{modal.equipo.nombre}</strong></p>
              <label>Nombre del solicitante<input required maxLength={150} value={form.solicitante || ''} onChange={e => setForm({ ...form, solicitante:e.target.value })}/></label>
              <label>Fecha de préstamo<input type="date" required value={form.fechaPrestamo || ''} onChange={e => setForm({ ...form, fechaPrestamo:e.target.value })}/></label>
              <label>Fecha prevista de devolución<input type="date" required min={form.fechaPrestamo} value={form.fechaPrevistaDevolucion || ''} onChange={e => setForm({ ...form, fechaPrevistaDevolucion:e.target.value })}/></label>
            </>}
            {modal.type === 'delete' && <p className="modal-intro">¿Eliminar <strong>{modal.equipo.nombre}</strong>? Solo se permite si no tiene préstamos registrados.</p>}
            {modal.type === 'return' && <p className="modal-intro">¿Registrar la devolución de <strong>{modal.equipo.nombre}</strong>? Se marcará como DISPONIBLE.</p>}
            {actionError && <div className="form-error" role="alert">{actionError}</div>}
            <div className="modal-actions"><button type="button" className="button button-secondary" onClick={closeModal} disabled={busy}>Cancelar</button><button type="submit" disabled={busy} className="button button-primary">{busy ? 'Guardando…' : ({create:'Registrar equipo',edit:'Guardar cambios',delete:'Confirmar eliminación',loan:'Registrar préstamo',return:'Confirmar devolución'})[modal.type]}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
