package com.second_team.apt_project.services;

import com.second_team.apt_project.AptProjectApplication;
import com.second_team.apt_project.domains.*;
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
    private final ArticleTagService articleTagService;
    private final LoveService loveService;
    private final CommentService commentService;
    private final CultureCenterService cultureCenterService;
    private final LessonService lessonService;
    private final LessonUserService lessonUserService;

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
            throw new IllegalArgumentException("유저 객체 없음");
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
    private void userCheck(SiteUser user, Profile profile) {
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        if (profile.getUser() != user)
            throw new IllegalArgumentException("유저와 일치 X");
    }

    @Transactional
    private UserResponseDTO getUserResponseDTO(SiteUser siteUser, Apt apt) {
        return UserResponseDTO.builder()
                .aptNum(siteUser.getAptNum())
                .username(siteUser.getUsername())
                .email(siteUser.getEmail())
                .aptResponseDto(this.getAptResponseDTO(siteUser.getApt()))
                .createDate(this.dateTimeTransfer(siteUser.getCreateDate()))
                .modifyDate(this.dateTimeTransfer(siteUser.getModifyDate()))
                .role(siteUser.getRole().toString())
                .build();
    }

    @Transactional
    public UserResponseDTO saveUser(String name, String password, String email, int aptNumber, int role, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY)
            throw new IllegalArgumentException("권한 불일치");
        if (email != null) userService.userEmailCheck(email);
        SiteUser siteUser = userService.save(name, password, email, aptNumber, role, apt);
        return this.getUserResponseDTO(siteUser, siteUser.getApt());
    }

    @Transactional
    public List<UserResponseDTO> saveUserGroup(int aptNum, Long aptId, String username, int h, int w) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        List<UserResponseDTO> userResponseDTOList = new ArrayList<>();
        if (user.getRole() == UserRole.SECURITY || user.getRole() == UserRole.ADMIN) {
            for (int i = 1; h >= i; i++)
                for (int j = 1; w >= j; j++) {
                    String jKey = String.valueOf(j);
                    if (j < 10) jKey = "0" + jKey;
                    String name = String.valueOf(aptNum) + String.valueOf(i) + jKey;
                    SiteUser _user = userService.saveGroup(name, aptNum, apt);
                    userResponseDTOList.add(UserResponseDTO.builder().username(_user.getUsername()).aptNum(_user.getAptNum()).aptResponseDto(this.getAptResponseDTO(apt)).build());
                }
            return userResponseDTOList;
        } else throw new IllegalArgumentException("권한 불일치");
    }

    @Transactional
    public Page<UserResponseDTO> getUserList(int page, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Pageable pageable = PageRequest.of(page, 20);
        Page<SiteUser> userList = userService.getUserList(pageable, aptId);
        List<UserResponseDTO> responseDTOList = new ArrayList<>();

        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY)
            throw new IllegalArgumentException("권한 불일치");
        for (SiteUser siteUser : userList) {
            Apt apt = aptService.get(siteUser.getApt().getId());
            if (apt == null) throw new DataNotFoundException("apt not data");
            UserResponseDTO userResponseDTO = getUserResponseDTO(siteUser, apt);
            responseDTOList.add(userResponseDTO);
        }
        return new PageImpl<>(responseDTOList, pageable, userList.getTotalElements());
    }

    @Transactional
    public UserResponseDTO getUserDetail(String userId, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY && !user.getUsername().equals(username))
            throw new IllegalArgumentException("권한 불일치");
        SiteUser user1 = userService.getUser(userId);
        Apt apt = aptService.get(user1.getApt().getId());
        if (apt == null) throw new DataNotFoundException("apt not data");
        return this.getUserResponseDTO(user1, apt);
    }


    @Transactional
    public UserResponseDTO updateUser(String username, String email) {
        SiteUser user = userService.get(username);
        if (!user.getUsername().equals(username)) throw new IllegalArgumentException("로그인 유저와 불일치");
        if (email != null) userService.userEmailCheck(email);

        SiteUser siteUser = userService.update(user, email);
        Apt apt = aptService.get(siteUser.getApt().getId());
        if (apt == null) throw new DataNotFoundException("apt not data");
        return this.getUserResponseDTO(siteUser, apt);
    }

    @Transactional
    public void updatePassword(String username, String password, String newPassword1, String newPassword2) {
        SiteUser user = userService.get(username);
        if (!user.getUsername().equals(username)) throw new IllegalArgumentException("로그인 유저와 불일치");
        if (!this.userService.isMatch(password, user.getPassword()))
            throw new IllegalArgumentException("기존 비밀번호 일치 X");
        else if (!newPassword1.equals(newPassword2))
            throw new IllegalArgumentException("새 비밀번호 일치 X");
        else
            if (!this.userService.isMatch(newPassword1, user.getPassword()))
                userService.updatePassword(user, newPassword1);
            else
                throw new IllegalArgumentException("기존 비밀번호와 새 비밀번호가 일치함");
    }

    @Transactional
    public UserResponseDTO getUser(String username) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        return this.getUserResponseDTO(user, user.getApt());
    }


    /**
     * Apt
     */

    private AptResponseDTO getAptResponseDTO(Apt apt) {
        if (apt == null) throw new DataNotFoundException("아파트 객체 없음");
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.APT.getKey(apt.getId().toString()));
        List<ImageListResponseDTO> imageListResponseDTOS = new ArrayList<>();
        if (_multiKey.isPresent()) {
            for (String value : _multiKey.get().getVs()) {
                Optional<FileSystem> _fileSystem = fileSystemService.get(value);
                _fileSystem.ifPresent(fileSystem -> imageListResponseDTOS.add(ImageListResponseDTO.builder().key(fileSystem.getK()).value(fileSystem.getV()).build()));
            }
        }
        return AptResponseDTO.builder()
                .aptId(apt.getId())
                .aptName(apt.getAptName())
                .roadAddress(apt.getRoadAddress())
                .x(apt.getX()).y(apt.getY())
                .urlList(imageListResponseDTOS)
                .build();
    }

    @Transactional
    public AptResponseDTO saveApt(String roadAddress, String aptName, Double x, Double y, String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
        Apt apt = aptService.save(roadAddress, aptName, x, y);
        return this.getAptResponseDTO(apt);
    }

    @Transactional
    public AptResponseDTO updateApt(Long profileId, Long aptId, String roadAddress, String aptName, List<String> key, String username) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        Apt apt = aptService.get(aptId);

        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY) throw new IllegalArgumentException("권한 불일치");
        apt = aptService.update(apt, roadAddress, aptName);
        Optional<MultiKey> _newMultiKey = multiKeyService.get(ImageKey.TEMP.getKey(username + "." + profile.getId()));
        Optional<MultiKey> _oldMulti = multiKeyService.get(ImageKey.APT.getKey(apt.getId().toString()));
        if (_oldMulti.isPresent())
            if (key != null) {
                for (String k : key) {
                    Optional<FileSystem> _fileSystem = fileSystemService.get(k);
                    _fileSystem.ifPresent(fileSystem -> {
                        fileSystemService.delete(fileSystem);
                        _oldMulti.get().getVs().remove(key);
                        deleteFile(_fileSystem.get());
                    });
                }
            }
        if (_newMultiKey.isPresent()) {
            String newFile = "/api/apt" + "/" + apt.getId() + "/";
            for (String values : _newMultiKey.get().getVs()) {
                Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.APT.getKey(apt.getId().toString()));
                Optional<FileSystem> _newFileSystem = fileSystemService.get(values);
                if (_newFileSystem.isPresent()) {
                    String newUrl = this.fileMove(_newFileSystem.get().getV(), newFile, _newFileSystem.get());
                    if (_multiKey.isPresent()) {
                        multiKeyService.add(_multiKey.get(), ImageKey.APT.getKey(apt.getId().toString() + "." + _multiKey.get().getVs().size()));
                        fileSystemService.save(_multiKey.get().getVs().getLast(), newUrl);
                    } else {
                        MultiKey multiKey = multiKeyService.save(ImageKey.APT.getKey(apt.getId().toString()), ImageKey.APT.getKey(apt.getId().toString() + ".0"));
                        fileSystemService.save(multiKey.getVs().getLast(), newUrl);

                    }
                }
            }
            multiKeyService.delete(_newMultiKey.get());
        }

        return getAptResponseDTO(apt);
    }

    @Transactional
    public List<AptResponseDTO> getAptList(String username) {
        SiteUser user = userService.get(username);
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
        List<Apt> aptList = aptService.getAptList();
        List<AptResponseDTO> responseDTOList = new ArrayList<>();
        for (Apt apt : aptList) {
            AptResponseDTO aptResponseDTO = this.getAptResponseDTO(apt);
            responseDTOList.add(aptResponseDTO);
        }
        return responseDTOList;
    }


    @Transactional
    public AptResponseDTO getAptDetail(Long aptId, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN && !user.getApt().equals(apt)) throw new IllegalArgumentException("권한 불일치");
        AptResponseDTO aptResponseDTO = this.getAptResponseDTO(apt);
        return aptResponseDTO;
    }

    /**
     * Image
     */

    @Transactional
    public ImageResponseDTO tempUpload(MultipartFile fileUrl, Long profileId, String username) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
        if (!fileUrl.isEmpty()) {
            try {
                String path = AptProjectApplication.getOsType().getLoc();
                Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username + "." + profile.getId()));
                if (_fileSystem.isPresent()) {
                    FileSystem fileSystem = _fileSystem.get();
                    File file = new File(path + fileSystem.getV());
                    if (file.exists()) file.delete();
                    fileSystemService.delete(_fileSystem.get());

                }
                UUID uuid = UUID.randomUUID();
                String fileLoc = "/api/user" + "/" + username + "/temp/" + profile.getId() + "/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                FileSystem fileSystem = fileSystemService.save(ImageKey.TEMP.getKey(username + "." + profile.getId()), fileLoc);

                File file = new File(path + fileLoc);
                if (!file.getParentFile().exists()) file.getParentFile().mkdirs();
                fileUrl.transferTo(file);
                return ImageResponseDTO.builder().key(fileSystem.getK()).url(fileSystem.getV()).build();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    @Transactional
    public ImageResponseDTO tempUploadProfile(MultipartFile fileUrl, String username) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        if (!fileUrl.isEmpty()) {
            try {
                String path = AptProjectApplication.getOsType().getLoc();
                Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username));
                if (_fileSystem.isPresent()) {
                    FileSystem fileSystem = _fileSystem.get();
                    File file = new File(path + fileSystem.getV());
                    if (file.exists()) file.delete();
                    fileSystemService.delete(_fileSystem.get());
                }
                UUID uuid = UUID.randomUUID();
                String fileLoc = "/api/user" + "/" + username + "/temp/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                FileSystem fileSystem = fileSystemService.save(ImageKey.TEMP.getKey(username), fileLoc);

                File file = new File(path + fileLoc);
                if (!file.getParentFile().exists()) file.getParentFile().mkdirs();
                fileUrl.transferTo(file);
                return ImageResponseDTO.builder().key(fileSystem.getK()).url(fileSystem.getV()).build();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    @Transactional
    public List<ImageListResponseDTO> tempUploadList(MultipartFile fileUrl, Long profileId, String username) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        if (!fileUrl.isEmpty()) {
            try {
                String path = AptProjectApplication.getOsType().getLoc();
                UUID uuid = UUID.randomUUID();
                Profile profile = profileService.findById(profileId);
                if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
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
                List<ImageListResponseDTO> imageListResponseDTOS = new ArrayList<>();
                if (_newMultiKey.isPresent())
                    for (String value : _newMultiKey.get().getVs()) {
                        Optional<FileSystem> fileSystem = fileSystemService.get(value);
                        fileSystem.ifPresent(system -> imageListResponseDTOS.add(ImageListResponseDTO.builder()
                                .key(fileSystem.get().getK())
                                .value(fileSystem.get().getV())
                                .build()));
                    }
                return imageListResponseDTOS;

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    @Transactional
    private void deleteFile(FileSystem fileSystem) {
        String path = AptProjectApplication.getOsType().getLoc();
        Path tempPath = Paths.get(path + fileSystem.getV());
        File file = tempPath.toFile();
        if (file.getParentFile().list().length == 1)
            this.deleteFolder(file.getParentFile());
        else
            file.delete();
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
            if (file.getParentFile().list().length == 0)
                this.deleteFolder(file.getParentFile());
            else
                file.delete();
            fileSystemService.delete(fileSystem);
            return newUrl + tempPath.getFileName();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Transactional
    public void deleteImageList(String username, Long profileId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId().toString()));
        String path = AptProjectApplication.getOsType().getLoc();
        if (_multiKey.isPresent()) for (String value : _multiKey.get().getVs()) {
            Optional<FileSystem> _fileSystem = fileSystemService.get(value);
            if (_fileSystem.isPresent()) {
                File file = new File(path + _fileSystem.get().getV());
                if (file.getParentFile().list().length == 1) this.deleteFolder(file.getParentFile());
                else file.delete();
                fileSystemService.delete(_fileSystem.get());
            }
            multiKeyService.delete(_multiKey.get());
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
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        if (!name.trim().isEmpty()) {
            Profile profile = profileService.save(user, name);
            Optional<FileSystem> _newFileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username));
            String newFile = "/api/user" + "/" + username + "/profile" + "/" + profile.getId() + "/";
            if (_newFileSystem.isPresent()) {
                String newUrl = this.fileMove(_newFileSystem.get().getV(), newFile, _newFileSystem.get());
                FileSystem fileSystem = fileSystemService.save(ImageKey.USER.getKey(username + "." + profile.getId()), newUrl);
                url = fileSystem.getV();
            }
            return ProfileResponseDTO.builder()
                    .id(profile.getId())
                    .url(url)
                    .name(profile.getName())
                    .username(profile.getUser().getUsername()).build();
        }
        return null;
    }

    private ProfileResponseDTO profileResponseDTO(Profile profile) {
        Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(profile.getUser().getUsername() + "." + profile.getId()));
        String url = null;
        if (_fileSystem.isPresent()) url = _fileSystem.get().getV();
        return ProfileResponseDTO.builder()
                .id(profile.getId())
                .url(url)
                .name(profile.getName())
                .username(profile.getUser().getUsername()).build();
    }

    @Transactional
    public ProfileResponseDTO getProfile(Long profileId, String username) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);

        return profileResponseDTO(profile);

    }

    @Transactional
    public List<ProfileResponseDTO> getProfileList(String username) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        List<ProfileResponseDTO> responseDTOList = new ArrayList<>();
        List<Profile> profileList = profileService.findProfilesByUserList(user);
        if (profileList == null) throw new DataNotFoundException("프로필 객체 없음");
        for (Profile profile : profileList) {
            Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(user.getUsername() + "." + profile.getId()));
            String url = null;
            if (_fileSystem.isPresent()) url = _fileSystem.get().getV();
            responseDTOList.add(ProfileResponseDTO.builder().id(profile.getId()).url(url).username(profile.getUser().getUsername()).name(profile.getName()).build());
        }
        return responseDTOList;
    }

    @Transactional
    public ProfileResponseDTO updateProfile(String username, String url, String name, Long profileId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
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

        return _newUserFileSystem.map(fileSystem -> ProfileResponseDTO.builder().name(profile.getName()).username(user.getUsername()).url(fileSystem.getV()).id(profile.getId()).build()).orElse(null);
    }

    private String profileUrl(String username, Long id) {
        Optional<FileSystem> _profileFileSystem = fileSystemService.get(ImageKey.USER.getKey(username + "." + id));
        String profileUrl = null;
        if (_profileFileSystem.isPresent()) profileUrl = _profileFileSystem.get().getV();
        return profileUrl;
    }

    /**
     * Category
     */

    @Transactional
    public CategoryResponseDTO saveCategory(String username, String name, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
        Category category = this.categoryService.save(name);
        return categoryResponseDTO(category);

    }

    @Transactional
    public void deleteCategory(Long categoryId, String username, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
        Category category = categoryService.findById(categoryId);
        if (category == null) throw new DataNotFoundException("카테고리 객체 없음");

        categoryService.delete(category);
    }

    @Transactional
    public CategoryResponseDTO getCategory(Long categoryId, String username, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Category category = categoryService.findById(categoryId);
        if (category == null)
            throw new DataNotFoundException("카테고리 객체 없음");

        return categoryResponseDTO(category);
    }
    @Transactional
    public List<CategoryResponseDTO> getCategoryList(String username, Long profileId) {
        SiteUser siteUser = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(siteUser, profile);
        List<Category> categoryList = categoryService.getList();
        List<CategoryResponseDTO> responseDTOList = new ArrayList<>();
        for (Category category : categoryList){
            responseDTOList.add(categoryResponseDTO(category));
        }
        return responseDTOList;

    }

    @Transactional
    public CategoryResponseDTO updateCategory(String username, Long profileId, Long id, String name) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Category category = categoryService.findById(id);
        if (category == null)
            throw new DataNotFoundException("카테고리 객체 없음");
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("권한 불일치");
        category = categoryService.update(category, name);

        return categoryResponseDTO(category);
    }

    private CategoryResponseDTO categoryResponseDTO(Category category) {
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .modifyDate(this.dateTimeTransfer(category.getModifyDate()))
                .createDate(this.dateTimeTransfer(category.getCreateDate())).build();
    }


    /**
     * Article
     */
    @Transactional
    public ArticleResponseDTO saveArticle(Long profileId, Long categoryId, List<Long> tagId, String title, String content, String username, Boolean topActive) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Category category = categoryService.findById(categoryId);
        if (category == null) throw new DataNotFoundException("카테고리 객체 없음");
        Article article = articleService.save(profile, title, content, category, topActive);
        List<TagResponseDTO> tagResponseDTOList = new ArrayList<>();
        if (tagId != null) {
            for (Long id : tagId) {
                Tag tag = tagService.findById(id);
                if (tag == null)
                    throw new DataNotFoundException("태그 객체 없음");
                articleTagService.save(article, tag);
                tagResponseDTOList.add(tagResponseDTO(tag));
            }
        }
        List<Love> loveList = loveService.findByArticle(article.getId());
        if (loveList == null) throw new DataNotFoundException("게시물 좋아요 객체 없음");
        int loveCount = loveList.size();
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId().toString()));
        _multiKey.ifPresent(multiKey -> this.updateArticleContent(article, multiKey));
        return this.getArticleResponseDTO(article, tagResponseDTOList, loveCount);
    }


    @Transactional
    public ArticleResponseDTO updateArticle(Long profileId, Long articleId, Long categoryId, List<Long> tagId, String title, String content, String username, Boolean topActive) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Category category = categoryService.findById(categoryId);
        if (category == null) throw new DataNotFoundException("카테고리 객체 없음");
        Article targetArticle = articleService.findById(articleId);
        if (profile != targetArticle.getProfile()) throw new IllegalArgumentException("수정 권한 없음");
        Article article = articleService.update(targetArticle, title, content, category, topActive);
        List<TagResponseDTO> tagResponseDTOList = new ArrayList<>();
        for (Long id : tagId) {
            Tag tag = tagService.findById(id);

            if (tag == null)
                throw new DataNotFoundException("태그 객체 없음");

            articleTagService.save(article, tag);
            tagResponseDTOList.add(tagResponseDTO(tag));
        }
        List<Love> loveList = loveService.findByArticle(article.getId());
        if (loveList == null) throw new DataNotFoundException("게시물 좋아요 객체 없음");
        int loveCount = loveList.size();
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId().toString()));
        _multiKey.ifPresent(multiKey -> this.updateArticleContent(article, multiKey));
        return this.getArticleResponseDTO(article, tagResponseDTOList, loveCount);
    }

    @Transactional
    public ArticleResponseDTO articleDetail(Long articleId, Long profileId, String username, int page) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Article article = articleService.findById(articleId);
        if (article == null) throw new DataNotFoundException("게시물 객체 없음");
        List<ArticleTag> articleTagList = articleTagService.getArticle(article);
        if (articleTagList == null) throw new DataNotFoundException("게시물태그 객체 없음");
        List<TagResponseDTO> responseDTOList = new ArrayList<>();
        for (ArticleTag articleTag : articleTagList) {
            Tag tag = tagService.findById(articleTag.getTag().getId());
            responseDTOList.add(tagResponseDTO(tag));
        }
        List<Love> loveList = loveService.findByArticle(article.getId());
        if (loveList == null) throw new DataNotFoundException("게시물 좋아요 객체 없음");
        int loveCount = loveList.size();
        Pageable pageable = PageRequest.of(page, 15);
        Page<Comment> commentList = commentService.getCommentPaging(pageable, article.getId());
        if (commentList == null) throw new DataNotFoundException("댓글 객체 없음");
        List<CommentResponseDTO> commentResponseDTOList = new ArrayList<>();
        for (Comment comment : commentList) {
            CommentResponseDTO commentResponseDTO = this.commentResponseDTO(comment, comment.getProfile());
            commentResponseDTOList.add(commentResponseDTO);
        }
        PageImpl<CommentResponseDTO> commentPage = new PageImpl<>(commentResponseDTOList, pageable, commentList.getTotalElements());
        return this.getArticleResponseDTODetail(article, responseDTOList, loveCount, commentPage);
    }

    private ArticleResponseDTO getArticleResponseDTODetail(Article article, List<TagResponseDTO> responseDTOList, int loveCount, Page<CommentResponseDTO> commentResponseDTOList) {
        String profileUrl = this.profileUrl(article.getProfile().getUser().getUsername(), article.getProfile().getId());

        return ArticleResponseDTO.builder()
                .articleId(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .loveCount(loveCount)
                .createDate(this.dateTimeTransfer(article.getCreateDate()))
                .modifyDate(this.dateTimeTransfer(article.getModifyDate()))
                .categoryName(article.getCategory().getName())
                .profileResponseDTO(ProfileResponseDTO.builder()
                        .id(article.getProfile().getId())
                        .username(article.getProfile().getName())
                        .url(profileUrl)
                        .name(article.getProfile().getName())
                        .build())
                .tagResponseDTOList(responseDTOList)
                .topActive(article.getTopActive())
                .commentResponseDTOList(commentResponseDTOList)
                .build();
    }

    @Transactional
    public List<ArticleResponseDTO> topActive(String username, Long profileId, Long categoryId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Boolean topActive = true;
        List<Article> articleList = articleService.topActive(user.getApt().getId(), categoryId, topActive);
        List<ArticleResponseDTO> articleResponseDTOList = new ArrayList<>();
        for (Article article : articleList) {
            ArticleResponseDTO articleResponseDTO = ArticleResponseDTO.builder()
                    .articleId(article.getId())
                    .topActive(article.getTopActive())
                    .title(article.getTitle())
                    .content(article.getContent())
                    .categoryName(article.getCategory().getName())
                    .createDate(this.dateTimeTransfer(article.getCreateDate()))
                    .modifyDate(this.dateTimeTransfer(article.getModifyDate()))
                    .build();
            articleResponseDTOList.add(articleResponseDTO);
        }
        return articleResponseDTOList;
    }

    @Transactional
    public Page<ArticleResponseDTO> articleList(String username, int page, Long profileId, Long categoryId) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Pageable pageable = PageRequest.of(page, 15);
        Boolean topActive = false;
        Page<Article> articleList = articleService.getArticleList(pageable, user.getApt().getId(), categoryId, topActive);
        List<ArticleResponseDTO> articleResponseDTOList = new ArrayList<>();
        for (Article article : articleList) {
            List<ArticleTag> articleTagList = articleTagService.getArticle(article);
            if (articleTagList == null) throw new DataNotFoundException("게시물태그 객체 없음");
            List<TagResponseDTO> responseDTOList = new ArrayList<>();
            for (ArticleTag articleTag : articleTagList) {
                Tag tag = tagService.findById(articleTag.getTag().getId());
                responseDTOList.add(tagResponseDTO(tag));
            }
            List<Love> loveList = loveService.findByArticle(article.getId());
            if (loveList == null) throw new DataNotFoundException("게시물 좋아요 객체 없음");
            int loveCount = loveList.size();
            ArticleResponseDTO articleResponseDTO = this.getArticleResponseDTO(article, responseDTOList, loveCount);
            articleResponseDTOList.add(articleResponseDTO);
        }
        return new PageImpl<>(articleResponseDTOList, pageable, articleList.getTotalElements());
    }

    private ArticleResponseDTO getArticleResponseDTO(Article article, List<TagResponseDTO> responseDTOList, int loveCount) {
        String profileUrl = this.profileUrl(article.getProfile().getUser().getUsername(), article.getProfile().getId());

        return ArticleResponseDTO.builder()
                .articleId(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .loveCount(loveCount)
                .createDate(this.dateTimeTransfer(article.getCreateDate()))
                .modifyDate(this.dateTimeTransfer(article.getModifyDate()))
                .categoryName(article.getCategory().getName())
                .profileResponseDTO(ProfileResponseDTO.builder()
                        .id(article.getProfile().getId())
                        .username(article.getProfile().getName())
                        .url(profileUrl)
                        .name(article.getProfile().getName())
                        .build())
                .tagResponseDTOList(responseDTOList)
                .topActive(article.getTopActive())
                .build();
    }

    private void updateArticleContent(Article article, MultiKey multiKey) {
        String content = article.getContent();
        for (String keyName : multiKey.getVs()) {
            Optional<MultiKey> _articleMulti = multiKeyService.get(ImageKey.ARTICLE.getKey(article.getId().toString()));
            Optional<FileSystem> _fileSystem = fileSystemService.get(keyName);
            if (_fileSystem.isPresent()) {
                String newFile = "/api/article" + "/" + article.getId() + "/";
                String newUrl = this.fileMove(_fileSystem.get().getV(), newFile, _fileSystem.get());
                if (_articleMulti.isEmpty()) {
                    MultiKey multiKey1 = multiKeyService.save(ImageKey.ARTICLE.getKey(article.getId().toString()), ImageKey.ARTICLE.getKey(article.getId().toString() + ".0"));
                    fileSystemService.save(multiKey.getVs().getLast(), newUrl);
                } else {
                    multiKeyService.add(_articleMulti.get(), ImageKey.ARTICLE.getKey(article.getId().toString()) + "." + _articleMulti.get().getVs().size());
                    fileSystemService.save(_articleMulti.get().getVs().getLast(), newUrl);
                }
                content = content.replace(_fileSystem.get().getV(), newUrl);
            }
        }
        multiKeyService.delete(multiKey);
        articleService.updateContent(article, content);
    }

    /**
     * Comment
     */

    @Transactional
    private CommentResponseDTO commentResponseDTO(Comment comment, Profile profile) {
        return CommentResponseDTO.builder().id(comment.getId()).content(comment.getContent()).articleId(comment.getArticle().getId()).profileResponseDTO(ProfileResponseDTO.builder().id(profile.getId()).name(profile.getName()).url(profileUrl(profile.getName(), profile.getId())).username(profile.getUser().getUsername()).build()).createDate(this.dateTimeTransfer(comment.getCreateDate())).parentId(comment.getParent() != null ? comment.getParent().getId() : null).build();
    }

    @Transactional
    public CommentResponseDTO saveComment(String username, Long articleId, Long parentId, Long profileId, String content) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Article article = articleService.findById(articleId);
        if (article == null) throw new DataNotFoundException("게시물 객체 없음");
        Comment comment = commentService.saveComment(article, profile, content, parentId);
        if (comment.getParent() != null && comment.getParent().getArticle().getId() != article.getId())
            throw new DataNotFoundException("부모 댓글의 게시글 객체와 해당 게시글 객체가 다름");
        return this.commentResponseDTO(comment, profile);
    }

    @Transactional
    public CommentResponseDTO updateComment(String username, Long profileId, Long commentId, String content) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Comment comment = commentService.updateComment(commentId, content);
        if (!profile.equals(comment.getProfile())) throw new IllegalArgumentException("작성자의 프로필이 일치하지 않습니다");
        return this.commentResponseDTO(comment, profile);
    }

    @Transactional
    public void deleteComment(String username, Long profileId, Long commentId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Comment comment = commentService.findByComment(commentId);
        if (comment == null)
            throw new DataNotFoundException("댓글 객체 없음");
        List<Comment> commentList = commentService.findByCommentList(commentId);
        for (Comment comment1 : commentList) {
            deleteChildren(comment1);
        }
        if (!profile.equals(comment.getProfile())) {
            throw new IllegalArgumentException("작성자의 프로필이 일치하지 않습니다");
        }
        commentService.deleteComment(comment);
    }

    private void deleteChildren(Comment comment) {
        List<Comment> commentList = commentService.findByCommentList(comment.getId());
        if (commentList != null) {
            for (Comment children : commentList) {
                this.deleteChildren(children);
            }
        }
        commentService.deleteComment(comment);
    }

    /**
     * Love
     */


    @Transactional
    public void saveLove(String username, Long articleId, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
        Article article = articleService.findById(articleId);
        if (article == null)
            throw new DataNotFoundException("게시물 객체 없음");
        loveService.save(article, profile);

    }

    @Transactional
    public void deleteLove(String username, Long articleId, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
        Article article = articleService.findById(articleId);
        if (article == null)
            throw new DataNotFoundException("게시물 객체 없음");
        Love love = loveService.findByArticleAndProfile(article, profile);
        loveService.delete(love);
    }


    /**
     * Tag
     */


    @Transactional
    public TagResponseDTO saveTag(String name, Long profileId, String username) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
        Tag tag = tagService.findByName(name);
        if (tag == null) tag = tagService.save(name);
        return this.tagResponseDTO(tag);
    }

    @Transactional
    public TagResponseDTO getTag(String username, Long profileId, Long tagId) {
        SiteUser user = userService.get(username);
        if (user == null) throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null) throw new DataNotFoundException("프로필 객체 없음");
        Tag tag = tagService.findById(tagId);
        if (tag == null) throw new DataNotFoundException("태그 객체 없음");
        return this.tagResponseDTO(tag);
    }

    private TagResponseDTO tagResponseDTO(Tag tag) {
        return TagResponseDTO.builder().id(tag.getId()).name(tag.getName()).build();
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

    /**
     * Center
     */
    @Transactional
    public CenterResponseDTO saveCenter(String username, Long profileId, int type, LocalDateTime endDate, LocalDateTime startDate) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        if (user.getRole() == UserRole.USER)
            throw new IllegalArgumentException("권한 불일치");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Apt apt = aptService.get(user.getApt().getId());
        if (apt == null)
            throw new DataNotFoundException("아파트 객체 없음");
        CultureCenter cultureCenter = cultureCenterService.save(type, endDate, startDate, apt);

        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId()));
        if (_multiKey.isPresent()) {
            for (String values : _multiKey.get().getVs()) {
                Optional<MultiKey> _centerMultiKey = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
                Optional<FileSystem> _fileSystem = fileSystemService.get(values);
                if (_fileSystem.isPresent()) {
                    String newFile = "/api/center" + "/" + cultureCenter.getId() + "/";
                    String newUrl = this.fileMove(_fileSystem.get().getV(), newFile, _fileSystem.get());
                    if (_centerMultiKey.isPresent()) {
                        MultiKey multiKey = multiKeyService.add(_centerMultiKey.get(), ImageKey.Center.getKey(cultureCenter.getId().toString() + "." + _centerMultiKey.get().getVs().size()));
                        fileSystemService.save(multiKey.getVs().getLast(), newUrl);
                    } else {
                        MultiKey multiKey = multiKeyService.save(ImageKey.Center.getKey(cultureCenter.getId().toString()), ImageKey.Center.getKey(cultureCenter.getId().toString() + ".0"));
                        fileSystemService.save(multiKey.getVs().getLast(), newUrl);
                    }
                }

            }
            multiKeyService.delete(_multiKey.get());
        }
        Optional<MultiKey> _newMultiKey = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
        MultiKey multiKey = null;
        if (_newMultiKey.isPresent())
            multiKey = _newMultiKey.get();
        return this.centerResponseDTO(cultureCenter, multiKey);
    }

    private CenterResponseDTO centerResponseDTO(CultureCenter cultureCenter, MultiKey multiKey) {
        List<ImageListResponseDTO> imageListResponseDTOS = new ArrayList<>();
        if (multiKey != null) {
            for (String value : multiKey.getVs()) {
                Optional<FileSystem> _fileSystem = fileSystemService.get(value);
                _fileSystem.ifPresent(fileSystem -> imageListResponseDTOS.add(ImageListResponseDTO.builder().key(fileSystem.getK()).value(fileSystem.getV()).build()));
            }
        }
        return CenterResponseDTO.builder()
                .id(cultureCenter.getId())
                .startDate(this.dateTimeTransfer(cultureCenter.getOpenTime()))
                .endDate(this.dateTimeTransfer(cultureCenter.getCloseTime()))
                .type(cultureCenter.getCenterType().toString())
                .createDate(this.dateTimeTransfer(cultureCenter.getCreateDate()))
                .modifyDate(this.dateTimeTransfer(cultureCenter.getModifyDate()))
                .imageListResponseDTOS(imageListResponseDTOS)
                .aptResponseDTO(getAptResponseDTO(cultureCenter.getApt()))
                .build();
    }

    @Transactional
    public CenterResponseDTO getCenter(String username, Long profileId, Long centerId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        CultureCenter cultureCenter = cultureCenterService.findById(centerId);
        if (cultureCenter == null)
            throw new DataNotFoundException("센터 객체 없음");
        Optional<MultiKey> _newMultiKey = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
        return _newMultiKey.map(multiKey -> centerResponseDTO(cultureCenter, multiKey)).orElse(null);
    }

    @Transactional
    public CenterResponseDTO updateCenter(String username, Long profileId, Long id, int type, LocalDateTime
            endDate, LocalDateTime startDate, List<String> key) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        if (user.getRole() == UserRole.USER)
            throw new IllegalArgumentException("권한 불일치");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        CultureCenter cultureCenter = cultureCenterService.findById(id);
        if (cultureCenter == null)
            throw new DataNotFoundException("센터 객체 없음");
        cultureCenterService.update(cultureCenter, type, endDate, startDate);
        Optional<MultiKey> _newMultiKey = multiKeyService.get(ImageKey.TEMP.getKey(username + "." + profile.getId()));
        Optional<MultiKey> _oldMulti = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
        if (_oldMulti.isPresent())
            if (key != null) {
                for (String k : key) {
                    Optional<FileSystem> _fileSystem = fileSystemService.get(k);
                    _fileSystem.ifPresent(fileSystem -> {
                        fileSystemService.delete(fileSystem);
                        _oldMulti.get().getVs().remove(key);
                        deleteFile(_fileSystem.get());
                    });
                }
            }
        if (_newMultiKey.isPresent()) {
            String newFile = "/api/center" + "/" + cultureCenter.getId() + "/";
            for (String values : _newMultiKey.get().getVs()) {
                Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
                Optional<FileSystem> _newFileSystem = fileSystemService.get(values);
                if (_newFileSystem.isPresent()) {
                    String newUrl = this.fileMove(_newFileSystem.get().getV(), newFile, _newFileSystem.get());
                    if (_multiKey.isPresent()) {
                        multiKeyService.add(_multiKey.get(), ImageKey.Center.getKey(cultureCenter.getId().toString() + "." + _multiKey.get().getVs().size()));
                        fileSystemService.save(_multiKey.get().getVs().getLast(), newUrl);
                    } else {
                        MultiKey multiKey = multiKeyService.save(ImageKey.Center.getKey(cultureCenter.getId().toString()), ImageKey.Center.getKey(cultureCenter.getId().toString() + ".0"));
                        fileSystemService.save(multiKey.getVs().getLast(), newUrl);

                    }
                }
            }
            multiKeyService.delete(_newMultiKey.get());
        }
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
        return _multiKey.map(multiKey -> this.centerResponseDTO(cultureCenter, multiKey)).orElse(null);

    }


    @Transactional
    public void deleteCenter(String username, Long profileId, Long centerId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        if (user.getRole() == UserRole.USER)
            throw new IllegalArgumentException("권한 불일치");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        CultureCenter cultureCenter = cultureCenterService.findById(centerId);
        if (cultureCenter == null)
            throw new DataNotFoundException("센터 객체 없음");
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
        if (_multiKey.isPresent()) {
            for (String values : _multiKey.get().getVs()) {
                Optional<FileSystem> _fileSystem = fileSystemService.get(values);
                _fileSystem.ifPresent(fileSystemService::delete);
            }
            multiKeyService.delete(_multiKey.get());
        }
        cultureCenterService.delete(cultureCenter);
    }

    @Transactional
    public List<CenterResponseDTO> getCenterList(String username, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        List<CultureCenter> cultureCenterList = cultureCenterService.getList(user.getApt().getId());
        if (cultureCenterList == null)
            throw new DataNotFoundException("센터 리스트 없음");
        List<CenterResponseDTO> centerResponseDTOS = new ArrayList<>();

        for (CultureCenter cultureCenter : cultureCenterList) {
            Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.Center.getKey(cultureCenter.getId().toString()));
            MultiKey multiKey = null;
            if (_multiKey.isPresent())
                multiKey = _multiKey.get();

            centerResponseDTOS.add(centerResponseDTO(cultureCenter, multiKey));
        }
        return centerResponseDTOS;
    }

    /**
     * Lesson
     */

    @Transactional
    public LessonResponseDTO saveLesson(String username, Long profileId, Long centerId, String name, String content, LocalDateTime startDate, LocalDateTime endDate, LocalDateTime startTime, LocalDateTime endTime) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        CultureCenter cultureCenter = cultureCenterService.findById(centerId);
        if (user.getRole() != UserRole.STAFF)
            throw new IllegalArgumentException("권한 불일치");
        if (cultureCenter == null)
            throw new DataNotFoundException("센터 객체가 없음");
        Lesson lesson = lessonService.save(cultureCenter, profile, name, content, startTime, endTime, startDate, endDate);

        return this.lessonResponseDTO(lesson);
    }


    private LessonResponseDTO lessonResponseDTO(Lesson lesson) {
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.Center.getKey(lesson.getCultureCenter().getId().toString()));
        MultiKey centerMulti = null;
        if (_multiKey.isPresent())
            centerMulti = _multiKey.get();
        Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(lesson.getProfile().getUser().getUsername() + "." + lesson.getProfile().getId()));
        String profileUrl = null;
        if (_fileSystem.isPresent())
            profileUrl = _fileSystem.get().getV();
        return LessonResponseDTO.builder()
                .id(lesson.getId())
                .centerResponseDTO(this.centerResponseDTO(lesson.getCultureCenter(), centerMulti))
                .profileResponseDTO(ProfileResponseDTO.builder().id(lesson.getProfile().getId())
                        .username(lesson.getProfile().getUser().getUsername())
                        .name(lesson.getProfile().getName())
                        .url(profileUrl).build())
                .createDate(this.dateTimeTransfer(lesson.getCreateDate()))
                .modifyDate(this.dateTimeTransfer(lesson.getModifyDate()))
                .name(lesson.getName())
                .content(lesson.getContent())
                .startDate(this.dateTimeTransfer(lesson.getStartDate()))
                .startTime(this.dateTimeTransfer(lesson.getStartTime()))
                .endDate(this.dateTimeTransfer(lesson.getEndDate()))
                .endTime(this.dateTimeTransfer(lesson.getEndTime()))
                .build();
    }

    @Transactional
    public LessonResponseDTO getLesson(String username, Long profileId, Long lessonId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Lesson lesson = lessonService.findById(lessonId);
        if (lesson == null)
            throw new DataNotFoundException("레슨 객체 없음");
        return this.lessonResponseDTO(lesson);
    }

    @Transactional
    public Page<LessonResponseDTO> getLessonPage(String username, Long profileId, int page) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Pageable pageable = PageRequest.of(page, 15);


        Page<Lesson> lessonPage = lessonService.getPage(user.getApt().getId(), pageable);
        if (lessonPage == null)
            throw new DataNotFoundException("레슨 페이지 객체 없음");
        List<LessonResponseDTO> lessonResponseDTOS = new ArrayList<>();
        for (Lesson lesson : lessonPage)
            lessonResponseDTOS.add(this.lessonResponseDTO(lesson));

        return new PageImpl<>(lessonResponseDTOS, pageable, lessonPage.getTotalElements());
    }

    @Transactional
    public LessonResponseDTO updateLesson(String username, Long profileId, Long id, Long centerId, String name, String content, LocalDateTime startDate, LocalDateTime endDate, LocalDateTime startTime, LocalDateTime endTime) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        CultureCenter cultureCenter = cultureCenterService.findById(centerId);
        if (cultureCenter == null)
            throw new DataNotFoundException("센터 객체 없음");
        Lesson lesson = lessonService.findById(id);
        if (lesson == null)
            throw new DataNotFoundException("레슨 객체 없음");
        if (!lesson.getProfile().equals(profile))
            throw new IllegalArgumentException("프로필 불일치");

        Lesson newLesson = lessonService.update(lesson, name, content, startDate, startTime, endDate, endTime);
        return this.lessonResponseDTO(newLesson);
    }

    @Transactional
    public void deleteLesson(String username, Long profileId, Long lessonId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Lesson lesson = lessonService.findById(lessonId);
        if (lesson == null)
            throw new DataNotFoundException("레슨 객체 없음");
        if (!lesson.getProfile().equals(profile))
            throw new IllegalArgumentException("프로필 불일치");
        this.lessonService.delete(lesson);
    }

    /**
     * LessonUser
     */

    @Transactional
    public LessonUserResponseDTO saveLessonUser(String username, Long profileId, Long lessonId, int type) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Lesson lesson = lessonService.findById(lessonId);
        if (lesson == null)
            throw new DataNotFoundException("레슨 객체 없음");
        return lessonUserResponseDTO(lessonUserService.save(lesson,profile,type));
    }

    private LessonUserResponseDTO lessonUserResponseDTO(LessonUser lessonUser) {
        return LessonUserResponseDTO.builder()
                .id(lessonUser.getId())
                .lessonResponseDTO(lessonResponseDTO(lessonUser.getLesson()))
                .type(lessonUser.getLessonStatus().toString())
                .build();
    }

    @Transactional
    public LessonUserResponseDTO getLessonUser(String username, Long profileId, Long lessonUserId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        LessonUser lessonUser = lessonUserService.findById(lessonUserId);
        if (lessonUser == null)
            throw new DataNotFoundException("레슨신청 객체 없음");
        if (!lessonUser.getProfile().equals(profile) && user.getRole() != UserRole.STAFF )
            throw new IllegalArgumentException("권한이 없음");
        return lessonUserResponseDTO(lessonUser);
    }

    @Transactional
    public List<LessonUserResponseDTO> getLessonUserMyList(String username, Long profileId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        List<LessonUser> lessonUserList = lessonUserService.getMyList(profile);
        List<LessonUserResponseDTO> userResponseDTOS = new ArrayList<>();
        for (LessonUser lessonUser : lessonUserList) {
            userResponseDTOS.add(lessonUserResponseDTO(lessonUser));
        }
        return userResponseDTOS;
    }

    @Transactional
    public List<LessonUserResponseDTO> getLessonUserSecurityList(String username, Long profileId, int type, Long lessonId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        Lesson lesson = lessonService.findById(lessonId);
        if (lesson == null)
            throw new DataNotFoundException("레슨 객체 없음");
        if (!lesson.getProfile().equals(profile))
            throw new IllegalArgumentException("레슨 강사 아님");
        List<LessonUser> lessonUserList = lessonUserService.getSecurityList(lesson, type);
        List<LessonUserResponseDTO> userResponseDTOS = new ArrayList<>();
        for (LessonUser lessonUser : lessonUserList) {
            userResponseDTOS.add(lessonUserResponseDTO(lessonUser));
        }
        return userResponseDTOS;
    }

    @Transactional
    public LessonUserResponseDTO updateLessonUser(String username, Long profileId, Long id, int type) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        LessonUser lessonUser = lessonUserService.findById(id);
        if (lessonUser == null)
            throw new DataNotFoundException("레슨신청 객체 없음");
        if (!lessonUser.getProfile().equals(profile) && user.getRole() != UserRole.STAFF )
            throw new IllegalArgumentException("권한이 없음");
        return lessonUserResponseDTO(lessonUserService.update(lessonUser, type));
    }

    @Transactional
    public void deleteLessonUser(String username, Long profileId, Long lessonUserId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(user, profile);
        LessonUser lessonUser = lessonUserService.findById(lessonUserId);
        if (lessonUser == null)
            throw new DataNotFoundException("레슨신청 객체 없음");
        if (!lessonUser.getProfile().equals(profile))
            throw new IllegalArgumentException("신청유저가 아님");
        lessonUserService.delete(lessonUser);
    }

}
