const eventSource = new EventSource("http://localhost:8080/sender/ssar/receiver/cos");

eventSource.onmessage = (event) => {
    console.log(1,event);
    const data = JSON.parse(event.data);
    console.log(2,data);
    initMessage(data); //메시지 내용과 시간을 받아야해서 data
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

function getSendMsgBox(msg,time){ //메시지와 시간을 받아야합니다
    return `<div class="sent_msg">
    <p>${msg}</p>
    <span class="time_date"> ${time}</span>
</div>`;
}

function initMessage(data){ //메시지 내용과 시간을 받아야해서 data
    let chatBox = document.querySelector("#chat-box"); //메세지전송영역
    let msgInput = document.querySelector("#chat-outgoing-msg"); //보낸메시지
    
    
    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
    
    //자바스크립트 파싱해서 시간+날짜 출력형태 만들기
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md
    chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, convertTime); //메시지내용+시간
    //chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, data.createdAt); //메시지내용+시간

    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}

function addMessage(){ //재사용할 수 있게 함수로 만들어버리자~!
    let chatBox = document.querySelector("#chat-box"); //메세지전송영역
    let msgInput = document.querySelector("#chat-outgoing-msg"); //보낸메시지
    
    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
   
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

    //메시지를 받습니다.
    chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value,now);
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}


document.querySelector("#chat-send").addEventListener("click", () => {
    //alert("클릭됨")
    addMessage();
});

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