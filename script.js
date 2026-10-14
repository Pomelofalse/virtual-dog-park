const STORAGE_KEY = "virtualDogParkPetV1";
const allowedBreeds = ["Beagle", "Golden Retriever", "Poodle"];

const adoptionForm = document.querySelector("#adoption-form");
const dogNameInput = document.querySelector("#dog-name");
const dogBreedSelect = document.querySelector("#dog-breed");
const adoptionMessage = document.querySelector("#adoption-message");
const storageMessage = document.querySelector("#storage-message");
const petPanel = document.querySelector("#pet-panel");
const petName = document.querySelector("#pet-name");
const petBreed = document.querySelector("#pet-breed");
const petDay = document.querySelector("#pet-day");
const petStage = document.querySelector("#pet-stage");
const growthMeter = document.querySelector("#growth-meter");
const growthDescription = document.querySelector("#growth-description");
const happinessMeter = document.querySelector("#happiness-meter");
const happinessValue = document.querySelector("#happiness-value");

let pet = null;

function showMessage(element, message, state) {
  element.textContent = message;
  element.dataset.state = state;
}

function stageFor(day) {
  if (day === 1) {
    return { name: "Puppy", progress: 34 };
  }
  if (day <= 3) {
    return { name: "Young Dog", progress: 67 };
  }
  return { name: "Adult Dog", progress: 100 };
}

function renderPet() {
  const hasPet = pet !== null;
  petPanel.hidden = !hasPet;
  adoptionForm.hidden = hasPet;

  if (!hasPet) {
    return;
  }

  const stage = stageFor(pet.day);
  petName.textContent = pet.name;
  petBreed.textContent = pet.breed;
  petDay.textContent = String(pet.day);
  petStage.textContent = stage.name;
  growthMeter.value = stage.progress;
  growthMeter.textContent = stage.progress + "% grown";
  growthDescription.textContent = stage.name + " · Day " + pet.day;
  happinessMeter.value = pet.happiness;
  happinessMeter.textContent = pet.happiness + " out of 100";
  happinessValue.textContent = pet.happiness + " / 100";
}

function savePet() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
    showMessage(storageMessage, "Progress saved in this browser.", "success");
  } catch (error) {
    showMessage(storageMessage, "The browser could not save progress this time.", "error");
  }
}

function isValidSavedPet(value) {
  return value !== null
    && typeof value === "object"
    && typeof value.name === "string"
    && value.name.trim().length > 0
    && value.name.trim().length <= 20
    && allowedBreeds.includes(value.breed)
    && Number.isInteger(value.day)
    && value.day >= 1
    && Number.isInteger(value.happiness)
    && value.happiness >= 0
    && value.happiness <= 100;
}

function loadPet() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText === null) {
      return;
    }

    const savedPet = JSON.parse(savedText);
    if (isValidSavedPet(savedPet)) {
      pet = {
        name: savedPet.name.trim(),
        breed: savedPet.breed,
        day: savedPet.day,
        happiness: savedPet.happiness
      };
      return;
    }

    showMessage(storageMessage, "Saved progress could not be read. You can adopt a new dog.", "error");
  } catch (error) {
    showMessage(storageMessage, "Saved progress could not be read in this browser.", "error");
  }
}

adoptionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const cleanName = dogNameInput.value.trim();
  if (cleanName.length === 0) {
    showMessage(adoptionMessage, "Please enter a name before adopting.", "error");
    dogNameInput.focus();
    return;
  }

  pet = {
    name: cleanName,
    breed: dogBreedSelect.value,
    day: 1,
    happiness: 50
  };

  showMessage(adoptionMessage, "", "");
  renderPet();
  savePet();
});

function increaseHappiness() {
  if (pet === null) {
    return;
  }

  pet.happiness = Math.min(100, pet.happiness + 10);
  renderPet();
  savePet();
}

function moveToNextDay() {
  if (pet === null) {
    return;
  }

  pet.day += 1;
  pet.happiness = Math.max(0, pet.happiness - 5);
  renderPet();
  savePet();
}

function startOver() {
  if (pet === null) {
    return;
  }

  const confirmed = window.confirm("Start over and delete this dog's saved progress?");
  if (!confirmed) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    showMessage(storageMessage, "The browser could not clear saved progress.", "error");
    return;
  }

  pet = null;
  adoptionForm.reset();
  renderPet();
  showMessage(adoptionMessage, "Saved progress was cleared. You can adopt again.", "success");
  dogNameInput.focus();
}

document.querySelector("#feed-button").addEventListener("click", increaseHappiness);
document.querySelector("#play-button").addEventListener("click", increaseHappiness);
document.querySelector("#next-day-button").addEventListener("click", moveToNextDay);
document.querySelector("#start-over-button").addEventListener("click", startOver);

loadPet();
renderPet();
