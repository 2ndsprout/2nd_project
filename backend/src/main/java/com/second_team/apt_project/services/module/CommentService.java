package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.Article;
import com.second_team.apt_project.domains.Comment;
import com.second_team.apt_project.domains.Profile;
import com.second_team.apt_project.dtos.CommentResponseDTO;
import com.second_team.apt_project.repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public Comment saveComment(Article article, Profile profile, String content, Long parentId) {
        Comment parent = null;

        if (parentId != null) {
            Optional<Comment> comment = commentRepository.findByParentId(parentId);
            if (comment.isPresent())
                parent = comment.get();
        }
        return commentRepository.save(Comment.builder()
                .article(article)
                .content(content)
                .profile(profile)
                .parent(parent)
                .build());
    }

    public Comment updateComment(Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId).orElse(null);
        comment.setContent(content);
        return this.commentRepository.save(comment);
    }

    public void deleteComment(Comment comment) {
        commentRepository.delete(comment);
    }

    public Comment findByComment(Long commentId) {
        return this.commentRepository.findById(commentId).orElse(null);
    }

    public List<Comment> findByChildrentList(Long commentId) {
        return this.commentRepository.findByChildren(commentId);
    }

    public Page<Comment> getCommentPaging(Pageable pageable, Long articleId) {
        return this.commentRepository.findByCommentList(pageable, articleId);
    }

    public List<CommentResponseDTO> getChildrenList(List<CommentResponseDTO> commentResponseDTOList, CommentResponseDTO childrenResponseDTO) {
        commentResponseDTOList.add(childrenResponseDTO);
        return commentResponseDTOList;
    }

    public Comment findByChildren(Long parentId) {
        return this.commentRepository.findByChildrenId(parentId);
    }

    public List<Comment> findByArticle(Long articleId) {
        return commentRepository.findByArticle(articleId);
    }

    public List<Comment> findByProfile(Long profileId) {
        return commentRepository.findByProfile(profileId);
    }

}
