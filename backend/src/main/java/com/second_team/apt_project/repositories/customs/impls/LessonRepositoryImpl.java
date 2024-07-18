package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.repositories.customs.LessonRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
public class LessonRepositoryImpl implements LessonRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QLesson qLesson = QLesson.lesson;
    QApt qApt = QApt.apt;
    QProfile qProfile = QProfile.profile;
    QSiteUser qSiteUser = QSiteUser.siteUser;

    @Override
    public Page<Lesson> findByApt(Long aptId, Pageable pageable, CultureCenter cultureCenter) {
        QueryResults<Lesson> results = jpaQueryFactory.selectFrom(qLesson)
                .leftJoin(qLesson.profile, qProfile)
                .leftJoin(qProfile.user, qSiteUser)
                .leftJoin(qSiteUser.apt, qApt)
                .where(qApt.id.eq(aptId),qLesson.cultureCenter.eq(cultureCenter) ,qLesson.endDate.gt(LocalDateTime.now())).orderBy(qLesson.startDate.asc(), qLesson.startTime.asc()).offset(pageable.getOffset()).limit(pageable.getPageSize()).fetchResults();
        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
    }
}