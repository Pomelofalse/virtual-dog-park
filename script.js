const adoptionForm = document.querySelector("#adoption-form");
const dogNameInput = document.querySelector("#dog-name");
const dogBreedSelect = document.querySelector("#dog-breed");
const adoptionMessage = document.querySelector("#adoption-message");
const petPanel = document.querySelector("#pet-panel");
const petName = document.querySelector("#pet-name");
const petBreed = document.querySelector("#pet-breed");

adoptionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const cleanName = dogNameInput.value.trim();
  if (cleanName.length === 0) {
    adoptionMessage.textContent = "Please enter a name before adopting.";
    dogNameInput.focus();
    return;
  }

  petName.textContent = cleanName;
  petBreed.textContent = dogBreedSelect.value;
  adoptionForm.hidden = true;
  petPanel.hidden = false;
});
