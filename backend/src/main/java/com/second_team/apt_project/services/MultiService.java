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
    private void userCheck(String username, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
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
                .build();
    }

    @Transactional
    public UserResponseDTO saveUser(String name, String password, String email, int aptNumber, int role, Long aptId, String username) {
        SiteUser user = userService.get(username);
        Apt apt = aptService.get(aptId);
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SECURITY)
            throw new IllegalArgumentException("권한 불일치");
        if (email != null)
            userService.userEmailCheck(email);
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
                    if (j < 10)
                        jKey = "0" + jKey;
                    String name = String.valueOf(aptNum) + String.valueOf(i) + jKey;
                    SiteUser _user = userService.saveGroup(name, aptNum, apt);
                    userResponseDTOList.add(UserResponseDTO.builder()
                            .username(_user.getUsername())
                            .aptNum(_user.getAptNum())
                            .aptResponseDto(this.getAptResponseDTO(apt))
                            .build());
                }
            return userResponseDTOList;
        } else
            throw new IllegalArgumentException("권한 불일치");
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
            if (apt == null)
                throw new DataNotFoundException("apt not data");
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
        if (apt == null)
            throw new DataNotFoundException("apt not data");
        return this.getUserResponseDTO(user1, apt);
    }


    @Transactional
    public UserResponseDTO updateUser(String username, String email) {
        SiteUser user = userService.get(username);
        if (!user.getUsername().equals(username)) throw new IllegalArgumentException("로그인 유저와 불일치");
        if (email != null)
            userService.userEmailCheck(email);

        SiteUser siteUser = userService.update(user, email);
        Apt apt = aptService.get(siteUser.getApt().getId());
        if (apt == null)
            throw new DataNotFoundException("apt not data");
        return this.getUserResponseDTO(siteUser, apt);
    }



    @Transactional
    public UserResponseDTO getUser(String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        return this.getUserResponseDTO(user, user.getApt());
    }



    /**
     * Apt
     */

    private AptResponseDTO getAptResponseDTO(Apt apt) {
        if (apt == null)
            return null;
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
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
        Apt apt = aptService.save(roadAddress, aptName, x, y);
        return this.getAptResponseDTO(apt);
    }

    @Transactional
    public AptResponseDTO updateApt(Long profileId, Long aptId, String roadAddress, String aptName, String url, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        Apt apt = aptService.get(aptId);

        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
        aptService.update(apt, roadAddress, aptName);
        Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.APT.getKey(apt.getId().toString()));
        String path = AptProjectApplication.getOsType().getLoc();
        if (_fileSystem.isPresent() && (url == null || !_fileSystem.get().getV().equals(url))) {
            File old = new File(path + _fileSystem.get().getV());
            if (old.exists()) old.delete();
        }
        if (url != null && !url.isBlank()) {
            String newFile = "/api/apt/" + aptId.toString() + "/";
            Optional<FileSystem> _newFileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username + "." + profile.getId()));
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
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
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
        if (user.getRole() != UserRole.ADMIN) throw new IllegalArgumentException("권한 불일치");
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
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        if (!fileUrl.isEmpty()) {
            try {
                String path = AptProjectApplication.getOsType().getLoc();
                Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.TEMP.getKey(username + "." + profile.getId()));
                if (_fileSystem.isPresent()) {
                    FileSystem fileSystem = _fileSystem.get();
                    File file = new File(path + fileSystem.getV());
                    if (file.exists())
                        file.delete();
                    fileSystemService.delete(_fileSystem.get());

                }
                UUID uuid = UUID.randomUUID();
                String fileLoc = "/api/user" + "/" + username + "/temp/" + profile.getId() + "/" + uuid + "." + fileUrl.getContentType().split("/")[1];
                fileSystemService.save(ImageKey.TEMP.getKey(username + "." + profile.getId()), fileLoc);

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
    public ImageResponseDTO tempUploadProfile(MultipartFile fileUrl, String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
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
                fileSystemService.save(ImageKey.TEMP.getKey(username), fileLoc);

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
            throw new DataNotFoundException("유저 객체 없음");
        if (!fileUrl.isEmpty()) {
            try {
                String path = AptProjectApplication.getOsType().getLoc();
                UUID uuid = UUID.randomUUID();
                Profile profile = profileService.findById(profileId);
                if (profile == null)
                    throw new DataNotFoundException("프로필 객체 없음");
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
            if (file.getParentFile().list().length == 1)
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
        this.userCheck(username, profileId);
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId().toString()));
        String path = AptProjectApplication.getOsType().getLoc();
        if (_multiKey.isPresent())
            for (String value : _multiKey.get().getVs()) {
                Optional<FileSystem> _fileSystem = fileSystemService.get(value);
                if (_fileSystem.isPresent()) {
                    File file = new File(path + _fileSystem.get().getV());
                    if (file.getParentFile().list().length == 1)
                        this.deleteFolder(file.getParentFile());
                    else
                        file.delete();
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
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
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
                    .username(user.getUsername())
                    .url(url)
                    .name(profile.getName()).build();
        }
        return null;
    }

    @Transactional
    public ProfileResponseDTO getProfile(Long profileId, String username) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(username, profileId);
        Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(user.getUsername() + "." + profile.getId()));
        String url = null;
        if (_fileSystem.isPresent())
            url = _fileSystem.get().getV();
        return ProfileResponseDTO.builder()
                .id(profile.getId())
                .name(profile.getName())
                .url(url)
                .username(user.getUsername()).build();

    }

    @Transactional
    public List<ProfileResponseDTO> getProfileList(String username) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        List<ProfileResponseDTO> responseDTOList = new ArrayList<>();
        List<Profile> profileList = profileService.findProfilesByUserList(user);
        if (profileList == null)
            throw new DataNotFoundException("프로필 객체 없음");
        for (Profile profile : profileList) {
            Optional<FileSystem> _fileSystem = fileSystemService.get(ImageKey.USER.getKey(user.getUsername() + "." + profile.getId()));
            String url = null;
            if (_fileSystem.isPresent())
                url = _fileSystem.get().getV();
            responseDTOList.add(ProfileResponseDTO.builder()
                    .id(profile.getId())
                    .url(url)
                    .username(profile.getUser().getUsername())
                    .name(profile.getName()).build());
        }
        return responseDTOList;
    }

    @Transactional
    public ProfileResponseDTO updateProfile(String username, String url, String name, Long profileId) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(username, profileId);
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

    private String profileUrl(String username, Long id) {
        Optional<FileSystem> _profileFileSystem = fileSystemService.get(ImageKey.USER.getKey(username + "." + id));
        String profileUrl = null;
        if (_profileFileSystem.isPresent())
            profileUrl = _profileFileSystem.get().getV();
        return profileUrl;
    }

    /**
     * Category
     */

    @Transactional
    public CategoryResponseDTO saveCategory(String username, String name, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("권한 불일치");
        Category category = this.categoryService.save(name);
        return categoryResponseDTO(category);

    }

    @Transactional
    public void deleteCategory(Long categoryId, String username, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        if (user.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("권한 불일치");
        Category category = categoryService.findById(categoryId);
        if (category == null)
            throw new DataNotFoundException("카테고리 객체 없음");

        categoryService.delete(category);
    }


    /**
     * Article
     */
    @Transactional
    public ArticleResponseDTO saveArticle(Long profileId, Long categoryId, List<Long> tagId, String title, String content, String username, Boolean topActive) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(username, profileId);
        Category category = categoryService.findById(categoryId);
        if (category == null)
            throw new DataNotFoundException("카테고리 객체 없음");
        Article article = articleService.save(profile, title, content, category, topActive);
        List<TagResponseDTO> tagResponseDTOList = new ArrayList<>();
        for (Long id : tagId){
            Tag tag =tagService.findById(id);
            if(tag == null)
                throw new DataNotFoundException("태그 객체 없음");
            articleTagService.save(article, tag);
            tagResponseDTOList.add(tagResponseDTO(tag));
        }
        List<Love> loveList = loveService.findByArticle(article.getId());
        if (loveList == null)
            throw new DataNotFoundException("게시물 좋아요 객체 없음");
        int loveCount = loveList.size();
        List<Comment> commentList = commentService.getComment(article.getId());
        if (commentList == null)
            throw new DataNotFoundException("댓글 객체 없음");
        List<CommentResponseDTO> commentResponseDTOList = new ArrayList<>();
        for (Comment comment : commentList) {
            CommentResponseDTO commentResponseDTO = this.commentResponseDTO(comment, comment.getProfile());
            commentResponseDTOList.add(commentResponseDTO);
        }
        String profileUrl = this.profileUrl(user.getUsername(), profile.getId());
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId().toString()));
        _multiKey.ifPresent(multiKey -> this.updateArticleContent(article, multiKey));
        return this.getArticleResponseDTO(article, profileUrl, tagResponseDTOList, loveCount, commentResponseDTOList);
    }


    @Transactional
    public ArticleResponseDTO updateArticle(Long profileId, Long articleId, Long categoryId, List<Long> tagId, String title, String content, String username, Boolean topActive) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(username, profileId);
        Category category = categoryService.findById(categoryId);
        if (category == null)
            throw new DataNotFoundException("카테고리 객체 없음");
        Article targetArticle = articleService.findById(articleId);
        if (profile != targetArticle.getProfile())
            throw new IllegalArgumentException("수정 권한 없음");
        Article article = articleService.update(targetArticle, title, content, category, topActive);
        List<TagResponseDTO> tagResponseDTOList = new ArrayList<>();
        for (Long id : tagId){
            Tag tag =tagService.findById(id);
            if(tag == null)
                throw new DataNotFoundException("태그 객체 없음");
            articleTagService.save(article, tag);
            tagResponseDTOList.add(tagResponseDTO(tag));
        }
        List<Love> loveList = loveService.findByArticle(article.getId());
        if (loveList == null)
            throw new DataNotFoundException("게시물 좋아요 객체 없음");
        int loveCount = loveList.size();
        List<Comment> commentList = commentService.getComment(article.getId());
        if (commentList == null)
            throw new DataNotFoundException("댓글 객체 없음");
        List<CommentResponseDTO> commentResponseDTOList = new ArrayList<>();
        for (Comment comment : commentList) {
            CommentResponseDTO commentResponseDTO = this.commentResponseDTO(comment, comment.getProfile());
            commentResponseDTOList.add(commentResponseDTO);
        }
        String profileUrl = this.profileUrl(user.getUsername(), profile.getId());
        Optional<MultiKey> _multiKey = multiKeyService.get(ImageKey.TEMP.getKey(user.getUsername() + "." + profile.getId().toString()));
        _multiKey.ifPresent(multiKey -> this.updateArticleContent(article, multiKey));
        return this.getArticleResponseDTO(article, profileUrl, tagResponseDTOList, loveCount, commentResponseDTOList);
    }

    @Transactional
    public ArticleResponseDTO articleDetail(Long articleId, Long profileId, String username) {
        SiteUser user = userService.get(username);
        Profile profile = profileService.findById(profileId);
        this.userCheck(username, profileId);
        Article article = articleService.findById(articleId);
        if (article == null)
            throw new DataNotFoundException("게시물 객체 없음");
        List<ArticleTag> articleTagList = articleTagService.getArticle(article);
        if (articleTagList == null)
            throw new DataNotFoundException("게시물태그 객체 없음");
        List<TagResponseDTO> responseDTOList = new ArrayList<>();
        for (ArticleTag articleTag : articleTagList) {
            Tag tag = tagService.findById(articleTag.getTag().getId());
            responseDTOList.add(tagResponseDTO(tag));
        }
        List<Love> loveList = loveService.findByArticle(article.getId());
        if (loveList == null)
            throw new DataNotFoundException("게시물 좋아요 객체 없음");
        int loveCount = loveList.size();
        List<Comment> commentList = commentService.getComment(article.getId());
        if (commentList == null)
            throw new DataNotFoundException("댓글 객체 없음");
        List<CommentResponseDTO> commentResponseDTOList = new ArrayList<>();
        for (Comment comment : commentList) {
            CommentResponseDTO commentResponseDTO = this.commentResponseDTO(comment, comment.getProfile());
            commentResponseDTOList.add(commentResponseDTO);
        }
        String profileUrl = this.profileUrl(user.getUsername(), profile.getId());
        return this.getArticleResponseDTO(article, profileUrl, responseDTOList, loveCount, commentResponseDTOList);
    }

    @Transactional
    public Page<ArticleResponseDTO> articleList(String username, int page, Long profileId, Long categoryId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Pageable pageable = PageRequest.of(page, 20);
        Page<Article> articleList = articleService.getArticleList(pageable, user.getApt().getId(), categoryId);
        List<ArticleResponseDTO> articleResponseDTOList = new ArrayList<>();
        for (Article article : articleList) {
            List<ArticleTag> articleTagList = articleTagService.getArticle(article);
            if (articleTagList == null)
                throw new DataNotFoundException("게시물태그 객체 없음");
            List<TagResponseDTO> responseDTOList = new ArrayList<>();
            for (ArticleTag articleTag : articleTagList) {
                Tag tag = tagService.findById(articleTag.getTag().getId());
                responseDTOList.add(tagResponseDTO(tag));
            }
            List<Love> loveList = loveService.findByArticle(article.getId());
            if (loveList == null)
                throw new DataNotFoundException("게시물 좋아요 객체 없음");
            int loveCount = loveList.size();
            List<Comment> commentList = commentService.getComment(article.getId());
            if (commentList == null)
                throw new DataNotFoundException("댓글 객체 없음");
            List<CommentResponseDTO> commentResponseDTOList = new ArrayList<>();
            for (Comment comment : commentList) {
                CommentResponseDTO commentResponseDTO = this.commentResponseDTO(comment, comment.getProfile());
                commentResponseDTOList.add(commentResponseDTO);
            }
            String profileUrl = this.profileUrl(user.getUsername(), profile.getId());
            ArticleResponseDTO articleResponseDTO = this.getArticleResponseDTO(article, profileUrl, responseDTOList, loveCount, commentResponseDTOList);
            articleResponseDTOList.add(articleResponseDTO);
        }
        return new PageImpl<>(articleResponseDTOList, pageable, articleList.getTotalElements());
    }

    private ArticleResponseDTO getArticleResponseDTO(Article article, String profileUrl, List<TagResponseDTO> responseDTOList, int loveCount, List<CommentResponseDTO> commentResponseDTOList) {
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
                        .name(article.getProfile().getName()).build())
                .tagResponseDTOList(responseDTOList)
                .topActive(article.getTopActive())
                .commentResponseDTOList(commentResponseDTOList)
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
                    fileSystemService.save(multiKey1.getVs().getLast(), newUrl);
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
     * Comment
     */

    @Transactional
    private CommentResponseDTO commentResponseDTO(Comment comment, Profile profile) {
        return CommentResponseDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .articleId(comment.getArticle().getId())
                .profileResponseDTO(ProfileResponseDTO.builder()
                        .id(profile.getId())
                        .name(profile.getName())
                        .url(profileUrl(profile.getName(), profile.getId()))
                        .username(profile.getUser().getUsername())
                        .build())
                .createDate(this.dateTimeTransfer(comment.getCreateDate()))
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .build();
    }

    @Transactional
    public CommentResponseDTO saveComment(String username, Long articleId, Long parentId, Long profileId, String content) {
        this.userCheck(username, profileId);
        Profile profile = profileService.findById(profileId);
        Article article = articleService.findById(articleId);
        if (article == null)
            throw new DataNotFoundException("게시물 객체 없음");
        Comment comment = commentService.saveComment(article, profile, content, parentId);
        if (comment.getParent().getArticle().getId() != article.getId())
            throw new DataNotFoundException("부모 댓글의 게시글 객체와 해당 게시글 객체가 다름");
        return this.commentResponseDTO(comment, profile);
    }

    /**
     * Love
     */


    @Transactional
    public void saveLove(String username, Long articleId, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Article article = articleService.findById(articleId);
        if (article == null )
            throw new DataNotFoundException("게시물 객체 없음");
        loveService.save(article, profile);

    }

    @Transactional
    public void deleteLove(String username, Long articleId, Long profileId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Article article = articleService.findById(articleId);
        if (article == null )
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
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Tag tag = tagService.findByName(name);
        if (tag == null)
            tag = tagService.save(name);
        return this.tagResponseDTO(tag);
    }

    @Transactional
    public TagResponseDTO getTag(String username, Long profileId, Long tagId) {
        SiteUser user = userService.get(username);
        if (user == null)
            throw new DataNotFoundException("유저 객체 없음");
        Profile profile = profileService.findById(profileId);
        if (profile == null)
            throw new DataNotFoundException("프로필 객체 없음");
        Tag tag = tagService.findById(tagId);
        if (tag == null)
            throw new DataNotFoundException("태그 객체 없음");
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
