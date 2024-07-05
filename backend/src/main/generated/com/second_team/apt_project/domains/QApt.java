package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QApt is a Querydsl query type for Apt
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QApt extends EntityPathBase<Apt> {

    private static final long serialVersionUID = -1706028860L;

    public static final QApt apt = new QApt("apt");

    public final StringPath aptName = createString("aptName");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath roadAddress = createString("roadAddress");

    public final NumberPath<Double> x = createNumber("x", Double.class);

    public final NumberPath<Double> y = createNumber("y", Double.class);

    public QApt(String variable) {
        super(Apt.class, forVariable(variable));
    }

    public QApt(Path<? extends Apt> path) {
        super(path.getType(), path.getMetadata());
    }

    public QApt(PathMetadata metadata) {
        super(Apt.class, metadata);
    }

}

