import { alert } from "./ui.js";
import { AuthStorage, isTokenExpired } from "./authentication.js";

let connection_status_display = document.getElementById("connection-status");
let stompClient = null;
let connected = false;
const user = AuthStorage.get();
const createEvent = document.getElementById("event-create");
const isConnected=document.getElementById("is-connected");


function connectWebSocket() {
  if (!user.token || isTokenExpired(user)) {
    connection_status_display.textContent = "token expired";
    return;
  }
  const socket = new SockJS("http://172.16.17.113:8080/ws");
  stompClient = Stomp.over(socket);
  stompClient.reconnect_delay = 5000;
  stompClient.debug = (str) => console.log(str);
  stompClient.connect(
    {
      Authorization: `Bearer ${user.token}`,
    },
    () => {
      connected = true;
      isConnected.style.background="#4CAF50"
      connection_status_display.textContent = "connected";
      stompClient.subscribe("/topic/event-status", (message) => {
        const stats = JSON.parse(message.body).content;
      });
      stompClient.subscribe("/user/topic/event-stats", (message) => {
        console.log("Raw message:", message.body);
        try {
          const stats = JSON.parse(message.body).content;
          console.log("Parsed stats:", stats);
          const display = document.getElementById("number");
          if (display) {
            display.textContent = stats.accomplished ?? "No data";
          } else {
            console.warn("Element #number not found in DOM");
          }
        } catch (err) {
          console.error("Failed to parse stats:", err);
        }
      });
    },
    (error) => {
      connected = false;
      isConnected.style.background="#f44336"
      connection_status_display.textContent = "offline";
      console.log(error);
    }
  );
}
async function createActivity(e) {
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
    alert("please fill all field", `error`);
    return;
  }
  let beginAt = new Date(`1970-01-01T${eventName.startTime}:00`);
  let endsAt = new Date(`1970-01-01T${eventName.endTime}:00`);

  if (beginAt > endsAt) {
    alert("Time error", `error`);
    return;
  }
  try {
    let request = await fetch("http://172.16.17.113:8080/laughter/event/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(eventName),
    });

    let response = await request.json();
    if (request.ok) {
      alert(`${response.message}`, `success`);
    } else {
      alert(`${response.message}`, `error`);
    }
  } catch (err) {
    alert("Error in processing", `error`);
  }
}
connectWebSocket();
setInterval(() => {
  if (stompClient && stompClient.connected) {
    if (!connected) {
      connected = true;
      isConnected.style.background="#4CAF50"
      connection_status_display.textContent = "Connected";
    }
  } else {
    if (connected) {
      connected = false;
      isConnected.style.background="#f44336"
      connection_status_display.textContent = "Offline";
    }
  }
}, 3000);
createEvent.addEventListener("click", createActivity);
async function fetchEventStats() {
  try {
    const response = await fetch("http://172.16.17.113:8080/laughter/event/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    const stats = await response.json();
    console.log("Fetched stats:", stats);

    const display = document.getElementById("number");
    const ongoing=document.getElementById("ongoing")
    const upcoming=document.getElementById("upcoming")
    if (display) {
      display.textContent = stats.accomplished ?? "No data";
    }
    if(ongoing){
      ongoing.textContent=stats.ongoing;
    }

    if(upcoming){
      upcoming.textContent=stats.upcoming;
    }
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
}
fetchEventStats();
