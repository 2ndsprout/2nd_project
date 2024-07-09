package com.second_team.apt_project.domains;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Profile { // 프로필

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private SiteUser user;
    @Column(length = 50, unique = true)
    private String name;

    private LocalDateTime createDate;

    @Builder
    public Profile(SiteUser user, String name) {
        this.createDate = LocalDateTime.now();
        this.user = user;
        this.name = name;
    }
}
