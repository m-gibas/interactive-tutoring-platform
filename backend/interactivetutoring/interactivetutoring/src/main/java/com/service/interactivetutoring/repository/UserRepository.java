package com.service.interactivetutoring.repository;

import com.service.interactivetutoring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    void deleteUserById(Long id);
    User findUserByUsername(String username);

}
