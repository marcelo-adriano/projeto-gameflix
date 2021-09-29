const chaveApi = 'c6f2e394cb2b4280a46ada2151482eac';

const arrayGenres = [ 'action', 'indie', 'adventure', 'role-playing-games-rpg', 'shooter', 'racing', 'fighting'];
const arrayConsoles = ['pc', 'playstation5', "xbox-series-x", 'nintendo-switch'];


let eixoX = [];

function criarBotao(idDoPai, classes, texto, eixoXIndex) {
  const botao = document.createElement("button");
  classes.forEach((classe) => botao.classList.add(classe));
  botao.innerText = texto;
  let direcao = classes.includes("antes") ? -1 : 1;

  botao.addEventListener("click", () =>
    carrossel(direcao, idDoPai, eixoXIndex)
  );

  return botao;
}

function criarDivJogo(classe, texto) {
  const gameDiv = document.createElement("div");
  gameDiv.classList.add(classe);
  gameDiv.innerText = texto;

  return gameDiv;
}

function criarCategoria(nomeCategoria) {
  const { slug, id, games} = nomeCategoria;
  eixoX.push(0);
  const eixoXIndex = eixoX.length - 1;
  const categoriaDiv = document.createElement("div");
  categoriaDiv.classList.add("categorias");
  categoriaDiv.id = slug;
  categoriaDiv.appendChild(
    criarBotao(slug, ["botao", "antes"], "<", eixoXIndex)
  );

  const slideDiv = document.createElement("div");
  slideDiv.classList.add("slide");
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("container");
  const numeroMax = games.length;
  games.forEach((game) => {
    containerDiv.appendChild(criarDivJogo("block", game.name));
  });
  slideDiv.appendChild(containerDiv);
  categoriaDiv.appendChild(slideDiv);
  categoriaDiv.appendChild(
    criarBotao(slug, ["botao", "depois"], ">", eixoXIndex)
  );

  document.body.appendChild(categoriaDiv);
}

function carrossel(direcao, categoria, eixoXIndex) {
  const boxes = document.querySelectorAll(`#${categoria} .block`);
  const aBox = boxes[boxes.length - 1];
  const caixa = document.querySelector(`#${categoria} .container`);
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
    for (let index = 0; index < 281; index += 40) {
        if(index === 0){
            response = await fetch(urlApi, headers());
        } else {
            response = await fetch(nextPage, headers());
        }
        const elementos = await response.json();
        nextPage = elementos.next;
        retorno.concat(elementos.results);
    }
    return retorno;
}

window.onload = async () => {
    const data = new Date();
    const todayDate = `${data.getFullYear()}-${(data.getMonth()+1).toString().padStart(2,'0')}-${data.getDate()}`;
    const ultimosSeisAnos = `${data.getFullYear()-6}-${(data.getMonth()+1).toString().padStart(2,'0')}-${data.getDate()}`;
    const objetoGeneros = await getInfo(`https://api.rawg.io/api/genres?key=${chaveApi}`, arrayGenres);
    const objetoPlataformas = await getInfo(`https://api.rawg.io/api/platforms?key=${chaveApi}`, arrayConsoles);
    
    const stringPlataformas = objetoPlataformas.map((plataforma) => plataforma.id).join(',');
    const stringGeneros = objetoGeneros.map((genero) => genero.id).join(',');

    const objetoGames = await getGames(`https://api.rawg.io/api/games?key=${chaveApi}&genres=${stringGeneros}&platforms=${stringPlataformas}&dates=${todayDate}.${ultimosSeisAnos}&page_size=40`);
};
