const pokemonGrid = document.querySelector(".pokemon-grid");
const pageBtnsWrapper = document.querySelector(".page-btns-wrapper");
const filterViewport = document.querySelector(".filter-viewport")
const searchInput = document.querySelector("#search")

let page = 1;
const pageSize = 9;

const POKEMON_API_URL = "https://pokeapi.co/api/v2";
let pokemonList = [];
let pokemonsData = [];

const pokemonTypes = [
  { name: "normal",   color: "#A8A77A", shadow: "0 4px 12px 0 rgba(168, 167, 122, 0.6)", isSelected: false },
  { name: "fire",     color: "#EE8130", shadow: "0 4px 12px 0 rgba(238, 129, 48, 0.6)", isSelected: false },
  { name: "electric", color: "#F7D02C", shadow: "0 4px 12px 0 rgba(247, 208, 44, 0.6)", isSelected: false },
  { name: "ice",      color: "#96D9D6", shadow: "0 4px 12px 0 rgba(150, 217, 214, 0.6)", isSelected: false },
  { name: "poison",   color: "#A33EA1", shadow: "0 4px 12px 0 rgba(163, 62, 161, 0.6)", isSelected: false },
  { name: "bug",      color: "#A6B91A", shadow: "0 4px 12px 0 rgba(166, 185, 26, 0.6)", isSelected: false },
  { name: "ghost",    color: "#735797", shadow: "0 4px 12px 0 rgba(115, 87, 151, 0.6)", isSelected: false },
  { name: "water",    color: "#6390F0", shadow: "0 4px 12px 0 rgba(99, 144, 240, 0.6)", isSelected: false },
  { name: "grass",    color: "#7AC74C", shadow: "0 4px 12px 0 rgba(122, 199, 76, 0.6)", isSelected: false },
  { name: "fighting", color: "#C22E28", shadow: "0 4px 12px 0 rgba(194, 46, 40, 0.6)", isSelected: false },
  { name: "ground",   color: "#E2BF65", shadow: "0 4px 12px 0 rgba(226, 191, 101, 0.6)", isSelected: false },
  { name: "psychic",  color: "#F95587", shadow: "0 4px 12px 0 rgba(249, 85, 135, 0.6)", isSelected: false },
  { name: "rock",     color: "#B6A136", shadow: "0 4px 12px 0 rgba(182, 161, 54, 0.6)", isSelected: false },
  { name: "dragon",   color: "#6F35FC", shadow: "0 4px 12px 0 rgba(111, 53, 252, 0.6)", isSelected: false },
  { name: "fairy",    color: "#D685AD", shadow: "0 4px 12px 0 rgba(214, 133, 173, 0.6)", isSelected: false }
]
let selectedTypes = [];
let searchText = ""

let favoriteIds = new Set(JSON.parse(localStorage.getItem("favoriteIds") || "[]"));

//get search from user input
searchInput.addEventListener("input", e => {
  searchText = e.target.value.trim().toLowerCase();
  page = 1;
  console.log(searchText)
  renderPage()
})

