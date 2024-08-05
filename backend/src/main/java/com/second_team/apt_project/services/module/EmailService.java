package com.second_team.apt_project.services.module;

import com.second_team.apt_project.configs.EmailHandler;
import com.second_team.apt_project.dtos.EmailRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private static final String FROM_ADDRESS = "2ndsprout@gmail.com";

    public void mailSend(EmailRequestDTO emailRequestDTO) {
        try {
            EmailHandler mailHandler = new EmailHandler(javaMailSender);
            mailHandler.setFrom(FROM_ADDRESS);
            mailHandler.setTo(emailRequestDTO.getTo());
            mailHandler.setSubject("꿀단지 서비스 사용승인 확인 바랍니다.");
            String aptId = emailRequestDTO.getFirst().split("_")[0];
            String htmlContent =
                    "<!DOCTYPE html>" +
                            "<html lang=\"en\">" +
                            "<head>" +
                            "<meta charset=\"UTF-8\">" +
                            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                            "<style>" +
                            ".email-content {" +
                            "font-family: Arial, sans-serif;" +
                            "line-height: 1.6;" +
                            "text-align: center;" +
                            "font-size: 24px;" +
                            "}" +
                            ".email-header {" +
                            "background-color: #f2f2f2;" +
                            "padding: 20px;" +
                            "color: orange;" +
                            "text-align: center;" +
                            "font-size: 36px;" +
                            "font-weight: bold;" +
                            "}" +
                            ".email-body {" +
                            "padding: 20px;" +
                            "font-weight: normal;" +
                            "}" +
                            ".email-footer {" +
                            "background-color: #f2f2f2;" +
                            "padding: 20px;" +
                            "text-align: center;" +
                            "font-size: 12px;" +
                            "}" +
                            ".button {" +
                            "display: inline-block;" +
                            "padding: 10px 20px;" +
                            "margin: 10px 0;" +
                            "text-decoration: none;" +
                            "color: white;" +
                            "background-color: #007BFF;" +
                            "border-radius: 5px;" +
                            "}" +
                            ".highlight {" +
                            "color: orange;" +  // 주황색으로 강조
                            "font-weight: normal;" +  // 굵게 하지 않음
                            "}" +
                            ".highlight-value {" +
                            "color: black;" +  // 검정색으로 텍스트 색상 설정
                            "font-weight: normal;" +  // 굵게 하지 않음
                            "}" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "<div class=\"email-content\">" +
                            "<div class=\"email-header\">" +
                            "꿀단지 서비스 <span class=\"highlight-value\">사용승인 완료!</span>" +
                            "</div>" +
                            "<div class=\"email-body\">" +
                            "<p class=\"highlight\">아파트 이름: <span class=\"highlight-value\">" + emailRequestDTO.getAptName() + "</span></p>" +
                            "<p class=\"highlight\">도로명 주소: <span class=\"highlight-value\">" + emailRequestDTO.getRoadAddress() + "</span></p>" +
                            "<p class=\"highlight\">입주민 계정 수 : <span class=\"highlight-value\">" + emailRequestDTO.getTotalUserCount() + "</span></p>" +
                            "<p class=\"highlight\">첫번째 동 첫번째 호 계정명 : <span class=\"highlight-value\">" + emailRequestDTO.getFirst() + "</span></p>" +
                            "<p class=\"highlight\">마지막 동 마지막 호 계정명 : <span class=\"highlight-value\">" + emailRequestDTO.getLast() + "</span></p>" +
                            "<p class=\"highlight-value\">계정명에서 첫번째 _(언더바) 앞자리가 해당 아파트 ID입니다. 뒷자리는 동,호수 입니다.</p>" +
                            "<p class=\"highlight\">관리자 계정명 : <span class=\"highlight-value\"> " + aptId + "_security</span></p>" +
                            "<p class=\"highlight\">관리자 비밀번호 : <span class=\"highlight-value\"> security" + aptId + "</span></p>" +
                            "<p>자세한 내용을 확인하려면 아래 버튼을 클릭하세요:</p>" +
                            "<a href=\"https://example.com\" class=\"button\">자세히 보기</a>" +
                            "<p>감사합니다!</p>" +
                            "</div>" +
                            "<div class=\"email-footer\">" +
                            "&copy; 2024 HoneyDanji Service. All rights reserved." +
                            "</div>" +
                            "</div>" +
                            "</body>" +
                            "</html>";

            mailHandler.setText(htmlContent, true);
            mailHandler.send();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
