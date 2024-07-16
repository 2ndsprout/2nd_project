package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentRepositoryCustom {
    List<Comment> getComment(Long articleId);

    Optional<Comment> findByParentId(Long parentId);

    List<Comment> findByChildren(Long commentId);
}
