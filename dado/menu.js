export default class Menu {
  static listar() {
    var lista = []
    lista.push({ codigo: 1, nivel: 999,importante:0, descricao: "Competência", pagina: "" })
    lista.push({ codigo: 2, nivel: 999,importante:0, descricao: "Entrada", pagina: "entrada" })
    lista.push({ codigo: 2, nivel: 999,importante:0, descricao: "Saída", pagina: "saida" })
    return lista

  }
}