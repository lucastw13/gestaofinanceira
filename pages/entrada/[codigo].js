import { useState, React, useEffect } from 'react';
import Menu from '../menu.js';
import { Container, Label, Input, Button, Form, FormGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dado from '../../dado/generico.js'
import { useRouter } from 'next/router'
import Host from '../../dado/host.js';
import Carregamento from '../carregamento.js';
function Entrada() {
    const [item, setItem] = useState("");
    const router = useRouter()
    const [carregando, setCarregando] = useState("")

    useEffect(() => {
        if ((router.query.codigo != "") && (router.query.codigo != undefined)) {
            if (router.query.codigo == "incluir") {
                setItem({ recorrente: false })
            }
            listar(router.query.codigo)
        }
    }, [router.query.codigo])
    function listar(pCodigo) {
        setCarregando(true)
        Dado.item(pCodigo, "entrada")
            .then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        setItem(response.data.item)
                        document.getElementById("descricao").value = response.data.item.descricao;
                        document.getElementById("valor").value = response.data.item.valor;
                        document.getElementById("recorrente").checked = response.data.item.recorrente;
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
    function salvar() {
        if (possuiErroObrigatorio()) {
            alert("Preencha todos os Campos obrigatórios!")
        } else {
            Dado.salvar(item, "entrada").then(response => {
                if (response.data != null) {
                    if (response.data.status == true) {
                        router.push(Host.url() + "/entrada")
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
        if (item.valor == "" || item.descricao == valor) {
            return true;
        }

    }



    return (
        <Container>
            <Menu descricao="Entradas" />
            <Form>
                <FormGroup>
                    <Label for="descricao">Descricao</Label>
                    <Input type="text" id="descricao" onChange={mudarDescricao} />

                    <Label for="valor">Valor</Label>
                    <Input type="text" id="valor" onChange={mudarValor} />

                    <Label for="recorrente">Recorrente</Label>
                    <Input type="checkbox" id="recorrente" onChange={mudarRecorrente} />
                    <br />
                    <Label for="mes">Mês</Label>
                    <Input type="number" id="mes" onChange={mudarMes} />

                    <Label for="ano">Ano</Label>
                    <Input type="number" id="ano" onChange={mudarAno} />
                </FormGroup>

                <Button color="danger" onClick={salvar}>Salvar</Button>
            </Form>
            {carregando &&
                <Carregamento />
            }
        </Container>
    );
}

function Pagina() {

    return <Entrada />
}
export default Pagina;