// Je récupère tout les éléments
const main = document.querySelector("main");

// Tri par date plus ancienne et date plus récente
const btnDatePublishAsc = document.querySelector("#btnDateAsc");
const btnDatePublishDesc = document.querySelector("#btnDateDesc");

// Filtrer par date
const inputFilterYear = document.getElementById("filterYear");
const btnFilterYear = document.getElementById("btnFilterYear");

// Rechercher un livre par son titre
const inputBookName = document.querySelector("#inputBookName");
const btnSearchBook = document.querySelector("#btnSearchBook");

// Variable pour stocker les livres
var books = [];
var sortMethod = "";

var filter = "";

// Chargement
setTimeout(() => {
  document.getElementById("loader").style.display = "none";
  document.getElementById("content").style.display = "block";
}, 2000); // 2 secondes pour un test

// Requête fetch
// Je créé ma fonction pour récupérer les livres
const fetchBooksData = async (search = "the lord of the rings") => {
  try {
    let url = `https://openlibrary.org/search.json?q=${search}`;

    if (!isNaN(search)) {
      // Si c'est un nombre (pour ici c'est l'année), on filtre aussi sur l'année
      url += `&first_publish_year=${search}`;
    }

    const request = await fetch(url);
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
  // En gros, si par exemple, je saisie l'année 1950, je n'ai que les films de 1950 et ainsi de suite mais pour une autre date
  if (filter) {
    copieBooks = copieBooks.filter((book) => {
      return book.first_publish_year && book.first_publish_year == filter;
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

  // Vérifier s'il y a des livres
  if (copieBooks.length === 0) {
    main.innerHTML = `<p class="no-results">Aucun livre trouvé.</p>`;
    return;
  }

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

//////////////
// Input pour rechercher un livre
/////////////
btnSearchBook.addEventListener("click", () => {
  const searchValue = inputBookName.value;
  if (searchValue !== "") {
    fetchBooksData(searchValue);
    inputBookName.value = ""; // une fois la recherche lancé, le champ texte se vide
  }
});

// test également si on appuie sur "Entrée" après avoir saisie le nom du livre
inputBookName.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const search = e.target.value.trim();
    if (search !== "") {
      fetchBooksData(search);
      inputBookName.value = ""; // une fois la recherche lancé, le champ texte se vide
    }
  }
});
