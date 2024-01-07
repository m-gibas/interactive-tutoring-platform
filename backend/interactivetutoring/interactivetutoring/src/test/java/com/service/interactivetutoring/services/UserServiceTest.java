package com.service.interactivetutoring.services;

import com.service.interactivetutoring.model.Announcement;
import com.service.interactivetutoring.model.User;
import com.service.interactivetutoring.repository.*;
import com.service.interactivetutoring.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;


import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserService userService;


    @Test
    public void testAddUser() {
        // Tworzenie testowego użytkownika
        User user = new User();
        user.setUsername("newUser");

        // Wywołanie metody z serwisu
        userService.addUser(user);

        // Sprawdzenie, że wywołana metoda wykonuje się w repozytorium
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testChangeAnnouncementAvailability() {
        // Przygotowanie danych testowych
        Long announcementId = 1L;
        boolean newAvailability = true;
        Announcement existingAnnouncement = new Announcement("testUser", "Subject", "Text", 50.0);
        existingAnnouncement.setId(announcementId);

        // Symulacja zachowania repozytorium
        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(existingAnnouncement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(existingAnnouncement);

        // Wywołanie metody serwisu
        userService.changeAnnouncementAvailability(announcementId, newAvailability);

        // Sprawdzenie, czy dostępność ogłoszenia została zmieniona
        assertTrue(existingAnnouncement.getIsTaken());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testChangeAnnouncementAvailabilityNotFound() {
        // Przygotowanie danych testowych
        Long nonExistingAnnouncementId = 99L;
        boolean newAvailability = true;

        // Symulacja zachowania repozytorium
        when(announcementRepository.findById(nonExistingAnnouncementId)).thenReturn(Optional.empty());

        // Wywołanie metody serwisu powinno rzucić wyjątek IllegalArgumentException
        userService.changeAnnouncementAvailability(nonExistingAnnouncementId, newAvailability);
    }

    @Test
    public void testFindAllAnnouncements() {
        // Przygotowanie danych testowych
        Announcement announcement1 = new Announcement("user1", "Subject1", "Text1", 50.0);
        Announcement announcement2 = new Announcement("user2", "Subject2", "Text2", 75.0);
        List<Announcement> announcements = Arrays.asList(announcement1, announcement2);

        // Symulacja zachowania repozytorium
        when(announcementRepository.findAll()).thenReturn(announcements);

        // Wywołanie metody serwisu
        List<Announcement> allAnnouncements = userService.findAllAnnouncements();

        // Sprawdzenie, czy wszystkie ogłoszenia zostały pobrane
        assertNotNull(allAnnouncements);
        assertEquals(2, allAnnouncements.size());
        assertEquals("Text2", allAnnouncements.get(1).getText());
    }

    @Test
    public void testFindAllAnnouncementsForUser() {
        // Przygotowanie danych testowych
        String username = "testUser";
        Announcement announcement1 = new Announcement(username, "Subject1", "Text1", 50.0);
        Announcement announcement2 = new Announcement(username, "Subject2", "Text2", 75.0);
        List<Announcement> userAnnouncements = Arrays.asList(announcement1, announcement2);

        // Symulacja zachowania repozytorium
        when(announcementRepository.findAllByUsername(username)).thenReturn(userAnnouncements);

        // Wywołanie metody serwisu
        List<Announcement> announcementsForUser = userService.findAllAnnouncementsForUser(username);

        // Sprawdzenie, czy ogłoszenia dla użytkownika zostały pobrane
        assertNotNull(announcementsForUser);
        assertEquals(2, announcementsForUser.size());
        assertEquals("Subject2", announcementsForUser.get(1).getSubject());
    }
}
