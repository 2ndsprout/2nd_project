package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.ChatMessage;
import com.second_team.apt_project.repositories.customs.ChatMessageRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> , ChatMessageRepositoryCustom {
}
