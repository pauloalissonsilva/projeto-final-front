import { loading } from "./singUp.js"
import { fieldsValidation } from "./fieldsValidation.js";
import { findByEmail, saveUserSessionStorage } from "./utilsLocalStorage.js"

const fields = document.querySelectorAll("[required]")

document.querySelector("#signIn-form")?.addEventListener("submit", event => {
  event.preventDefault()
  goToDashboard()
})

fieldsValidation(fields)

function goToDashboard() {
  const email = document.querySelector("#email")?.value;
  const password = document.querySelector("#password")?.value;

  const user = findByEmail(email)

  if (!user) {
    alert("Senha ou email incorretos")
    return;
  }

  if (password !== user.password || email !== user.email) {
    alert("Senha ou email incorretos")
    return;
  }

  saveUserSessionStorage(user)

  loading()
  setTimeout(function () {
    window.location.href = "src/pages/dashboard.html";
  }, 5000);

}



