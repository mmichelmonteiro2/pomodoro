const fs = require('fs');
const path = require('path');
const storagePath = path.resolve(__dirname, 'storage.json')

// Função para ler um arquivo json e salvar alterações baseadas no item como parâmetro
function saveToFile(newData) {
    let config = [];
    try {
        // Verifica se há dados já existentes no arquivo
        const existingData = fs.readFileSync(storagePath, 'utf8');
        // Converte para JSON utilizando o parse
        config = JSON.parse(existingData);
    } catch (err) {
        console.error('Error reading file:', err);
    }
    
    // Adiciona o novo dado no JSON
    config.push(newData);
    
    // Converte o JSON para stringify formatando com 2 de tabulação
    const updatedConfigJSON = JSON.stringify(config, null, 2);
    
    // Salva o arquivo
    fs.writeFile(storagePath, updatedConfigJSON, 'utf8', (err) => {
        if (err) {
            console.error('Error appending to storage.json:', err);
        } else {
            console.log('Data appended to storage.json');
        }
    });
}

// Função para ler um arquivo json
function listFileContents() {
    try {
        // Lê o conteúdo do arquivo
        const fileContents = fs.readFileSync(storagePath, 'utf8');
        
        // Transforma em um objeto JSON
        const jsonData = JSON.parse(fileContents);
        
        // Retorna
        return jsonData;
    } catch (err) {
        return [];
    }
}

// Função para atualizar um arquivo JSON
function updateToFile(data) {
    try {
        // Converte os dados para String
        const jsonData = JSON.stringify(data, null, 2);
        
        // Escreve os dados no arquivo, sobrescrevendo o conteúdo existente
        fs.writeFileSync(storagePath, jsonData, 'utf8');
    } catch (err) {
        console.error('Error saving to file:', err);
    }
}

module.exports = { saveToFile, listFileContents, updateToFile };

