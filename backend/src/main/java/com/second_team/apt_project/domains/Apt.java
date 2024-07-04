package com.second_team.apt_project.domains;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Apt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String roadAddress; // 도로명주소

    private String aptName; // 아파트 이름

    private Double x; // 위도

    private Double y; // 경도
}
