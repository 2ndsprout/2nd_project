package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.FileSystem;
import com.second_team.apt_project.repositories.customs.FileSystemRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileSystemRepository extends JpaRepository<FileSystem, String> , FileSystemRepositoryCustom {
}
