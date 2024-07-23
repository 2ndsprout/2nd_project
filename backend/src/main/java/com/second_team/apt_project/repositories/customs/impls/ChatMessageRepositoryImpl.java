package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.ChatMessage;
import com.second_team.apt_project.domains.ChatRoom;
import com.second_team.apt_project.domains.QChatMessage;
import com.second_team.apt_project.repositories.customs.ChatMessageRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ChatMessageRepositoryImpl implements ChatMessageRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QChatMessage qChatMessage = QChatMessage.chatMessage;


    @Override
    public List<ChatMessage> findByChatRoomList(ChatRoom chatRoom) {
        return jpaQueryFactory.selectFrom(qChatMessage).where(qChatMessage.chatRoom.eq(chatRoom)).fetch();
    }
}
