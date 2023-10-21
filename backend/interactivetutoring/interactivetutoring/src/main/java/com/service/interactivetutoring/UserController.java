package com.service.interactivetutoring;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.service.interactivetutoring.model.LoginUser;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
//@Validated
@RequestMapping("/user")
public class UserController {

    @Autowired
    private final UserService userService;

//    pytanie czy to i initBinder potrzebne?
    public static final Logger log = LoggerFactory.getLogger(UserController.class);

    public void initBinder(WebDataBinder webDataBinder) {
        StringTrimmerEditor stringTrimmerEditor = new StringTrimmerEditor(true);
        webDataBinder.registerCustomEditor(String.class, stringTrimmerEditor);
    }

    private final Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(32,64,1,15*1024,2);

    public UserController(UserService userService) {
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
    public ResponseEntity<User> addUser(@Valid @RequestBody User user) {

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

//    raczej to dać jako RequestBody?
    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password, HttpSession session) {
    public ResponseEntity<?> loginUser(@RequestBody LoginUser loginUser, HttpSession session) {
        User user = userService.findUserByUsername(loginUser.getUsername());
        if(user != null && encoder.matches(loginUser.getPassword(), user.getPassword())) {
//            pomyśleć, czy może ustawiać tu użytkownika do sesji i np po 30 minutach wylogowuje?

            System.out.println(loginUser.getUsername());
            session.setAttribute("username", loginUser.getUsername());
            System.out.println("sesja" + session.getAttribute("username"));
//            nie wiem czy to jest poprawnie, ale coś takiego znalazłem?
//            Property [max age] cannot be added to SessionCookieConfig for context [] as the context has been initialised
//            session.getServletContext().getSessionCookieConfig().setMaxAge(30 * 60);
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

    @GetMapping("/get-current-username")
    @ResponseBody
    public ResponseEntity<String> getCurrentUsername(HttpSession session) throws JsonProcessingException {
        String username = (String) session.getAttribute("username");
        Map<String, Object> usernameObject = new HashMap<>();
        usernameObject.put("username", username);
        ObjectMapper mapper = new ObjectMapper();

        if (username == null) {
            return ResponseEntity.notFound().build();
        }
        return new ResponseEntity<>(mapper.writeValueAsString(usernameObject), HttpStatus.OK);
    }
}
