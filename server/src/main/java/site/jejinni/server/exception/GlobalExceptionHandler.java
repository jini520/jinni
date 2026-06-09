package site.jejinni.server.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import site.jejinni.server.dto.common.ErrorResponse;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException e) {
    return build(HttpStatus.NOT_FOUND, e.getMessage());
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException e) {
    return build(HttpStatus.BAD_REQUEST, e.getMessage());
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ErrorResponse> handleConflict(IllegalStateException e) {
    return build(HttpStatus.CONFLICT, e.getMessage());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpected(Exception e) {
    log.error("Unhandled exception", e);
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
  }

  // @Valid 검증 실패: 필드별 메시지로 가공해 400 반환
  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(err -> err.getField() + ": " + err.getDefaultMessage())
        .collect(Collectors.joining(", "));
    return new ResponseEntity<>(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), message), HttpStatus.BAD_REQUEST);
  }

  // 그 외 Spring MVC 예외(타입 불일치·잘못된 JSON·미지원 메서드 등)도 ErrorResponse 포맷으로 통일
  @Override
  protected ResponseEntity<Object> handleExceptionInternal(
      Exception ex, Object body, HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
    return new ResponseEntity<>(new ErrorResponse(statusCode.value(), ex.getMessage()), headers, statusCode);
  }

  private ResponseEntity<ErrorResponse> build(HttpStatus status, String message) {
    return ResponseEntity.status(status).body(new ErrorResponse(status.value(), message));
  }
}
