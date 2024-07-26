package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Lesson;
import com.second_team.apt_project.domains.LessonUser;
import com.second_team.apt_project.domains.Profile;

import java.util.List;
import java.util.Optional;

public interface LessonUserRepositoryCustom {
    List<LessonUser> getMyList(Profile profile);

    List<LessonUser> getStaffList(Lesson lesson, int type);

    List<LessonUser> findByLessonId(Long id);

    List<LessonUser> findByProfileId(Long id);

    Optional<LessonUser> findByLessonAndProfile(Long lessonId, Long profileId);
}
