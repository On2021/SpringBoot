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

function getMsg(msg){
    return `<div class="sent_msg">
    <p>${msg}</p>
    <span class="time_date"> 11:18 | Today</span>
</div>`;
}


document.querySelector("#chat-send").addEventListener("click", () => {
    //alert("클릭됨")
    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");
    //alert(msgInput.value);
    
    //chatBox.append("<div>안녕</div>");
    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
    //chatOutgoingBox.innerHTML = "안녕";
    chatOutgoingBox.innerHTML = getMsg(msgInput.value);
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    //alert("클릭됨")
    //console.log(e.keyCode);
    if(e.keyCode === 13){
    //alert("엔터 요청됨");
    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");
    
    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
   
    chatOutgoingBox.innerHTML = getMsg(msgInput.value);
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
    }
});