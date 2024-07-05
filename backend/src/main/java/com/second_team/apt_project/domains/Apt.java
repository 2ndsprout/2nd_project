package com.second_team.apt_project.domains;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
    @Column(length = 50, unique = true)
    private String roadAddress; // 도로명주소

    private String aptName; // 아파트 이름

    private Double x; // 위도

    private Double y; // 경도

    @Builder
    public Apt(String roadAddress, String aptName, Double x, Double y) {
        this.roadAddress = roadAddress;
        this.aptName = aptName;
        this.x = x;
        this.y = y;
    }
}
