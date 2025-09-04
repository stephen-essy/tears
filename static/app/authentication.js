import { alert } from "./ui.js";
export const AuthStorage = {
  save: (data) => {
    const authData = {
      name: data.userName,
      token: data.token,
    };
    localStorage.setItem(
      "authenticated-laughter-user",
      JSON.stringify(authData)
    );
  },
  get: () => {
    const raw = localStorage.getItem("authenticated-laughter-user");
    return raw ? JSON.parse(raw) : null;
  },
  clear: () => {
    localStorage.removeItem("authenticated-laughter-user");
  },
};

export function isTokenExpired(token){
  try{
    const payLoad=JSON.parse(atob(token.split('.')[1]));
    const expiry = payLoad.exp*1000;
    return Date.now()>expiry;
  }catch(error){
    console.error("Invalid token format",error)
    return true;
  }
}
document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const get_registered_btn = document.getElementById("button-get-registered");
  const get_authenticated_btn = document.getElementById("login-form-btn");
  const get_password_btn = document.getElementById("form-request-password");
  const registration_form = document.getElementById("registration-panel");
  const authenticating_form = document.getElementById("login-panel");
  const reset_password_form = document.getElementById("recover-email-panel");

  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (get_registered_btn && get_authenticated_btn && get_password_btn) {
    console.log("Hello");
    console.log(get_registered_btn);
  } else {
    console.log("recheck your code ");
  }
  async function userRegistration(e) {
    e.preventDefault();
    let userToBeRegistered = {
      name: document.getElementById("user-name").value.trim(),
      email: document.getElementById("user-email").value.trim(),
      password: document.getElementById("user-password").value.trim(),
    };

    if (
      !userToBeRegistered.name ||
      !userToBeRegistered.email ||
      !userToBeRegistered.password
    ) {
      Swal.fire({
        title: "Registration Status",
        text: "Please Fill all field",
        icon: "warning",
        timer: 5000,
      });
      return;
    }

    if (!emailRegex.test(userToBeRegistered.email)) {
      Swal.fire({
        title: "Registration Status",
        text: "Please Enter a valid email",
        icon: "warning",
        iconColor: "red",
        timer: 5000,
      });
      return;
    }

    try {
      let request = await fetch(
        "http://localhost:8080/laughter/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userToBeRegistered),
        }
      );

      let response = await request.json();
      if (request.ok) {
        Swal.fire({
          title: "Registration Status",
          text: response.message,
          icon: "success",
          timer: 5000,
        });
        registration_form.reset();
        return;
      } else {
        Swal.fire({
          title: "Registration Status",
          text: response.message,
          icon: "warning",
          timer: 5000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Registration Status",
        text: error,
        icon: "error",
        timer: 5000,
      });
    }
  }
  async function requestPassword(e) {
    e.preventDefault();
    const user = {
      email: document.getElementById("lazy-email").value.trim(),
      recoveryString: document.getElementById("lazy-code").value.trim(),
    };
    if (!user.email || !user.recoveryString) {
      Swal.fire({
        title: "Recovery Password",
        text: "Please fill all fields",
        icon: "warning",
        timer: 5000,
      });
      return;
    }

    if (!emailRegex.test(user.email)) {
      Swal.fire({
        title: "Recovery Password",
        text: "Email is invalid",
        icon: "warning",
        timer: 5000,
      });
      return;
    }

    try {
      let request = await fetch("http://localhost:8080/laughter/user/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      let response = await request.json();
      if (request.ok) {
        Swal.fire({
          title: "Recovery password",
          text: response.message,
          icon: "success",
          timer: 5000,
        });
        reset_password_form.reset();
      } else {
        Swal.fire({
          title: "Recovery Password",
          text: response.message,
          icon: "error",
          timer: 5000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Recovery Password",
        text: error,
        icon: "warning",
        timer: 5000,
      });
    }
  }
  async function login(e) {
    e.preventDefault();
    const userToBeAuthenticated = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("passcode").value.trim(),
    };

    if (!userToBeAuthenticated.email || !userToBeAuthenticated.password) {
      alert("please fill all the fields", `error`);
      return;
    }
    if (!emailRegex.test(userToBeAuthenticated.email)) {
      alert("please Enter a valid Email", `error`);
      return;
    }

    try {
      let spinner = document.getElementById("login-spinner");
      spinner.style.display = "flex";
      let request = await fetch("http://localhost:8080/laughter/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToBeAuthenticated),
      });

      let response = await request.json();
      if (request.ok) {
        setTimeout(() => {
          spinner.style.display = "none";
        }, 1000);
        
        alert(`${response.message}`,`success`);

        setTimeout(() => {
          authenticating_form.reset();
          AuthStorage.save(response);
        }, 2000);

        setTimeout(() => {
          window.location.href = "hero.html";
        }, 3000);
        return;
      } else {
        spinner.style.display = "none";
        alert(`${response.message}`, `error`);
      }
    } catch (error) {
      spinner.style.display = "none";
      Swal.fire({
        title: "Login session",
        text: error,
        icon: "warning",
        timer: 5000,
      });
    }
  }
  get_registered_btn.addEventListener("click", userRegistration);
  get_authenticated_btn.addEventListener("click", login);
  get_password_btn.addEventListener("click", requestPassword);
});
