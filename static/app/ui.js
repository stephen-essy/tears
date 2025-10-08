import { AuthStorage } from "./authentication.js";
const user = AuthStorage.get();
const logOutButton=document.getElementById("sign-out");
$(document).ready(() => {
  let isDark = true;
  let theme = $(".dark");
  let themeButton = $("#theme-toogle").on("click", (e) => {
    isDark = !isDark;
    if (!isDark) {
      $("#current-theme").text("dark theme");
      theme.removeClass("dark").addClass("light");
    } else {
      $("#current-theme").text("light theme");
      theme.removeClass("light").addClass("dark");
    }
  });
});
export function alert(message, type) {
  const popup = document.getElementById("alert-popup");
  const popupMessage = document.getElementById("popup-message");
  const popupIcon = document.getElementById("popup-icon");
  const icon = document.getElementById("popup-icon-icon");

  if (!popup || !popupIcon || !popupMessage) return;
  if (type === "error") {
    icon.classList.remove("fa-check");
    icon.classList.add("fa-xmark");
    icon.style.background = "#f44336";
  }
  popupMessage.innerText = message;
  popup.className = `alert-popup alert-${type} show`;
  setTimeout(() => {
    popup.classList.remove("show");
    popupMessage.textContent = "";
  }, 3000);
}
export function updateClock() {
  const clock = document.getElementById("time-display");
  if (!clock) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  clock.textContent = timeString;
}

export function showDay() {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = new Date();
  const todayIndex = today.getDay();
  const dayShow = document.getElementById("day-display");
  if (!dayShow) return;
  dayShow.textContent = `${days[todayIndex]}`;
}

export function showUserName() {
  const badgeName = document.getElementById("user-name");
  const name = user.name;
  if (!badgeName || !name) return;
  badgeName.textContent = name;
}

export function showUserProfile() {
  const name = document.getElementById("name");
  const uni = document.getElementById("uni");
  const prog = document.getElementById("corse");
  const phone = document.getElementById("phone");

  if (!name || !uni || !prog || !phone) return;
  name.textContent = user.name;
  uni.textContent = user.profile.university;
  prog.textContent = user.profile.corse;
  phone.textContent = user.profile.phoneNumber;
}

logOutButton.addEventListener("click",()=>{
  window.location.href="../index.html";
  AuthStorage.clear();
})

showUserName();
showUserProfile();
updateClock();
setInterval(updateClock, 1000);
showDay();
