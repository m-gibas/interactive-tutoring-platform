package com.service.interactivetutoring.service;

import com.corundumstudio.socketio.SocketIOClient;
import com.service.interactivetutoring.model.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SocketIOService {

    public void sendMessage(String room, String eventName, SocketIOClient senderClient, Message message) {
        for (
                SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent(eventName, message);
            }
        }
    }

}