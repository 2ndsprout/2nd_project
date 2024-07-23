package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.ChatRoom;
import com.second_team.apt_project.domains.ChatRoomUser;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.repositories.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;


    public ChatRoom save(String title) {
        return chatRoomRepository.save(ChatRoom.builder().title(title).build());
    }

    public ChatRoom findById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId).orElse(null);
    }

    public ChatRoom chatRoomUpdate(ChatRoom targetChatRoom, String title) {
        targetChatRoom.setTitle(title);
        return chatRoomRepository.save(targetChatRoom);
    }

    public void delete(ChatRoom chatRoom) {
        chatRoomRepository.delete(chatRoom);
    }
}
