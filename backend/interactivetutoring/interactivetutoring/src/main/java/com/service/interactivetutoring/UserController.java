package com.service.interactivetutoring;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.service.interactivetutoring.model.Announcement;
import com.service.interactivetutoring.model.LoginUser;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.model.UserProfile;
import com.service.interactivetutoring.service.UserService;
import jakarta.servlet.SessionCookieConfig;
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

    @GetMapping("/get-user")
    public ResponseEntity<User> getUserByUsername(@RequestParam String username) {
        User user = userService.findUserByUsername(username);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


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

    // poprawić logowanie do systemu - aktualnie da się tylko jeden raz i się zawiesza (w sumie to nie wiem kiedy to przestaje działać)
//    do tego dodać wyświetlanie błędów na froncie i poprawić komunikaty i warunki, dodać np regexa czy coś - jakbym dodał imię i nazwisko, to żeby tylko można było litery pisać
//     i dodać też obsługę wylogowania (w apce)

//    mogę pousuwac nieużywane metody też
    //    dodatkowo pom.xml mogę posprzątać trochę z dependencji np.: mvn dependency:analyze -DignoreNonCompile

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginUser loginUser, HttpSession session) {
        User user = userService.findUserByUsername(loginUser.getUsername());

        if(user == null) {
            return new ResponseEntity<>("There is no user with such username!", HttpStatus.NOT_FOUND);
        }
        else if(!encoder.matches(loginUser.getPassword(), user.getPassword())) {
            return new ResponseEntity<>("Password invalid!", HttpStatus.NOT_FOUND);
        }

        session.setAttribute("username", loginUser.getUsername());
        return new ResponseEntity<>(HttpStatus.OK);
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
            new ResponseEntity<>(null, HttpStatus.OK);
//            return ResponseEntity.notFound().build();
        }
        return new ResponseEntity<>(mapper.writeValueAsString(usernameObject), HttpStatus.OK);
    }


//  Announcements

    @GetMapping("/get-announcements")
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = userService.findAllAnnouncements();

        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }

    @GetMapping("/get-announcements-for-user")
    public ResponseEntity<List<Announcement>> getAllAnnouncementsForUser(@RequestParam String username) {
        List<Announcement> announcements = userService.findAllAnnouncementsForUser(username);

        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }

    @PostMapping("/add-announcement")
    public ResponseEntity<Announcement> addAnnouncement(@Valid @RequestBody Announcement announcement) {
        Announcement newAnnouncement = userService.addAnnouncement(announcement);

        return new ResponseEntity<>(newAnnouncement, HttpStatus.CREATED);
    }

    @PatchMapping("/change-announcement-availability")
//    public ResponseEntity<?> changeAnnouncementAvailability(@RequestParam Long id, @RequestParam boolean newAvailability) {
    public ResponseEntity<?> changeAnnouncementAvailability(@RequestBody Map<String, Object> payload) {
        Long id = ((Number) payload.get("id")).longValue();
        boolean newAvailability = (Boolean) payload.get("newAvailability");

        System.out.println("id: " + id + "  boolean: " + newAvailability);

        userService.changeAnnouncementAvailability(id, newAvailability);

        return new ResponseEntity<>(HttpStatus.OK);

    }


//    User Profiles


    @GetMapping("/get-user-profile")
    public ResponseEntity<UserProfile> getUserProfile(@RequestParam String username) {
        UserProfile userProfile = userService.findUserProfile(username);

        return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }


    @PutMapping("/update-profile")
    public ResponseEntity<UserProfile> updateUserProfile(@RequestBody UserProfile userProfile) {
        UserProfile updatedUserProfile = userService.updateUserProfile(userProfile);
        return new ResponseEntity<>(updatedUserProfile, HttpStatus.OK);
    }

}
