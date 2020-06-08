import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './style.css';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import * as yup from 'yup'


const CreatePoint = () => {

    interface Item {
        id: number;
        name: string;
        image_url: string;
    }

    interface IBGEUfResponse {
        sigla: string;
    }

    interface IBGECityResponse {
        nome: string;
    }



    //Precisamos manualmente informar o tipo da variavel armazenada
    const [items, setItems] = useState <Item[]> ([]);

    // Armazena a uf que o usuario selecionou
    const [selectedUf, setSelectedUf] = useState('0')

    // Armazenar as ufs
    const [uf, setUf] = useState<string[]>([]);

    const [selectedCity, setSelectedCity] = useState('0')

    const history =  useHistory();

    // Armazenar as cidades
    const [city, setCity] = useState<string[]>([]);

    //Itens selecionados pelo usuario
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])

    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    //pegar os items da api local
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);



    //Pegar os itens da cidade
    useEffect(() => {
        //carregar as cidades sempre que a uf mudar
        if (selectedUf === '0'){
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityName = response.data.map(city => city.nome)
            setCity(cityName)
        })
    })

    //api do IBGE de uf
    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUf(ufInitials)
        })
    }, []);

    //Vai disparar assim que a tela for carregada o marker com a posiçao do usuario inicial
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude,longitude} = position.coords;

            setInitialPosition([latitude,longitude]);
        });
    }, [])



    //Obtendo valor da UF
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf)
    }
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
            const city = event.target.value;
            setSelectedCity(city)
        }

    
    // dar a opção de clicar no mapa e pegar as informações de localização lat e long
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value });
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems, id])
        }

        
    }

    async function Submit(event: FormEvent){
        event.preventDefault();
        const  { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }
        console.log(data)
       await api.post('points', data) // dados para criar o point

       alert('Ponto de coleta criado');
       history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para a home
                </Link>
            </header>

            <form onSubmit={Submit}>
                <h1>Cadastro do <br /> Ponto de Coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">
                            Nome da Entidade:
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">
                                E-mail:
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">
                                Whatsapp:
                            </label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>


                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>

                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF): </label>
                            <select onChange={handleSelectUf} value={selectedUf} name="uf" id="uf">
                                <option value="0">Selecione uma uf</option>
                                {uf.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade: </label>
                            <select value={selectedCity} onChange={handleSelectCity} name="city" id="city">
                            {city.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo:</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id)? 'selected': ''}>
                                <img src={item.image_url} alt={item.name} />
                                <span>{item.name}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit">Cadastrar Ponto de Coleta</button>

            </form>
        </div>
    )
}

export default CreatePoint;