$(document).ready(()=>{
    let isDark=true;
    let theme=$('.dark');
    let themeButton=$('#theme-toogle').on('click',(e)=>{
        isDark=!isDark;
        if(!isDark){
            $('#current-theme').text("dark theme")
            theme.removeClass('dark').addClass('light')
        }else{
            $('#current-theme').text("light theme")
            theme.removeClass('light').addClass('dark')
        } 
    })
})
export function alert(message,type){
    const popup=document.getElementById('alert-popup');
    const popupMessage=document.getElementById('popup-message')
    const popupIcon=document.getElementById('popup-icon')
    const icon=document.getElementById('popup-icon-icon')

    if(!popup || !popupIcon || !popupMessage)return;
    if(type==='error'){
        icon.classList.remove('fa-check');
        icon.classList.add('fa-xmark');
        icon.style.background='#f44336';
    }
    popupMessage.innerText=message;
    popup.className=`alert-popup alert-${type} show`;
    setTimeout(()=>{
        popup.classList.remove('show');
        popupMessage.textContent='';
    },3000);
}
export function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12:true

    });

    clock.textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);

