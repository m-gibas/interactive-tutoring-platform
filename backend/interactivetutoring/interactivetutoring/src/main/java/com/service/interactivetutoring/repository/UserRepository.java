package com.service.interactivetutoring.repository;

import com.service.interactivetutoring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    void deleteUserById(Long id);
    User findUserByUsername(String username);
    User findUserByEmail(String email);

}
