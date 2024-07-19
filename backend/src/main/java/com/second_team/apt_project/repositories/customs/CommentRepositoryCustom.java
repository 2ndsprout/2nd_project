package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CommentRepositoryCustom {
    Optional<Comment> findByParentId(Long parentId);

    List<Comment> findByChildren(Long commentId);

    Page<Comment> findByCommentList(Pageable pageable, Long articleId);

    Comment findByChildrenId(Long parentId);

    List<Comment> findByArticle(Long articleId);

    List<Comment> findByProfile(Long profileId);
}
