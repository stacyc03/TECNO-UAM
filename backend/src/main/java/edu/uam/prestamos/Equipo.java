package edu.uam.prestamos;
import jakarta.persistence.*;
@Entity @Table(name="equipos",uniqueConstraints=@UniqueConstraint(columnNames="codigo"))
public class Equipo {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,unique=true) public String codigo;
 @Column(nullable=false) public String nombre;
 @Column(nullable=false) public String tipo;
 @Enumerated(EnumType.STRING) @Column(nullable=false) public EstadoEquipo estado=EstadoEquipo.DISPONIBLE;
}
enum EstadoEquipo { DISPONIBLE, PRESTADO }
