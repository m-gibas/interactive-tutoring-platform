package com.service.interactivetutoring;

import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {
    @Autowired
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Message>> findAllMessagesForUser(@RequestParam String username) {
        List<Message> allMessages = messageService.findAllMessagesByUsername(username);
        return new ResponseEntity<>(allMessages, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Message> addMessage(@RequestBody Message message) {
        Message addedMessage = messageService.addMessage(message);
        return new ResponseEntity<>(addedMessage, HttpStatus.OK);
    }
}
