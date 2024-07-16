package com.second_team.apt_project.domains;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.sql.Time;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 강사
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    private CultureCenter cultureCenter;

    @Column(length = 50)
    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private LocalDateTime createDate;
    private LocalDateTime modifyDate;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Builder
    public Lesson(Profile profile, CultureCenter cultureCenter, String name, String content, LocalDateTime startDate, LocalDateTime endDate, LocalDateTime startTime, LocalDateTime endTime, LocalDateTime modifyDate) {
        this.profile = profile;
        this.cultureCenter = cultureCenter;
        this.name = name;
        this.content = content;
        this.modifyDate = modifyDate;
        this.startDate = startDate;
        this.createDate = LocalDateTime.now();
        this.endDate = endDate;
        this.startTime =startTime;
        this.endTime =endTime;
    }
}
