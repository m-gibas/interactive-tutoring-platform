package com.service.interactivetutoring.repository;

import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByFirstUserUsername(String firstUserUsername);

    List<Message> findAllByFirstUserUsernameAndSecondUserUsername(String firstUserUsername, String secondUserUsername);

    @Query(value = "SELECT * FROM " +
            "(SELECT * FROM message m " +
            "WHERE (m.first_user_username = :firstUserUsername AND m.second_user_username = :secondUserUsername) " +
            "OR (m.first_user_username = :secondUserUsername AND m.second_user_username = :firstUserUsername) " +
            "ORDER BY m.date DESC, m.id DESC " +
            "LIMIT 20 " +
            ") T " +
            "ORDER BY T.date, T.id ASC", nativeQuery = true)
    List<Message> getAllBetweenUsers(@Param("firstUserUsername") String firstUserUsername,
                                     @Param("secondUserUsername") String secondUserUsername);


    @Query(value = "SELECT DISTINCT username " +
            "FROM ( " +
            "    SELECT first_user_username AS username, date " +
            "    FROM message " +
            "    WHERE second_user_username = 'maks1' " +
            "    UNION " +
            "    SELECT second_user_username AS username, date " +
            "    FROM message " +
            "    WHERE first_user_username = 'maks1' " +
            ") AS merged_usernames " +
            "ORDER BY date;",
            nativeQuery = true)
    List<String> findRecentChatters(@Param("firstUserUsername") String firstUserUsername);


}
