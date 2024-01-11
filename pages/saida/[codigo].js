import { useState, React, useEffect } from 'react';
import Menu from '../menu.js';
import { Container, Label, Input, Button, Table, Form, FormGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../../dado/host.js';
import Carregamento from '../carregamento.js';
import styles from './[codigo].module.css'
function Saida() {
    const [item, setItem] = useState("");
    const [listaCompetencia, setListaCompetencia] = useState("");
    const router = useRouter()
    const [carregando, setCarregando] = useState("")

    useEffect(() => {
        if ((router.query.codigo != "") && (router.query.codigo != undefined)) {
            if (router.query.codigo == "incluir") {
                setItem({ recorrente: false, mozao: false, competencia: [] })
            } else {
                listar(router.query.codigo)
            }
        }
    }, [router.query.codigo])
    function listar(pCodigo) {
        setCarregando(true)
        Dado.item(pCodigo, "saida")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        if ((response.data.item.competencia == "") || (response.data.item.competencia == undefined)) {
                            response.data.item.competencia = []
                            setListaCompetencia([])
                        } else {
                            setListaCompetencia(response.data.item.competencia)
                        }
                        setItem(response.data.item)
                        document.getElementById("descricao").value = response.data.item.descricao;
                        document.getElementById("valor").value = response.data.item.valor;
                        document.getElementById("recorrente").checked = response.data.item.recorrente;
                        document.getElementById("mozao").checked = response.data.item.mozao;
                        document.getElementById("mes").value = response.data.item.mes;
                        document.getElementById("ano").value = response.data.item.ano;
                    } else {
                        setItem({})
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

    function mudarDescricao(event) {
        var itemTemp = item
        itemTemp.descricao = event.target.value
        setItem(itemTemp);

    }
    function mudarValor(event) {
        var itemTemp = item
        itemTemp.valor = event.target.value
        setItem(itemTemp);

    }
    function mudarRecorrente(event) {
        var itemTemp = item
        itemTemp.recorrente = event.target.checked
        setItem(itemTemp);

    }
    function mudarMozao(event) {
        var itemTemp = item
        itemTemp.mozao = event.target.checked
        setItem(itemTemp);

    }
    function mudarMes(event) {
        var itemTemp = item
        itemTemp.mes = event.target.value
        setItem(itemTemp);

    }
    function mudarAno(event) {
        var itemTemp = item
        itemTemp.ano = event.target.value
        setItem(itemTemp);

    }
    function adicionar() {
        var mes = document.getElementById("mes").value
        var ano = document.getElementById("ano").value
        var valor = document.getElementById("valor").value
        if ((mes == "") || (mes == undefined) || (ano == "") || (ano == undefined) || (valor == "") || (valor == undefined)) {
            alert("Preencha todos os Campos obrigatórios!")
        } else {
            var mes = parseInt(mes)
            var ano = parseInt(ano)
            var valor = parseFloat(valor)
            var possuiCompetencia = false
            for (var itemCompetenciaTemp of item.competencia) {
                if ((itemCompetenciaTemp.mes == mes) && (itemCompetenciaTemp.ano == ano)) {
                    possuiCompetencia = true
                    break
                }
            }
            if (possuiCompetencia) {
                alert("Competencia já inclusa!")
            } else {
                var listaCompetenciaTemp = listaCompetencia
                var itemTemp = item
                listaCompetenciaTemp.push({ mes: mes, ano: ano, valor: valor })
                listaCompetenciaTemp = listaCompetenciaTemp.sort((item1, item2) => item1.mes - item2.mes)
                listaCompetenciaTemp = listaCompetenciaTemp.sort((item1, item2) => item1.ano - item2.ano)
                itemTemp.competencia = listaCompetenciaTemp
                setItem(itemTemp)
                console.log(listaCompetenciaTemp)
                setListaCompetencia(listaCompetenciaTemp)
            }
        }
    }
    function salvar() {
        if (possuiErroObrigatorio()) {
            alert("Preencha todos os Campos obrigatórios!")
        } else {
            Dado.salvar(item, "saida").then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        router.push(Host.url() + "/saida")
                    } else {
                        console.log("error: " + response.data.descricao)
                    }
                }
            }, (error) => {
                console.log("error: " + error)
            })
        }
    }
    function possuiErroObrigatorio() {
        if (item.descricao == "" || item.descricao == undefined) {
            return true;
        }

    }

    function deletar(pItem) {
        var deletar = confirm("Deseja excluir a competência: " + pItem.mes + "/" + pItem.ano + " ?");
        if (deletar) {
            var itemTemp = item
            var listaCompetenciaTemp = []
            for (var itemCompetenciaTemp of listaCompetencia) {
                if ((itemCompetenciaTemp.mes != pItem.mes) || (itemCompetenciaTemp.ano != pItem.ano)) {
                    listaCompetenciaTemp.push(itemCompetenciaTemp)
                }
            }
            itemTemp.competencia = listaCompetenciaTemp
            setItem(itemTemp)
            setListaCompetencia(listaCompetenciaTemp)
        }

    }

    return (
        <Container>
            <Menu descricao="Saídas" />
            <Form>
                <Label for="descricao">Descricao</Label>
                <Input type="text" id="descricao" onChange={mudarDescricao} />

                <Label for="valor">Valor</Label>
                <Input type="text" id="valor" onChange={mudarValor} />
                <Table className={styles.tabela}>
                    <tr >

                        <td><Label for="recorrente">Recorrente</Label></td>
                        <td><Input type="checkbox" id="recorrente" onChange={mudarRecorrente} /></td>
                    </tr>
                    <tr>
                        <td><Label for="mozao">Mozão</Label></td>
                        <td><Input type="checkbox" id="mozao" onChange={mudarMozao} /></td>
                    </tr>
                </Table>
                <br />
                <Label for="mes">Mês</Label>
                <Input type="number" id="mes" onChange={mudarMes} />

                <Label for="ano">Ano</Label>
                <Input type="number" id="ano" onChange={mudarAno} />

                <Button color="danger" onClick={adicionar}>Adicionar</Button>
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
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaCompetencia && listaCompetencia.map((item) => (
                            <tr>
                                <td>
                                    {item.mes}
                                </td>
                                <td>
                                    {item.ano}
                                </td>
                                <td>
                                    {item.valor}
                                </td>
                                <td>
                                    <img src='/x.png' width="20px" onClick={() => deletar(item)} />

                                </td>
                            </tr>

                        ))}
                    </tbody>
                </Table>


                <Button color="danger" onClick={salvar}>Salvar</Button>
            </Form>
            {
                carregando &&
                <Carregamento />
            }
        </Container >
    );
}

function Pagina() {

    return <Saida />
}
export default Pagina;