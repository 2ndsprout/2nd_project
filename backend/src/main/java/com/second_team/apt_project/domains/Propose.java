package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.ProposeStatus;
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
public class Propose {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 100, unique = true)
    private String roadAddress;

    private String aptName;

    private Integer h;

    private Integer w;

    private Integer min;

    private Integer max;

    private String password;

    private String email;

    private ProposeStatus proposeStatus;

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

    @Builder
    public Propose (String email, String title, String roadAddress, String aptName, Integer min, Integer max, Integer h, Integer w, String password) {
        this.title = title;
        this.roadAddress = roadAddress;
        this.aptName = aptName;
        this.min = min;
        this.max = max;
        this.h = h;
        this.w = w;
        this.password = password;
        this.email = email;
        this.createDate = LocalDateTime.now();
        this.proposeStatus = ProposeStatus.PENDING;
    }
}
