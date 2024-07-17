package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Lesson;
import com.second_team.apt_project.domains.LessonUser;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.enums.LessonStatus;
import com.second_team.apt_project.repositories.LessonUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonUserService {
    private final LessonUserRepository lessonUserRepository;

    public LessonUser save(Lesson lesson, Profile profile, int type) {
        return lessonUserRepository.save(LessonUser.builder().lesson(lesson).profile(profile).lessonStatus(LessonStatus.values()[type]).build());
    }

    public LessonUser findById(Long lessonUserId) {
        return lessonUserRepository.findById(lessonUserId).orElse(null);
    }

    public List<LessonUser> getMyList(Profile profile) {
        return lessonUserRepository.getMyList(profile);
    }

    public List<LessonUser> getSecurityList(Lesson lesson, int type) {
        return lessonUserRepository.getSecurityList(lesson, type);
    }

    public LessonUser update(LessonUser lessonUser, int type) {
        lessonUser.setLessonStatus(LessonStatus.values()[type]);
        return lessonUserRepository.save(lessonUser);
    }

    public void delete(LessonUser lessonUser) {
        lessonUserRepository.delete(lessonUser);
    }
}
