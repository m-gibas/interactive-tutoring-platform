package com.service.interactivetutoring.service;

import com.service.interactivetutoring.exceptions.ValueTakenException;
import com.service.interactivetutoring.model.Announcement;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.model.UserProfile;
import com.service.interactivetutoring.repository.AnnouncementRepository;
import com.service.interactivetutoring.repository.UserProfileRepository;
import com.service.interactivetutoring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final AnnouncementRepository announcementRepository;
    @Autowired
    private final UserProfileRepository userProfileRepository;

//    @Autowired
    public UserService(UserRepository userRepository, AnnouncementRepository announcementRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
        this.userProfileRepository = userProfileRepository;
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

//    Announcements

    public List<Announcement> findAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public List<Announcement> findAllAnnouncementsForUser(String username) {
        return announcementRepository.findAllByUsername(username);
    }

    public Announcement addAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public void changeAnnouncementAvailability(Long announcementId, boolean newAvailability) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found with id: " + announcementId));

        announcement.setIsTaken(newAvailability);
        announcementRepository.save(announcement);
    }

//    User Profiles
    public UserProfile findUserProfile(String username) {
        return userProfileRepository.findByUsername(username);
    }

    public UserProfile updateUserProfile(UserProfile userProfile) {
//        return userProfileRepository.save(userProfile);
        Optional<UserProfile> existingProfileOptional = Optional.ofNullable(userProfileRepository.findByUsername(userProfile.getUsername()));

        if (existingProfileOptional.isPresent()) {
            // Update the existing profile if it exists
            UserProfile existingProfile = existingProfileOptional.get();
            existingProfile.setName(userProfile.getName());
            existingProfile.setSurname(userProfile.getSurname());
            existingProfile.setAbout(userProfile.getAbout());
            return userProfileRepository.save(existingProfile);
        } else {
            // Create a new profile if it doesn't exist
            return userProfileRepository.save(userProfile);
        }
    }

}
