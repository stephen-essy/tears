import { alert } from "./ui.js";
import { AuthStorage } from "./authentication.js";
let user = AuthStorage.get();
let name = user.name;
document.getElementById("exit-button").addEventListener("click", () => {
  alert("Hello there", `success`);
});

let userBadge = document.getElementById("name");
userBadge.textContent = name;

let stompClient = null;
let connected = false;

function connectWebSocket() {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.reconnect_delay = 5000; // Auto-reconnect delay
  stompClient.debug = (str) => console.log(str); // Optional debug logs

  stompClient.connect(
    { Authorization: `Bearer ${user.token}` },
    () => {
      connected = true;
      console.log("✅ WebSocket connected");

      stompClient.subscribe("/user/topic/event-stats", (message) => {
        const stats = JSON.parse(message.body);
        updateStatsUI(stats);
      });

      stompClient.subscribe("/topic/event-status", (message) => {
        const updatedEvent = JSON.parse(message.body);
        updateTimelineUI(updatedEvent);
      });
    },
    (error) => {
      connected = false;
      console.error("❌ WebSocket connection failed:", error);
      showConnectionStatus("Disconnected");
      // Optional: retry manually or wait for auto-reconnect
    }
  );
}

function showConnectionStatus(status) {
  const statusElement = document.getElementById("ws-status");
  if (statusElement) {
    statusElement.textContent = status;
    statusElement.style.color = status === "Connected" ? "green" : "red";
  }
}

// Monitor connection state every few seconds
setInterval(() => {
  if (stompClient && stompClient.connected) {
    if (!connected) {
      connected = true;
      showConnectionStatus("Connected");
    }
  } else {
    if (connected) {
      connected = false;
      showConnectionStatus("Disconnected");
    }
  }
}, 3000);

// Start connection
connectWebSocket();
