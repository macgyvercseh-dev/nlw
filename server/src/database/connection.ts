import knex from 'knex'; // importando a lib do knex
import path from 'path'; 


const connection = knex({ // criamos uma variavel consta para armazenar os dados de conexão
    client: 'sqlite3', // definimos o tipo de cliente
    connection: {
        filename: path.resolve(__dirname, 'data.sqlite'), // e o nome do banco de dados. __dirname faz sempre voltar para a página connection.ts
    },
    useNullAsDefault: true,
})





export  default connection;


// Migrations: Histórico do banco de dados
