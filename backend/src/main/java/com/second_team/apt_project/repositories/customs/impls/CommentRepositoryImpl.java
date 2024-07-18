package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.Comment;
import com.second_team.apt_project.domains.QComment;
import com.second_team.apt_project.repositories.customs.CommentRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class CommentRepositoryImpl implements CommentRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QComment qComment = QComment.comment;

    @Override
    public Optional<Comment> findByParentId(Long parentId) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qComment).where(qComment.id.eq(parentId)).fetchOne());
    }

    @Override
    public List<Comment> findByChildren(Long commentId) {
        return jpaQueryFactory.selectFrom(qComment).where(qComment.parent.id.eq(commentId)).fetch();
    }

    @Override
    public Page<Comment> findByCommentList(Pageable pageable, Long articleId) {
        QueryResults<Comment> results = jpaQueryFactory.selectFrom(qComment).where(qComment.article.id.eq(articleId).and(qComment.parent.isNull())).offset(pageable.getOffset()).limit(pageable.getPageSize()).fetchResults();
        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
    }

    @Override
    public Comment findByChildrenId(Long parentId) {
        return jpaQueryFactory.selectFrom(qComment).where(qComment.parent.id.eq(parentId)).fetchOne();
    }

    @Override
    public List<Comment> findByArticle(Long articleId) {
        return jpaQueryFactory.selectFrom(qComment).where(qComment.article.id.eq(articleId).and(qComment.parent.isNull())).fetch();
    }

}
