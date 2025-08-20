import { AuthStorage } from "./authentication.js";
const user=AuthStorage.get();
let name=user.name;
const user_name_display=document.getElementById('logo-name')
if(name){
    user_name_display.innerHTML=name;
} 