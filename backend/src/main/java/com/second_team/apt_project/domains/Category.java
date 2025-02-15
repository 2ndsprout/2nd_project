package com.second_team.apt_project.domains;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Category { //카테고리

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String name;

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

    @Builder
    public Category(String name) {
        this.createDate = LocalDateTime.now();
        this.name = name;
    }
}
