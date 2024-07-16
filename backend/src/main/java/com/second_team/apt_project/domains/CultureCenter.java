package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.CenterType;
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
public class CultureCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime openTime;

    private LocalDateTime closeTime;

    private CenterType centerType;

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;
    @ManyToOne(fetch = FetchType.LAZY)
    private Apt apt;


    @Builder
    public CultureCenter(LocalDateTime openTime, LocalDateTime closeTime, CenterType centerType, Apt apt) {
        this.createDate = LocalDateTime.now();
        this.apt = apt;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.centerType = centerType;
        this.apt = apt;
    }
}