//get pokemons (returns name & url only)
const fetchPokemons = async (limit, offset) => {
  try {
    const response = await fetch(
      `${POKEMON_API_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    const jsonBody = await response.json();
    return jsonBody.results;
  } catch (err) {
    return [];
  }
};

//get data of pokemon --> needs id
const fetchPokemon = async (url) => {
  try {
    const response = await fetch(url);
    const jsonBody = await response.json();
    return jsonBody;
  } catch (err) {
    return {};
  }
};

//save all pokemons data in pokemonsData variable
const getPokemonData = async () => {
  pokemonList = await fetchPokemons(151, 0);
  for (let pokemon of pokemonList){
    const thisPokemonData = await fetchPokemon(pokemon.url)
    pokemonsData.push(thisPokemonData)
  }
}

//get description text
const fetchSpecies = async (id) => {
  try {
    const response = await fetch(`${POKEMON_API_URL}/pokemon-species/${id}`);
    const jsonBody = await response.json();
    return jsonBody.genera[7].genus;
  } catch (err) {
    return "";
  }
};

//create next btn & update page before re-render --> return btn
const goToNextPage = () => {
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.classList.add("page-btn");
  nextBtn.addEventListener("click", async () => {
    if (page >= 17){
      return
    }
    page++;
    await renderPage();
  });
  return nextBtn;
};

//create prev btn & update page before re-render --> return btn
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

//helper to style filter pills
const stylePill = (pill, type) => {
      pill.style.backgroundColor = `${type.isSelected ? type.color : ''}`
      pill.style.color = `${type.isSelected ? '#1E1E1E' : '#E5E5E5'}`
      pill.style.borderColor = `${type.isSelected ? '' : type.color}`
}

//helper to check if pokemon id is in favorites
const isFav = (id) => favoriteIds.has(id);

//helper to toggle favorite
const toggleFav = (id) => {
  if (favoriteIds.has(id)) favoriteIds.delete(id);
  else favoriteIds.add(id);
  localStorage.setItem("favoriteIds", JSON.stringify([...favoriteIds]));
};

//create all dynamic elements on page
const buildPage = async (pokemons) => {
  filterViewport.replaceChildren();
  //build filter pane
  for (let type of pokemonTypes){
    const filterPill = document.createElement("button")
    filterPill.classList.add("filter-pill")
    filterPill.textContent = `${type.name}`

    //style pill
    stylePill(filterPill,type);
    
    filterPill.addEventListener("click",() => {
      //deal with default = all categories selected
      type.isSelected = !type.isSelected

      //style pill
      stylePill(filterPill,type);
      
      for (let type of pokemonTypes) {
      if(type.isSelected && !selectedTypes.includes(type.name)) {
        //add
        selectedTypes.push(type.name)
      }  
      else if(!type.isSelected && selectedTypes.includes(type.name)){
            // remove
          selectedTypes = selectedTypes.filter(typeName => typeName !== type.name) 
      }    
      //reset page
      page = 1
}
renderPage()     

  })

    filterViewport.append(filterPill)
  }  


  // building the cards
  pokemonGrid.replaceChildren();

  for (let pokemon of pokemons) {
    // div.card>div.fav-wrapper>img.fav-img +h2+img+p
    const card = document.createElement("div");
    card.classList.add("card");
    for (let type of pokemonTypes) {
      //card styling
      if (type.name === pokemon.types[0].type.name){
        card.style.borderColor = `${type.color}`
        card.style.boxShadow = `${type.shadow}`
      }
      else {continue}
    }

    const favWrapper = document.createElement("div");
    favWrapper.classList.add("fav-wrapper");

    const favImg = document.createElement("img");
    //toggle icon
    favImg.src = isFav(pokemon.id) ? "./images/fav.svg" : "./images/unfav.svg";
    favImg.classList.add("fav-img");

    favImg.addEventListener("click", () => {

      toggleFav(pokemon.id);
      favImg.src = isFav(pokemon.id) ? "./images/fav.svg" : "./images/unfav.svg";

      console.log([...favoriteIds]);
    })

    favWrapper.append(favImg);

    const pokeName = document.createElement("h2");
    pokeName.textContent = `${pokemon.name}`;

    const pokeImg = document.createElement("img");
    pokeImg.src = `./images/${pokemon.name}.png`;
    pokeImg.width = 150;
    pokeImg.height = 150;

    const pokemonDesc = await fetchSpecies(pokemon.id);
    const pokemonDescription = document.createElement("p");
    pokemonDescription.textContent = `The ${pokemonDesc}`;

    card.append(favWrapper, pokeName, pokeImg, pokemonDescription);

    pokemonGrid.append(card);
  }
//   page navigation
  pageBtnsWrapper.replaceChildren();
  const pageNum = document.createElement("p");
  pageNum.textContent = page;
  pageBtnsWrapper.append(goToPrevPage(), pageNum, goToNextPage());
};

//get pokemon for current page
const getPage = (pokemons, page, pageSize = 9) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return pokemons.slice(start, end)
}

//duh
const renderPage = async () => {
  // let filteredPokemons = pokemonsData
  // if(selectedTypes.length > 0) {
  //   filteredPokemons = pokemonsData.filter(data => selectedTypes.includes(data.types[0].type.name)) && ((data.name === searchText) || (searchText === ""))
  // }
  // else {
  //   filteredPokemons = pokemonsData.filter(data => (data.name === searchText) || (searchText === ""))
  // }

  // const pokemonsOnThisPage = getPage(filteredPokemons, page, pageSize)
  // await buildPage(pokemonsOnThisPage);

  const filteredPokemons = pokemonsData.filter(pokemon => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(pokemon.types[0].type.name);

    const matchesSearch =
      !searchText || pokemon.name.toLowerCase().includes(searchText);

    return matchesType && matchesSearch;
  });

  const pokemonsOnThisPage = getPage(filteredPokemons, page, pageSize);
  await buildPage(pokemonsOnThisPage);
};

//RUN FIRST
const init = async () => {
await getPokemonData()
await renderPage();
}

init();

