const principal = document.querySelector('main');
const chaveApi = 'c6f2e394cb2b4280a46ada2151482eac';

const stringGenres = '4,51,3,5,2,1,6';
const stringConsoles = '4,187,18,1,186,7';

const data = new Date();
const todayDate = `${data.getFullYear()}-${(data.getMonth()+1).toString().padStart(2,'0')}-${data.getDate()}`;
const ultimosSeisAnos = `${data.getFullYear()-6}-${(data.getMonth()+1).toString().padStart(2,'0')}-${data.getDate()}`;

let eixoX = [];

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

function criarElementoPadrão(elemento, classes) {
  const e = document.createElement(elemento);
  e.classList.add(classes);

  return e;
}

function criarBotao(classeDoPai, classes, texto, eixoXIndex) {
  const botao = criarElementoPadrão('button', 'botao');
  botao.classList.add(classes);
  botao.innerText = texto;
  let direcao = classes.includes("antes") ? -1 : 1;
  
  botao.addEventListener("click", () => carrossel(direcao, classeDoPai, eixoXIndex));
  
  return botao;
}

function removerGameFixed() {
  const gameFixed = document.querySelector('.popup');
  gameFixed.remove();
}

const objEsrb = {
  0: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DJCTQ_-_L.svg/1024px-DJCTQ_-_L.svg.png',
  1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/DJCTQ_-_10.svg/1024px-DJCTQ_-_10.svg.png',
  2: 'https://logodownload.org/wp-content/uploads/2017/07/classificacao-14-anos-logo.png',
  3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/DJCTQ_-_16.svg/1024px-DJCTQ_-_16.svg.png',
  4: 'https://logodownload.org/wp-content/uploads/2017/07/classificacao-18-anos-logo-1.png',
  5: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/ESRB_2013_Rating_Pending.svg/80px-ESRB_2013_Rating_Pending.svg.png'
};

function qualImagemEsrb(idEsrb = 5) {
  return objEsrb[idEsrb];
}

function criarDivInfoJogo(jogo) {
  const alvo = !jogo.target.classList[1] ? jogo.target.parentElement : jogo.target;
  const gameId = alvo.classList[1];

  fetch(`https://api.rawg.io/api/games/${gameId}?key=${chaveApi}`)
  .then((response) => response.json())
  .then((gameObject) => {
      const divFixed = criarElementoPadrão('div', 'popup');
      const scrollUpDown = criarElementoPadrão('div', 'scrollUpDown');
      const infoBox = criarElementoPadrão('div', 'box-info');
      infoBox.style.backgroundImage = `url(${gameObject.background_image_additional})`;
    
      const infoRight = criarElementoPadrão('div', 'info-right');
    
      const titleGameName = criarElementoPadrão('span', 'title-game-name');
      titleGameName.innerText = gameObject.name;
      infoRight.appendChild(titleGameName);
      const urlSite = criarElementoPadrão('button', 'url-site');
      urlSite.innerText = 'Site';
      urlSite.addEventListener('click', () => window.open( gameObject.website, '_black'))

      infoRight.appendChild(urlSite);
    
      const scoreYearAgeDiv = criarElementoPadrão('div', 'score-year-age');
      const score = criarElementoPadrão('span', 'score-game');
      score.innerText = gameObject.metacritic;
      scoreYearAgeDiv.appendChild(score);
      const releasedYear = criarElementoPadrão('span', 'released-year');
      releasedYear.innerText = gameObject.released.split('-')[0];
      scoreYearAgeDiv.appendChild(releasedYear);
      if (gameObject.esrb_rating !== null) {
        console.log(gameObject.esrb_rating);
        const esrb = criarElementoPadrão('span', 'esrb');
        const idade = qualImagemEsrb(gameObject.esrb_rating.id);
        esrb.style.backgroundImage = `url(${idade})`;
        scoreYearAgeDiv.appendChild(esrb);
      }
      infoRight.appendChild(scoreYearAgeDiv);
      
      const gameDescription = criarElementoPadrão('div', 'game-description');
      gameDescription.innerHTML = gameObject.description;
      infoRight.appendChild(gameDescription);
    
      infoBox.appendChild(infoRight);
    
      const infoLeft = criarElementoPadrão('div', 'info-left');
    
      const publishers = criarElementoPadrão('span', 'pre-list');
      publishers.innerText = 'Publishers: ';
      const publishersInner = criarElementoPadrão('span', 'list-inside');
      publishersInner.classList.add('publishers-list');
      publishersInner.innerText = gameObject.publishers.map((elemento) => elemento.name).join(', ');
      publishers.appendChild(publishersInner);
      infoLeft.appendChild(publishers);
    
      const generos = criarElementoPadrão('span', 'pre-list');
      generos.innerText = 'Genres: ';
      const generosInner = criarElementoPadrão('span', 'list-inside');
      generosInner.classList.add('generos-list');
      generosInner.innerText = gameObject.genres.map((elemento) => elemento.name).join(', ');
      generos.appendChild(generosInner);
      infoLeft.appendChild(generos);
    
      const plataformas = criarElementoPadrão('span', 'pre-list');
      plataformas.innerText = 'Platforms: ';
      const plataformasInner = criarElementoPadrão('span', 'list-inside');
      plataformasInner.classList.add('plataformas-list');
      plataformasInner.innerText = gameObject.platforms.map((elemento) => elemento.platform.name).join(', ');
      plataformas.appendChild(plataformasInner);
      infoLeft.appendChild(plataformas);
      
      infoBox.appendChild(infoLeft);
    
      const excludeButton = criarElementoPadrão('button', 'exclude-button');
      excludeButton.addEventListener('click', removerGameFixed);
    
      infoBox.appendChild(excludeButton);
      scrollUpDown.appendChild(infoBox);
    
      divFixed.appendChild(scrollUpDown);
    
      document.body.appendChild(divFixed);
  });
}

