package edu.uam.prestamos;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
record EquipoRequest(@NotBlank @Size(max=100) String codigo, @NotBlank @Size(max=150) String nombre, @NotBlank @Size(max=100) String tipo) {}
record PrestamoRequest(@NotNull Long equipoId, @NotBlank @Size(max=150) String solicitante, @NotNull LocalDate fechaPrestamo, @NotNull LocalDate fechaPrevistaDevolucion) {}
record LoginRequest(@NotBlank String username, @NotBlank String password) {}
record LoginResponse(String token, String tipo, String rol) {}
