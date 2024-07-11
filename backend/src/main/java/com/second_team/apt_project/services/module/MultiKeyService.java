package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.MultiKey;
import com.second_team.apt_project.repositories.MultiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MultiKeyService {
    private final MultiKeyRepository multiKeyRepository;


    public Optional<MultiKey> get(String key) {
        return multiKeyRepository.findByKey(key);
    }

    public MultiKey save(String key, String s) {
        List<String> multiList = new ArrayList<>();
        multiList.add(s);
        return multiKeyRepository.save(MultiKey.builder()
                .k(key)
                .vs(multiList)
                .build());

    }

    public void add(MultiKey multiKey, String s) {
        multiKey.getVs().add(s);
        multiKeyRepository.save(multiKey);
    }
}
