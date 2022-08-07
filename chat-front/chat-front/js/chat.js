//강제로 프롬프트 받음
//로그인 시스템 대신 임시 방편
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

//SSE 연결하기
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`); //roomNum을 받아줘야함
//const eventSource = new EventSource("http://localhost:8080/sender/ssar/receiver/cos");

eventSource.onmessage = (event) => {
    //console.log(1,event);
    const data = JSON.parse(event.data);
    //console.log(2,data);

    if(data.sender === username){ //로그인한 유저가 보낸 메시지
        //파란박스(오른쪽)
        initMyMessage(data);
    }else{
        //회색박스(왼쪽)
        initYourMessage(data);
    }

    //initMessage(data); //메시지 내용과 시간을 받아야해서 data
}

//보낸메시지 시작
/*
<div class="outgoing_msg">
  <div class="sent_msg">
    <p>Lorem Ipsum refers to text that the DTP (Desktop Publishing) industry use as replacement text when
      the real text is not </p>
    <span class="time_date"> 11:18 | Today</span>
  </div>
</div>
*/

/*
function getSendMsgBox(msg,time){ //메시지와 시간을 받아야합니다
    return `<div class="sent_msg">
    <p>${msg}</p>
    <span class="time_date"> ${time}</span>
</div>`;
}
*/

//파란박스 작업
function getSendMsgBox(data){
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `<div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
</div>`;
}

//회색박스 작업
function getReceiveMsgBox(data){
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `<div class="received_withd_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
</div>`;
}

//최초 초기화될 때 1번방 3건이 있으면 3건 내용을 다 가져와요
//addMessage() 함수 호출시 DB에 INSERT되고, 그 데이터가 자동으로 흘러들어온다(SSE) => append 적용됨
//메시지 파란박스 초기화하기 + 이벤트 계속 작업
function initMyMessage(data){ //메시지 내용과 시간을 받아야해서 data => 파란박스
    let chatBox = document.querySelector("#chat-box"); //메세지전송영역
    //let msgInput = document.querySelector("#chat-outgoing-msg"); //보낸메시지
    
    let sendBox = document.createElement("div");
    sendBox.className = "outgoing_msg";
    
    /*
    //자바스크립트 파싱해서 시간+날짜 출력형태 만들기
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md
    */

    sendBox.innerHTML = getSendMsgBox(data);
    //chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, convertTime); //메시지내용+시간
    //chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, data.createdAt); //메시지내용+시간

    chatBox.append(sendBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
    //msgInput.value = "";
}

//메시지 회색박스 초기화하기 + 이벤트 계속 작업
function initYourMessage(data){ //회색박스
    let chatBox = document.querySelector("#chat-box");
  
    let receivedBox = document.createElement("div");
    receivedBox.className = "received_withd_msg";
    
    receivedBox.innerHTML = getReceiveMsgBox(data);

    chatBox.append(receivedBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
}

//AJAX 채팅 메시지 전송
//전송버튼 or 엔터치면 정보나와요
//fetch 통신이 원활하게 진행될 수 있도록 비동기형식으로 바꿔줍니다!
async function addMessage(){ //재사용할 수 있게 함수로 만들어버리자~!
    //let chatBox = document.querySelector("#chat-box"); //메세지전송영역
    let msgInput = document.querySelector("#chat-outgoing-msg"); //보낸메시지
    
    //let chatOutgoingBox = document.createElement("div");
    //chatOutgoingBox.className = "outgoing_msg";
   
    /*
    //시간을 받습니다
    let date = new Date();
    //let now = date.getHours()+":"+date.getMinutes()+" | "+ (date.getMonth()+1) +"-"+date.getDate();
    //month = 월 date = 날짜 day = 요일(숫자로 뜸)
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let month = date.getMonth()+1;
    let monthF = month < 10 ? "0"+month : month;
    let date2 = date.getDate();
    let date2F = date2 < 10 ? "0"+date2 : date2;
    let now = hours + ":" + minutes + " | " + monthF + "-" + date2F;
    */

    let chat = {
        sender:username,
        //receiver:"cos",
        roomNum:roomNum,
        msg: msgInput.value
    }

    //통신(fetch) => return은 서버쪽에서 DB에 save된 그 오브젝트를 돌려줘 (Mono타입)
    //Mono타입은 1건, Flux는 여러건 리턴해줌
    //let response = fetch("http://localhost:8080/chat",{  //이렇겐 사용불가
    //fetch가 통신이기 때문에 소요 시간이 걸림 => response에 null값이 리턴됨 > 그리고 코드 위에서 아래로 진행됨
    //그래서 fetch 통신이 끝날때까지 기다려줘야함 근데 기다려주면 블럭당함 > 다른 모든것들이 동작하지 않게됨 > 그래서!! 함수 자체를 비동기형식으로 바꿔줘야함 (47행-48행참고)
    //let response = await fetch("http://localhost:8080/chat",{
    fetch("http://localhost:8080/chat",{
        method:"post", //http post 메서드 (새로운 데이터를 write) "내가 데이터 보낼거니까 너는 DB에 보낸 데이터를 저장해~!"
        body: JSON.stringify(chat), //chat에 js 파일로 데이터 전송불가, JSON으로 작업해서 전송해줘야함
        headers:{
            "Content-Type":"application/json; charset=utf-8"
        }
    });
    //addMessage에서는 db에 값만 받아주면 됨 (날짜 등은 db에서 자동으로 다 가져옴)

    //mime타입 >> https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    //mime타입 전체목록 >> https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

    //응답받은 데이터를 콘솔창에 찍어볼게용
    //console.log(response);
    
    //파싱에 방법이 2가지 있습니다.
    //let parseResponse = response.text();
    //let parseResponse = await response.json(); //상대방의 응답을 json으로 받았기 때문에 이렇게 작성함 + 기다렸다가 작업해야해서 await
    //console.log(parseResponse);

    //메시지를 받습니다.
    //chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value,now);
    //chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}

//버튼 클릭시 메시지 전송
document.querySelector("#chat-send").addEventListener("click", () => {
    //alert("클릭됨")
    addMessage();
});

//엔터 치면 메시지 전송
document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    //alert("클릭됨")
    //console.log(e.keyCode);
    if(e.keyCode === 13){
    //alert("엔터 요청됨");
        addMessage();
    /*
    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");
    
    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
   
    chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value);
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
    */
    }
});