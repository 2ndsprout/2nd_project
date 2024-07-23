package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.ChatRoom;
import com.second_team.apt_project.domains.ChatRoomUser;
import com.second_team.apt_project.domains.Profile;

import java.util.List;
import java.util.Optional;

public interface ChatRoomUserRepositoryCustom {
    List<ChatRoomUser> findByChatRoomList(ChatRoom chatRoom);

    Optional<ChatRoomUser> findByChatRoom(ChatRoom chatRoom, Profile targetProfile);

    List<ChatRoomUser> getList(Profile profile);
}
