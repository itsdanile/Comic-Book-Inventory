document.addEventListener('DOMContentLoaded', () => {
  const comicForm = document.getElementById('comicForm');
  let editIndex = -1;
  const savedComics = JSON.parse(localStorage.getItem('comics')) || [];

  // Function to display comics in the grid
  function displayComics() {
      const comicGrid = document.querySelector('.comic-grid');
      if (comicGrid) {
          comicGrid.innerHTML = '';
          savedComics.forEach((comic, index) => {
              const comicCard = document.createElement('div');
              comicCard.className = 'comic-card';
              comicCard.innerHTML = `
                  <img src="${comic.cover}" class="card-img-top" alt="${comic.title}">
                  <div class="card-body">
                      <h5 class="card-title">${comic.title} - #${comic.issueNumber}</h5>
                      <p class="card-text">${comic.description}</p>
                      <p class="card-text"><small class="text-muted">Published: ${comic.publicationDate}</small></p>
                      <div class="tag">${comic.tags}</div>
                      <div class="menu-dots">
                          <div class="dropdown">
                              <button class="dropbtn">⋮</button>
                              <div class="dropdown-content">
                                  <a href="#" class="edit-comic" data-index="${index}">Edit</a>
                                  <a href="#" class="toggle-read" data-index="${index}">Read?</a>
                              </div>
                          </div>
                      </div>
                      <button class="delete-btn" data-index="${index}">X</button>
                  </div>
              `;
              comicGrid.appendChild(comicCard);
          });
      }
  }

  // Function to save comics to local storage
  function saveComics() {
      localStorage.setItem('comics', JSON.stringify(savedComics));
  }

  // Function to delete a comic
  function deleteComic(index) {
      savedComics.splice(index, 1);
      saveComics();
      displayComics();
  }

  // Function to handle drop event
  function dropHandler(event) {
      event.preventDefault();
      if (event.dataTransfer.items) {
          for (let i = 0; i < event.dataTransfer.items.length; i++) {
              if (event.dataTransfer.items[i].kind === 'file') {
                  const file = event.dataTransfer.items[i].getAsFile();
                  document.getElementById('cover').files = [file];
                  break;
              }
          }
      } else {
          for (let i = 0; i < event.dataTransfer.files.length; i++) {
              const file = event.dataTransfer.files[i];
              document.getElementById('cover').files = [file];
              break;
          }
      }
  }

  // Function to handle drag over event
  function dragOverHandler(event) {
      event.preventDefault();
  }

  // Handle form submission to add/edit comics
  if (comicForm) {
      comicForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const coverFile = document.getElementById('cover').files[0];
          const reader = new FileReader();

          reader.onloadend = () => {
              const cover = reader.result;
              const title = document.getElementById('title').value;
              const issueNumber = document.getElementById('issueNumber').value;
              const tags = document.getElementById('tags').value;
              const description = document.getElementById('description').value;
              const publicationDate = document.getElementById('publicationDate').value;

              const newComic = { cover, title, issueNumber, tags, description, publicationDate };

              if (editIndex > -1) {
                  savedComics[editIndex] = newComic;
                  editIndex = -1;
              } else {
                  savedComics.push(newComic);
              }

              saveComics();
              displayComics();
              comicForm.reset();
          };

          if (coverFile) {
              reader.readAsDataURL(coverFile);
          } else {
              alert("Please upload a cover image.");
          }
      });
  }

  // Handle delete button clicks
  document.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
          const index = e.target.getAttribute('data-index');
          deleteComic(index);
      }
  });

  // Load and display comics on page load
  displayComics();
});
