package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.domains.SiteUser;

import java.util.List;

public interface ProfileRepositoryCustom {
    List<Profile> findProfilesByUserList(SiteUser user);
}
