import Menu from './menu.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container,Table } from 'reactstrap';
import Dado from '../dado/generico.js';
import { useState, React, useEffect } from 'react';
import Carregamento from './carregamento.js';
function Insumo() {
    const [lista, setLista] = useState("");
    const [carregando, setCarregando] = useState("")
    useEffect(() => {
        listar()
    }, [])

    function listar() {
        setCarregando(true)
        Dado.listar("ranking")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setLista(response.data.lista)
                    } else {
                        setLista([])
                        console.log("error: " + response.data.descricao)

                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
            .finally(() => {
                setCarregando(false)
            });
    }
    return (
        <Container>
            <Menu descricao="Gestão Financeira" />

            <Table>
                <thead>
                    <tr>
                        <th>
                            Cliente
                        </th>
                        <th>
                            Valor no Mês
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lista && lista.map((item) => (
                        <tr>
                            <td>
                                {item.nome}

                            </td>
                            <td>
                                R${item.total}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {carregando &&
                <Carregamento/>
            }
        </Container >
    );


}


function Pagina() {
    return <Insumo />
}


export default Pagina;