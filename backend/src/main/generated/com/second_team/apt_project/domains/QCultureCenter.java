package com.second_team.apt_project.domains;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCultureCenter is a Querydsl query type for CultureCenter
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCultureCenter extends EntityPathBase<CultureCenter> {

    private static final long serialVersionUID = -1431392382L;

    public static final QCultureCenter cultureCenter = new QCultureCenter("cultureCenter");

    public final EnumPath<com.second_team.apt_project.enums.CenterType> centerType = createEnum("centerType", com.second_team.apt_project.enums.CenterType.class);

    public final TimePath<java.sql.Time> closeTime = createTime("closeTime", java.sql.Time.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final TimePath<java.sql.Time> openTime = createTime("openTime", java.sql.Time.class);

    public QCultureCenter(String variable) {
        super(CultureCenter.class, forVariable(variable));
    }

    public QCultureCenter(Path<? extends CultureCenter> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCultureCenter(PathMetadata metadata) {
        super(CultureCenter.class, metadata);
    }

}

