package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.repositories.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    public Profile save(SiteUser user, String name) {
        return profileRepository.save(Profile.builder()
                .name(name)
                .user(user).build());
    }

    public Profile findById(Long profileId) {
        return profileRepository.findById(profileId).orElse(null);
    }

    public List<Profile> findProfilesByUserList(SiteUser user) {
        return profileRepository.findProfilesByUserList(user);
    }

    public void updateProfile(Profile profile, String name) {
        profile.setName(name);
        profileRepository.save(profile);
    }
}
