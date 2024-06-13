document.addEventListener("DOMContentLoaded", function () {
    loadComicsFromLocalStorage();
  
    function loadComicsFromLocalStorage() {
      const comics = getComicsFromLocalStorage();
      comics.forEach(comic => addComicToLibrary(comic));
    }
  
    function getComicsFromLocalStorage() {
      return JSON.parse(localStorage.getItem('comics')) || [];
    }
  
    function addComicToLibrary(comic) {
      const librarySection = document.getElementById('library-section');
      const comicCard = document.createElement('div');
      comicCard.className = 'comic-card';
      comicCard.innerHTML = `
        <img src="${comic.imageUrl}" class="card-img-top">
        <div class="menu-dots">
          <div class="dropdown">
            <button class="dropbtn">&#x22EE;</button>
            <div class="dropdown-content">
              <a href="#" onclick="editComic(${comic.id})">Edit</a>
              <a href="#" class="read-status" data-id="${comic.id}">Read?</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${comic.title}</h5>
          <p class="card-text">Issue #${comic.issueNumber}</p>
          <p class="card-text">${comic.description}</p>
          <p class="card-text">${comic.publicationDate}</p>
          <div class="tags">
            ${comic.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
      librarySection.appendChild(comicCard);
      updateReadStatus(comicCard, comic.read);
    }
  
    function updateReadStatus(comicCard, read) {
      const img = comicCard.querySelector('img');
      img.style.border = read ? '5px solid black' : '5px solid white';
    }
  
    window.editComic = function (id) {
      const comics = getComicsFromLocalStorage();
      const comic = comics.find(comic => comic.id === id);
  
      if (comic) {
        document.getElementById('title').value = comic.title;
        document.getElementById('issue-number').value = comic.issueNumber;
        document.getElementById('description').value = comic.description;
        document.getElementById('publication-date').value = comic.publicationDate;
        document.getElementById('tags').value = comic.tags.join(', ');
  
        const comicIndex = comics.indexOf(comic);
        comics.splice(comicIndex, 1);
        localStorage.setItem('comics', JSON.stringify(comics));
      }
    };
  
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('read-status')) {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        const comics = getComicsFromLocalStorage();
        const comic = comics.find(comic => comic.id === id);
        if (comic) {
          comic.read = !comic.read;
          localStorage.setItem('comics', JSON.stringify(comics));
          const comicCard = e.target.closest('.comic-card');
          updateReadStatus(comicCard, comic.read);
        }
      }
    });
  });
  