package com.cos.chatapp;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data //STS툴에 lombok 설정하는 법 (인터넷 찾아보기)
@Document(collation = "chat")
public class Chat {
	@Id
	private String id;
	private String msg; //메세지
	private String sender; //보내는 사람
	private String reciver; //받는 사람
	
	private LocalDateTime createdAT;
}
