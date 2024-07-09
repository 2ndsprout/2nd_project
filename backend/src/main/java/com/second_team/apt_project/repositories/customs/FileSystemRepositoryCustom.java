package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.FileSystem;

import java.util.Optional;

public interface FileSystemRepositoryCustom {
    Optional<FileSystem> findKey(String key);
}
