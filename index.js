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
  }
}

menu();
