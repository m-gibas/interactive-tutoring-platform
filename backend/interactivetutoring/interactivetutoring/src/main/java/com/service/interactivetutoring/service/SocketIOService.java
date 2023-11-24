package com.service.interactivetutoring.service;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.service.interactivetutoring.model.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SocketIOService {
    private final SocketIOServer server;

    public SocketIOService(SocketIOServer server) {
        this.server = server;
    }

    public void sendMessage(String room, String eventName, SocketIOClient senderClient, Message message) {
        for (
                SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
//            uncomment to send messages only to other users - excluding the one who send it
//            if (!client.getSessionId().equals(senderClient.getSessionId()))
                client.sendEvent(eventName, message);

        }
    }

    public void sendUnreadMessagesNotification(Message message) {
        server.getBroadcastOperations().sendEvent("unread_messages", message);
    }

}