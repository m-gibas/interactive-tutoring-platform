package com.service.interactivetutoring.service;

import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.model.UnreadMessage;
import com.service.interactivetutoring.repository.MessageRepository;
import com.service.interactivetutoring.repository.UnreadMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    private final MessageRepository messageRepository;
    @Autowired
    private final UnreadMessageRepository unreadMessageRepository;
    @Autowired
    private final SocketIOService socketIOService;

    public MessageService(MessageRepository messageRepository, UnreadMessageRepository unreadMessageRepository, SocketIOService socketIOService) {
        this.messageRepository = messageRepository;
        this.unreadMessageRepository = unreadMessageRepository;
        this.socketIOService = socketIOService;
    }


    public List<String> findRecentChatters(String username) {
        return messageRepository.findRecentChatters(username);
    }

    public List<Message> findAllMessagesByUsername(String username) {
        return messageRepository.findAllByFirstUserUsername(username);
    }

    public List<Message> findAllMessagesByBothUsernames(String firstUsername, String secondUsername) {
        return messageRepository.findAllByFirstUserUsernameAndSecondUserUsername(firstUsername, secondUsername);
    }

    public List<Message> findAllMessagesBetweenUsers(String firstUsername, String secondUsername) {
        return messageRepository.getAllBetweenUsers(firstUsername, secondUsername);
    }

    public Message addMessage(Message message) {
        return messageRepository.save(message);
    }


//    Unread Messages

    public void addUnreadMessage(String username, String room, Message message) {
        UnreadMessage unreadMessage = new UnreadMessage();
        unreadMessage.setUsername(username);
        unreadMessage.setRoom(room);
        unreadMessage.setMessage(message);
        unreadMessageRepository.save(unreadMessage);
    }

    public List<UnreadMessage> getUnreadMessages(String username) {
        return unreadMessageRepository.findAllByUsername(username);
    }

    public void markMessagesAsRead(String room) {
        // Znajdź nieprzeczytane wiadomości dla danego użytkownika
        List<UnreadMessage> unreadMessages = unreadMessageRepository.findAllByRoom(room);

        // Oznacz jako przeczytane i usuń z tabeli
        for (UnreadMessage unreadMessage : unreadMessages) {
            unreadMessageRepository.delete(unreadMessage);
        }

        // Po oznaczeniu wiadomości jako przeczytane, wysyłamy powiadomienie przez WebSocket
//        to chyba niepotrzebne, bo wysyła wiadomość jakby do użytkownika co to czyta?
//        socketIOService.sendUnreadMessagesNotification(username);
    }
}
