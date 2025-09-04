import { AuthStorage } from "./authentication.js";
import {alert} from './ui.js';
const user = AuthStorage.get();
let name = user.name;
let userToken=user.token;
let signOutBtn = document.getElementById("sign-out");
let profileButton = document.getElementById("profile-button");
const user_name_display = document.getElementById("logo-name");
if (name) {
  user_name_display.innerHTML = name;
}
signOutBtn.addEventListener("click", () => {
  window.location.href = "authentication.html";
  AuthStorage.clear();
});
document.addEventListener("DOMContentLoaded", () => {
  async function createProfile(e) {
    e.preventDefault();
    let profile = {
      gender: document.getElementById("gender").value.trim(),
      phoneNumber: document.getElementById("phoneNumber").value.trim(),
      university: document.getElementById("university").value.trim(),
      corse: document.getElementById("corse").value.trim(),
    };
    if (
      !profile.gender ||
      !profile.corse ||
      !profile.phoneNumber ||
      !profile.university
    ) {
      window.alert("Enter all fields please !");
      return
    }

    try {
      let request = await fetch(
        "http://localhost:8080/laughter/profile/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${user.token}`
          },
          body:JSON.stringify(profile)
        }
      );

      let response= await request.json();
      if(request.ok){
        window.alert("Hello seems like things are going great")
        console.log(response.message)
      }else{
        window.alert("something is wrong")
        console.log(response.message)
      }
    } catch (error) {
      console.log("error in processing :" + error);
    }
  }
  let token_area=document.getElementById("token-value").innerText=userToken;
  profileButton.addEventListener("click",createProfile);
  document.getElementById('exit-button').addEventListener('click',()=>{
  window.alert("hello there")
})
});
