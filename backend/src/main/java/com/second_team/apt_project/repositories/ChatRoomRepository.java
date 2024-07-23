package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.ChatRoom;
import com.second_team.apt_project.repositories.customs.ChatRoomRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> , ChatRoomRepositoryCustom {

}
