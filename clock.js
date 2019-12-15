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
  clock.innerText = now.toLocaleTimeString("en-US", clockOption);
};

const clockInit = () => {
  updateClock();
  setInterval(updateClock, 1000);
};

clockInit();
