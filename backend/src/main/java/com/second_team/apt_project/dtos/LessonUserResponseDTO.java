package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Getter
@Setter
@NoArgsConstructor
public class LessonUserResponseDTO {
    private Long id;
    private LessonResponseDTO lessonResponseDTO;
    private String type;

    @Builder
    public LessonUserResponseDTO(Long id, LessonResponseDTO lessonResponseDTO, String type) {
        this.id = id;
        this.lessonResponseDTO = lessonResponseDTO;
        this.type = type;
    }
}
