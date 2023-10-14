package com.service.interactivetutoring.service;

import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> findAllMessagesByUsername(String username) {
        return messageRepository.findAllByFirstUserUsername(username);
    }

    public Message addMessage(Message message) {
        return messageRepository.save(message);
    }
}
