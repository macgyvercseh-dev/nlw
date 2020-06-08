import {Request, Response} from 'express';
import knex from '../database/connection';
class ItemsController {
async index(request: Request, response: Response) { // adicionando a rota /items
    const items = await knex('items').select('*'); // buscando os itens no banco de dados, reunindo todos
    const serializedItems = items.map(item => {
            return {
            id: item.id,
            name: item.title,
            image_url: `http://10.10.10.104:3333/uploads/${item.image}`,
        }
    })
    return response.json(serializedItems)

    }
}

export default ItemsController;