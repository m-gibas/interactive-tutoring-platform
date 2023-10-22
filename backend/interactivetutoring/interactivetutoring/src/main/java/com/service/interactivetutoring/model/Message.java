package com.service.interactivetutoring.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;

@Entity
@Validated
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    @NotBlank(message = "firstUserUsername must not be blank")
    private String firstUserUsername;
    @NotBlank(message = "secondUserUsername must not be blank")

    private String secondUserUsername;
    private String message;
    private String room;

    public Message() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstUserUsername() {
        return firstUserUsername;
    }

    public void setFirstUserUsername(String firstUserUsername) {
        this.firstUserUsername = firstUserUsername;
    }

    public String getSecondUserUsername() {
        return secondUserUsername;
    }

    public void setSecondUserUsername(String secondUserUsername) {
        this.secondUserUsername = secondUserUsername;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    @Override
    public String toString() {
        return "Message{" +
                "id=" + id +
                ", firstUserUsername='" + firstUserUsername + '\'' +
                ", secondUserUsername='" + secondUserUsername + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
