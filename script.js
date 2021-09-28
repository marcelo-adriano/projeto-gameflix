let index = [];

function criarBotao(idDoPai, classes, texto, indexIndex) {
  const botao = document.createElement('button');
  classes.forEach((classe) => botao.classList.add(classe));
  botao.innerText = texto;
  let direcao = classes.includes('antes') ? -1 : 1;

  botao.addEventListener("click", () => carrossel(direcao, idDoPai, indexIndex));

  return botao;
}

function criarDivJogo(classe, texto) {
    const gameDiv = document.createElement('div');
    gameDiv.classList.add(classe);
    gameDiv.innerText = texto;
  
    return gameDiv;
  }

function criarCategoria(nomeCategoria) {
  index.push(0);
  const indexIndex = index.length - 1;
  const categoriaDiv = document.createElement("div");
  categoriaDiv.classList.add("categorias");
  categoriaDiv.id = nomeCategoria;
  categoriaDiv.appendChild(criarBotao(nomeCategoria, ["botao", "antes"], "<", indexIndex));

  const slideDiv = document.createElement("div");
  slideDiv.classList.add("slide");
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("container");
  const numeroMax = 25;
  for (let i = 1; i <= numeroMax; i += 1) {
    containerDiv.appendChild(criarDivJogo("block", i));
  }
  slideDiv.appendChild(containerDiv);
  categoriaDiv.appendChild(slideDiv);
  categoriaDiv.appendChild(criarBotao(nomeCategoria, ["botao", "depois"], ">", indexIndex));

  document.body.appendChild(categoriaDiv);
}


function carrossel(direcao, categoria, indexIndex) {
  const boxes = document.querySelectorAll(`#${categoria} .block`);
  const aBox = boxes[boxes.length - 1];
  const caixa = document.querySelector(`#${categoria} .container`);
  const larCont = caixa.clientWidth;
  const margin = parseInt(getComputedStyle(aBox).marginLeft, 10) * 2;
  const larBlk = (aBox.offsetWidth + margin) * boxes.length;
  const deslFinal = parseFloat((larBlk / larCont - 1).toFixed(2));
  index[indexIndex] += direcao;
  if (deslFinal < index[indexIndex]) {
    index[indexIndex] = deslFinal;
  }
  if (index[indexIndex] < 0) {
    index[indexIndex] = 0;
  }
  caixa.style.transform = `translateX(${-index[indexIndex] * larCont}px)`;
}

window.onload = () => {
  criarCategoria("nomeCategoria");
  criarCategoria("nomeCategoriaDois");
  criarCategoria("nomeCategoriaTres");
};
