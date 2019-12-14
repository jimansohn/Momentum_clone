const calendar = document.getElementById("calendar");
const clock = document.getElementById("clock");
const dateOption = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};
const clockOption = { hour: "2-digit", minute: "2-digit", hour12: true };

const updateClock = () => {
  const now = new Date();
  calendar.innerText = `${now.toLocaleDateString("en-US", dateOption)}`;
  const hour = `${now.getHours() % 12}`;
  const minutes = `${now.getMinutes()}`;
  clock.innerText = now.toLocaleTimeString("en-US", clockOption);
  //clock.innerText=`${now.getHours()%12}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
};

const clockInit = () => {
  setInterval(updateClock, 1000);
};

clockInit();
