package com.service.interactivetutoring.service;

import com.service.interactivetutoring.exceptions.CustomErrorResponse;
import com.service.interactivetutoring.exceptions.ValueTakenException;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

//    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

}
