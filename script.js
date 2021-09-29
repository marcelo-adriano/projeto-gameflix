const principal = document.querySelector('main');
const chaveApi = 'c6f2e394cb2b4280a46ada2151482eac';

const stringGenres = '4,51,3,5,2,1,6';
const stringConsoles = '4,187,18,1,186,7';

const data = new Date();
const todayDate = `${data.getFullYear()}-${(data.getMonth()+1).toString().padStart(2,'0')}-${data.getDate()}`;
const ultimosSeisAnos = `${data.getFullYear()-6}-${(data.getMonth()+1).toString().padStart(2,'0')}-${data.getDate()}`;

let eixoX = [];

function criarBotao(classeDoPai, classes, texto, eixoXIndex) {
  const botao = document.createElement("button");
  classes.forEach((classe) => botao.classList.add(classe));
  botao.innerText = texto;
  let direcao = classes.includes("antes") ? -1 : 1;

  botao.addEventListener("click", () =>
    carrossel(direcao, classeDoPai, eixoXIndex)
  );

  return botao;
}

function criarDivJogo(classe, objeto) {
  const gameDiv = document.createElement("div");
  gameDiv.classList.add(classe);
  gameDiv.classList.add(objeto.id);
  // console.log(gameDiv.classList[1]);
  gameDiv.style.backgroundImage = `url(${objeto.background_image})`;
  
  const spanName = document.createElement('span');
  spanName.innerText = objeto.name;
  spanName.classList.add('name-game');

  gameDiv.appendChild(spanName);

  // const gameDescription = document.createElement('p');
  // spanName.innerText = objeto.des;
  // spanName.classList.add('name-game');
  
  const spanMetacritic = document.createElement('span');
  spanMetacritic.innerText = objeto.metacritic;
  spanMetacritic.classList.add('score-game');

  gameDiv.appendChild(spanMetacritic);

  return gameDiv;
}

function criarCategoria(nomeCategoria, jogos) {
  eixoX.push(0);
  const eixoXIndex = eixoX.length - 1;
  const categoriaDiv = document.createElement("div");
  categoriaDiv.classList.add("categorias");
  categoriaDiv.classList.add(nomeCategoria);
  categoriaDiv.appendChild(criarBotao(nomeCategoria, ["botao", "antes"], "<", eixoXIndex));

  const slideDiv = document.createElement("div");
  slideDiv.classList.add("slide");
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("container");
  jogos.forEach((jogo) => {
    const jogoDiv = criarDivJogo("block", jogo);
    containerDiv.appendChild(jogoDiv);
  });
  slideDiv.appendChild(containerDiv);
  categoriaDiv.appendChild(slideDiv);
  categoriaDiv.appendChild(
    criarBotao(nomeCategoria, ["botao", "depois"], ">", eixoXIndex)
  );

  const category = document.createElement('span');
  category.classList.add('categorySubtitle');
  let categoriaNomeBonito = '';
  if(nomeCategoria === 'aclamados-critica') categoriaNomeBonito = 'Aclamados Pela Crítica';
  else if(nomeCategoria === 'role-playing-games-rpg') categoriaNomeBonito = 'RPG';
  else categoriaNomeBonito = nomeCategoria;
  category.innerText = categoriaNomeBonito;

  principal.appendChild(category);
  principal.appendChild(categoriaDiv);
}

function carrossel(direcao, categoria, eixoXIndex) {
  const boxes = document.querySelectorAll(`.${categoria} .block`);
  const aBox = boxes[boxes.length - 1];
  const caixa = document.querySelector(`.${categoria} .container`);
  const larCont = caixa.clientWidth;
  const margin = parseInt(getComputedStyle(aBox).marginLeft, 10) * 2;
  const larBlk = (aBox.offsetWidth + margin) * boxes.length;
  const deslFinal = parseFloat((larBlk / larCont - 1).toFixed(2));
  eixoX[eixoXIndex] += direcao;
  if (deslFinal < eixoX[eixoXIndex]) {
    eixoX[eixoXIndex] = deslFinal;
  }
  if (eixoX[eixoXIndex] < 0) {
    eixoX[eixoXIndex] = 0;
  }
  caixa.style.transform = `translateX(${-eixoX[eixoXIndex] * larCont}px)`;
}

function headers() {
  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return {
      method: 'GET',
      headers: myHeaders,
  }
}

async function getInfo(urlApi, arrayCheck) {
    const response = await fetch(urlApi, headers());
    const elementos = await response.json();
    return elementos.results.filter((elemente) => arrayCheck.includes(elemente.slug));
}

async function getGames(urlApi) {
    let retorno = [];
    let nextPage = '';
    let response;
    for (let index = 0; index < 6; index += 1) {
        const urlRequest = index === 0 ? urlApi : nextPage;
        response = await fetch(urlRequest, headers());
        const elementos = await response.json();
        nextPage = elementos.next;
        retorno = retorno.concat(elementos.results);
    }
    return retorno;
}

window.onload = async () => {
    const objetoGamesMetacritic = await getGames(`https://api.rawg.io/api/games?key=${chaveApi}&genres=${stringGenres}&platforms=${stringConsoles}&dates=${todayDate}.${ultimosSeisAnos}&metacritic=96,100&page_size=1`);
    criarCategoria('aclamados-critica', objetoGamesMetacritic);

    const objetoGames = await getGames(`https://api.rawg.io/api/games?key=${chaveApi}&genres=${stringGenres}&platforms=${stringConsoles}&dates=${todayDate}.${ultimosSeisAnos}&page_size=40`);
    stringGenres.split(',').forEach((genre) => {
      let contador = 0;
      const gamesChoosed = objetoGames.filter((game) => {
        return game.genres.some((genero) => {
          contador = genero.id === parseInt(genre, 10) ? contador + 1 : contador;
          return genero.id === parseInt(genre, 10);
        }) && contador < 20;
      });
      const genreSlug = gamesChoosed[0].genres.find((elemento) => elemento.id === parseInt(genre, 10));
      criarCategoria(genreSlug.slug, gamesChoosed);
    });

};
