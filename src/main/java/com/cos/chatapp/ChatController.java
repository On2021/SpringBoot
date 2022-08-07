package com.cos.chatapp;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RequiredArgsConstructor
@RestController //데이터 리턴 서버
public class ChatController {

	private final ChatRepository chatRepository;
	
	//귓속말 할 때 사용하면 되요!
	//SSE프로토콜 : 데이터를 요청 받으면 계속 지속적으로 데이터를 보내줄 수 있습니다. (Response선이 끊기지 않고 데이터 전송 가능) => return 타입 Flux
	@CrossOrigin //js가 적용된 대로 웹페이지에서 출력되게 하고싶어용
	@GetMapping(value = "/sender/{sender}/receiver/{receiver}",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<Chat> getMsg(@PathVariable String sender, @PathVariable String receiver) { //데이터 여러개 리턴할거면 Flux
		return chatRepository.mFindBySender(sender, receiver)
				.subscribeOn(Schedulers.boundedElastic());
	}
	
	//방에서 같이 채팅, 일단 채팅 내역 모두 다 받아야함
	@CrossOrigin
	@GetMapping(value = "/chat/roomNum/{roomNum}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<Chat> findByRoomNum(@PathVariable Integer roomNum) { 
		return chatRepository.mFindByRoomNum(roomNum)
				.subscribeOn(Schedulers.boundedElastic());
	}
	
	@CrossOrigin
	@PostMapping("/chat")
	public Mono<Chat> setMsg(@RequestBody Chat chat){ //데이터 한건 리턴할거면 Mono / void 사용해도 됨 => 근데 save 데이터 잘 들어오는지 확인하고 싶어서 이렇게 작성함
		chat.setCreatedAt(LocalDateTime.now());
		return chatRepository.save(chat); //object를 리턴하면 자동으로 JSON 변환 (MessageConverter)
		//(<S extends T> Mono<S> save(S entity); Mono타입으로 변환) => Mono타입은 데이터 1건 리턴, Flux타입은 데이터 여러건 리턴
	}
}
