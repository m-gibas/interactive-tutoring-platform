package com.service.interactivetutoring;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.service.MessageService;
import com.service.interactivetutoring.service.SocketIOService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SocketIOController {

    private final SocketIOServer  server;
    private final SocketIOService socketService;
    @Autowired
    private final MessageService messageService;

    public SocketIOController(SocketIOServer server, SocketIOService socketService, MessageService messageService) {
        this.server = server;
        this.socketService = socketService;
        this.messageService = messageService;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        server.addEventListener("send_message", Message.class, onChatReceived());
    }


    private DataListener<Message> onChatReceived() {
        System.out.println("onChatReceived");
        return (senderClient, data, ackSender) -> {
            log.info(data.toString());
            socketService.sendMessage(
                    data.getRoom(),
                    "get_message",
                    senderClient, data);

//            messageService.markMessagesAsRead(data.getSecondUserUsername());
            socketService.sendUnreadMessagesNotification(data);
        };
    }


    private ConnectListener onConnected() {
        return (client) -> {
            System.out.println("client data: {}" + client.getHandshakeData().getSingleUrlParam("room"));
            String room = client.getHandshakeData().getSingleUrlParam("room");
            client.joinRoom(room);
            log.info("Socket ID[{}]  Connected to socket", client.getSessionId().toString());
        };

    }

    private DisconnectListener onDisconnected() {
        return client -> {
            log.info("Client[{}] - Disconnected from socket", client.getSessionId().toString());
        };
    }

}