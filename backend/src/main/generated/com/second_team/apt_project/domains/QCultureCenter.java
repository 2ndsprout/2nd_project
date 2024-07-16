package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCultureCenter is a Querydsl query type for CultureCenter
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCultureCenter extends EntityPathBase<CultureCenter> {

    private static final long serialVersionUID = -1431392382L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCultureCenter cultureCenter = new QCultureCenter("cultureCenter");

    public final QApt apt;

    public final EnumPath<com.second_team.apt_project.enums.CenterType> centerType = createEnum("centerType", com.second_team.apt_project.enums.CenterType.class);

    public final DateTimePath<java.time.LocalDateTime> closeTime = createDateTime("closeTime", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> createDate = createDateTime("createDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> modifyDate = createDateTime("modifyDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> openTime = createDateTime("openTime", java.time.LocalDateTime.class);

    public QCultureCenter(String variable) {
        this(CultureCenter.class, forVariable(variable), INITS);
    }

    public QCultureCenter(Path<? extends CultureCenter> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCultureCenter(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCultureCenter(PathMetadata metadata, PathInits inits) {
        this(CultureCenter.class, metadata, inits);
    }

    public QCultureCenter(Class<? extends CultureCenter> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.apt = inits.isInitialized("apt") ? new QApt(forProperty("apt")) : null;
    }

}

