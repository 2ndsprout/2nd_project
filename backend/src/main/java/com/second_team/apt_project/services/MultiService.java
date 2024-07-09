package com.second_team.apt_project.services;

import com.second_team.apt_project.AptProjectApplication;
import com.second_team.apt_project.Exception.DataNotFoundException;
import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.domains.FileSystem;
import com.second_team.apt_project.domains.SiteUser;
import com.second_team.apt_project.dtos.AptResponseDTO;
import com.second_team.apt_project.dtos.AuthRequestDTO;
import com.second_team.apt_project.dtos.AuthResponseDTO;
import com.second_team.apt_project.dtos.UserResponseDTO;
import com.second_team.apt_project.dtos.*;
import com.second_team.apt_project.enums.ImageKey;
import com.second_team.apt_project.enums.UserRole;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.securities.CustomUserDetails;
import com.second_team.apt_project.securities.jwt.JwtTokenProvider;
import com.second_team.apt_project.services.module.AptService;
import com.second_team.apt_project.services.module.FileSystemService;
import com.second_team.apt_project.services.module.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MultiService {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AptService aptService;
    private final FileSystemService fileSystemService;

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
    private UserResponseDTO getUserResponseDTO(SiteUser siteUser) {
        return UserResponseDTO.builder()
                .aptNum(siteUser.getAptNum())
                .username(siteUser.getUsername())
                .email(siteUser.getEmail())
                .aptResponseDto(this.getAptResponseDTO(siteUser.getApt()))
                .build();
    }

    @Transactional
    public void saveUser(String name, String password, String email, int aptNumber, int role, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY) throw new IllegalArgumentException("role is not");
        if (email != null)
            userService.userEmailCheck(email);
        userService.save(name, password, email, aptNumber, role, apt);
    }

    @Transactional
    public List<UserResponseDTO> saveUserGroup(int aptNumber, Long aptId, String username, int h, int w) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        List<UserResponseDTO> userResponseDTOList = new ArrayList<>();
        if (user.getRole() == UserRole.SECURITY || user.getRole() == UserRole.ADMIN) {
            for (int i = 1; h >= i; i++)
                for (int j = 1; w >= j; j++) {
                    String jKey = String.valueOf(j);
                    if (j < 10)
                        jKey =  "0" + jKey;
                    String name = String.valueOf(aptNumber) +  String.valueOf(i) + jKey;
                    SiteUser _user = userService.saveGroup(name, aptNumber, apt);
                    userResponseDTOList.add(UserResponseDTO.builder()
                                    .username(_user.getUsername())
                                    .aptNum(_user.getAptNum())
                                    .email(_user.getEmail())
                                    .aptResponseDto(this.getAptResponseDTO(apt))
                            .build());
                }
            return userResponseDTOList;
        }else
            throw new IllegalArgumentException("not role");
    }

    @Transactional
    public List<UserResponseDTO> getUserList(String username) {
        SiteUser user = userService.get(username);

        List<SiteUser> userList = userService.getUserList(UserRole.USER);
        List<UserResponseDTO> responseDTOList = new ArrayList<>();

        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY) throw new IllegalArgumentException("role is not admin or security");
        for (SiteUser siteUser : userList) {
            UserResponseDTO userResponseDTO = getUser(siteUser);
           responseDTOList.add(userResponseDTO);
        }
        return responseDTOList;
    }

    @Transactional
    private UserResponseDTO getUser(SiteUser siteUser) {
        return getUserResponseDTO(siteUser);
    }

    /**
     * Apt
     */

    private AptResponseDTO getAptResponseDTO(Apt apt) {
        return AptResponseDTO.builder()
                .aptId(apt.getId())
                .aptName(apt.getAptName())
                .roadAddress(apt.getRoadAddress())
                .x(apt.getX())
                .y(apt.getY())
                .build();
    }

    @Transactional
    public AptResponseDTO saveApt(String roadAddress, String aptName, Double x, Double y, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("role is not admin");
        Apt apt = aptService.save(roadAddress, aptName, x, y);
        return this.getAptResponseDTO(apt);
    }

    @Transactional
    public void updateApt(Long aptId, String aptName, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("role is not admin");
        aptService.update(apt, aptName);
    }


    public List<AptResponseDTO> getAptList(String username) {
        SiteUser user = userService.get(username);
        List<Apt> aptList = aptService.getAptList();
        List<AptResponseDTO> responseDTOList = new ArrayList<>();
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("role is not admin");
        for (Apt apt : aptList) {
            AptResponseDTO aptResponseDTO = this.getApt(apt);
            responseDTOList.add(aptResponseDTO);
        }
        return responseDTOList;
    }

    private AptResponseDTO getApt(Apt apt) {
        return getAptResponseDTO(apt);
    }


    public AptResponseDTO getAptDetail(Long aptId, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("role is not admin");
        Apt apt = aptService.get(aptId);
        AptResponseDTO aptResponseDTO = this.getApt(apt);
        return aptResponseDTO;
    }
    /**
     * Image
     */

    @Transactional
    public ImageResponseDTO tempUpload(MultipartFile fileUrl, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new IllegalArgumentException("username");
        if (!fileUrl.isEmpty()) {
            try {
                String path = AptProjectApplication.getOsType().getLoc();
                Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username));
                if (_fileSystem.isPresent()) {
                    FileSystem fileSystem = _fileSystem.get();
                    File file = new File(path + fileSystem.getV());
                    if (file.exists()) file.delete();
                }
                UUID uuid = UUID.randomUUID();
                String fileLoc = "/api/user" + "/" + username + "/temp/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                File file = new File(path + fileLoc);
                if (!file.getParentFile().exists()) file.getParentFile().mkdirs();
                fileUrl.transferTo(file);
                if (fileLoc != null) {
                    fileSystemService.save(ImageKey.TEMP.getKey(username), fileLoc);
                }
                return ImageResponseDTO.builder().url(fileLoc).build();
            }catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;


    }
}
