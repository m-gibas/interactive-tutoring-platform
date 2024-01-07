package com.service.interactivetutoring.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.service.interactivetutoring.MessageController;
import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.model.UnreadMessage;
import com.service.interactivetutoring.service.MessageService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@WebMvcTest(MessageController.class)
public class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MessageService messageService;

    @Test
    public void testGetRecentChatters() throws Exception {
        // Przygotowanie danych testowych
        String firstUsername = "user1";
        List<String> expectedRecentChatters = Arrays.asList("user2", "user3");

        // Symulacja działania serwisu
        when(messageService.findRecentChatters(firstUsername)).thenReturn(expectedRecentChatters);

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(get("/message/recent-chatters")
                        .param("firstUsername", firstUsername))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0]").value("user2"))
                .andExpect(jsonPath("$[1]").value("user3"));
    }


    @Test
    public void testFindAllMessagesBetweenUsers() throws Exception {
        // Przygotowanie danych testowych
        String firstUsername = "user1";
        String secondUsername = "user2";
        List<Message> expectedMessages = Arrays.asList(
                new Message(firstUsername, secondUsername, "Hello!", "room1"),
                new Message(secondUsername, firstUsername, "Hi there!", "room1")
        );

        // Symulacja działania serwisu
        when(messageService.findAllMessagesBetweenUsers(firstUsername, secondUsername)).thenReturn(expectedMessages);

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(get("/message/all-between-users")
                        .param("firstUsername", firstUsername)
                        .param("secondUsername", secondUsername))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].firstUserUsername").value(firstUsername))
                .andExpect(jsonPath("$[1].firstUserUsername").value(secondUsername));
    }

    @Test
    public void testAddMessage() throws Exception {
        // Przygotowanie danych testowych
        Message message = new Message("user1", "user2", "Hello!", "room1");

        // Symulacja działania serwisu
        when(messageService.addMessage(any(Message.class))).thenReturn(message);

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(post("/message/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(message)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstUserUsername").value("user1"))
                .andExpect(jsonPath("$.secondUserUsername").value("user2"))
                .andExpect(jsonPath("$.message").value("Hello!"));
    }

    @Test
    public void testGetUnreadMessages() throws Exception {
        // Przygotowanie danych testowych
        String username = "user1";
        List<UnreadMessage> expectedUnreadMessages = Arrays.asList(
                new UnreadMessage(username, "room1", new Message("user2", username, "Hello!", "room1")),
                new UnreadMessage(username, "room1", new Message("user3", username, "Hi there!", "room1"))
        );

        // Symulacja działania serwisu
        when(messageService.getUnreadMessages(username)).thenReturn(expectedUnreadMessages);

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(get("/message/unread-messages")
                        .param("username", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].message.secondUserUsername").value(username)) // Poprawka tutaj
                .andExpect(jsonPath("$[1].message.secondUserUsername").value(username)); // Poprawka tutaj
    }


    @Test
    public void testMarkMessagesAsRead() throws Exception {
        // Przygotowanie danych testowych
        String room = "room1";

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(get("/message/mark-messages-as-read")
                        .param("room", room))
                .andExpect(status().isOk());

        // Sprawdzenie, czy metoda serwisu została wywołana
        verify(messageService, times(1)).markMessagesAsRead(room);
    }

    // Metoda pomocnicza do konwersji obiektu na JSON
    private String asJsonString(Object object) {
        try {
            return new ObjectMapper().writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}

