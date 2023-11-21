document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  const userTableBody = document.getElementById("userTableBody");
  const clearTableBtn = document.getElementById("clearTableBtn");

  // Load existing entries from local storage
  loadEntriesFromLocalStorage();

  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const dobInput = document.getElementById("dob");
    const termsCheckbox = document.getElementById("terms");

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const dob = dobInput.value;
    const termsAccepted = termsCheckbox.checked;

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return;
    }

    // Check age range (between 18 and 55)
    const birthDate = new Date(dob);
    const age = calculateAge(birthDate);
    if (age < 18 || age > 55) {
      alert("Age must be between 18 and 55");
      return;
    }

    // Verify password with at least one uppercase, one lowercase, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      alert("Password must contain at least one uppercase letter, one lowercase letter, and one special character");
      return;
    }

    // Add the user details to the table and local storage
    addUserToTable(name, email, password, dob, termsAccepted);
    saveEntryToLocalStorage(name, email, password, dob, termsAccepted);

    // Clear the form
    registrationForm.reset();
  });

  clearTableBtn.addEventListener("click", function () {
    // Clear the table and local storage
    userTableBody.innerHTML = "";
    clearLocalStorage();
  });

  function addUserToTable(name, email, password, dob, termsAccepted) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${password}</td>
      <td>${dob}</td>
      <td>${termsAccepted ? 'Yes' : 'No'}</td>
    `;
    userTableBody.appendChild(newRow);
  }

  function saveEntryToLocalStorage(name, email, password, dob, termsAccepted) {
    const entry = {
      name: name,
      email: email,
      password: password,
      dob: dob,
      termsAccepted: termsAccepted
    };

    let entries = getEntriesFromLocalStorage();
    entries.push(entry);
    localStorage.setItem("userEntries", JSON.stringify(entries));
  }

  function loadEntriesFromLocalStorage() {
    let entries = getEntriesFromLocalStorage();

    for (const entry of entries) {
      addUserToTable(entry.name, entry.email, entry.password, entry.dob, entry.termsAccepted);
    }
  }

  function getEntriesFromLocalStorage() {
    const storedEntries = localStorage.getItem("userEntries");
    return storedEntries ? JSON.parse(storedEntries) : [];
  }

  function clearLocalStorage() {
    localStorage.removeItem("userEntries");
  }

  function calculateAge(birthDate) {
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1;
    } else {
      return age;
    }
  }
});
