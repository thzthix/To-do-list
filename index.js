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
function createLiElement(id) {
  const listItem = document.createElement("li");
  listItem.id = id;
  listItem.classList.add("plan");
  return listItem;
}
function createCheckBox(id, checked, className, textContent) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = className;
  checkbox.id = id;
  checkbox.checked = checked ? true : false;

  const checkboxLabel = document.createElement("label");
  checkboxLabel.id = id;
  checkboxLabel.textContent = textContent;
  checkbox.addEventListener("click", handleCheck);

  return { checkbox, checkboxLabel };
}
function createPlanContentDiv(value, className, checked) {
  const planContainer = document.createElement("div");
  planContainer.className = className;
  planContainer.textContent = value;
  if (checked) {
    planContainer.classList.add("checked");
  }
  return planContainer;
}
function createBtn(className, innerHTML, ariaLabel) {
  const btn = document.createElement("button");
  btn.className = className;
  btn.innerHTML = innerHTML;
  btn.ariaLabel = ariaLabel;

  return btn;
}
function createBtnContainer(classList) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList = classList;

  const editButton = createBtn(
    "edit-btn",
    `<i class="fa-solid fa-pen-to-square"></i>`,
    "Edit Plan"
  );

  const deleteButton = createBtn(
    "delete-btn",
    `<i class="fa-solid fa-trash"></i>`,
    "Delete Plan"
  );
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  return buttonContainer;
}
function createEditForm(className, editLabeltext, id) {
  const editForm = document.createElement("form");
  editForm.className = className.editForm;
  editForm.classList.add("hide");

  const editInput = document.createElement("input");
  editInput.className = className.editInput;
  editInput.id = id;
  const editInputLabel = document.createElement("label");
  editInputLabel.htmlFor = id;
  editInputLabel.textContent = editLabeltext;

  const saveButton = createBtn("save-btn", "save", "Save Changes");
  saveButton.type = "submit";

  const cancelButton = createBtn("cancel-btn", "cancel", "Discard Changes");
  cancelButton.type = "button";

  editForm.appendChild(editInputLabel);
  editForm.appendChild(editInput);
  editForm.appendChild(saveButton);
  editForm.appendChild(cancelButton);

  return editForm;
}
function createListItem(id, value, checked) {
  const listItem = createLiElement(id);

  const checkboxWithLabel = createCheckBox(
    id,
    checked,
    "plan-checkbox",
    "Mark as completed"
  );

  const checkboxEl = checkboxWithLabel.checkbox;
  const checkboxLabel = checkboxWithLabel.checkboxLabel;

  const planContainer = createPlanContentDiv(value, "plan-display", checked);

  const buttonContainer = createBtnContainer("btn-container");

  // const editForm=createEditForm()

  const editFormClassNames = {
    editForm: "form-edit",
    editInput: "plan-edit",
  };
  const editLabeltext = "Edit Plan";

  const editForm = createEditForm(editFormClassNames, editLabeltext, id);

  listItem.appendChild(checkboxLabel);
  listItem.appendChild(checkboxEl);

  listItem.appendChild(planContainer);

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
function handleCheck(event) {
  const listItem = event.target.parentNode;
  const planContent = listItem.querySelector(".plan-display");
  const itemId = event.target.id;
  const isChecked = event.target.checked;
  const itemIndex = findIndexById(itemId);
  savedPlans[itemIndex].checked = isChecked;
  if (isChecked) {
    planContent.classList.add("checked");
  } else {
    planContent.classList.remove("checked");
  }

  if (itemIndex === -1) {
    throw new Error(`Item with id ${itemId} not found in savedPlans`);
  }
  setLocalStorage(savedPlans);
}
function handleSave(event) {
  event.preventDefault();
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
}
function handleDelete(event) {
  const item = event.target.closest(".plan");
  const itemId = item.id;
  savedPlans = savedPlans.filter((item) => item.id !== itemId);
  setLocalStorage(savedPlans);
  render(savedPlans);
}
function handleCancel(event) {
  let listItem = event.target.closest(".plan");
  const currentValue = listItem.querySelector(".plan-display").textContent;

  const cancelBtn = event.target;
  cancelBtn.disabled = true;
  listItem = hideSaveElements(listItem);

  listItem = showEditElements(listItem, currentValue);
}
function handleEdit(event) {
  let listItem = event.target.closest(".plan");

  const itemId = listItem.id;
  const currentValue = listItem.querySelector(".plan-display").textContent;
  listItem = hideEditElements(listItem);

  listItem = showSaveElements(listItem, currentValue);

  listItem.id = itemId;
}

function render(planArr) {
  lists.innerHTML = "";
  planArr.forEach((item) => {
    const listItem = createListItem(item.id, item.value, item.checked);
    lists.appendChild(listItem);
  });
}
