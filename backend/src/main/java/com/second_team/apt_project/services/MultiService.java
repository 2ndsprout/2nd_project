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
import lombok.ToString;
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
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    private final MultiKeyService multiKeyService;
    private final ArticleService articleService;
    private final TagService tagService;

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

    public TokenRecord checkToken(String accessToken, Long profile_id) {
        if (profile_id == null)
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
                .createDate(this.dateTimeTransfer(siteUser.getCreateDate()))
                .modifyDate(this.dateTimeTransfer(siteUser.getModifyDate()))

                .build();
    }

    @Transactional
    public UserResponseDTO saveUser(String name, String password, String email, int aptNumber, int role, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY)
            throw new IllegalArgumentException("incorrect permissions");
        if (email != null)
            userService.userEmailCheck(email);
        SiteUser siteUser = userService.save(name, password, email, aptNumber, role, apt);
        return this.getUserResponseDTO(siteUser);
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
            throw new IllegalArgumentException("incorrect permissions");
    }

    @Transactional
    public Page<UserResponseDTO> getUserList(int page, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Pageable pageable = PageRequest.of(page, 20);
        Page<SiteUser> userList = userService.getUserList(pageable, aptId);
        List<UserResponseDTO> responseDTOList = new ArrayList<>();

        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY)
            throw new IllegalArgumentException("incorrect permissions");
        for (SiteUser siteUser : userList) {
            UserResponseDTO userResponseDTO = getUserResponseDTO(siteUser);
            responseDTOList.add(userResponseDTO);
        }
        return new PageImpl<>(responseDTOList, pageable, userList.getTotalElements());
    }

    @Transactional
    public UserResponseDTO getUserDetail(String userId, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY && !user.getUsername().equals(username)) throw new IllegalArgumentException("incorrect permissions");
        SiteUser user1 = userService.getUser(userId);
        UserResponseDTO userResponseDTO = getUserResponseDTO(user1);

        return userResponseDTO;
    }


    @Transactional
    public UserResponseDTO updateUser(String username, String email) {
        SiteUser user = userService.get(username);
        if (!user.getUsername().equals(username)) throw new IllegalArgumentException("user mismatch in login user");
        if (email != null)
            userService.userEmailCheck(email);

        SiteUser siteUser = userService.update(user, email);

        return this.getUserResponseDTO(siteUser);
    }


    @Transactional
    public UserResponseDTO getUser(String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        return this.getUserResponseDTO(user);
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
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("incorrect permissions");
        Apt apt = aptService.save(roadAddress, aptName, x, y);
        return this.getAptResponseDTO(apt);
    }

    @Transactional
    public AptResponseDTO updateApt(Long profileId, Long aptId, String roadAddress, String aptName, String url, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        Profile profile = profileService.findById(profileId);
        Apt apt = aptService.get(aptId);
        if (apt == null)
            throw new DataNotFoundException("not apt");
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("incorrect permissions");
        aptService.update(apt, roadAddress, aptName);
        Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.APT.getKey(apt.getId().toString()));
        String path = AptProjectApplication.getOsType().getLoc();
        if (_fileSystem.isPresent() && (url == null || !_fileSystem.get().getV().equals(url))) {
            File old = new File(path + _fileSystem.get().getV());
            if (old.exists()) old.delete();
        }
        if (url != null && !url.isBlank()) {
            String newFile = "/api/apt/" + aptId.toString() + "/";
            Optional<FileSystem> _newFileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username + "."+ profile.getId()));
            if (_newFileSystem.isPresent()) {
                String newUrl = this.fileMove(_newFileSystem.get().getV(), newFile, _newFileSystem.get());
                fileSystemService.save(ImageKey.APT.getKey(apt.getId().toString()), newUrl);
            }
        }
        Optional<FileSystem> _newAptFileSystem = fileSystemService.get(ImageKey.APT.getKey(apt.getId().toString()));

        return _newAptFileSystem.map(fileSystem -> AptResponseDTO.builder()
                .aptId(apt.getId())
                .aptName(apt.getAptName())
                .roadAddress(apt.getRoadAddress())
                .url(fileSystem.getV())
                .build()).orElse(null);
    }

    @Transactional
    public List<AptResponseDTO> getAptList(String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("incorrect permissions");
        List<Apt> aptList = aptService.getAptList();
        List<AptResponseDTO> responseDTOList = new ArrayList<>();
        for (Apt apt : aptList) {
            AptResponseDTO aptResponseDTO = this.getApt(apt);
            responseDTOList.add(aptResponseDTO);
        }
        return responseDTOList;
    }

    private AptResponseDTO getApt(Apt apt) {
        return getAptResponseDTO(apt);
    }

    @Transactional
    public AptResponseDTO getAptDetail(Long aptId, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("incorrect permissions");
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
                    if (profile == null)
                        throw new DataNotFoundException("profile not data");
                    fileLoc = "/api/user" + "/" + username + "/temp/" + profile.getId() + "/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                    fileSystemService.save(ImageKey.TEMP.getKey(username + "." + profile.getId()), fileLoc);
                } else {
                    fileLoc = "/api/user" + "/" + username + "/temp/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                    fileSystemService.save(ImageKey.TEMP.getKey(username), fileLoc);
                }
                File file = new File(path + fileLoc);
                if (!file.getParentFile().exists()) file.getParentFile().mkdirs();
                fileUrl.transferTo(file);
                return ImageResponseDTO.builder().url(fileLoc).build();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    @Transactional
    public ImageResponseDTO tempUploadList(MultipartFile fileUrl, Long profileId, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        if (!fileUrl.isEmpty()) {
            try {
                String path = AptProjectApplication.getOsType().getLoc();
                UUID uuid = UUID.randomUUID();
                Profile profile = profileService.findById(profileId);
                if (profile == null)
                    throw new DataNotFoundException("profile not data");
                String fileLoc = "/api/user" + "/" + username + "/temp_list/" + profile.getId() + "/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                File file = new File(path + fileLoc);
                if (!file.getParentFile().exists()) file.getParentFile().mkdirs();
                fileUrl.transferTo(file);
                Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(username + "." + profile.getId()));
                if (_multiKey.isEmpty()) {
                    MultiKey multiKey = multiKeyService.save(ImageKey.TEMP.getKey(username + "." + profile.getId()), ImageKey.TEMP.getKey(username + "." + profile.getId()) + ".0");
                    fileSystemService.save(multiKey.getVs().getLast(), fileLoc);
                } else {
                    multiKeyService.add(_multiKey.get(), ImageKey.TEMP.getKey(username + "." + profile.getId()) + "." + _multiKey.get().getVs().size());
                    fileSystemService.save(_multiKey.get().getVs().getLast(), fileLoc);
                }
                Optional<MultiKey> _newMultiKey = multiKeyService.get(ImageKey.TEMP.getKey(username + "." + profile.getId()));
                List<String> urlList = new ArrayList<>();
                for (String value : _newMultiKey.get().getVs()) {
                    Optional<FileSystem> fileSystem = fileSystemService.get(value);
                    fileSystem.ifPresent(system -> urlList.add(system.getV()));
                }
                return ImageResponseDTO.builder()
                        .urlList(urlList).build();

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
            throw new IllegalArgumentException("user mismatch in profile");
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
            throw new DataNotFoundException("profileList not data");
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
            throw new DataNotFoundException("profile not data");
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
    public CategoryResponseDTO saveCategory(String username, String name, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("profile not data");
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("incorrect permissions");
        Category category = this.categoryService.save(name);
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .createDate(this.dateTimeTransfer(category.getCreateDate())).build();

    }

    @Transactional
    public void deleteCategory(Long categoryId, String username, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("username");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("profile not data");
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("incorrect permissions");
        Category category = categoryService.findById(categoryId);
        if (category == null)
            throw new DataNotFoundException("category not data");

        categoryService.delete(category);
    }


    /**
     * Tag
     */

    @Transactional
    public TagResponseDTO saveTag(String name, Long profileId, String username) {
        SiteUser user = userService.get(username);
        if (user == null )
            throw new DataNotFoundException("username");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("profile not data");
        Tag tag = tagService.findByName(name);
        if (tag == null)
            tag = tagService.save(name);
        return this.tagResponseDTO(tag);

    }

    @Transactional
    public TagResponseDTO getTag(String username, Long profileId, Long tagId) {
        SiteUser user = userService.get(username);
        if (user == null )
            throw new DataNotFoundException("username");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("profile not data");
        Tag tag = tagService.findById(tagId);
        if (tag == null)
            throw new DataNotFoundException("tag not data");
        return this.tagResponseDTO(tag);
    }

    private TagResponseDTO tagResponseDTO(Tag tag) {
        return TagResponseDTO.builder()
                .id(tag.getId())
                .name(tag.getName()).build();
    }



    /**
     * function
     */

    private Long dateTimeTransfer(LocalDateTime dateTime) {

        if (dateTime == null) {
            return null;
        }
        return dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

}
