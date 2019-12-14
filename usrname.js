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

usrnameInit();
