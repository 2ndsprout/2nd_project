package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QLessonUser is a Querydsl query type for LessonUser
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLessonUser extends EntityPathBase<LessonUser> {

    private static final long serialVersionUID = 105331108L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QLessonUser lessonUser = new QLessonUser("lessonUser");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QLesson lesson;

    public final EnumPath<com.second_team.apt_project.enums.LessonStatus> lessonStatus = createEnum("lessonStatus", com.second_team.apt_project.enums.LessonStatus.class);

    public final QProfile profile;

    public QLessonUser(String variable) {
        this(LessonUser.class, forVariable(variable), INITS);
    }

    public QLessonUser(Path<? extends LessonUser> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QLessonUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QLessonUser(PathMetadata metadata, PathInits inits) {
        this(LessonUser.class, metadata, inits);
    }

    public QLessonUser(Class<? extends LessonUser> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.lesson = inits.isInitialized("lesson") ? new QLesson(forProperty("lesson"), inits.get("lesson")) : null;
        this.profile = inits.isInitialized("profile") ? new QProfile(forProperty("profile"), inits.get("profile")) : null;
    }

}

