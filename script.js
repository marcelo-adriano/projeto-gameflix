const chaveApi = 'c6f2e394cb2b4280a46ada2151482eac';

// console.log(chaveApi);

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
  console.log(slug);
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

window.onload = async () => {
  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const response = await fetch(`https://api.rawg.io/api/platforms?key=${chaveApi}`, {
      method: 'GET',
      headers: myHeaders,
  });
  const objeto = await response.json();
  objeto.results.forEach((plataforma) => criarCategoria(plataforma));
};