function criarDivJogo(classe, objeto) {
  const gameDiv = criarElementoPadrão('div', classe);
  gameDiv.classList.add(objeto.id);
  gameDiv.style.backgroundImage = `url(${objeto.background_image})`;
  
  const spanName = criarElementoPadrão('span', 'name-game');
  spanName.innerText = objeto.name;

  gameDiv.appendChild(spanName);
  
  const spanMetacritic = criarElementoPadrão('span', 'score-game');
  spanMetacritic.innerText = objeto.metacritic;

  gameDiv.appendChild(spanMetacritic);

  gameDiv.addEventListener('click', criarDivInfoJogo);

  return gameDiv;
}

function criarDivCategoria(categoria) {
  const categoriaDiv = criarElementoPadrão('div', 'categorias');
  categoriaDiv.classList.add(categoria);

  return categoriaDiv;
}

function nomearCategoria(nome) {
  let categoriaNomeBonito = '';
  if(nome === 'aclamados-critica') categoriaNomeBonito = 'Aclamados Pela Crítica';
  else if(nome === 'role-playing-games-rpg') categoriaNomeBonito = 'RPG';
  else categoriaNomeBonito = nome;

  return categoriaNomeBonito;
}

function criarBlocks(arrayJogos) {
  const containerDiv = criarElementoPadrão('div', 'container');
  arrayJogos.forEach((jogo) => {
    const jogoDiv = criarDivJogo('block', jogo);
    containerDiv.appendChild(jogoDiv);
  });

  return containerDiv;
}

function criarCategoria(nomeCategoria, jogos) {
  eixoX.push(0);
  const eixoXIndex = eixoX.length - 1;

  const categoriaDiv = criarDivCategoria(nomeCategoria)
  categoriaDiv.appendChild(criarBotao(nomeCategoria, 'antes', '<', eixoXIndex));

  const slideDiv = criarElementoPadrão('div', 'slide');
  const containerDiv = criarBlocks(jogos);
  
  slideDiv.appendChild(containerDiv);
  categoriaDiv.appendChild(slideDiv);
  categoriaDiv.appendChild(criarBotao(nomeCategoria, 'depois', '>', eixoXIndex));

  const category = criarElementoPadrão('span', 'categorySubtitle');
  category.innerText = nomearCategoria(nomeCategoria);

  principal.appendChild(category);
  principal.appendChild(categoriaDiv);
}

function headers() {
  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return {
      method: 'GET',
      headers: myHeaders,
  }
}

async function getGames(urlApi) {
    let response = await fetch(urlApi, headers());
    const elementos = await response.json();
    return elementos.results;
}

window.onload = async () => {
    getGames(`https://api.rawg.io/api/games?key=${chaveApi}&genres=${stringGenres}&platforms=${stringConsoles}&dates=${todayDate}.${ultimosSeisAnos}&metacritic=95,100&page_size=20`)
    .then((objetoMetacritic) => criarCategoria('aclamados-critica', objetoMetacritic));

    stringGenres.split(',').forEach((genero) => {
      getGames(`https://api.rawg.io/api/games?key=${chaveApi}&genres=${genero}&platforms=${stringConsoles}&dates=${todayDate}.${ultimosSeisAnos}&page_size=20`)
      .then((objetoAction) => {
        const genreSlug = objetoAction[0].genres.find((elemento) => elemento.id === parseInt(genero, 10));
        criarCategoria(genreSlug.slug, objetoAction);
      });
    });
}
