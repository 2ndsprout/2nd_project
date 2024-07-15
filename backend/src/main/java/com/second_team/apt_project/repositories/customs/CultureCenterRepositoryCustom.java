package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.CultureCenter;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CultureCenterRepositoryCustom {
    List<CultureCenter> getList();
}
