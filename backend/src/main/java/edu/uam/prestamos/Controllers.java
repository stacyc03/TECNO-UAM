package edu.uam.prestamos;
import java.net.URI;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/equipos") class EquipoController {
 private final PrestamosService s; EquipoController(PrestamosService s){this.s=s;}
 @GetMapping List<Equipo> list(){return s.equipos();}
 @GetMapping("/{id}") Equipo get(@PathVariable Long id){return s.equipo(id);}
 @PostMapping ResponseEntity<Equipo> create(@Valid @RequestBody EquipoRequest r){Equipo e=s.crear(r);return ResponseEntity.created(URI.create("/api/equipos/"+e.id)).body(e);}
 @PutMapping("/{id}") Equipo update(@PathVariable Long id,@Valid @RequestBody EquipoRequest r){return s.actualizar(id,r);}
 @DeleteMapping("/{id}") ResponseEntity<Void> delete(@PathVariable Long id){s.eliminar(id);return ResponseEntity.noContent().build();}
}
@RestController @RequestMapping("/api/prestamos") class PrestamoController {
 private final PrestamosService s; PrestamoController(PrestamosService s){this.s=s;}
 @GetMapping List<Prestamo> list(){return s.prestamos();}
 @PostMapping ResponseEntity<Prestamo> create(@Valid @RequestBody PrestamoRequest r){Prestamo p=s.prestar(r);return ResponseEntity.status(201).body(p);}
 @PutMapping("/{id}/devolver") Prestamo devolver(@PathVariable Long id){return s.devolver(id);}
}
