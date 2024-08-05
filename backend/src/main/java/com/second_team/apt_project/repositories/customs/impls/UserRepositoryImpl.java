package com.second_team.apt_project.repositories.customs.impls;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.second_team.apt_project.domains.QSiteUser;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.repositories.customs.UserRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    QSiteUser qSiteUser = QSiteUser.siteUser;

    @Override
    public List<SiteUser> isDuplicateEmail(String email) {
        return jpaQueryFactory.select(qSiteUser).from(qSiteUser).where(qSiteUser.email.eq(email)).fetch();
    }

    @Override
    public Page<SiteUser> findByUserList(Pageable pageable, Long aptId) {
        JPAQuery<SiteUser> query = jpaQueryFactory.selectFrom(qSiteUser)
                .where(qSiteUser.apt.id.eq(aptId))
                .orderBy(qSiteUser.role.asc());

        QueryResults<SiteUser> results = query.fetchResults();
        List<SiteUser> sortedResults = results.getResults().stream()
                .sorted(this::compareUsernames)
                .collect(Collectors.toList());

        return new PageImpl<>(sortedResults, pageable, results.getTotal());
    }

    private int compareUsernames(SiteUser user1, SiteUser user2) {
        String username1 = user1.getUsername();
        String username2 = user2.getUsername();

        ParsedUsername parsed1 = parseUsername(username1);
        ParsedUsername parsed2 = parseUsername(username2);

        int middleNumberComparison = parsed1.middleNumber.compareTo(parsed2.middleNumber);
        if (middleNumberComparison != 0) {
            return middleNumberComparison;
        }

        return parsed1.suffixNumber.compareTo(parsed2.suffixNumber);
    }

    private ParsedUsername parseUsername(String username) {
        Pattern pattern = Pattern.compile("^(\\d+_\\d+)_(\\d+)$");
        Matcher matcher = pattern.matcher(username);
        if (matcher.find()) {
            String prefix = matcher.group(1);
            Integer middleNumber = Integer.parseInt(prefix.split("_")[1]);
            Integer suffixNumber = Integer.parseInt(matcher.group(2));
            return new ParsedUsername(middleNumber, suffixNumber);
        }
        return new ParsedUsername(0, 0);
    }

    private static class ParsedUsername {
        Integer middleNumber;
        Integer suffixNumber;

        ParsedUsername(Integer middleNumber, Integer suffixNumber) {
            this.middleNumber = middleNumber;
            this.suffixNumber = suffixNumber;
        }
    }

    @Override
    public SiteUser findByUsername(String username) {
        return jpaQueryFactory.selectFrom(qSiteUser).where(qSiteUser.username.eq(username)).fetchOne();
    }
}
