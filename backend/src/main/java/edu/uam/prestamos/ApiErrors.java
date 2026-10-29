package edu.uam.prestamos;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;
@RestControllerAdvice class ApiErrors {
 @ExceptionHandler(ApiException.class) ResponseEntity<?> api(ApiException e){return ResponseEntity.status(e.status).body(Map.of("error",e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){var errors=e.getBindingResult().getFieldErrors().stream().map(x -> x.getField()+": "+x.getDefaultMessage()).toList();return ResponseEntity.badRequest().body(Map.of("errores",errors));}
 @ExceptionHandler(HttpMessageNotReadableException.class) ResponseEntity<?> malformed(){return ResponseEntity.badRequest().body(Map.of("error","JSON o fecha inválida"));}
 @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<?> integrity(){return ResponseEntity.status(409).body(Map.of("error","Conflicto con datos existentes"));}
}
