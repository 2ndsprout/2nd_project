package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.ChatType;
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
public class Notification { // 알림

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;

    @Column(length = 255)
    private String content;

    private LocalDateTime createDate;

    private Boolean active;

    private ChatType chatType;


    @Builder
    public Notification(Profile profile, String content, Boolean active, ChatType chatType) {
        this.createDate = LocalDateTime.now();
        this.profile = profile;
        this.content = content;
        this.active = active;
        this.chatType = chatType;
    }
}
