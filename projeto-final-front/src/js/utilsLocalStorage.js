const dataKey = '@CreedTech:users';

export function loadUsersLocalStorage() {
  const data = localStorage.getItem(dataKey);
  const currentData = data ? JSON.parse(data) : [];

  return currentData
}

export function saveUserLocalStorage(obj) {
  const users = loadUsersLocalStorage()

  const indexUser = users.findIndex(user => user.id === obj.id);

  if (indexUser < 0) {

    const dataFormatted = [
      ...users,
      obj
    ];

    localStorage.setItem(dataKey, JSON.stringify(dataFormatted));

  } else {

    const userUpdated = {
      id: obj.id,
      username: obj.username,
      email: obj.email,
      password: obj.password,
      stickyNotes: obj.stickyNotes
    }

    users.splice(indexUser, 1, userUpdated)

    localStorage.setItem(dataKey, JSON.stringify(users));

  }

}

export function loadUserSessionStorage() {
  const data = sessionStorage.getItem(dataKey);
  const currentData = data ? JSON.parse(data) : {};

  return currentData
}

export function saveUserSessionStorage(user) {

  const dataFormatted = {
    id: user.id,
    username: user.username
  }

  sessionStorage.setItem(dataKey, JSON.stringify(dataFormatted));
}

export function findByEmail(email) {
  const users = loadUsersLocalStorage()

  return users.find(user => user.email === email)
}

export function findById(id) {
  const users = loadUsersLocalStorage()

  return users.find(user => user.id === id)
}

export function findByStickyNoteCurrentUser(stickyNote_id) {
  const {id} = loadUserSessionStorage()

  const user = findById(id)

  const note = user.stickyNotes.find(stickyNote => stickyNote.id === +stickyNote_id)
  
  return note
}

export function welcome() {
  const title = document.querySelector("#welcome");
  const user = loadUserSessionStorage()

  title.innerHTML = `Olá! ${user.username}`

}

