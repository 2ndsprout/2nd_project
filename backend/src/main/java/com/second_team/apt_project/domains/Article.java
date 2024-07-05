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
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

    private Boolean topActive;

    @Builder
    public Article(Category category, Profile profile, String title, String content, Boolean topActive) {
        this.category = category;
        this.profile = profile;
        this.title = title;
        this.content = content;
        this.topActive = topActive;
        this.createDate = LocalDateTime.now();
    }
}
