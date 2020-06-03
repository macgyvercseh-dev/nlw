import Knex from 'knex';

export async function up(knex: Knex){
    // Criar a tabela
    return knex.schema.createTable('points', table => {
        table.increments('id').primary,
        table.string('image').notNullable(),
        table.string('name').notNullable(),
        table.string('email').notNullable(),
        table.string('whats').notNullable(),
        table.string('city').notNullable(),
        table.string('uf', 2).notNullable(),
        table.decimal('latitude').notNullable(),
        table.decimal('longitude').notNullable();
            
    })

}
export async function down(knex: Knex){
    // Voltar atrás (Deletar a tabela)
    return knex.schema.dropTable('point')
}