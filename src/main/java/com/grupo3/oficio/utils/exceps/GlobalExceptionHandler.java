package com.grupo3.oficio.utils.exceps;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex,HttpServletRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(),request);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(EntityNotFoundException ex,HttpServletRequest request) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(),request);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNoSuch(NoSuchElementException ex,HttpServletRequest request) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(),request);
    }

    @ExceptionHandler(FechaReservadaException.class)
    public ResponseEntity<Map<String, String>> handleFechaReservada(FechaReservadaException ex,HttpServletRequest request) {
        return buildError(HttpStatus.CONFLICT, ex.getMessage(),request);
    }

    @ExceptionHandler(UsuarioInactivoRuntimeException.class)
    public ResponseEntity<Map<String, String>> handleUsuarioInactivo(UsuarioInactivoRuntimeException ex,HttpServletRequest request) {
        return buildError(HttpStatus.FORBIDDEN, ex.getMessage(),request);
    }

    @ExceptionHandler(SinNombreException.class)
    public ResponseEntity<Map<String, String>> handleSinNombre(SinNombreException ex,HttpServletRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(),request);
    }

    /*@ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex,HttpServletRequest request) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor",request);
    }*/

    private ResponseEntity<Map<String, String>> buildError(HttpStatus status, String message, HttpServletRequest request) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        error.put("path", request.getRequestURI());

        return ResponseEntity.status(status).body(error);
    }

}

