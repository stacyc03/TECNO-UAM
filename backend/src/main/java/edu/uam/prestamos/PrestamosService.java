package edu.uam.prestamos;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service class PrestamosService {
 private final EquipoRepository equipos; private final PrestamoRepository prestamos;
 PrestamosService(EquipoRepository e, PrestamoRepository p){equipos=e;prestamos=p;}
 @Transactional(readOnly=true) List<Equipo> equipos(){return equipos.findAll();}
 @Transactional(readOnly=true) Equipo equipo(Long id){return equipos.findById(id).orElseThrow(()->ApiException.notFound("Equipo no encontrado"));}
 @Transactional(readOnly=true) List<Prestamo> prestamos(){return prestamos.findAll();}
 @Transactional Equipo crear(EquipoRequest r){String codigo=r.codigo().trim();if(equipos.existsByCodigo(codigo))throw ApiException.conflict("El código patrimonial ya existe");Equipo e=new Equipo();copiar(e,r);return equipos.saveAndFlush(e);}
 @Transactional Equipo actualizar(Long id,EquipoRequest r){Equipo e=bloquearEquipo(id);if(equipos.existsByCodigoAndIdNot(r.codigo().trim(),id))throw ApiException.conflict("El código patrimonial ya existe");copiar(e,r);return equipos.saveAndFlush(e);}
 private void copiar(Equipo e,EquipoRequest r){e.codigo=r.codigo().trim();e.nombre=r.nombre().trim();e.tipo=r.tipo().trim();}
 private Equipo bloquearEquipo(Long id){return equipos.findForUpdate(id).orElseThrow(()->ApiException.notFound("Equipo no encontrado"));}
 @Transactional void eliminar(Long id){Equipo e=bloquearEquipo(id);if(prestamos.existsByEquipoIdAndEstado(id,EstadoPrestamo.ACTIVO))throw ApiException.conflict("No se puede eliminar un equipo con préstamos activos");if(prestamos.existsByEquipoId(id))throw ApiException.conflict("No se puede eliminar un equipo con historial de préstamos");equipos.delete(e);}
 @Transactional Prestamo prestar(PrestamoRequest r){if(r.fechaPrevistaDevolucion().isBefore(r.fechaPrestamo()))throw ApiException.badRequest("La devolución prevista no puede ser anterior al préstamo");Equipo e=bloquearEquipo(r.equipoId());if(e.estado!=EstadoEquipo.DISPONIBLE || prestamos.existsByEquipoIdAndEstado(e.id,EstadoPrestamo.ACTIVO))throw ApiException.conflict("El equipo ya está prestado");Prestamo p=new Prestamo();p.equipo=e;p.solicitante=r.solicitante().trim();p.fechaPrestamo=r.fechaPrestamo();p.fechaPrevistaDevolucion=r.fechaPrevistaDevolucion();e.estado=EstadoEquipo.PRESTADO;equipos.save(e);return prestamos.save(p);}
 @Transactional Prestamo devolver(Long id){Prestamo p=prestamos.findForUpdate(id).orElseThrow(()->ApiException.notFound("Préstamo no encontrado"));Equipo e=bloquearEquipo(p.equipo.id);if(p.estado!=EstadoPrestamo.ACTIVO)throw ApiException.conflict("El préstamo ya fue devuelto");p.estado=EstadoPrestamo.DEVUELTO;e.estado=EstadoEquipo.DISPONIBLE;return prestamos.save(p);}
}
