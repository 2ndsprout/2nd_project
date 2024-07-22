package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Tag;
import com.second_team.apt_project.repositories.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public Tag findByName(String name) {
        return tagRepository.findByName(name).orElse(null);
    }

    public Tag save(String name) {
        return tagRepository.save(Tag.builder()
                .name(name).build());
    }

    public Tag findById(Long tagId) {
        return tagRepository.findById(tagId).orElse(null);
    }


    public void delete(Tag tag) {
        tagRepository.delete(tag);
    }
}
