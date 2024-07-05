package com.second_team.apt_project.domains;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class FileSystem {
    @Id
    @Column(length = 50)
    private String k;

    @Column(length = 200)
    private String v;

    @Builder

    public FileSystem(String k, String v) {
        this.k = k;
        this.v = v;
    }
}
