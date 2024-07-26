package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.domains.CultureCenter;
import com.second_team.apt_project.domains.Lesson;
import com.second_team.apt_project.domains.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface LessonRepositoryCustom {
    Page<Lesson> findByApt(Long aptId, Pageable pageable, CultureCenter cultureCenter);

    List<Lesson> findByProfile(Long profileId);

    List<Lesson> findByProfileAndCenter(Long profileId, Long cultureCenterId);
}
