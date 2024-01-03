import { useState, React, useEffect } from 'react';
import Menu from '../menu.js';
import { Container, Label, Input, Button, Form, FormGroup, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../../dado/host.js';
import Carregamento from '../carregamento.js';
function Competencia() {
    const [item, setItem] = useState("");
    const [listaEntrada, setListaEntrada] = useState("");
    const [listaEntradaTodos, setListaEntradaTodos] = useState("");
    const [listaSaida, setListaSaida] = useState("");
    const [listaSaidaTodos, setListaSaidaTodos] = useState("");
    const [total, setTotal] = useState(0);
    const router = useRouter()
    const [carregando, setCarregando] = useState("")

    useEffect(() => {
        if ((router.query.codigo != "") && (router.query.codigo != undefined)) {
            if (router.query.codigo == "incluir") {
                setItem({ entrada: [], saida: [] })
                setListaEntrada([])
                setListaSaida([])
            }
            listar(router.query.codigo)
        }
    }, [router.query.codigo])
    function listar(pCodigo) {
        setCarregando(true)
        Dado.listar("entrada")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setListaEntradaTodos(response.data.lista)
                    } else {
                        setLista([])
                        console.log("error: " + response.data.descricao)

                    }
                }
                if (pCodigo != "incluir") {
                    listarEdicao(pCodigo)
                }
            }, (error) => {
                console.log("error: " + error)
            })
            .finally(() => {
                setCarregando(false)
            });
        Dado.listar("saida")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setListaSaidaTodos(response.data.lista)
                    } else {
                        setLista([])
                        console.log("error: " + response.data.descricao)

                    }
                }
                if (pCodigo != "incluir") {
                    listarEdicao(pCodigo)
                }
            }, (error) => {
                console.log("error: " + error)
            })
            .finally(() => {
                setCarregando(false)
            });
    }
    function listarEdicao(pCodigo) {
        setCarregando(true)
        Dado.item(pCodigo, "competencia")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setItem(response.data.item)

                        Dado.itemLista(response.data.item._id, "competencia", "entrada")
                            .then(response => {
                                if (response.data.status == true) {
                                    setListaEntrada(response.data.lista)
                                } else {
                                    setListaEntrada([])
                                }

                            }, (error) => {
                                console.log("error: " + error)
                            })
                            .finally(() => {
                                setCarregando(false)
                            });

                        Dado.itemLista(response.data.item._id, "competencia", "saida")
                            .then(response => {
                                if (response.data.status == true) {
                                    setListaSaida(response.data.lista)
                                } else {
                                    setListaSaida([])
                                }

                            }, (error) => {
                                console.log("error: " + error)
                            })
                            .finally(() => {
                                setCarregando(false)
                            });

                    } else {
                        setItem({})
                        console.log("error: " + response.data.descricao)
                    }


                }
            }, (error) => {
                console.log("error: " + error)
            })
    }

    function adicionarEntrada() {
        if (item._id != "" && item._id != undefined) {
            alert("Competencia não pode ser editada")
        } else {
            var _id = document.getElementById("entrada").value
            var valor = document.getElementById("entradaValor").value
            if (_id != "" && _id != undefined && valor != "" && valor != undefined) {
                var possuiEntrada = false
                for (var itemEntrada of item.entrada) {
                    if (itemEntrada._id == _id) {
                        possuiEntrada = true
                        break
                    }
                }
                if (possuiEntrada) {
                    alert("Entrada já Incluso!")
                } else {

                    for (var itemEntradaTodos of listaEntradaTodos) {
                        if (itemEntradaTodos._id == _id) {
                            break;
                        }
                    }

                    var listaTemp = []
                    for (itemEntrada of listaEntrada) {
                        listaTemp.push(itemEntrada)
                    }
                    itemEntradaTodos.valorCompetencia = valor
                    listaTemp.push(itemEntradaTodos)

                    setListaEntrada(listaTemp)
                    var itemTemp = item
                    if (itemTemp.entrada == "" || itemTemp.entrada == undefined) {
                        itemTemp.entrada = []
                    }
                    itemTemp.entrada.push({ _id: _id, valor: valor })
                    setItem(itemTemp)
                    setTotal(Number(total) + Number(valor))
                    document.getElementById("entradaValor").value = ""

                }
            } else {

                alert("Preencha todos os Campos obrigatórios!")
            }
        }
    }

    function adicionarSaida() {
        if (item._id != "" && item._id != undefined) {
            alert("Competencia não pode ser editada")
        } else {
            var _id = document.getElementById("saida").value
            var valor = document.getElementById("saidaValor").value
            if (_id != "" && _id != undefined && valor != "" && valor != undefined) {
                var possuiSaida = false
                for (var itemSaida of item.saida) {
                    if (itemSaida._id == _id) {
                        possuiSaida = true
                        break
                    }
                }
                if (possuiSaida) {
                    alert("Saída já Incluso!")
                } else {

                    for (var itemSaidaTodos of listaSaidaTodos) {
                        if (itemSaidaTodos._id == _id) {
                            break;
                        }
                    }

                    var listaTemp = []
                    for (itemSaida of listaSaida) {
                        listaTemp.push(itemSaida)
                    }
                    itemSaidaTodos.valorCompetencia = valor
                    listaTemp.push(itemSaidaTodos)

                    setListaSaida(listaTemp)
                    var itemTemp = item
                    if (itemTemp.saida == "" || itemTemp.saida == undefined) {
                        itemTemp.saida = []
                    }
                    itemTemp.saida.push({ _id: _id, valor: valor })
                    setItem(itemTemp)
                    setTotal(Number(total) + Number(valor))
                    document.getElementById("saidaValor").value = ""

                }
            } else {

                alert("Preencha todos os Campos obrigatórios!")
            }
        }
    }

    function salvar() {
        if (item._id != "" && item._id != undefined) {
            alert("Competencia não pode ser editada")
        } else {
            if (possuiErroObrigatorio()) {
                alert("Preencha todos os Campos obrigatórios!")
            } else {
                Dado.salvar(item, "competencia").then(response => {
                    if (response.data != null) {
                        if (response.data.status == true) {
                            router.push(Host.url() + "/competencia")
                        } else {
                            console.log("error: " + response.data.descricao)
                        }
                    }
                }, (error) => {
                    console.log("error: " + error)
                })
            }
        }
    }
    function possuiErroObrigatorio() {
        if (item.entrada.length == 0) {
            return true
        }
        if (item.saida.length == 0) {
            return true
        }
        return false;
    }
    function mudarEntrada() {

    }

    function mudarSaida() {

    }
    function deletarEntrada(itemParametro) {
        if (item._id != "" && item._id != undefined) {
            alert("Competencia não pode ser editada")
        } else {
            var deletar = confirm("Deseja excluir o entrada: " + itemParametro.descricao + " ?");
            if (deletar) {
                var listaEntradaTemp = []
                for (var itemEntrada of listaEntrada) {
                    if (itemEntrada._id != itemParametro._id) {
                        listaEntradaTemp.push(itemEntrada)
                    }
                }
                setListaEntrada(listaEntradaTemp)

                var itemListaEntradaTemp = []
                for (var itemEntrada of item.entrada) {
                    if (itemEntrada._id != itemParametro._id) {
                        itemListaEntradaTemp.push(itemEntrada)
                    }
                }
                var itemTemp = item
                itemTemp.entrada = itemListaEntradaTemp
                setItem(itemTemp)
                setTotal(total - itemParametro.valorCompetencia)
                console.log(total - itemParametro.valorCompetencia)
            }
        }

    }
    function deletarSaida(itemParametro) {
        if (item._id != "" && item._id != undefined) {
            alert("Competencia não pode ser editada")
        } else {
            var deletar = confirm("Deseja excluir o saida: " + itemParametro.descricao + " ?");
            if (deletar) {
                var listaSaidaTemp = []
                for (var itemSaida of listaSaida) {
                    if (itemSaida._id != itemParametro._id) {
                        listaSaidaTemp.push(itemSaida)
                    }
                }
                setListaSaida(listaSaidaTemp)

                var itemListaSaidaTemp = []
                for (var itemSaida of item.saida) {
                    if (itemSaida._id != itemParametro._id) {
                        itemListaSaidaTemp.push(itemSaida)
                    }
                }
                var itemTemp = item
                itemTemp.saida = itemListaSaidaTemp
                setItem(itemTemp)
                setTotal(total - itemParametro.valorCompetencia)
                console.log(total - itemParametro.valorCompetencia)
            }
        }

    }
    return (
        <Container>
            <Menu descricao="Competencias" />
            <Form>

                <h4>{item.mes}-{item.ano}</h4>


                <FormGroup check inline>
                    <Label for="entrada">Entrada</Label>
                    <Input type="select" id="entrada" onChange={mudarEntrada}>
                        {listaEntradaTodos && listaEntradaTodos.map((item) => (
                            <option value={item._id}>{item.descricao}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup check inline>
                    <Label for="entradaValor">Valor</Label>
                    <Input type="number" id="entradaValor" width="30px" />

                </FormGroup>

                <FormGroup check inline>
                    <img src='/+.png' width="20px" onClick={adicionarEntrada} />
                </FormGroup>

                <Table>
                    <thead>
                        <tr>
                            <th>
                                Descrição
                            </th>
                            <th>
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaEntrada && listaEntrada.map((item) => (
                            <tr>
                                <td>
                                    <a href={Host.url() + "/entrada/" + item._id}>
                                        {item.descricao}
                                    </a>

                                </td>
                                <td>
                                    {item.valor}
                                </td>
                                <td>
                                    <img src='/x.png' width="20px" onClick={() => deletarEntrada(item)} />

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <FormGroup check inline>
                    <Label for="saida">Entrada</Label>
                    <Input type="select" id="saida" onChange={mudarSaida}>
                        {listaSaidaTodos && listaSaidaTodos.map((item) => (
                            <option value={item._id}>{item.descricao}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup check inline>
                    <Label for="saidaValor">Valor</Label>
                    <Input type="number" id="saidaValor" width="30px" />

                </FormGroup>

                <FormGroup check inline>
                    <img src='/+.png' width="20px" onClick={adicionarSaida} />
                </FormGroup>

                <Table>
                    <thead>
                        <tr>
                            <th>
                                Descrição
                            </th>
                            <th>
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaSaida && listaSaida.map((item) => (
                            <tr>
                                <td>
                                    <a href={Host.url() + "/saida/" + item._id}>
                                        {item.descricao}
                                    </a>

                                </td>
                                <td>
                                    {item.valor}
                                </td>
                                <td>
                                    <img src='/x.png' width="20px" onClick={() => deletarSaida(item)} />

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button color="danger" onClick={salvar}>Salvar</Button>
            </Form>
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