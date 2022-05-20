import {
  findById, findByStickyNoteCurrentUser,
  loadUserSessionStorage, saveUserLocalStorage,
  welcome
} from "../js/utilsLocalStorage.js"

const btnCreateStickyNote = document.querySelector("#create-sticky-note")

function checksExistsUser() {
  const { id } = loadUserSessionStorage()
  const user = findById(id)

  return user
}

async function presentAlert(msg) {
  const alert = document.createElement('ion-alert');
  alert.cssClass = 'my-custom-class';

  alert.message = msg;
  alert.buttons = ['OK'];

  document.body.appendChild(alert);
  await alert.present();

}

function createStickyNote() {
  const user = checksExistsUser()
  const idStickyNoteElement = +document.querySelector(".wrap-sticky-note").id
  let title = document.querySelector("#title-sticky-note")
  let description = document.querySelector("#description-sticky-note")

  if (!user) {
    alert("Algo saiu errado faça login!")
    return;
  }

  if (idStickyNoteElement) {
    
    const sticky = {
      id: idStickyNoteElement,
      title: title.value,
      description: description.value,
      created_at: new Date()
    }

    const user = checksExistsUser();

    const stickyNoteIndex = user.stickyNotes.findIndex(stickyNote => stickyNote.id === idStickyNoteElement);
  
    if (stickyNoteIndex < 0) {
      alert("Não foi possível realizar esta operação!")
      return;
    }
  
    user.stickyNotes.splice(stickyNoteIndex, 1, sticky);
    
    saveUserLocalStorage(user)
    loadStickyNotes()
    presentAlert("Atualizado com sucesso!")

  } else {

    const sticky = {
      id: Math.random(),
      title: title.value,
      description: description.value,
      created_at: new Date()
    }

    user.stickyNotes.push(sticky)
    
    saveUserLocalStorage(user)
    loadStickyNotes()
    presentAlert("Seu lembrete foi criado com sucesso!")
  }
  title.value = ""
  description.value = ""
}

function editSticky(stickyNote_id) {
  const currentStickyNote = findByStickyNoteCurrentUser(stickyNote_id)
  const idStickyNoteElement = document.querySelector(".wrap-sticky-note")
  const titleElement = document.querySelector("#title-sticky-note")
  const descriptionElement = document.querySelector("#description-sticky-note")

  idStickyNoteElement.setAttribute("id", String(currentStickyNote.id))
  titleElement.value = currentStickyNote.title
  descriptionElement.value = currentStickyNote.description

  openModal()
}

function deleteSticky(id) {
  const user = checksExistsUser();

  const stickyNoteIndex = user.stickyNotes.findIndex(stickyNote => stickyNote.id === id);

  if (stickyNoteIndex < 0) {
    alert("Não foi possível realizar esta operação!")
    return;
  }

  user.stickyNotes.splice(stickyNoteIndex, 1);
  saveUserLocalStorage(user)
}


function loadStickyNotes() {
  const user = checksExistsUser()
  const slides = document.querySelector(".swiper-wrapper")

  slides.innerHTML = ""

  const notes = user?.stickyNotes

  notes.map(sticky => {
    slides.innerHTML += cardSticky(sticky)
  })
}

function cardSticky(stickyNote) {
  return `
  <ion-slide>
    <ion-card>
      <ion-item readonly="true">
        <ion-icon name="pin" slot="start"></ion-icon>
        <ion-label>${stickyNote.title}</ion-label>
        <ion-buttons slot="end">
          <ion-button id="edit-${stickyNote.id}" >
            <ion-icon slot="icon-only" color="success" name="pencil"></ion-icon>
          </ion-button>
          <ion-button id="delete-${stickyNote.id}">
            <ion-icon slot="icon-only" color="danger" name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-item>
      <ion-card-content clear-on-edit="true">
        ${stickyNote.description}
      </ion-card-content>
    </ion-card>
  </ion-slide>
  `
}

function captureAction(event) {
  if (event.target.type === 'button') {

    const [action, id] = event.target.id.split('-')

    if (action == 'edit') {
      editSticky(id)
    } else {
      const response = confirm(`Deseja realmente excluir`)
      if (response) {
        deleteSticky(+id)
        loadStickyNotes()
      }
    }
  }
}

window.addEventListener("load", () => {
  const user = loadUserSessionStorage()
  const progressBar = document.querySelector("ion-progress-bar")

  if (!user.id) {
    window.location.href = "/";
  } else {
    setTimeout(function () {
      progressBar.style.display = "block"
      welcome()
      loadStickyNotes()
      progressBar.style.display = "none"
    }, 5000);
  }
})

document.querySelector('ion-slides').addEventListener('click', captureAction)
document.querySelector('#new-sticky-Note').addEventListener('click', () => {
  const idStickyNoteElement = document.querySelector(".wrap-sticky-note")
  let title = document.querySelector("#title-sticky-note")
  let description = document.querySelector("#description-sticky-note")

  idStickyNoteElement?.removeAttribute("id")
  title.value = ""
  description.value = ""
  openModal()
})

btnCreateStickyNote.onclick = createStickyNote;


