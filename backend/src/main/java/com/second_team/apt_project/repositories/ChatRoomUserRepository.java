package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.ChatRoomUser;
import com.second_team.apt_project.repositories.customs.ChatRoomUserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> , ChatRoomUserRepositoryCustom {
}
