const prompt = require('prompt-sync')();
const { Client } = require('pg');

// Configuração do banco de dados
const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Login',
  password: '12345',
  port: 5432,
});

db.connect();

// Menu de opções
async function menu() {
  let opcao;
  do {
    console.log(`
=== MENU LOGIN ===
1 - Inserir usuário
2 - Listar usuários
3 - Deletar tabela login
4 - Sair
        `);

    opcao = prompt('Escolha uma opção: ');

    switch (opcao) {
      case '1':
        await inserirUsuario();
        break;
      case '2':
        await listarUsuarios();
        break;
      case '3':
        await deletarTabela();
        break;
      case '4':
        console.log('Encerrando...');
        break;
      default:
        console.log('Opção inválida.');
    }
  } while (opcao !== '4');

  db.end();
}

async function inserirUsuario() {
  const nome = prompt('Nome: ');
  const email = prompt('Email: ');
  const senha = prompt('Senha: ');

  try {
    await db.query(
      'INSERT INTO login (nome, email, senha) VALUES ($1, $2, $3)',
      [nome, email, senha]
    );
    console.log('Usuário inserido com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir:', error.message);
  }
}

async function listarUsuarios() {
  try {
    const result = await db.query('SELECT * FROM login');
    console.log('Usuários cadastrados:');
    result.rows.forEach((user) => {
      console.log(`ID: ${user.id}, Nome: ${user.nome}, Email: ${user.email}`);
    });
  } catch (error) {
    console.error('Erro ao listar:', error.message);
  }
}

async function deletarTabela() {
  const confirmar = prompt(
    'Tem certeza que deseja deletar a tabela login? (s/n): '
  );
  if (confirmar.toLowerCase() === 's') {
    try {
      await db.query('DROP TABLE login');
      console.log("Tabela 'login' deletada com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar:', error.message);
    }
  } else {
    console.log('Ação cancelada.'); 
    
    // Função para consultar previsão do tempo
async function consultarPrevisao() {
  const cidade = prompt('Digite o nome da cidade: ');

  try {
    // Obter coordenadas
    const geo = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: cidade,
        format: 'json',
        limit: 1,
      },
    });

    if (geo.data.length === 0) {
      console.log('Cidade não encontrada.\n');
      return;
    }

    const { lat, lon } = geo.data[0];

    // Obter previsão do tempo
    const tempo = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
      },
    });

    const clima = tempo.data.current_weather;
    console.log(`\nPrevisão em ${cidade}:`);
    console.log(`Temperatura: ${clima.temperature}°C`);
    console.log(`Vento: ${clima.windspeed} km/h`);
    console.log(`Data/Hora: ${clima.time}\n`);
  } catch (err) {
    console.error('Erro ao consultar API:', err.message);
  }
}

// Início do sistema
(async () => {
  const logado = await login();
  if (logado) {
    await consultarPrevisao();
  }
  db.end();
})();
  }
}

menu();
