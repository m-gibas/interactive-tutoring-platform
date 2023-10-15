package com.service.interactivetutoring.repository;

import com.service.interactivetutoring.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByFirstUserUsername(String firstUserUsername);

    List<Message> findAllByFirstUserUsernameAndSecondUserUsername(String firstUserUsername, String secondUserUsername);

}
