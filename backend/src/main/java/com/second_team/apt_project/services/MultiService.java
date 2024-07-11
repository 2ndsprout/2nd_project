package com.second_team.apt_project.services;

import com.second_team.apt_project.AptProjectApplication;
import com.second_team.apt_project.domains.*;
import com.second_team.apt_project.dtos.AptResponseDTO;
import com.second_team.apt_project.dtos.AuthRequestDTO;
import com.second_team.apt_project.dtos.AuthResponseDTO;
import com.second_team.apt_project.dtos.UserResponseDTO;
import com.second_team.apt_project.dtos.*;
import com.second_team.apt_project.enums.ImageKey;
import com.second_team.apt_project.enums.UserRole;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.securities.CustomUserDetails;
import com.second_team.apt_project.securities.jwt.JwtTokenProvider;
import com.second_team.apt_project.services.module.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    private final ProfileService profileService;
    private final CategoryService categoryService;

    /**
     * Auth
     */

    public TokenRecord checkToken(String accessToken) {
        HttpStatus httpStatus = HttpStatus.FORBIDDEN;
        String username = null;
        String body = "logout";
        if (accessToken != null && accessToken.length() > 7) {
            String token = accessToken.substring(7);
            if (this.jwtTokenProvider.validateToken(token)) {
                httpStatus = HttpStatus.OK;
                username = this.jwtTokenProvider.getUsernameFromToken(token);
                body = "okay";
            } else {
                httpStatus = HttpStatus.UNAUTHORIZED;
                body = "refresh";
            }
        }
        return TokenRecord.builder().httpStatus(httpStatus).username(username).body(body).build();
    }
    public TokenRecord checkToken(String accessToken,Long profile_id) {
        if(profile_id==null)
            return TokenRecord.builder().httpStatus(HttpStatus.UNAUTHORIZED).body("unknown profile").build();
        return checkToken(accessToken);
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
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY)
            throw new IllegalArgumentException("role is not");
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
                        jKey = "0" + jKey;
                    String name = String.valueOf(aptNumber) + String.valueOf(i) + jKey;
                    SiteUser _user = userService.saveGroup(name, aptNumber, apt);
                    userResponseDTOList.add(UserResponseDTO.builder()
                                    .username(_user.getUsername())
                                    .aptNum(_user.getAptNum())
                                    .aptResponseDto(this.getAptResponseDTO(apt))
                            .build());
                }
            return userResponseDTOList;
        } else
            throw new IllegalArgumentException("not role");
    }

    @Transactional
    public Page<UserResponseDTO> getUserList(int page, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Pageable pageable = PageRequest.of(page, 20);
        Page<SiteUser> userList = userService.getUserList(pageable, aptId);
        List<UserResponseDTO> responseDTOList = new ArrayList<>();

        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY)
            throw new IllegalArgumentException("role is not admin or security");
        for (SiteUser siteUser : userList) {
            UserResponseDTO userResponseDTO = getUser(siteUser);
            responseDTOList.add(userResponseDTO);
        }
        return new PageImpl<>(responseDTOList, pageable, userList.getTotalElements());
    }

    @Transactional
    public UserResponseDTO getUserDetail(String userId, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY && !user.getUsername().equals(username)) throw new IllegalArgumentException("role is not admin or security");
        SiteUser user1 = userService.getUser(userId);
        UserResponseDTO userResponseDTO = getUser(user1);

        return userResponseDTO;
    }


    public UserResponseDTO updateUser(String username, String name, String password, String email, Long aptId, int aptNum, String loginId) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        SiteUser updateUser = userService.get(loginId);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY && user.getUsername().equals(username)) throw new IllegalArgumentException("role is not admin or security or not login user");
        if (email != null)
            userService.userEmailCheck(email);
        SiteUser siteUser = userService.update(updateUser, name, password, email, aptNum, apt);
        return this.getUser(siteUser);
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
    public ImageResponseDTO tempUpload(MultipartFile fileUrl, Long profileId, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
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
                String fileLoc = null;
                if (profileId != null) {
                    Profile profile = profileService.findById(profileId);
                    fileLoc = "/api/user" + "/" + username + "/temp/" + profile.getId() + "/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                    fileSystemService.save(ImageKey.TEMP.getKey(username + "." + profile.getId()), fileLoc);
                } else {
                    fileLoc = "/api/user" + "/" + username + "/temp/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                    fileSystemService.save(ImageKey.TEMP.getKey(username), fileLoc);
                }
                if (fileLoc != null) {
                    File file = new File(path + fileLoc);
                    if (!file.getParentFile().exists()) file.getParentFile().mkdirs();
                    fileUrl.transferTo(file);
                    return ImageResponseDTO.builder().url(fileLoc).build();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;


    }

    @Transactional
    public String fileMove(String url, String newUrl, FileSystem fileSystem) {
        try {
            String path = AptProjectApplication.getOsType().getLoc();
            Path tempPath = Paths.get(path + url);
            Path newPath = Paths.get(path + newUrl + tempPath.getFileName());

            Files.createDirectories(newPath.getParent());
            Files.move(tempPath, newPath);
            File file = tempPath.toFile();
            this.deleteFolder(file.getParentFile());
            fileSystemService.delete(fileSystem);
            return newUrl + tempPath.getFileName();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * File
     */
    public void deleteFolder(File file) {
        if (file.exists()) {
            if (file.isDirectory()) {
                for (File list : file.listFiles())
                    deleteFolder(list);
            }
            file.delete();
        }
    }

    /**
     * Profile
     */
    @Transactional
    public ProfileResponseDTO saveProfile(String name, String url, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        if (!name.trim().isEmpty()) {
            Profile profile = profileService.save(user, name);
            if (url != null) {
                Optional<FileSystem> _newFileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username));
                String newFile = "/api/user" + "/" + username + "/profile" + "/" + profile.getId() + "/";
                if (_newFileSystem.isPresent()) {
                    String newUrl = this.fileMove(_newFileSystem.get().getV(), newFile, _newFileSystem.get());
                    FileSystem fileSystem = fileSystemService.save(ImageKey.USER.getKey(username + "." + profile.getId()), newUrl);
                    return ProfileResponseDTO.builder()
                            .id(profile.getId())
                            .username(user.getUsername())
                            .url(fileSystem.getV())
                            .name(profile.getName()).build();
                }
            }
        }
        return null;
    }

    @Transactional
    public ProfileResponseDTO getProfile(Long profileId, String username) {
        SiteUser user = userService.get(username);
        if (user != null)
            throw new DataNotFoundException("username");
        Profile profile = profileService.findById(profileId);
        Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(user.getUsername() + "." + profile.getId()));
        if (profile.getUser() != user)
            throw new IllegalArgumentException("User mismatch in profile.");
        return _fileSystem.map(fileSystem -> ProfileResponseDTO.builder()
                .id(profile.getId())
                .url(fileSystem.getV())
                .name(profile.getName())
                .username(user.getUsername()).build()).orElse(null);

    }

    @Transactional
    public List<ProfileResponseDTO> getProfileList(String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        List<ProfileResponseDTO> responseDTOList = new ArrayList<>();
        List<Profile> profileList = profileService.findProfilesByUserList(user);
        if (profileList == null)
            throw new DataNotFoundException("not profileList");
        for (Profile profile : profileList) {
            Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(user.getUsername() + "." + profile.getId()));
            _fileSystem.ifPresent(fileSystem -> responseDTOList.add(ProfileResponseDTO.builder()
                    .id(profile.getId())
                    .url(fileSystem.getV())
                    .username(profile.getUser().getUsername())
                    .name(profile.getName()).build()));
        }
        return responseDTOList;
    }

    @Transactional
    public ProfileResponseDTO updateProfile(String username, String url, String name, Long id) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        Profile profile = profileService.findById(id);
        if (profile == null)
            throw new DataNotFoundException("not profile");
        profileService.updateProfile(profile, name);
        Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(user.getUsername() + "." + profile.getId()));
        String path = AptProjectApplication.getOsType().getLoc();
        if (_fileSystem.isPresent() && (url == null || !_fileSystem.get().getV().equals(url))) {
            File old = new File(path + _fileSystem.get().getV());
            if (old.exists()) old.delete();
        }
        if (url != null && !url.isBlank()) {
            String newFile = "/api/user" + "/" + username + "/profile" + "/" + profile.getId() + "/";
            Optional<FileSystem> _newFileSystem = fileSystemService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId()));
            if (_newFileSystem.isPresent()) {
                String newUrl = this.fileMove(_newFileSystem.get().getV(), newFile, _newFileSystem.get());
                fileSystemService.save(ImageKey.USER.getKey(username + "." + profile.getId()), newUrl);
            }
        }
        Optional<FileSystem> _newUserFileSystem = fileSystemService.get(ImageKey.USER.getKey(user.getUsername() + "." + profile.getId()));

        return _newUserFileSystem.map(fileSystem -> ProfileResponseDTO.builder()
                .name(profile.getName())
                .username(user.getUsername())
                .url(fileSystem.getV())
                .id(profile.getId()).build()).orElse(null);
    }

    /**
     *
     */

    @Transactional
    public CategoryResponseDTO saveCategory(String username, String name) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("requires admin role");
        Category category = this.categoryService.save(name);
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName()).build();

    }

    @Transactional
    public void deleteCategory(Long categoryId, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("requires admin role");
        Category category = categoryService.findById(categoryId);
        if (category == null)
            throw new DataNotFoundException("data not category");

        categoryService.delete(category);
    }
}
