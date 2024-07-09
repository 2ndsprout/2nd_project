package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.enums.UserRole;

import java.util.List;

public interface UserRepositoryCustom {
    List<SiteUser> isDuplicateEmail(String email);

    List<SiteUser> findByUserList(Long aptId, UserRole userRole);

    SiteUser findByUser(String userId);
}
