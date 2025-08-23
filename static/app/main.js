import { AuthStorage } from "./authentication.js";
const user = AuthStorage.get();
let name = user.name;
const user_name_display = document.getElementById("logo-name");
let button_to_webSocket=document.getElementById('connect')
let stompClient = null;
if (name) {
  user_name_display.innerHTML = name;
}
function connect() {
  const socket = new SockJS("http://172.16.130.195:8080/laughter");
  stompClient = Stomp.over(socket);
  stompClient.connect(
    {},
    (frame) => {
      console.log("Connected :" + frame);
      document.getElementById("status").innerText = "Connected !";
    },
    (error) => {
      console.log("Connection error :" + error);
      document.getElementById("status").innerText = "connection failed !";
    }
  );
}
button_to_webSocket.addEventListener('click',connect)
