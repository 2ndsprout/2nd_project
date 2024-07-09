package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.FileSystem;
import com.second_team.apt_project.domains.QFileSystem;
import com.second_team.apt_project.repositories.customs.FileSystemRepositoryCustom;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
@RequiredArgsConstructor
public class FileSystemRepositoryImpl implements FileSystemRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QFileSystem qFileSystem = QFileSystem.fileSystem;
    @Override
    public Optional<FileSystem> findKey(String key) {
        return Optional.ofNullable(jpaQueryFactory.selectFrom(qFileSystem).where(qFileSystem.k.eq(key)).fetchOne());
    }
}
