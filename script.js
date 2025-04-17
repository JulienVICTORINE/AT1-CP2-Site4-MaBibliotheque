// Je récupère tout les éléments
const main = document.querySelector("main");

// Tri par date plus ancienne et date plus récente
const btnDatePublishAsc = document.querySelector("#btnDateAsc");
const btnDatePublishDesc = document.querySelector("#btnDateDesc");

// Filtrer par date
const inputFilterYear = document.getElementById("filterYear");
const btnFilterYear = document.getElementById("btnFilterYear");

// Variable pour stocker les livres
var books = [];
var sortMethod = "";

var filter = "";

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
  main.innerHTML = ""; // je vide le main
  let copieBooks = [...books]; // je fais une copie pour permettre de filtrer, trier les livres

  // Appliquer le filtre par année
  // En gros, si par exemple, je saisie l'année 1950, je ne garde que les livres publiés après ou pendant 1950.
  if (filter) {
    copieBooks = copieBooks.filter((book) => {
      return book.first_publish_year && book.first_publish_year >= filter;
    });
  }

  // On trie les livres filtrés
  copieBooks = copieBooks.sort((a, b) => {
    if (sortMethod == "dateAsc") {
      return (b.first_publish_year || 0) - (a.first_publish_year || 0);
    } else if (sortMethod == "dateDesc") {
      return (a.first_publish_year || 0) - (b.first_publish_year || 0);
    } else {
      return 0; // affiche pas les livres
    }
  });

  // On afffiche les livres
  copieBooks.map((book) => {
    const title = book.title;
    const authorName = book.author_name;
    const anneePublication = book.first_publish_year;
    const imageAPI = book.cover_i;

    // URL de l'image
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

// Ajout des événements pour les boutons

///////////////
// Trier les livres par date de publication
//////////////
btnDatePublishAsc.addEventListener("click", () => {
  sortMethod = "dateAsc";
  updateMain();
});

btnDatePublishDesc.addEventListener("click", () => {
  sortMethod = "dateDesc";
  updateMain();
});

///////////////
// Filtrer les livres par date
//////////////
btnFilterYear.addEventListener("click", () => {
  filter = parseInt(inputFilterYear.value); // je récupère l'année saisie
  updateMain();
});
