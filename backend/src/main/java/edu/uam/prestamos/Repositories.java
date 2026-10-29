package edu.uam.prestamos;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
interface EquipoRepository extends JpaRepository<Equipo,Long> {
 boolean existsByCodigo(String codigo);
 boolean existsByCodigoAndIdNot(String codigo,Long id);
 @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select e from Equipo e where e.id = :id") Optional<Equipo> findForUpdate(@Param("id") Long id);
}
interface PrestamoRepository extends JpaRepository<Prestamo,Long> {
 boolean existsByEquipoIdAndEstado(Long id,EstadoPrestamo estado);
 boolean existsByEquipoId(Long id);
 @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select p from Prestamo p where p.id = :id") Optional<Prestamo> findForUpdate(@Param("id") Long id);
}
