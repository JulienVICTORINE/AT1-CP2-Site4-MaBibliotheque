// Je récupère tout les éléments
const main = document.querySelector("main");

// Variable pour stocker les livres
var books = [];

// Requête fetch
// Je créé ma fonction pour récupérer les livres
const fetchBooksData = async (search = "the lord of the rings") => {
  try {
    const request = await fetch(
      `https://openlibrary.org/search.json?q=${search}`
    );
    const data = await request.json();
    books = data.docs; // c'est dans le docs qu'on récupère les données
    console.log("Livres récupérés :", books);
    updateMain();
  } catch (error) {
    console.log(error);
  }
};

// Fonction pour récupérer et afficher tous les livres
const updateMain = () => {
  books.map((book) => {
    const title = book.title;
    const authorName = book.author_name;
    const anneePublication = book.first_publish_year;
    const imageAPI = book.cover_i;

    // URL de l'image par défaut
    let imageURL = "";

    if (imageAPI) {
      // Si cover_i existe, alors on utilise l'API de Open Library pour récupérer l'image
      imageURL = `https://covers.openlibrary.org/b/id/${imageAPI}-L.jpg`;
    } else {
      imageURL = `https://covers.openlibrary.org/a/olid/OL23919A-M.jpg`;
    }

    main.innerHTML += `
        <div class="card">
            <div class="card-header">
                <img src="${imageURL}" alt="Image du livre ${title}" />
            </div>
            <div class="card-body">
                <h5 class="card-body__title">${title}</h5>
                <div class="card-body__infos">
                    <p class="card-body__infos_author">
                        <span>${
                          authorName ? authorName.join(", ") : "Auteur inconnu"
                        }</span>
                    </p>
                    <p class="card-body__infos_publish_year">
                        <span>${anneePublication || "Année inconnue"}</span>
                    </p>
                </div>
            </div>
        </div>
        `;
  });
};

fetchBooksData();
