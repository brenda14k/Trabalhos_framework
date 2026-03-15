let tabela = document.getElementsByTagName("tabela");

for (let i = 0; i < tabela.length; i++) {

    let tab = tabela[i];

    let linhasAttr = tab.getAttribute("linha");
    let colunasAttr = tab.getAttribute("coluna");

    let linhas = parseInt(linhasAttr);
    let colunas = parseInt(colunasAttr);

    let novaTabela = document.createElement("table");

    let expandElements = tab.getElementsByTagName("expand");// isso getElementsByTagName faz com que mesmos se a tabela não tiver expand cria a tabela
    let matriz = [];

    for (let w = 0; w < expandElements.length; w++) {
        matriz.push({
            l: parseInt(expandElements[w].getAttribute("linha")),
            c: parseInt(expandElements[w].getAttribute("coluna")),
            tam: parseInt(expandElements[w].getAttribute("tamanho")),
            tipo: expandElements[w].getAttribute("tipo")
        });
    }

    
    let dadosTag = tab.getElementsByTagName("dados")[0];
let dados = [];

if(dadosTag){

    let texto = dadosTag.textContent.trim();
    let linhaDados = texto.split("\n");

    for(let linha of linhaDados){

        let cols = linha.split("|");
        dados.push(cols.map(c => c.trim()));

    }

}

let erroMsg = "";

// verificar se linhas e colunas foram informadas
if(isNaN(linhas) || linhasAttr == ""){
    erroMsg += "Erro: Favor informar o número de linhas.<br>";
}

if(isNaN(colunas) || colunasAttr == ""){
    erroMsg += "Erro: Favor informar o número de colunas.<br>";
}


// VERIFICAÇÃO DAS EXPANSÕES

for(let k = 0; k < matriz.length; k++){

    let linha = matriz[k].l;
    let coluna = matriz[k].c;
    let tamanho = matriz[k].tam;
    let tipo = matriz[k].tipo;

      // verifica se a coluna original + tamanho do colspan ultrapassa o limite de colunas da tabela
if(tipo == "linha" && coluna + tamanho > colunas){
    erroMsg += "Erro: colspan maior que o número de colunas da tabela.<br>";
}

// verifica se a linha original + tamanho do rowspan ultrapassa o limite de linhas da tabela
if(tipo == "coluna" && linha + tamanho > linhas){
    erroMsg += "Erro: rowspan maior que o número de linhas da tabela.<br>";
}
}


// VERIFICAÇÃO DOS DADOS

let totalDados = 0;
// percorre todas as linhas de dados do elemento <dados>
for(let d = 0; d < dados.length; d++){

    // soma a quantidade de colunas existentes em cada linha
    totalDados += dados[d].length;
}

// verifica se a quantidade total de dados ultrapassa
// o número máximo de células da tabela (linhas × colunas)
if(totalDados > linhas * colunas){

    
    erroMsg += "Erro: Existem informações a mais no elemento <dados>.<br>";

}


// MOSTRAR ERRO (APENAS UMA VEZ)

if(erroMsg != ""){

    let erro = document.createElement("p");

    erro.style = "color:red; font-weight:bold;";

    erro.innerHTML = erroMsg;

    tab.appendChild(erro);

    continue;
}
    
    // CRIAÇÃO DA TABELA
    
    let ocupadas = new Set();

    for (let x = 0; x < linhas; x++) {

        let tr = document.createElement("tr");

        for (let y = 0; y < colunas; y++) {

            if (ocupadas.has(`${x}-${y}`)) continue;

            let td = document.createElement("td");

            if(dados[x] && dados[x][y]){
                td.innerText = dados[x][y];
            }

            let conferencia = matriz.find(item => item.l === x && item.c === y);

            if (conferencia) {

                let span = conferencia.tam;
                let tipo = conferencia.tipo;

                if (tipo === 'linha') {

                    td.setAttribute("colspan", span);

                    for (let s = 1; s < span; s++) {
                        ocupadas.add(`${x}-${y + s}`);
                    }

                } 
                else if (tipo === 'coluna') {

                    td.setAttribute("rowspan", span);

                    for (let s = 1; s < span; s++) {
                        ocupadas.add(`${x + s}-${y}`);
                    }

                }

            }

            tr.appendChild(td);

        }

        novaTabela.appendChild(tr);

    }

    let bordaAttr = tab.getAttribute("borda");

if (bordaAttr && bordaAttr.includes(" ")) {

    let vetBorda = bordaAttr.split(" ");

    novaTabela.style.setProperty('--tamanho-borda', vetBorda[0]);
    novaTabela.style.setProperty('--tipo-borda', vetBorda[1]);
    novaTabela.style.setProperty('--cor-borda', vetBorda[2]);

}

    tab.appendChild(novaTabela);

}