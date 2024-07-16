package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QLesson is a Querydsl query type for Lesson
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLesson extends EntityPathBase<Lesson> {

    private static final long serialVersionUID = -1652908487L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QLesson lesson = new QLesson("lesson");

    public final StringPath content = createString("content");

    public final DateTimePath<java.time.LocalDateTime> createDate = createDateTime("createDate", java.time.LocalDateTime.class);

    public final QCultureCenter cultureCenter;

    public final DateTimePath<java.time.LocalDateTime> endDate = createDateTime("endDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> endTime = createDateTime("endTime", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> modifyDate = createDateTime("modifyDate", java.time.LocalDateTime.class);

    public final StringPath name = createString("name");

    public final QProfile profile;

    public final DateTimePath<java.time.LocalDateTime> startDate = createDateTime("startDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> startTime = createDateTime("startTime", java.time.LocalDateTime.class);

    public QLesson(String variable) {
        this(Lesson.class, forVariable(variable), INITS);
    }

    public QLesson(Path<? extends Lesson> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QLesson(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QLesson(PathMetadata metadata, PathInits inits) {
        this(Lesson.class, metadata, inits);
    }

    public QLesson(Class<? extends Lesson> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.cultureCenter = inits.isInitialized("cultureCenter") ? new QCultureCenter(forProperty("cultureCenter"), inits.get("cultureCenter")) : null;
        this.profile = inits.isInitialized("profile") ? new QProfile(forProperty("profile"), inits.get("profile")) : null;
    }

}

