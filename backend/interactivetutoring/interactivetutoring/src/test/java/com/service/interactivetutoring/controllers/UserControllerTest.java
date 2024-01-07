package com.service.interactivetutoring.controllers;

import com.service.interactivetutoring.UserController;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.is;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void testGetUserByUsername() throws Exception {
        // Przygotowanie danych testowych
        String username = "testUser";
        User expectedUser = new User();
        expectedUser.setUsername(username);

        // Symulacja działania serwisu
        when(userService.findUserByUsername(username)).thenReturn(expectedUser);

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(get("/user/get-user")
                        .param("username", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username));
    }


    @Test
    public void testAddUser() throws Exception {
        // Przygotowanie danych testowych
        User newUser = new User();
        newUser.setUsername("newUser");
        newUser.setPassword("password123");
        newUser.setEmail("newUser@example.com");

        // Symulacja działania serwisu
        when(userService.addUser(any(User.class))).thenReturn(newUser);

        // Tworzenie żądania HTTP
        String requestBody = "{ \"username\": \"newUser\", \"password\": \"password123\", \"email\": \"newUser@example.com\" }";

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(post("/user/add")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newUser"));
    }


    @Test
    public void testUpdateUser() throws Exception {
        // Przygotowanie danych testowych
        User userToUpdate = new User();
        userToUpdate.setId(1L);
        userToUpdate.setUsername("updatedUser");

        // Symulacja działania serwisu
        when(userService.updateUser(any(User.class))).thenReturn(userToUpdate);

        // Tworzenie żądania HTTP
        String requestBody = "{ \"id\": 1, \"username\": \"updatedUser\", \"password\": \"updatedPassword\", \"email\": \"updatedUser@example.com\" }";

        // Wywołanie kontrolera i sprawdzenie wyników
        mockMvc.perform(put("/user/update")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updatedUser"));
    }

}
