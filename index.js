const PLAN_KEY = "plans";
const newplanForm = document.querySelector(".form-newplan");
const input = newplanForm.querySelector(".input-newplan");
const addPlanBtn = newplanForm.querySelector(".input-btn");
const lists = document.querySelector(".lists");

let savedPlans = [];

const eventListeners = {
  handleEdit,
  handleDelete,
  handleCancel,
  handleSave,
};
try {
  const storedData = JSON.parse(localStorage.getItem(PLAN_KEY)) || [];
  if (storedData) {
    savedPlans = storedData;
  }
} catch (error) {
  console.error("Error retrieving data from local storage:", error);
}
render(savedPlans);

function handleCheck(event) {
  console.log("handleCheck called");
  console.log("handleCheck 1");
  const listItem = event.target.parentNode;
  const itemId = event.target.id;
  const isChecked = event.target.checked;
  const itemIndex = findIndexById(itemId);
  savedPlans[itemIndex].checked = isChecked;
  if (isChecked) {
    listItem.classList.add("checked");
  } else {
    listItem.classList.remove("checked");
  }

  if (itemIndex === -1) {
    throw new Error(`Item with id ${itemId} not found in savedPlans`);
  }
  setLocalStorage(savedPlans);
  console.log("handleCheck 2");
}
function disableButtons() {
  const buttonContainers = document.querySelectorAll(".btn-container");
  const checkboxes = document.querySelectorAll(".plan-checkbox");
  buttonContainers.forEach((buttonContainer) => {
    if (buttonContainer.classList.contains("hide")) {
      return;
    }
    buttonContainer.classList.add("disabledContainer");
  });
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = true;
  });

  input.disabled = true;
  addPlanBtn.disabled = true;
}
function enableButtons() {
  const buttonContainers = document.querySelectorAll(".btn-container");
  const checkboxes = document.querySelectorAll(".plan-checkbox");

  buttonContainers.forEach((buttonContainer) => {
    if (!buttonContainer.classList.contains("disabledContainer")) {
      return;
    }
    buttonContainer.classList.remove("disabledContainer");
  });
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = false;
  });

  input.disabled = false;
  addPlanBtn.disabled = false;
}
function setLocalStorage(arr) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(arr));
}
function bindEditEvents(listItem) {
  const editButton = listItem.querySelector(".edit-btn");
  const deleteButton = listItem.querySelector(".delete-btn");

  editButton.addEventListener("click", handleEdit);
  deleteButton.addEventListener("click", handleDelete);
}
function bindSaveEvents(listItem) {
  const editForm = listItem.querySelector(".form-edit");
  const cancelBtn = listItem.querySelector(".cancel-btn");
  editForm.addEventListener("submit", handleSave);
  cancelBtn.addEventListener("click", handleCancel);
}
function unbindEditEvents(listItem) {
  const editButton = listItem.querySelector(".edit-btn");
  const deleteButton = listItem.querySelector(".delete-btn");
  editButton.removeEventListener("click", handleEdit);
  deleteButton.removeEventListener("click", handleDelete);
}
function unbindSaveEvents(listItem) {
  const editForm = listItem.querySelector(".form-edit");
  const cancelBtn = listItem.querySelector(".cancel-btn");
  editForm.removeEventListener("submit", handleSave);
  cancelBtn.removeEventListener("click", handleCancel);
}
function createListItem(id, value, checked) {
  const listItem = document.createElement("li");
  listItem.id = id;
  listItem.classList.add("plan");
  if (checked) {
    listItem.classList.add("checked");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "plan-checkbox";
  checkbox.id = listItem.id;
  checkbox.checked = checked ? true : false;

  const checkboxLabel = document.createElement("label");
  checkboxLabel.id = listItem.id;
  checkboxLabel.textContent = "Mark as completed";
  checkbox.addEventListener("click", handleCheck);

  const planContainer = document.createElement("div");
  planContainer.className = "plan-display";
  planContainer.textContent = value;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList = "btn-container";

  const editForm = document.createElement("form");
  editForm.className = "form-edit";
  editForm.classList.add("hide");

  const editInput = document.createElement("input");
  editInput.className = "plan-edit";
  editInput.id = listItem.id;
  const editInputLabel = document.createElement("label");
  editInputLabel.htmlFor = editInput.id;
  editInputLabel.textContent = "Edit Plan";
  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.ariaLabel = "Edit Plan";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  deleteButton.ariaLabel = "Delete Plan";

  const saveButton = document.createElement("button");
  saveButton.className = "save-btn";
  saveButton.textContent = "save";
  saveButton.type = "submit";
  saveButton.ariaLabel = "Save Changes";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.ariaLabel = "Discard Changes";
  cancelButton.className = "cancel-btn";
  cancelButton.textContent = "cancel";

  listItem.appendChild(checkboxLabel);
  listItem.appendChild(checkbox);

  listItem.appendChild(planContainer);

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  editForm.appendChild(editInputLabel);
  editForm.appendChild(editInput);
  editForm.appendChild(saveButton);
  editForm.appendChild(cancelButton);

  listItem.appendChild(buttonContainer);
  listItem.appendChild(editForm);

  bindEditEvents(listItem);

  return listItem;
}
function addNewPlan(event) {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  const id = Date.now().toString();
  savedPlans.push({ id, value, checked: false });
  input.value = "";
  setLocalStorage(savedPlans);
  const listItem = createListItem(id, value, false);
  lists.appendChild(listItem);
}
function editPlan(itemId, editedPlan) {
  const itemIndex = findIndexById(itemId);
  if (itemIndex === -1) {
    throw new Error(`Item with id ${itemId} not found in savedPlans`);
  }
  savedPlans[itemIndex].value = editedPlan;
  setLocalStorage(savedPlans);
}
newplanForm.addEventListener("submit", addNewPlan);

function findIndexById(id) {
  return savedPlans.findIndex((item) => item.id === id);
}
function hideEditElements(listItem) {
  const editBtns = listItem.querySelector(".btn-container");
  const planContainer = listItem.querySelector(".plan-display");
  unbindEditEvents(listItem);

  editBtns.classList.add("hide");
  planContainer.classList.add("hide");

  return listItem;
}
function hideSaveElements(listItem) {
  const editForm = listItem.querySelector(".form-edit");

  unbindSaveEvents(listItem);

  editForm.classList.add("hide");

  return listItem;
}
function showEditElements(listItem, currentValue) {
  listItem.classList.remove("active");

  const editBtns = listItem.querySelector(".btn-container");
  const planCotent = listItem.querySelector(".plan-display");

  planCotent.textContent = currentValue;
  listItem = hideSaveElements(listItem);

  editBtns.classList.remove("hide");
  planCotent.classList.remove("hide");
  bindEditEvents(listItem);
  enableButtons();

  return listItem;
}
function showSaveElements(listItem, currentValue) {
  listItem.classList.add("active");

  const editForm = listItem.querySelector(".form-edit");
  const input = editForm.querySelector(".plan-edit");

  const saveBtn = editForm.querySelector(".save-btn");
  const cancelBtn = editForm.querySelector(".cancel-btn");

  input.value = currentValue;
  listItem = hideEditElements(listItem);
  editForm.classList.remove("hide");

  saveBtn.disabled = false;
  cancelBtn.disabled = false;

  input.focus();
  input.select();

  bindSaveEvents(listItem);
  disableButtons();
  return listItem;
}
function handleSave(event) {
  event.preventDefault();
  console.log("handleSave called");
  console.log("handleSave1");
  event.stopPropagation();
  const editForm = event.target;
  let listItem = event.target.parentNode;

  const saveBtn = editForm.querySelector(".save-btn");
  const cancelBtn = editForm.querySelector(".cancel-btn");
  saveBtn.disabled = true;
  const input = editForm.querySelector(".plan-edit");

  const editedPlan = {
    id: listItem.id,
    value: input.value.trim(),
  };
  if (editedPlan.value === "") {
    alert("please enter a valid plan");
    saveBtn.disabled = false;
    return;
  }
  if (cancelBtn.disabled === true) {
    return;
  }

  if (editedPlan.id && editedPlan.value) {
    editPlan(editedPlan.id, editedPlan.value);
    listItem = hideSaveElements(listItem);

    // listItem.id = editedPlan.id;
    listItem = showEditElements(listItem, editedPlan.value);
  }
  console.log("handleSave2");
}
function handleDelete(event) {
  console.log("handleDelete called because");
  console.log(event.target);
  console.log("handleDelete 1");
  const item = event.target.closest(".plan");
  const itemId = item.id;
  savedPlans = savedPlans.filter((item) => item.id !== itemId);
  setLocalStorage(savedPlans);
  render(savedPlans);
  console.log("handleDelete 2");
}
function handleCancel(event) {
  console.log("handleCancel called");
  console.log("handleCancel 1");
  let listItem = event.target.closest(".plan");
  const currentValue = listItem.querySelector(".plan-display").textContent;

  const cancelBtn = event.target;
  cancelBtn.disabled = true;
  listItem = hideSaveElements(listItem);

  listItem = showEditElements(listItem, currentValue);
  console.log("handleCancel 2");
}
function handleEdit(event) {
  console.log("handleEdit called");
  console.log("handleEdit 1");
  let listItem = event.target.closest(".plan");

  const itemId = listItem.id;
  const currentValue = listItem.querySelector(".plan-display").textContent;
  listItem = hideEditElements(listItem);

  listItem = showSaveElements(listItem, currentValue);

  listItem.id = itemId;
  console.log("handleEdit 2");
}

function render(planArr) {
  lists.innerHTML = "";
  planArr.forEach((item) => {
    const listItem = createListItem(item.id, item.value, item.checked);
    lists.appendChild(listItem);
  });
}
