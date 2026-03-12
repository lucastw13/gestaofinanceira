import { useState, React, useEffect } from 'react';
import Menu from './menu.js';
import { Container, Table, Label, Input, ModalFooter, Modal, ModalBody, ModalHeader ,Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../dado/generico.js';
import Host from '../dado/host.js';
import { useRouter } from 'next/router'
import Carregamento from './carregamento.js';
import axios from 'axios';

function Saida() {
    const [porcentagemInvestimento, setPorcentagemInvestimento] = useState("");
    const [valorAvista, setValorAvista] = useState("");
    const [valorParcela, setValorParcela] = useState("");
    const [qtdParcela , setQtdParcela] = useState("");
    const [valorRestante, setValorRestante] = useState("");
    const [lista, setLista] = useState("");
    
    const [listaRecorrente, setListaRecorrente] = useState("");
    const [listaExibir, setListaExibir] = useState("");
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
        Dado.listar("saida")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status) {
                        setLista(response.data.lista);
                        setListaRecorrente(response.data.listaRecorrente);
                        console.log(document.getElementById("recorrente").checked)
                        if(document.getElementById("recorrente").checked){
                            setListaExibir(response.data.listaRecorrente)
                        }else{
                            setListaExibir(response.data.lista)
                        }
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
        Dado.deletar(item._id, "saida")
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

    function mudarRecorrente(event) {
        if (event.target.checked) {
            setListaExibir(listaRecorrente)
        } else {
            setListaExibir(lista)
        }
    }

    function mudarPorcentagemInvestimento(event) {
        setPorcentagemInvestimento(event.target.value);
    }

    function mudarValorAvista(event) {
        setValorAvista(event.target.value);
    }

    function mudarValorParcela(event) {
        setValorParcela(event.target.value);
    }

    function mudarQtdParcela(event) {
        setQtdParcela(event.target.value);
    }

    function calculoCompra(){
        var dateTime = new Date()
        var dia = dateTime.getDate()-1
        var mes = dateTime.getMonth()+1
        var ano = dateTime.getFullYear()
        var anoInicio = ano-1
        axios.get("https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json&dataInicial="+dia+"/"+mes+"/"+anoInicio+"&dataFinal="+dia+"/"+mes+"/"+ano)
            .then(response => {
                if (response.data != null) {
                    var quantidade = response.length
                    var soma = 0
                    var porcentagemInvestimento = 0
                    response.data.forEach(function(data, index) {
                        soma += data.valor
                    });
                    porcentagemInvestimento = (soma/quantidade)*365
                    if((porcentagemInvestimento!="")
                    &&(valorAvista!="")
                    &&(valorParcela!="")
                    &&(qtdParcela!="")){
                        let valorRestanteTemp = valorAvista
                        for(let contador=1;contador<=qtdParcela;contador++){
                            valorRestanteTemp *= (1+(Math.pow(1 + (porcentagemInvestimento/100), 1/12) - 1))
                            valorRestanteTemp -= valorParcela
                        }
                        setValorRestante(valorRestanteTemp)
                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
            .finally(() => {
                toggleModal()
            });
            
       /* if((porcentagemInvestimento!="")
         &&(valorAvista!="")
         &&(valorParcela!="")
         &&(qtdParcela!="")){
            let valorRestanteTemp = valorAvista
            for(let contador=1;contador<=qtdParcela;contador++){
                valorRestanteTemp *= (1+(Math.pow(1 + (porcentagemInvestimento/100), 1/12) - 1))
                valorRestanteTemp -= valorParcela
            }
            setValorRestante(valorRestanteTemp)
        }*/
			
    }
    return (
        <Container>
            <Menu descricao="Saídas" />
            <Label for="recorrente">Recorrente</Label>
            <Input type="checkbox" id="recorrente" onChange={mudarRecorrente} />
            <Table>
                <thead>
                    <tr>
                        <th>
                            Descrição
                        </th>
                        <th>
                            Valor
                        </th>
                        <th>
                            <a href={Host.url() + "/saida/incluir"}>
                                <img src='/+.png' width="20px" />
                            </a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listaExibir && listaExibir.map((item) => (
                        <tr>
                            <td onClick={() => router.push(Host.url() + "/saida/" + item._id)}>
                                {item.descricao}
                            </td>
                            <td>
                                {item.valor}
                            </td>
                            <td>
                                <img src='/x.png' width="20px" onClick={() => deletarToggle(item)} />

                            </td>

                        </tr>

                    ))}
                </tbody>
            </Table>

            <Label for="porcentagemInvestimento">porcentagemInvestimento</Label>
            <Input type="text" id="porcentagemInvestimentoAnual" onChange={mudarPorcentagemInvestimento} />

            <Label for="valorAvista">valorAvista</Label>
            <Input type="text" id="valorAvista" onChange={mudarValorAvista} />

            <Label for="valorParcela">valorParcela</Label>
            <Input type="text" id="valorParcela" onChange={mudarValorParcela} />

            <Label for="qtdParcela">qtdParcela</Label>
            <Input type="text" id="qtdParcela" onChange={mudarQtdParcela} />

            <h1>{valorRestante}</h1>
            <Button color="danger" onClick={() => calculoCompra()}>
            Calcular
             </Button>

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
    return <Saida />
}


export default Pagina;