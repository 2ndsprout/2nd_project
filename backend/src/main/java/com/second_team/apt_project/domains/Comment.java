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
public class Comment { // 댓글

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    private Article article;

    @ManyToOne(fetch = FetchType.LAZY)
    private Comment parent;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private LocalDateTime createDate;

    @Builder
    public Comment(Profile profile, Article article, Comment parent, String content) {
        this.profile = profile;
        this.article = article;
        this.parent = parent;
        this.content = content;
        this.createDate = LocalDateTime.now();
    }
}
