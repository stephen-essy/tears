import { AuthStorage } from "./authentication.js";
const user = AuthStorage.get();
const logOutButton = document.getElementById("sign-out");
const queenLeaves = document.getElementById("sign-out-button");
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

logOutButton.addEventListener("click", (e) => {
  e.preventDefault();
  const alertCard = document.getElementById("alert-card");
  alertCard.style.opacity = "1";
});
queenLeaves.addEventListener("click", (event) => {
  event.preventDefault();
  const alertCard = document.getElementById("alert-card");
  const messageCard = document.getElementById("alert-card-message");
  alertCard.style.opacity = "0";
  messageCard.innerText = "thanks for your confrimation";
  AuthStorage.clear();
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
});

async function createProfile(event) {
  event.preventDefault();

  let profile = {
    gender: document.getElementById("gender").value.trim(),
    phoneNumber: document.getElementById("phoneNumber").value.trim(),
    university: document.getElementById("current-university").value.trim(),
    corse: document.getElementById("current-corse").value.trim(),
  };

  if (
    !profile.corse ||
    !profile.gender ||
    !profile.phoneNumber ||
    !profile.corse
  ) {
    alert("Please Enter all fields", "error");
    return;
  }

  try {
    let request = await fetch("http://localhost:8080/laughter/profile/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(profile),
    });

    let response = await request.json();
    if (request.ok) {
      alert(response.message,'success')
    } else {
      alert(response.message,'error')
    }
  } catch (error) {
    alert('Error in processing','error')
  }
}

if (user.profile === null) {
  document.getElementById("update-create").textContent = "create";
  document.getElementById("profile-trash").style.display = "none";
  const modal = document.getElementById("profile-modal");
  const openBtn = document.getElementById("open-profile-modal");
  const closeBtn = document.querySelector(".close");
  const submitProfile = document.getElementById("profile-button");
  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    setTimeout(() => {
      document.getElementById("profile-info").style.opacity = "0";
    }, 1000);
  });
  openBtn.onclick = () => (modal.style.display = "block");
  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  submitProfile.addEventListener("click", createProfile);
}
console.log(user);
console.log(user.profile);
showUserName();
showUserProfile();
updateClock();
setInterval(updateClock, 1000);
showDay();
