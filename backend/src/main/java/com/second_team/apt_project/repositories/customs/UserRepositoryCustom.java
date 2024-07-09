package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface UserRepositoryCustom {
    List<SiteUser> isDuplicateEmail(String email);

    Page<SiteUser> findByUserList(Pageable pageable, Long aptId);

    SiteUser findByUser(String userId);
}
