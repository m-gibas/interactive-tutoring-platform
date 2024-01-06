package com.service.interactivetutoring;

import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.model.UnreadMessage;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {
    @Autowired
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }


    @GetMapping("/recent-chatters")
    public ResponseEntity<List<String>> getRecentChatters(@RequestParam String firstUsername) {
        List<String> recentUsers = messageService.findRecentChatters(firstUsername);
        return new ResponseEntity<>(recentUsers, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Message>> findAllMessagesForUser(@RequestParam String username) {
        List<Message> allMessages = messageService.findAllMessagesByUsername(username);
        return new ResponseEntity<>(allMessages, HttpStatus.OK);
    }


    @GetMapping("/all-between-users")
    public ResponseEntity<List<Message>> findAllMessagesBetweenUsers(@RequestParam String firstUsername, @RequestParam String secondUsername) {
        List<Message> allMessages = messageService.findAllMessagesBetweenUsers(firstUsername, secondUsername);
        return new ResponseEntity<>(allMessages, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Message> addMessage(@RequestBody Message message) {
        LocalDateTime now = LocalDateTime.now();
        Timestamp timestamp = Timestamp.valueOf(now);
        message.setDate(timestamp);
        System.out.println("add message " + message);
        Message addedMessage = messageService.addMessage(message);

        messageService.addUnreadMessage(message.getSecondUserUsername(), message.getRoom(), addedMessage);
        return new ResponseEntity<>(addedMessage, HttpStatus.OK);
    }

    @GetMapping("/unread-messages")
    public ResponseEntity<List<UnreadMessage>> getUnreadMessages(@RequestParam String username) {
        List<UnreadMessage> unreadMessages = messageService.getUnreadMessages(username);
        return new ResponseEntity<>(unreadMessages, HttpStatus.OK);
    }

     @GetMapping("/mark-messages-as-read")
    public ResponseEntity<?> markMessagesAsRead(@RequestParam String room) {
         messageService.markMessagesAsRead(room);
        return new ResponseEntity<>(HttpStatus.OK);
    }



}
