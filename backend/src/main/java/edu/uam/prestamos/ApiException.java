package edu.uam.prestamos;
import org.springframework.http.HttpStatus;
public class ApiException extends RuntimeException {
 final HttpStatus status; ApiException(HttpStatus s,String m){super(m);status=s;}
 static ApiException notFound(String m){return new ApiException(HttpStatus.NOT_FOUND,m);}
 static ApiException conflict(String m){return new ApiException(HttpStatus.CONFLICT,m);}
 static ApiException badRequest(String m){return new ApiException(HttpStatus.BAD_REQUEST,m);}
}
