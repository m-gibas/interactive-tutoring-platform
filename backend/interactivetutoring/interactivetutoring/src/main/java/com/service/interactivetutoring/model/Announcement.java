package com.service.interactivetutoring.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.validation.annotation.Validated;

import java.util.Date;


@Entity
@Table(name = "announcement")
@Validated
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

//    @JsonBackReference
//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//private User user;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String text;

    private Double price;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_posted", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date datePosted;

    private boolean IsTaken;

    public Announcement() {
    }

    public Announcement(String username, String subject, String text, Double price) {
        this.username = username;
        this.subject = subject;
        this.text = text;
        this.price = price;
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

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Date getDatePosted() {
        return datePosted;
    }

    public void setDatePosted(Date datePosted) {
        this.datePosted = datePosted;
    }

    public boolean getIsTaken() {
        return IsTaken;
    }

    public void setIsTaken(boolean isTaken) {
        IsTaken = isTaken;
    }
}
