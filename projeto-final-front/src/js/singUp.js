import { fieldsValidation } from "./fieldsValidation.js";
import { findByEmail, saveUserLocalStorage, saveUserSessionStorage } from "./utilsLocalStorage.js";

const fields = document.querySelectorAll("[required]")

document.querySelector("#signUp-form")?.addEventListener("submit", event => {
    event.preventDefault()
    createUser()
  })

fieldsValidation(fields)

export function loading() {
  document.querySelector('.container').style.display = "none"
  document.querySelector('.loading-page').style.display = "flex"
}

function formattedUser() {
  const userForm = document.querySelectorAll("#signUp-form input");
  const newUser = {}

  userForm.forEach(data => {
    if (data.name === "confirm-password" || data.value === "Entrar") {
      return;
    }
    newUser[data.name] = data.value
  })
  Object.assign(newUser, { id: Math.random(), stickyNotes: [] })

  return newUser
}

function createUser() {
  const user = formattedUser()
  const usersAlreadyExists = findByEmail(user.email)

  if (usersAlreadyExists) {
    alert("Usuário já cadastrado, faça login!")
    return;
  }
  saveUserLocalStorage(user)
  saveUserSessionStorage(user)
  loading()

  setTimeout(function () {
    window.location.href = "dashboard.html";
  }, 5000);


}

