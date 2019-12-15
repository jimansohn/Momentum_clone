const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

const TODO_LS_KEY = "todolist";

let todoListArray = [];

const addTodoItem = text => {
  const id = Date.now();
  displayTodoItem(`${id}`, text);
  loadToDoListFromDisplay();
};

const displayTodoItem = (id, text) => {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo-item");

  todoDiv.id = id;
  todoDiv.innerHTML = text;
  todoDiv.style.cssText = "text-align:right";
  if (todoDiv.id.charAt(0) === "C") {
    todoDiv.style.cssText = "text-align:right; text-decoration: line-through;";
  }

  todoDiv.addEventListener("click", handleTodoItemClick);
  todoList.appendChild(todoDiv);
};

const handleTodoItemClick = event => {
  const divNode = event.target;
  if (divNode.id.charAt(0) === "C") {
    removeTodoItem(divNode);
  } else {
    divNode.id = `C${divNode.id}`;
    divNode.style.cssText = "text-align:right; text-decoration:line-through;";
  }
  loadToDoListFromDisplay();
};

const removeTodoItem = divObj => {
  divObj.parentNode.removeChild(divObj);
  loadToDoListFromDisplay();
};

const handleTodoSubmit = event => {
  event.preventDefault();
  console.log("please");
  const input = todoInput.value;
  console.log(input);
  addTodoItem(input);
  todoInput.value = "";
};

const loadToDoListFromLocalStorage = () => {
  todoListArray.length = 0;
  const loadedList = localStorage.getItem(TODO_LS_KEY);
  if (loadedList !== null) {
    todoListArray = JSON.parse(loadedList);
  }
  todoListArray.forEach(todoItem => {
    displayTodoItem(todoItem.id, todoItem.text);
  });
};

const loadToDoListFromDisplay = () => {
  todoListArray.length = 0;
  const childItems = todoList.childNodes;
  for (let i = 0; i < childItems.length; i++) {
    const divObj = childItems[i];
    todoListArray.push({
      id: divObj.id,
      text: divObj.innerText
    });
  }
  localStorage.setItem(TODO_LS_KEY, JSON.stringify(todoListArray));
};

const todoInit = () => {
  todoForm.addEventListener("submit", handleTodoSubmit);
  loadToDoListFromLocalStorage();
};

todoInit();
