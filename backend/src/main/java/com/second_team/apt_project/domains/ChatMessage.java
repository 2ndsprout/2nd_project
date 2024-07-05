package com.second_team.apt_project.domains;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;

    @Column(columnDefinition = "LONGTEXT")
    private String message;

    private LocalDateTime createDate;

    @Builder
    public ChatMessage(ChatRoom chatRoom, Profile profile, String message) {
        this.chatRoom = chatRoom;
        this.profile = profile;
        this.message = message;
        this.createDate = LocalDateTime.now();
    }
}
