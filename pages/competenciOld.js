import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import Usuario from "../dado/usuario.js";
import Host from '../dado/host.js';
import { useRouter } from 'next/router'
import Carregamento from './carregamento.js';
function Competencia() {
    const [lista, setLista] = useState("");
    const router = useRouter();
    const [carregando, setCarregando] = useState("")
    useEffect(() => {
        listar()
    },[])

    function listar() {
        setCarregando(true)
        Dado.listar("competencia")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        /*var listaTemp = []
                        for(var itemTemp of response.data.lista){
                            itemTemp.entradas = 0
                            for(var itemEntrada of itemTemp.entrada){
                                itemTemp.entradas = itemTemp.entradas + itemEntrada.valor
                            }
                            itemTemp.saidas = 0
                            for(var itemSaida of itemTemp.saida){
                                itemTemp.saidas = itemTemp.saidas + itemSaida.valor
                            }
                            itemTemp.saldo = itemTemp.entradas - itemTemp.saidas
                            listaTemp.push(itemTemp)
                        }*/
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

    function deletar(item) {
        var deletar = confirm("Deseja excluir o competencia: " + item.descricao + " ?");
        if (deletar) {
            Dado.deletar(item._id, "competencia")
                .then(response => {
                    if (response.data != null) {
                        if (response.data.status == true) {
                            listar()
                        } else {
                            console.log("error: " + response.data.descricao)
                        }
                    }
                }, (error) => {
                    console.log("error: " + error)
                })
        }

    }
    return (
        <Container>
            <Menu descricao="Competencias" />
            <Table>
                <thead>
                    <tr>
                        <th>
                            Mês
                        </th>
                        <th>
                            Ano
                        </th>
                        <th>
                            Entradas
                        </th>
                        <th>
                            Saídas
                        </th>
                        <th>
                            Saldo
                        </th>
                        <th>
                            <a href={Host.url() + "/competencia/incluir"}>
                                <img src='/+.png' width="20px" />
                            </a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lista && lista.map((item) => (
                       <tr onClick={() => router.push(Host.url() + "/competencia/" + item._id)}>
                       <td>
                           {item.mes}
                       </td>
                       <td>
                           {item.ano}
                       </td>
                       <td>
                           {item.totalEntrada}
                       </td>
                       <td>
                           {item.totalSaida}
                       </td>
                       <td>
                           {item.saldo}
                       </td>
                       <td>
                           <img src='/x.png' width="20px" onClick={() => deletar(item)} />

                       </td>

                   </tr>

                    ))}
                </tbody>
            </Table>

            {carregando &&
                <Carregamento/>
            }
        </Container>
    );


}


function Pagina() {
    return <Competencia />
}


export default Pagina;