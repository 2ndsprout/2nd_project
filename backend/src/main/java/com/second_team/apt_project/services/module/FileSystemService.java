package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.FileSystem;
import com.second_team.apt_project.repositories.FileSystemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileSystemService {
    private final FileSystemRepository fileSystemRepository;

    public Optional<FileSystem> get(String key) {
        return this.fileSystemRepository.findKey(key);
    }

    public void save(String key, String fileLoc) {
        fileSystemRepository.save(FileSystem.builder()
                .k(key)
                .v(fileLoc).build());
    }
}
