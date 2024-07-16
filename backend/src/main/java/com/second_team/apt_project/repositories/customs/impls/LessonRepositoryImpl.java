package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.QLesson;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class LessonRepositoryImpl {
    private final JPAQueryFactory jpaQueryFactory;
    QLesson qLesson = QLesson.lesson;
}
