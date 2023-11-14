package com.service.interactivetutoring.model;

import jakarta.persistence.*;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.validation.annotation.Validated;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "user")
@Validated
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    @Length(min = 5, message = "Username must be at least 5 characters long")
    @Length(max = 45, message = "Username must be at most 45 characters long")
    private String username;
    @Email(message = "Email must be in proper format like: abc@gmail.com")
    private String email;
    @Length(min = 6, message = "Password must be at least 6 characters long")
    private String password;

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<Announcement> announcements;

    public User() {
    }

//    public User(Long id, String username, String email, String password) {
//        this.id = id;
//        this.username = username;
//        this.email = email;
//        this.password = password;
//    }

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
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
