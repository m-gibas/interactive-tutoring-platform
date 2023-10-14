package com.service.interactivetutoring.model;

import jakarta.persistence.*;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.io.Serializable;

@Entity
@Validated
//@ValidUser(groups = ValidUserGroup.class)
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
//    @NotNull
//    @Size(min=5, max=45)
//    @Column(unique = true)
//    @Min(value = 5, message = "Username must have at least 5 characters")
//    @Max(value = 10, message = "Username must have less than 45 characters")
    @Length(min = 5, message = "Username must be at least 5 characters long")
    @Length(max = 45, message = "Username must be at most 45 characters long")
//    @Column(unique = true)
//    @UniqueElements(message = "Username already taken!")
    private String username;
//    @Size(min=5, max=45)
//    @Email
//    @NotBlank(message = "Email is mandatory")
//    @Size(min = )
    @Email(message = "Email must be in proper format like: abc@gmail.com")
//    @Column(unique = true)
//    @UniqueElements(message = "Email already taken!")
    private String email;
//    @NotEmpty(message = "Password is mandatory")
//    @Size(min=5, max=45, message = "Password between 5 to 45 characters")
    @Length(min = 6, message = "Password must be at least 6 characters long")
    private String password;

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
