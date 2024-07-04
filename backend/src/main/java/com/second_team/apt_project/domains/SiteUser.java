package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class SiteUser {

    @Id
    @Column(length = 24, unique = true)
    private String username;

    @Column(columnDefinition = "TEXT")
    private String password;

    @Column(length = 100, unique = true)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    private Apt apt; // 도로명 주소

    private UserRole role;

    private Integer aptNum; // 아파트 동

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

}