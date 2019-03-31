class Movie {
  constructor(title, genre, date) {
    this.title = title;
    this.genre = genre;
    this.date = date;
  }
}
class UI {
  static displayMovies() {
    const movies = Store.getMovies();
    movies.forEach((movie) => UI.addMovieToList(movie));
  }
  static addMovieToList(movie) {
    const list = document.querySelector('#movie-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${movie.title}</td>
      <td>${movie.genre}</td>
      <td>${movie.date}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteMovie(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#movie-form');
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#genre').value = '';
    document.querySelector('#date').value = '';
  }
}

class Store {
  static getMovies() {
    let movies;
    if(localStorage.getItem('movies') === null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem('movies'));
    }

    return movies;
  }

  static addMovie(movie) {
    const movies = Store.getMovies();
    movies.push(movie);
    localStorage.setItem('movies', JSON.stringify(movies));
  }

  static removeMovie(date) {
    const movies = Store.getMovies();

    movies.forEach((movie, index) => {
      if(movie.date === date) {
        movies.splice(index, 1);
      }
    });
    localStorage.setItem('movies', JSON.stringify(movies));
  }
}
document.addEventListener('DOMContentLoaded', UI.displayMovies);

document.querySelector('#movie-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.querySelector('#title').value;
  const genre = document.querySelector('#genre').value;
  const date = document.querySelector('#date').value;

  if(title === '' || genre === '' || date === '') {
    UI.showAlert('Please fill all fields', 'danger');
  } else {
    const movie = new Movie(title, genre, date);

    UI.addMovieToList(movie);

    Store.addMovie(movie);

    UI.showAlert('Movie Added', 'success');

    UI.clearFields();
  }
});
document.querySelector('#movie-list').addEventListener('click', (e) => {
  UI.deleteMovie(e.target);
  Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert('Movie Removed', 'success');
});