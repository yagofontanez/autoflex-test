package com.yago.inventory_api.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(NotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI(), null);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(ConflictException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), req.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex,
            HttpServletRequest req) {
        List<ApiErrorResponse.FieldErrorItem> fields = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::toFieldItem)
                .toList();

        return build(HttpStatus.BAD_REQUEST, "Validation failed.", req.getRequestURI(), fields);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI(), null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error.", req.getRequestURI(), null);
    }

    private ApiErrorResponse.FieldErrorItem toFieldItem(FieldError fe) {
        return new ApiErrorResponse.FieldErrorItem(fe.getField(), fe.getDefaultMessage());
    }

    private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message, String path,
            List<ApiErrorResponse.FieldErrorItem> fieldErrors) {
        ApiErrorResponse body = new ApiErrorResponse();
        body.timestamp = Instant.now();
        body.status = status.value();
        body.error = status.getReasonPhrase();
        body.message = message;
        body.path = path;
        body.fieldErrors = fieldErrors;
        return ResponseEntity.status(status).body(body);
    }
}
