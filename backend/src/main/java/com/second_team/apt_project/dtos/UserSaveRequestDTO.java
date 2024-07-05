package com.second_team.apt_project.dtos;

import jakarta.validation.constraints.Email;
import lombok.Getter;

@Getter
public class UserSaveRequestDTO {
    private String name;
    private Long aptId;
    private int aptNum;
    private String password;
    @Email
    private String email;
    private int role;

    private int h;
    private int w;
}
