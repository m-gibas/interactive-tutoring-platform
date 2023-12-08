package com.service.interactivetutoring.services;

import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.model.UnreadMessage;
import com.service.interactivetutoring.repository.MessageRepository;
import com.service.interactivetutoring.repository.UnreadMessageRepository;
import com.service.interactivetutoring.service.MessageService;
import com.service.interactivetutoring.service.SocketIOService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UnreadMessageRepository unreadMessageRepository;

    @Mock
    private SocketIOService socketIOService;

    @InjectMocks
    private MessageService messageService;

    @Test
    public void testFindRecentChatters() {
        // Przygotowanie danych testowych
        String username = "testUser";
        List<String> expectedRecentChatters = Arrays.asList("user1", "user2", "user3");

        // Symulacja działania repozytorium
        when(messageRepository.findRecentChatters(username)).thenReturn(expectedRecentChatters);

        // Wywołanie metody serwisu
        List<String> actualRecentChatters = messageService.findRecentChatters(username);

        // Sprawdzenie, czy wyniki są zgodne z oczekiwaniami
        assertEquals(expectedRecentChatters, actualRecentChatters);
    }

    @Test
    public void testFindAllMessagesByUsername() {
        // TODO: Implement test case
    }

    @Test
    public void testFindAllMessagesBetweenUsers() {
        // Przygotowanie danych testowych
        String firstUsername = "user1";
        String secondUsername = "user2";

        // Przykładowe wiadomości
        Message message1 = new Message(firstUsername, secondUsername, "Hello!", "room1");
        Message message2 = new Message(secondUsername, firstUsername, "Hi there!", "room1");
        Message message3 = new Message(firstUsername, secondUsername, "How are you?", "room2");

        List<Message> expectedMessages = Arrays.asList(message1, message2, message3);

        // Symulacja działania repozytorium
        when(messageRepository.getAllBetweenUsers(firstUsername, secondUsername)).thenReturn(expectedMessages);

        // Wywołanie metody serwisu
        List<Message> actualMessages = messageService.findAllMessagesBetweenUsers(firstUsername, secondUsername);

        // Sprawdzenie, czy wyniki są zgodne z oczekiwaniami
        assertEquals(expectedMessages, actualMessages);
    }

    @Test
    public void testAddMessage() {
        // Przygotowanie danych testowych
        String firstUsername = "user1";
        String secondUsername = "user2";
        String messageText = "Hello!";
        String room = "room1";

        // Przykładowa wiadomość
        Message newMessage = new Message(firstUsername, secondUsername, messageText, room);

        // Symulacja działania repozytorium
        when(messageRepository.save(newMessage)).thenReturn(newMessage);

        // Wywołanie metody serwisu
        Message addedMessage = messageService.addMessage(newMessage);

        // Sprawdzenie, czy wyniki są zgodne z oczekiwaniami
        assertEquals(newMessage, addedMessage);

        // Sprawdzenie, czy metoda repozytorium została wywołana z odpowiednimi parametrami
        verify(messageRepository).save(newMessage);
    }

    @Test
    public void testAddUnreadMessage() {
        // Przygotowanie danych testowych
        String username = "user1";
        String room = "room1";
        String messageText = "Hello!";
        Message message = new Message("senderUser", username, messageText, room);

        // Wywołanie metody serwisu
        messageService.addUnreadMessage(username, room, message);

        // Sprawdzenie, czy metoda repozytorium została wywołana z odpowiednimi parametrami
        verify(unreadMessageRepository).save(any(UnreadMessage.class));
    }

    @Test
    public void testGetUnreadMessages() {
        // Przygotowanie danych testowych
        String username = "user1";
        String room = "room1";

        // Symulacja działania repozytorium
        List<UnreadMessage> expectedUnreadMessages = Arrays.asList(
                new UnreadMessage(username, room, new Message("sender1", username, "Hello!", room)),
                new UnreadMessage(username, room, new Message("sender2", username, "How are you?", room))
        );
        when(unreadMessageRepository.findAllByUsername(username)).thenReturn(expectedUnreadMessages);

        // Wywołanie metody serwisu
        List<UnreadMessage> actualUnreadMessages = messageService.getUnreadMessages(username);

        // Sprawdzenie, czy wyniki są zgodne z oczekiwaniami
        assertEquals(expectedUnreadMessages, actualUnreadMessages);
    }

    @Test
    public void testMarkMessagesAsRead() {
        // Przygotowanie danych testowych
        String room = "room1";

        // Symulacja działania repozytorium
        List<UnreadMessage> unreadMessages = Arrays.asList(
                new UnreadMessage("user1", room, new Message("sender1", "user1", "Hello!", room)),
                new UnreadMessage("user1", room, new Message("sender2", "user1", "How are you?", room))
        );
        when(unreadMessageRepository.findAllByRoom(room)).thenReturn(unreadMessages);

        // Wywołanie metody serwisu
        messageService.markMessagesAsRead(room);

        // Sprawdzenie, czy metoda repozytorium została wywołana z odpowiednimi parametrami
        for (UnreadMessage unreadMessage : unreadMessages) {
            verify(unreadMessageRepository).delete(eq(unreadMessage));
        }
    }
}
