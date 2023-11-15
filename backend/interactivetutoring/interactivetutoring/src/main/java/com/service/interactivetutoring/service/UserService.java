package com.service.interactivetutoring.service;

import com.service.interactivetutoring.exceptions.ValueTakenException;
import com.service.interactivetutoring.model.Announcement;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.repository.AnnouncementRepository;
import com.service.interactivetutoring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final AnnouncementRepository announcementRepository;

//    @Autowired
    public UserService(UserRepository userRepository, AnnouncementRepository announcementRepository) {
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
    }

    public User addUser(User user) {
//        Set<ConstraintViolation<User>> violations = validatorFactory.getValidator().validate(user);
//        if(!violations.isEmpty()) {
//            throw new ValidationException(violations.stream().map(ConstraintViolation::getMessage).collect(Collectors.joining()));
//        }
        if (userRepository.findUserByUsername(user.getUsername()) != null) {
            throw new ValueTakenException("Username is already taken");
        }
        if (userRepository.findUserByEmail(user.getEmail()) != null) {
            throw new ValueTakenException("Email is already taken.");
        }

       return userRepository.save(user);
    }


    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }
//  returnUsers?
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteUserById(id);
    }

    public List<Announcement> findAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public List<Announcement> findAllAnnouncementsForUser(String username) {
        return announcementRepository.findAllByUsername(username);
    }


    public Announcement addAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
}
