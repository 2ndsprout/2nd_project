package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.UserRole;
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
public class SiteUser { //사이트 유저

    @Id
    @Column(length = 24, unique = true)
    private String username;

    @Column(columnDefinition = "TEXT")
    private String password;

    @Column(length = 100, unique = true)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    private Apt apt;

    private UserRole role;

    @Column(length = 25)
    private Integer aptNum; // 아파트 동

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

    @Builder
    public SiteUser(String username, String password, String email, Apt apt, UserRole role, Integer aptNum) {
        this.username = username;
        this.createDate = LocalDateTime.now();
        this.password = password;
        this.email = email;
        this.apt = apt;
        this.role = role;
        this.aptNum = aptNum;
    }
}