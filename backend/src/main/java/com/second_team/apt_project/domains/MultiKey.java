package com.second_team.apt_project.domains;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class MultiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String k;

    private List<String> vs;

    @Builder
    public MultiKey(String k, List<String> vs) {
        this.k = k;
        this.vs = vs;
    }
}
