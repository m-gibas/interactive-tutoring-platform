package com.service.interactivetutoring.repository;

import com.service.interactivetutoring.model.UnreadMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnreadMessageRepository extends JpaRepository<UnreadMessage, Long> {
    List<UnreadMessage> findAllByUsername(String username);

    List<UnreadMessage> findAllByRoom(String room);
}
