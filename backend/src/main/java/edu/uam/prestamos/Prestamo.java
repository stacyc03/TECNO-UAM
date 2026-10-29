package edu.uam.prestamos;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity @Table(name="prestamos")
public class Prestamo {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="equipo_id",nullable=false) public Equipo equipo;
 @Column(nullable=false) public String solicitante;
 @Column(nullable=false) public LocalDate fechaPrestamo;
 @Column(nullable=false) public LocalDate fechaPrevistaDevolucion;
 @Enumerated(EnumType.STRING) @Column(nullable=false) public EstadoPrestamo estado=EstadoPrestamo.ACTIVO;
}
enum EstadoPrestamo { ACTIVO, DEVUELTO }
