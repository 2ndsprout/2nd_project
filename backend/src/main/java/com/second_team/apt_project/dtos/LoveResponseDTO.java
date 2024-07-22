package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoveResponseDTO {
    private int count;

    @Builder
    public LoveResponseDTO(int count) {
        this.count = count;
    }
}
