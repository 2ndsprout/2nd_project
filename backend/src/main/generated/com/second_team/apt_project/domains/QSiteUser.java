package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSiteUser is a Querydsl query type for SiteUser
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSiteUser extends EntityPathBase<SiteUser> {

    private static final long serialVersionUID = -722405261L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSiteUser siteUser = new QSiteUser("siteUser");

    public final QApt apt;

    public final NumberPath<Integer> aptNum = createNumber("aptNum", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> createDate = createDateTime("createDate", java.time.LocalDateTime.class);

    public final StringPath email = createString("email");

    public final DateTimePath<java.time.LocalDateTime> modifyDate = createDateTime("modifyDate", java.time.LocalDateTime.class);

    public final StringPath password = createString("password");

    public final EnumPath<com.second_team.apt_project.enums.UserRole> role = createEnum("role", com.second_team.apt_project.enums.UserRole.class);

    public final StringPath username = createString("username");

    public QSiteUser(String variable) {
        this(SiteUser.class, forVariable(variable), INITS);
    }

    public QSiteUser(Path<? extends SiteUser> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSiteUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSiteUser(PathMetadata metadata, PathInits inits) {
        this(SiteUser.class, metadata, inits);
    }

    public QSiteUser(Class<? extends SiteUser> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.apt = inits.isInitialized("apt") ? new QApt(forProperty("apt")) : null;
    }

}

