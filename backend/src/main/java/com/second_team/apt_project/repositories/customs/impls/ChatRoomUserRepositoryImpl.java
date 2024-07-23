package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.repositories.customs.ChatRoomUserRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class ChatRoomUserRepositoryImpl implements ChatRoomUserRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QChatRoomUser qChatRoomUser = QChatRoomUser.chatRoomUser;

    @Override
    public List<ChatRoomUser> findByChatRoomList(ChatRoom chatRoom) {
        return jpaQueryFactory.selectFrom(qChatRoomUser).where(qChatRoomUser.chatRoom.eq(chatRoom)).fetch();
    }

    @Override
    public Optional<ChatRoomUser> findByChatRoom(ChatRoom chatRoom, Profile targetProfile) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qChatRoomUser).where(qChatRoomUser.chatRoom.eq(chatRoom).and(qChatRoomUser.profile.eq(targetProfile))).fetchOne());
    }

    @Override
    public List<ChatRoomUser> getList(Profile profile) {
        return jpaQueryFactory.selectFrom(qChatRoomUser).where(qChatRoomUser.profile.eq(profile)).fetch();
    }
}
