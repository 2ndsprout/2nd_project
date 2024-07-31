package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPropose is a Querydsl query type for Propose
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPropose extends EntityPathBase<Propose> {

    private static final long serialVersionUID = -77112355L;

    public static final QPropose propose = new QPropose("propose");

    public final StringPath aptName = createString("aptName");

    public final DateTimePath<java.time.LocalDateTime> createDate = createDateTime("createDate", java.time.LocalDateTime.class);

    public final NumberPath<Integer> h = createNumber("h", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> max = createNumber("max", Integer.class);

    public final NumberPath<Integer> min = createNumber("min", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> modifyDate = createDateTime("modifyDate", java.time.LocalDateTime.class);

    public final StringPath password = createString("password");

    public final EnumPath<com.second_team.apt_project.enums.ProposeStatus> proposeStatus = createEnum("proposeStatus", com.second_team.apt_project.enums.ProposeStatus.class);

    public final StringPath roadAddress = createString("roadAddress");

    public final StringPath title = createString("title");

    public final NumberPath<Integer> w = createNumber("w", Integer.class);

    public QPropose(String variable) {
        super(Propose.class, forVariable(variable));
    }

    public QPropose(Path<? extends Propose> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPropose(PathMetadata metadata) {
        super(Propose.class, metadata);
    }

}

