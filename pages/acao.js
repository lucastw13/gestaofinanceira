import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table, Label, Input, ModalFooter, Modal, ModalBody, ModalHeader ,Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import Host from '../dado/host.js';
import { useRouter } from 'next/router'
import Carregamento from './carregamento.js';
function Acao() {
    const [lista, setLista] = useState("");
    const router = useRouter();
    const [carregando, setCarregando] = useState("")
    const [itemModal, setItemModal] = useState("");
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    useEffect(() => {
        listar()
    }, [])

    function listar() {
        setCarregando(true)
        Dado.listar("acao")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status) {
                        setLista(response.data.lista);
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

    function deletarToggle(item) {
        setItemModal(item)
        toggleModal()
    }
    function deletar(item) {
        Dado.deletar(item._id, "acao")
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
            .finally(() => {
                toggleModal()
            });


    }

    return (
        <Container>
            <Menu descricao="Saídas" />
            <Table>
                <thead>
                    <tr>
                        <th>
                            Descrição
                        </th>
                        <th>
                            <a href={Host.url() + "/acao/incluir"}>
                                <img src='/+.png' width="20px" />
                            </a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lista&& lista.map((item) => (
                        <tr>
                            <td onClick={() => router.push(Host.url() + "/acao/" + item._id)}>
                                {item.descricao}
                            </td>
                            <td>
                                <img src='/x.png' width="20px" onClick={() => deletarToggle(item)} />

                            </td>

                        </tr>

                    ))}
                </tbody>
            </Table>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Confirmação</ModalHeader>
                <ModalBody>
                    Deseja excluir a saída:  {itemModal.descricao}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={()=>deletar(itemModal)}>
                        OK
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            {carregando &&
                <Carregamento />
            }
            {carregando &&
                <Carregamento />
            }
        </Container>
    );


}


function Pagina() {
    return <Acao />
}


export default Pagina;