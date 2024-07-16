package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.repositories.customs.LessonRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class LessonRepositoryImpl implements LessonRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QLesson qLesson = QLesson.lesson;
    QApt qApt = QApt.apt;
    QProfile qProfile = QProfile.profile;
    QSiteUser qSiteUser = QSiteUser.siteUser;

    @Override
    public List<Lesson> findByApt(Long aptId) {
        return jpaQueryFactory.selectFrom(qLesson)
                .leftJoin(qLesson.profile, qProfile)
                .leftJoin(qProfile.user, qSiteUser)
                .leftJoin(qSiteUser.apt, qApt)
                .where(qApt.id.eq(aptId)).orderBy(qLesson.startDate.asc(), qLesson.startTime.asc()).fetch();
    }
}
