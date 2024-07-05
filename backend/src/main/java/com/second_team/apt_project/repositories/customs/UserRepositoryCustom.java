package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.SiteUser;

import java.util.List;

public interface UserRepositoryCustom {
    List<SiteUser> isDuplicateEmail(String email);
}
