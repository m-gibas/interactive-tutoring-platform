package com.service.interactivetutoring;

import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserResource {
    private final UserService userService;

    private final Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(32,64,1,15*1024,2);


    public UserResource(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

//    wyszukiwanie pojedynczego uzytkownika
//    @GetMapping("/{id}")
//    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
//        User user = userService.findUserById(id);
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }

    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        String hashedPassword = encoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        User newUser = userService.addUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        User updatedUser = userService.updateUser(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    nie wiem czy przy username w parametrach powinno być @Valid, do sprawdzenia
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam @Valid String username, @RequestParam String password, HttpSession session) {
        User user = userService.findUserByUsername(username);
        if(user != null && encoder.matches(password, user.getPassword())) {
//            pomyśleć, czy może ustawiać tu użytkownika do sesji i np po 30 minutach wylogowuje?
            session.setAttribute("username", username);
//            nie wiem czy to jest poprawnie, ale coś takiego znalazłem?
            session.getServletContext().getSessionCookieConfig().setMaxAge(30 * 60);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpSession session) {
        if(session == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        session.invalidate();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
