package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.CenterType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class CultureCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Time openTime;

    private Time closeTime;

    private CenterType centerType;
    private LocalDateTime createDate;

    @Builder
    public CultureCenter(Time openTime, Time closeTime, CenterType centerType) {
        this.createDate = LocalDateTime.now();
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.centerType = centerType;
    }
}
