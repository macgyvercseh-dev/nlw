import path from 'path'; 

module.exports = {
    client: 'sqlite3', // definimos o tipo de cliente
    connection: {
        filename: path.resolve(__dirname,'src', 'database', 'data.sqlite'), // caminho para o bd
    },
    migrations: {
        directory: path.resolve(__dirname,'src', 'database', 'migrations'),
    },
    seeds: {
        directory: path.resolve(__dirname,'src', 'database', 'seeds'),
    },
    useNullAsDefault: true,
}