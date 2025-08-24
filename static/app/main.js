import { AuthStorage } from "./authentication.js";
const user = AuthStorage.get();
let name = user.name;
let signOutBtn=document.getElementById('sign-out')
const user_name_display = document.getElementById("logo-name");
if (name) {
  user_name_display.innerHTML = name;
}
signOutBtn.addEventListener('click',()=>{
  window.location.href="authentication.html";
  AuthStorage.clear();
})

