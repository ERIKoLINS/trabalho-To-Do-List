import { useState } from "react";
import Button from "./assets/components/Button";

export default function App(){
  const [listaTarefa, setListaTarefa] = useState([])
  const [texto, setTexto] = useState("")

  function adicionar(){
    const tarefa = {
      id: listaTarefa.length + 1,
      texto,
      concluida: false
    }

    setListaTarefa([...listaTarefa, tarefa])
    setTexto("")
  }

  function removerTarefa(indiceTarefa){
    const tarefaFiltrada = listaTarefa.filter(item => item.id != indiceTarefa)
    setListaTarefa(tarefaFiltrada)
  }

  function checkbox(id){
    const novaLista = listaTarefa.map(item =>{
      if(item.id === id){
        return { ...item, concluida: !item.concluida }
      }
      return item
    })  
    setListaTarefa(novaLista)
  }

  return(
    <div>
      <div>
        <h1>To-Do List</h1>

        <label htmlFor="tarefa">Adicionar tarefa</label>
        <input
          id="tarefa"
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <Button 
          funcao={adicionar}
          bntText="Adicionar"
        />
      </div>

      <div>
        {listaTarefa.map(item => (
          <div 
            style={{border: "2px solid blue", borderRadius:"10px"}}
            key={item.id}
          >
            <p>{item.texto}</p> 
            
            <input 
              type="checkbox"
              checked={item.concluida}
              onChange={() => checkbox(item.id)}
            /> 

            <Button
              funcao={() => removerTarefa(item.id)}
              bntText="Excluir"
            />
          </div>
        ))}
      </div>
    </div>
  )
}