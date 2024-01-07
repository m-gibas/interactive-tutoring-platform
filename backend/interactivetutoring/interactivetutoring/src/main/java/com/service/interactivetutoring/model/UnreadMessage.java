package com.service.interactivetutoring.model;

import jakarta.persistence.*;

@Entity
public class UnreadMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String username;

    private String room;

    @ManyToOne
    @JoinColumn(name = "message_id")
    private Message message;

    public UnreadMessage() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoom() {
        return room;
    }

    public UnreadMessage(String username, String room, Message message) {
        this.username = username;
        this.room = room;
        this.message = message;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }
}