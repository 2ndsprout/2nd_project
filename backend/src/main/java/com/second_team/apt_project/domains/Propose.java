package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.ProposeStatus;
import jakarta.persistence.*;
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

    @Column(length = 50, unique = true)
    private String roadAddress;

    private String aptName;

    private Integer h;

    private Integer w;

    private Double x;

    private Double y;

    private Integer password;

    private ProposeStatus proposeStatus;

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

}
