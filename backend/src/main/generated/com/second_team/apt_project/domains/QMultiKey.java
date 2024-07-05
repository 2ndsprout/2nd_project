package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMultiKey is a Querydsl query type for MultiKey
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMultiKey extends EntityPathBase<MultiKey> {

    private static final long serialVersionUID = -743846105L;

    public static final QMultiKey multiKey = new QMultiKey("multiKey");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath k = createString("k");

    public final ListPath<String, StringPath> vs = this.<String, StringPath>createList("vs", String.class, StringPath.class, PathInits.DIRECT2);

    public QMultiKey(String variable) {
        super(MultiKey.class, forVariable(variable));
    }

    public QMultiKey(Path<? extends MultiKey> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMultiKey(PathMetadata metadata) {
        super(MultiKey.class, metadata);
    }

}

