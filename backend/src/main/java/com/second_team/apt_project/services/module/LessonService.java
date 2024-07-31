package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.CultureCenter;
import com.second_team.apt_project.domains.Lesson;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.repositories.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

    public Lesson save(CultureCenter cultureCenter, Profile profile, String name, String content, LocalDateTime startDate, LocalDateTime endDate) {
        return lessonRepository.save(Lesson.builder()
                .profile(profile)
                .cultureCenter(cultureCenter)
                .name(name)
                .content(content)
                .startDate(startDate)
                .endDate(endDate)
                .build());
    }

    public Lesson findById(Long lessonId) {
        return lessonRepository.findById(lessonId).orElse(null);
    }

    public Page<Lesson> getPage(Long aptId, Pageable pageable, CultureCenter cultureCenter) {
        return lessonRepository.findByApt(aptId, pageable, cultureCenter);
    }

    public Lesson update(Lesson lesson, String name, String content, LocalDateTime startDate, LocalDateTime endDate) {
        lesson.setName(name);
        lesson.setContent(content);
        lesson.setStartDate(startDate);
        lesson.setEndDate(endDate);
        lesson.setModifyDate(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    public void delete(Lesson lesson) {
        lessonRepository.delete(lesson);
    }

    public List<Lesson> findByProfile(Long profileId) {
        return lessonRepository.findByProfile(profileId);
    }

    public List<Lesson> findByProfileAndCenter(Long profileId, Long cultureCenterId) {
        return lessonRepository.findByProfileAndCenter(profileId, cultureCenterId);
    }

    public Lesson updateContent(Lesson lesson, String content) {
        lesson.setContent(content);
        return lessonRepository.save(lesson);
    }
}
