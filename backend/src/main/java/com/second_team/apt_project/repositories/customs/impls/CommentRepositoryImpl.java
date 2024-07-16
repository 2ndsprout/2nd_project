package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.Comment;
import com.second_team.apt_project.domains.QComment;
import com.second_team.apt_project.repositories.customs.CommentRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class CommentRepositoryImpl implements CommentRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QComment qComment = QComment.comment;

    @Override
    public List<Comment> getComment(Long articleId) {
        return jpaQueryFactory.selectFrom(qComment).where(qComment.article.id.eq(articleId)).fetch();
    }

    @Override
    public Optional<Comment> findByParentId(Long parentId) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qComment).where(qComment.id.eq(parentId)).fetchOne());
    }

}
