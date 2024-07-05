package com.second_team.apt_project.domains;

import com.second_team.apt_project.enums.LessonStatus;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class LessonUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;

    private LessonStatus lessonStatus;

    @Builder
    public LessonUser(Lesson lesson, Profile profile, LessonStatus lessonStatus) {
        this.lesson = lesson;
        this.profile = profile;
        this.lessonStatus = lessonStatus;
    }
}
