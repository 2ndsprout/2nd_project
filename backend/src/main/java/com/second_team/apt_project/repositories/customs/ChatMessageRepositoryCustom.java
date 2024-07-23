package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.ChatMessage;
import com.second_team.apt_project.domains.ChatRoom;

import java.util.List;

public interface ChatMessageRepositoryCustom {
    List<ChatMessage> findByChatRoomList(ChatRoom chatRoom);
}
