package com.second_team.apt_project.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoveResponseDTO {
    private int count;

    @JsonProperty("isLoved")
    private boolean isLoved;

    @Builder
    public LoveResponseDTO(int count, boolean isLoved) {
        this.count = count;
        this.isLoved = isLoved;
    }
}
