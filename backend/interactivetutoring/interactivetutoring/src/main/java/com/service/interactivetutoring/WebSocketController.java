package com.service.interactivetutoring;

import com.service.interactivetutoring.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate template;

    @Autowired
    WebSocketController(SimpMessagingTemplate template){
        this.template = template;
    }

    @MessageMapping("/send-message")
    @SendTo("/topic/public")
    public Message onReceivedMessage(@Payload Message message) {
//        nie wiem czy taki destination? sprawdzić
//        this.template.convertAndSend("chat", new SimpleDateFormat("Hh:mm:ss").format(new Date()) + "- " + message);
        System.out.println(message);
    return message;
    }

    @MessageMapping("/add-user")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", message.getFirstUserUsername());
        return message;
    }
}
