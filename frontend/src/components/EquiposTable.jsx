export default function EquiposTable({ items, loading, error, emptyMessage, admin, onEdit, onDelete, onPrestamo, onDevolver }) {
  if (loading) return <div className="table-state" role="status"><span className="loading-ring" /> Consultando equipos…</div>;
  if (error) return <div className="table-state table-error" role="alert">{error}</div>;
  if (items.length === 0) return <div className="table-state table-empty">{emptyMessage}</div>;
  return (
    <div className="table-wrap">
      <table className="equipment-table">
        <thead><tr><th>Código patrimonial</th><th>Equipo</th><th>Tipo</th><th>Disponibilidad</th>{admin && <th>Acciones</th>}</tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}>
          <td><span className="equipment-code">{item.codigo}</span></td>
          <td className="equipment-name">{item.nombre}</td>
          <td>{item.tipo}</td>
          <td><span className={`status-pill ${item.estado === 'DISPONIBLE' ? 'is-available' : 'is-loaned'}`}><span className="status-dot" />{item.estado === 'DISPONIBLE' ? 'Disponible' : 'Prestado'}</span></td>
          {admin && <td><div className="row-actions">
            <button type="button" className="action-button" onClick={() => onEdit(item)}>Editar</button>
            {item.estado === 'DISPONIBLE' ? <button type="button" className="action-button" onClick={() => onPrestamo(item)}>Prestar</button> : <button type="button" className="action-button" onClick={() => onDevolver(item)}>Devolver</button>}
            <button type="button" className="action-button action-danger" onClick={() => onDelete(item)}>Eliminar</button>
          </div></td>}
        </tr>)}</tbody>
      </table>
    </div>
  );
}
