package com.cos.chatapp;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

//STS툴에 lombok 설정하는 법 (인터넷 찾아보기) => OK
@Data
@Document(collection = "chat")
public class Chat {
	@Id
	private String id;
	private String msg; //메세지
	private String sender; //보내는 사람
	private String receiver; //받는 사람 (귓속말 기능때문에 일단 남겨둠)
	private Integer roomNum; //방 번호 (같은 방에 있으면 같은 내용을 볼 수 있음)
	//솔직히 받는 사람은 굳이 필요 없음 => 보내는 사람이 어떤 방에 내용을 보내는지가 중요함
	
	
	private LocalDateTime createdAt;
}
