package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Tag;

import java.util.Optional;

public interface TagRepositoryCustom {
    Optional<Tag> findByName(String name);
}
