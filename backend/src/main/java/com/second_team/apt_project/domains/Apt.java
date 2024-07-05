package com.second_team.apt_project.domains;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Apt { //아파트

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(length = 50, unique = true)
    private String roadAddress; // 도로명주소

    private String aptName; // 아파트 이름

    private Double x; // 위도

    private Double y; // 경도

    @Builder
    public Apt(String aptName, Double x, Double y) {
        this.aptName = aptName;
        this.x = x;
        this.y = y;
    }
}
