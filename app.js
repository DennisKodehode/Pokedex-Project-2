const pokemonGrid = document.querySelector(".pokemon-grid");
const pageBtnsWrapper = document.querySelector(".page-btns-wrapper");
const POKEMON_API_URL = "https://pokeapi.co/api/v2";
let page = 1;
let pokemonList = [];

const fetchPokemons = async (limit, offset) => {
  try {
    const response = await fetch(
      `${POKEMON_API_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    const jsonBody = await response.json();
    // console.log(jsonBody.results);
    return jsonBody.results;
  } catch (err) {
    return [];
  }
};

const fetchPokemon = async (url) => {
  try {
    const response = await fetch(url);
    const jsonBody = await response.json();
    // console.log(jsonBody);
    return jsonBody;
  } catch (err) {
    return {};
  }
};

const fetchSpecies = async (id) => {
  try {
    const response = await fetch(`${POKEMON_API_URL}/pokemon-species/${id}`);
    const jsonBody = await response.json();
    // console.log(jsonBody.genera[7].genus);
    return jsonBody.genera[7].genus;
  } catch (err) {
    return "";
  }
};

const goToNextPage = () => {
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.classList.add("page-btn");
  nextBtn.addEventListener("click", async () => {
    page++;
    await renderPage();
  });
  return nextBtn;
};

const goToPrevPage = () => {
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.classList.add("page-btn");
  prevBtn.addEventListener("click", async () => {
    if (page <= 1) {
      return;
    }
    page--;
    await renderPage();
  });

  return prevBtn;
};

const pokemonTypes = [
  { name: "Normal", color: "#A8A77A" },
  { name: "Fire", color: "#EE8130" },
  { name: "Electric", color: "#F7D02C" },
  { name: "Ice", color: "#96D9D6" },
  { name: "Poison", color: "#A33EA1" },
  { name: "Flying", color: "#A98FF3" },
  { name: "Bug", color: "#A6B91A" },
  { name: "Ghost", color: "#735797" },
  { name: "Dark", color: "#705746" },
  { name: "Water", color: "#6390F0" },
  { name: "Grass", color: "#7AC74C" },
  { name: "Fighting", color: "#C22E28" },
  { name: "Ground", color: "#E2BF65" },
  { name: "Psychic", color: "#F95587" },
  { name: "Rock", color: "#B6A136" },
  { name: "Dragon", color: "#6F35FC" },
  { name: "Steel", color: "#B7B7CE" },
  { name: "Fairy", color: "#D685AD" },
];

const buildPage = async (pokemons) => {
  pokemonGrid.replaceChildren();

  for (let pokemon of pokemons) {
    const pokemonData = await fetchPokemon(pokemon.url);
    // div.card>div.fav-wrapper>img.fav-img +h2+img+p
    const card = document.createElement("div");
    card.classList.add("card");
    // pokemonData.types[0].type.name
    console.log(pokemonData.types[0].type.name);

    const favWrapper = document.createElement("div");
    favWrapper.classList.add("fav-wrapper");

    const favImg = document.createElement("img");
    favImg.src = `./images/unfav.svg`;
    favImg.classList.add("fav-img");
    favWrapper.append(favImg);

    const pokeName = document.createElement("h2");
    pokeName.textContent = `${pokemonData.name}`;

    const pokeImg = document.createElement("img");
    pokeImg.src = `./images/${pokemon.name}.png`;
    pokeImg.width = 150;
    pokeImg.height = 150;

    const pokemonDesc = await fetchSpecies(pokemonData.id);
    const pokemonDescription = document.createElement("p");
    pokemonDescription.textContent = `The ${pokemonDesc}`;

    card.append(favWrapper, pokeName, pokeImg, pokemonDescription);

    pokemonGrid.append(card);
  }

  pageBtnsWrapper.replaceChildren();
  const pageNum = document.createElement("p");
  pageNum.textContent = page;
  pageBtnsWrapper.append(goToPrevPage(), pageNum, goToNextPage());
};

const renderPage = async () => {
  pokemonList = await fetchPokemons(9, (page - 1) * 9);
  await buildPage(pokemonList);
};

renderPage().then();
