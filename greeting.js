const USRNAME_LS_KEY = "usrname";
const prompt = document.getElementById("form");
const input = document.getElementById("input");
const usrname = document.getElementById("usrname");

const handleUserNameInput = e => {
  e.preventDefault();
  prompt.style.display = "none";
  usrname.innerText = input.value;
  usrname.style.display = "block";

  localStorage.setItem(USRNAME_LS_KEY, input.value);
};

const minutesOfDay = dateObj => {
  return dateObj.getHours() * 60 + dateObj.getMinutes();
};

const updateGreetingMsg = () => {
  const greetingMsg = document.getElementById("goodSomething");
  const now = minutesOfDay(new Date());
  if (now >= 0 && now < 300) {
    greetingMsg.innerText = "Good Night, ";
  } else if (now >= 300 && now < 720) {
    greetingMsg.innerText = "Good Morning, ";
  } else if (now >= 720 && now < 1020) {
    greetingMsg.innerText = "Good Afternoon, ";
  } else if (now >= 1020 && now < 1260) {
    greetingMsg.innerText = "Good Evening, ";
  } else {
    greetingMsg.innerText = "Good Night, ";
  }
};

const usrnameInit = () => {
  const loadedName = localStorage.getItem(USRNAME_LS_KEY);
  console.log(loadedName);
  if (loadedName !== null) {
    usrname.innerText = loadedName;
    prompt.style.display = "none";
    usrname.style.display = "block";
  } else {
    prompt.addEventListener("submit", handleUserNameInput);
  }
};

const greetingInit = () => {
  usrnameInit();
  updateGreetingMsg();
  setInterval(updateGreetingMsg, 600000);
};

greetingInit();
