package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.enums.LessonStatus;
import com.second_team.apt_project.repositories.customs.LessonUserRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class LessonUserRepositoryImpl implements LessonUserRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QLessonUser qLessonUser = QLessonUser.lessonUser;

    @Override
    public List<LessonUser> getMyList(Profile profile) {
        return jpaQueryFactory.selectFrom(qLessonUser).where(qLessonUser.profile.eq(profile)).fetch();
    }

    @Override
    public List<LessonUser> getSecurityList(Lesson lesson, int type) {
        return jpaQueryFactory.selectFrom(qLessonUser).where(qLessonUser.lesson.eq(lesson), qLessonUser.lessonStatus.eq(LessonStatus.values()[type])).fetch();
    }
}
