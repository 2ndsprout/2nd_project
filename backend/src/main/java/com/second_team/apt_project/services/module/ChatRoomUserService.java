package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.ChatRoom;
import com.second_team.apt_project.domains.ChatRoomUser;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.repositories.ChatRoomUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomUserService {
    private final ChatRoomUserRepository chatRoomUserRepository;

    public ChatRoomUser save(Profile profile, ChatRoom chatRoom) {
        return chatRoomUserRepository.save(ChatRoomUser.builder().profile(profile).chatRoom(chatRoom).build());
    }

    public List<ChatRoomUser> findByChatRoomList(ChatRoom chatRoom) {
        return chatRoomUserRepository.findByChatRoomList(chatRoom);
    }

    public ChatRoomUser findByProfile(ChatRoom chatRoom, Profile targetProfile) {
        return chatRoomUserRepository.findByChatRoom(chatRoom,targetProfile).orElse(null);
    }

    public List<ChatRoomUser> getList(Profile profile) {
        return chatRoomUserRepository.getList(profile);
    }

    public void delete(ChatRoomUser chatRoomUser) {
        chatRoomUserRepository.delete(chatRoomUser);
    }
}
