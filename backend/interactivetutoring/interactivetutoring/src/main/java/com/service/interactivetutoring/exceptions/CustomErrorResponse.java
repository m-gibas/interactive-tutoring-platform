package com.service.interactivetutoring.exceptions;

import org.springframework.http.HttpStatus;

public class CustomErrorResponse {
    private HttpStatus status;
    private String message;

    public CustomErrorResponse(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
