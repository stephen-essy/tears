import { alert } from "./ui.js";
import { AuthStorage } from "./authentication.js";

let connection_status_display = document.getElementById("connection-status");
let stompClient = null;
let connected = false;
const user = AuthStorage.get();
const createEvent = document.getElementById("event-create");

function connectWebSocket() {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);
  stompClient.reconnect_delay = 5000;
  stompClient.debug = (str) => console.log(str);
  stompClient.connect(
    {
      Authorization: `Bearer ${user.token}`,
    },
    () => {
      connected = true;
      connection_status_display.textContent = "connected";
      stompClient.subscribe("/user/topic/event-status", (message) => {
        const stats = JSON.parse(message.body);
        console.log(stats);
      });
      stompClient.subscribe("/topic/event-status", (message) => {
        const stats = JSON.parse(message.body);
        console.log(stats);
      });
    },
    (error) => {
      connected = false;
      connection_status_display.textContent = "Offline";
      console.log(error);
    }
  );
}
function createActivity(e) {
  e.preventDefault();
  let eventName = {
    name: document.getElementById("event-name").value,
    startTime: document.getElementById("startTime").value,
    endTime: document.getElementById("endTime").value,
    date: document.getElementById("date").value,
    location: document.getElementById("location").value,
  };
  if (
    !eventName.name ||
    !eventName.startTime ||
    !eventName.endTime ||
    !eventName.date ||
    !eventName.location
  ) {
    alert("Fill all field", `success`);
    return;
  }
  let beginAt = new Date(`1970-01-01T${eventName.startTime}:00`);
  let endsAt = new Date(`1970-01-01T${eventName.endTime}:00`);

  if (beginAt > endsAt) {
    alert("Time error",`error`)
    return
  }

  alert("moving to greatness",`success`)

  console.log(eventName);
}
connectWebSocket();
createEvent.addEventListener("click", createActivity);
