package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Lesson;
import com.second_team.apt_project.domains.LessonUser;
import com.second_team.apt_project.domains.Profile;

import java.util.List;

public interface LessonUserRepositoryCustom {
    List<LessonUser> getMyList(Profile profile);

    List<LessonUser> getSecurityList(Lesson lesson,int type);
}
