package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;

import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String>{
	
	@Tailable //커서를 안닫고 계속 유지한다.
	@Query("{sender:?0,receiver:?1}") //cmd 확인하세요
	Flux<Chat> mFindBySender(String sender,String receiver); 
	//Flux(흐름) response를 유지하면서 데이터를 계속 흘려보내기
	//전화를 끊기 전까지는 계속 통화할 수 있게 된 상태임
	//그래서 HTTP프로토콜(X) SSE 프로토콜(O)
}
