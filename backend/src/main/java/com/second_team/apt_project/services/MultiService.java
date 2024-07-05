package com.second_team.apt_project.services;

import com.second_team.apt_project.Exception.DataDuplicateException;
import com.second_team.apt_project.Exception.DataNotFoundException;
import com.second_team.apt_project.domains.Apt;

import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.dtos.AptResponseDto;
import com.second_team.apt_project.dtos.AuthRequestDTO;
import com.second_team.apt_project.dtos.AuthResponseDTO;
import com.second_team.apt_project.enums.UserRole;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.securities.CustomUserDetails;
import com.second_team.apt_project.securities.jwt.JwtTokenProvider;
import com.second_team.apt_project.services.module.AptService;
import com.second_team.apt_project.services.module.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.aot.AotServices;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MultiService {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AptService aptService;

    /**
     * Auth
     */

    public TokenRecord checkToken(String accessToken) {
        HttpStatus httpStatus = HttpStatus.FORBIDDEN;
        String username = null;
        if (accessToken != null && accessToken.length() > 7) {
            String token = accessToken.substring(7);
            if (this.jwtTokenProvider.validateToken(token)) {
                httpStatus = HttpStatus.OK;
                username = this.jwtTokenProvider.getUsernameFromToken(token);
            } else httpStatus = HttpStatus.UNAUTHORIZED;
        }
        return TokenRecord.builder().httpStatus(httpStatus).username(username).build();
    }

    @Transactional
    public String refreshToken(String refreshToken) {
        if (this.jwtTokenProvider.validateToken(refreshToken)) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            SiteUser user = userService.get(username);
            if (user != null) {
                return this.jwtTokenProvider.generateAccessToken(new UsernamePasswordAuthenticationToken(new CustomUserDetails(user), user.getPassword()));
            }
        }
        return null;
    }

    @Transactional
    public AuthResponseDTO login(AuthRequestDTO requestDto) {
        SiteUser user = this.userService.get(requestDto.getUsername());
        if (user == null) {
            throw new IllegalArgumentException("username");
        }
        if (!this.userService.isMatch(requestDto.getPassword(), user.getPassword()))
            throw new IllegalArgumentException("password");
        String accessToken = this.jwtTokenProvider //
                .generateAccessToken(new UsernamePasswordAuthenticationToken(new CustomUserDetails(user), user.getPassword()));
        String refreshToken = this.jwtTokenProvider //
                .generateRefreshToken(new UsernamePasswordAuthenticationToken(new CustomUserDetails(user), user.getPassword()));

        return AuthResponseDTO.builder().tokenType("Bearer").accessToken(accessToken).refreshToken(refreshToken).build();
    }

    /**
     * User
     */

    @Transactional
    public void saveUser(String name, String password, String email, int aptNumber, int role, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("role is not admin");
        if (apt == null)
            throw new DataNotFoundException("apt not found");
        userService.userEmailCheck(email);
        userService.save(name, password, email, aptNumber, role, apt);
    }
      
     /**
     * Apt
     */

    @Transactional
    public void saveApt(String roadAddress, String aptName, Double x, Double y, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("role is not admin");

        aptService.save(roadAddress, aptName, x, y);

    }
    @Transactional
    public void updateApt(Long aptId, String aptName, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("role is not admin");
        aptService.update(apt, aptName);
    }

}
