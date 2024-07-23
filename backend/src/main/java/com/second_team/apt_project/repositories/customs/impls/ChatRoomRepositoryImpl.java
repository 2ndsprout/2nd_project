package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.ChatRoom;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.domains.QChatRoom;
import com.second_team.apt_project.repositories.customs.ChatRoomRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ChatRoomRepositoryImpl implements ChatRoomRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QChatRoom qChatRoom = QChatRoom.chatRoom;


}
