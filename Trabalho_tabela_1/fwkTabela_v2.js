let tabela = document.getElementsByTagName("tabela");

for (let i = 0; i < tabela.length; i++) {
    let tab = tabela[i];
    
   
    let linhasAttr = tab.getAttribute("linha");
    let colunasAttr = tab.getAttribute("coluna");
    
    // transforma os valores em números
    let linhas = parseInt(linhasAttr);
    let colunas = parseInt(colunasAttr);

    // cria a nova tabela
    let novaTabela = document.createElement("table");

  
    let expandElements = tab.getElementsByTagName("expand");
    let matriz = [];

    // guarda as informações das expansões em um vetor
    for (let w = 0; w < expandElements.length; w++) {
        matriz.push({
            l: parseInt(expandElements[w].getAttribute("linha")), // Faz com que sempre seja números
            c: parseInt(expandElements[w].getAttribute("coluna")), // Faz com que sempre seja números
            tam: parseInt(expandElements[w].getAttribute("tamanho")), // Faz com que sempre seja números
            tipo: expandElements[w].getAttribute("tipo")
        });
    }

    let ocupadas = new Set(); // guarda as células que já foram ocupadas por uma expansão

    // percorre as linhas da tabela
    for (let x = 0; x < linhas; x++) {
        let tr = document.createElement("tr");

        // percorre as colunas da tabela
        for (let y = 0; y < colunas; y++) {
            
            // verifica se a célula já foi ocupada por uma expansão
            if (ocupadas.has(`${x}-${y}`)) continue;

            let td = document.createElement("td");
            
            // verifica se existe expansão começando nessa posição
            let conferencia = matriz.find(item => item.l === x && item.c === y);

            if (conferencia) {
                let span = conferencia.tam;
                let tipo = conferencia.tipo;

                // expansão horizontal (para a direita)
                if (tipo === 'linha') {
                    td.setAttribute("colspan", span);

                    for (let s = 1; s < span; s++) {
                        // marca as células à direita como ocupadas
                        ocupadas.add(`${x}-${y + s}`);
                    }
                } 
                // expansão vertical (para baixo)
                else if (tipo === 'coluna') {
                    td.setAttribute("rowspan", span);

                    // percorre as células que fazem parte da expansão
                    for (let s = 1; s < span; s++) {
                        // marca as células abaixo como ocupadas
                        ocupadas.add(`${x + s}-${y}`);
                    }
                }
            }

            tr.appendChild(td);
        }

        novaTabela.appendChild(tr);
    }

    // O IF verifica se é necessário aplicar borda
    // Só entra se a borda existir e tiver espaços separando tamanho, tipo e cor
    let bordaAttr = tab.getAttribute("borda");

    if (bordaAttr && bordaAttr.includes(" ")) {
        let vetBorda = bordaAttr.split(" ");

        novaTabela.style.setProperty('--tamanho-borda', vetBorda[0]);
        novaTabela.style.setProperty('--tipo-borda', vetBorda[1]);
        novaTabela.style.setProperty('--cor-borda', vetBorda[2]);
    }

    // adiciona a tabela criada dentro do elemento <tabela>
    tab.appendChild(novaTabela);
}