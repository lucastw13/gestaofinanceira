import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import Usuario from "../dado/usuario.js";
import Host from '../dado/host.js';
import { useRouter } from 'next/router'
import Carregamento from './carregamento.js';
import styles from './competencia.module.css'
function Competencia() {
    const [lista, setLista] = useState("");
    const [itemModal, setItemModal] = useState("");
    const router = useRouter();
    const [carregando, setCarregando] = useState("")
    useEffect(() => {
        listar()
    }, [])

    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);
    function exibirModal(itemRegistro) {
        setItemModal(itemRegistro)
        toggleModal()
    }
    function listar() {
        setCarregando(true)
        Dado.listar("competencia")
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
                    </tr>
                </thead>
                <tbody>
                    {lista && lista.map((item) => (
                        <tr onClick={() => exibirModal(item)}>
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

                        </tr>

                    ))}
                </tbody>
            </Table>

            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>{itemModal.mes}/{itemModal.ano}</ModalHeader>
                <ModalBody>
                    <h6>Entradas:</h6>
                    <Table className={styles.entrada}>
                        {itemModal.entrada && itemModal.entrada.map((itemEntrada) => (
                            <tr>
                                <td>{itemEntrada.descricao}</td> <td>R${itemEntrada.valor}</td>
                                <br />
                            </tr>
                        ))}
                    </Table>
                    <br />
                    <h6>Saídas:</h6>
                    <Table className={styles.saida}>
                        {itemModal.saida && itemModal.saida.map((itemSaida) => (
                            <tr>
                                <td>{itemSaida.descricao}</td><td>R${itemSaida.valor}</td>
                                <br />
                            </tr>
                        ))}
                    </Table>
                    <br />
                    <h6>Saídas Recorrentes:</h6>
                    <Table className={styles.saidaRecorrente}>
                        {itemModal.saidaRecorrente && itemModal.saidaRecorrente.map((itemSaidaRecorrente) => (
                            <tr>
                                <td>{itemSaidaRecorrente.descricao}</td><td>R${itemSaidaRecorrente.valor}</td>
                                <br />
                            </tr>
                        ))}
                    </Table>
                    <br />
                    <Table className={styles.saidaMozao}>
                        <tr>
                            <td><h6>Mozão</h6></td><td>{itemModal.totalMozao}</td>
                        </tr>
                    </Table>
                    <Table className={styles.saidaRecorrente}>
                        {itemModal.mozao && itemModal.mozao.map((itemSaidaMozao) => (
                            <tr>
                                <td>{itemSaidaMozao.descricao}</td><td>R${itemSaidaMozao.valor}</td>
                                <br />
                            </tr>
                        ))}
                    </Table>
                    <br />
                </ModalBody>
            </Modal>
            {carregando &&
                <Carregamento />
            }
        </Container>
    );


}


function Pagina() {
    return <Competencia />
}


export default Pagina;