package com.service.interactivetutoring;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.service.interactivetutoring.model.Message;
import com.service.interactivetutoring.service.SocketIOService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SocketIOController {

    private final SocketIOServer  server;
    private final SocketIOService socketService;

    public SocketIOController(SocketIOServer server, SocketIOService socketService) {
        this.server = server;
        this.socketService = socketService;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        server.addEventListener("send_message", Message.class, onChatReceived());
    }


//    sprawdzić czy działa wszystko z tym zakomentowanym kodem, jeśli tak to go pousuwać
//    do tego jak obsłużyć pokój? bo nie ma sensu raczej, żeby był jako pole w Message
//    ewentualnie może go usunąć, skoro i tak nie korzystam z pokoi aktualnie

//    dodatkowo pom.xml mogę posprzątać trochę z dependencji

//    może jako room przesyłać jakiegoś sklejonego stringa np firstUsername/secondUsername - tylko może niekoniecznie ze slashem
//    myślę, że będzie małoinwazyjne, a w razie gdybym chciał dodać pokoje to pewnie się przyda

    private DataListener<Message> onChatReceived() {
        System.out.println("onChatReceived");
        return (senderClient, data, ackSender) -> {
            log.info(data.toString());
            socketService.sendMessage(
                    data.getRoom(),
                    "get_message", senderClient, data);
//            data.getMessage()
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