package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.domains.Lesson;

import java.util.List;

public interface LessonRepositoryCustom {
    List<Lesson> findByApt(Long aptId);
}
