//variables y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado =document.querySelector('#gastos ul')



//eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)


    formulario.addEventListener('submit',agregarGasto)
}


//clases

class Presupuesto{

    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto){
       this.gastos = [...this.gastos,gasto]
       this.calcularRestante()
    }
    calcularRestante(){
      const gastado = this.gastos.reduce( ( total,gasto) => total + gasto.cantidad, 0)
      this.restante = this.presupuesto - gastado;

      // console.log(gastado)
      // console.log(this.restante)
    }

  
    eliminarGasto(id){
      this.gastos = this.gastos.filter(gasto => gasto.id !== id)
      this.calcularRestante()
  
  
       
    }
    
}




class UI{
    insertarPresupuesto(cantidad){
     //extrayendo los valores
      const {presupuesto,restante} =cantidad
      //agrega al html
      document.querySelector('#total').textContent = presupuesto
      document.querySelector('#restante').textContent = restante


    }

    imprimirAlerta(mensaje,tipo){
        //crear el div
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center','alert')

        if(tipo ==='error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }
        //mensaje de error
        divMensaje.textContent= mensaje;

        //insertar en el html

        document.querySelector('.primario').insertBefore(divMensaje,formulario)

        //quita del html
        setTimeout(()=>{
            divMensaje.remove()
        }, 3000)

    }
    agregarGastoListado(gastos){
    //  console.log(gastos)
      this.limpiarHTMl()
      gastos.forEach(gasto => {
       
        const {cantidad,nombre,id} = gasto;

      //crea un li
      const nuevoGasto = document.createElement('li')
      nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id
      //  console.log(nuevoGasto)
        //Agregar el html gasto

        nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}  </span>`


        //boton para agregar el gasto
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn','btn-danger','borrar-gasto')
        btnBorrar.innerHTML= 'Borrar &times;'

      btnBorrar.onclick = () =>{
        eliminarGasto(id)
      }

        nuevoGasto.appendChild(btnBorrar)

        //agregar al HTML
        gastoListado.appendChild(nuevoGasto)

        
      });
    }
    limpiarHTMl(){
      while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild)
       }
    }

    actualizarRestante(restante){
      document.querySelector('#restante').textContent = restante

    }
    comprobarPresupuesto(presupuestoObj){
      const {presupuesto,restante} = presupuestoObj;
      const restanteDiv = document.querySelector('.restante');
      //comprobar 25%
      if((presupuesto / 4) > restante){
        restanteDiv.classList.remove('alert-success', 'alert-warning')
        restanteDiv.classList.add('alert-danger')
      }else if((presupuesto / 2) > restante){
        restanteDiv.classList.remove('alert-success')
        restanteDiv.classList.add('alert-warning')

      }else{
        restanteDiv.classList.remove('alert-danger','alert-warning')
        restanteDiv.classList.add('alert-success')
      }
      //si el total es 0 o menor
    
    
      if(restante<= 0 ){
        ui.imprimirAlerta('el presupuesto se ha agotado ', 'error')

        formulario.querySelector('button[type="submit"]').disabled = true;
      }else{
        formulario.querySelector('button[type="submit"]').disabled = false;
      }
    }
}



//instanciar
const ui = new UI();

let presupuesto;

//funciones

function preguntarPresupuesto(){
    const presupuestoUsuario= prompt('cual es tu presupuesto?')
//   console.log(parseInt(presupuestoUsuario))

  if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
    window.location.reload()
  }
  //presupuesto valido

  presupuesto = new Presupuesto(presupuestoUsuario)
  // console.log(presupuesto)

  ui.insertarPresupuesto(presupuesto)

}

function agregarGasto(e){
e.preventDefault();

  const nombre = document.querySelector('#gasto').value
  const cantidad = Number(document.querySelector('#cantidad').value)

  // console.log(nombre)
  // console.log(cantidad)

  //validar
  if(nombre === '' || cantidad === '') {
    ui.imprimirAlerta('ambos campos son obligatorios','error')
    return;

  }else if(cantidad <= 0 || isNaN(cantidad)){

    ui.imprimirAlerta('cantidad no valida', 'error')
    return;
  }
 
  //generar un objeto con el gasto
  const gasto = {nombre,cantidad, id: Date.now()}

  //añade un nuevo gasto

  presupuesto.nuevoGasto(gasto)

  ui.imprimirAlerta('Gasto agregado correctamente')
  
  //imprimir los gastos
 const {gastos,restante} = presupuesto
 ui.agregarGastoListado(gastos)

 //actualiza el restante
 ui.actualizarRestante(restante)

 ui.comprobarPresupuesto(presupuesto)
//reinicia el formulario
  formulario.reset()

  // console.log(gasto);

}


// function limpiarHTMl(){
//   while(gastoListado.firstChild){
//     gastoListado.removeChild(gastoListado.firstChild)
//    }
// }

function eliminarGasto(id){
  presupuesto.eliminarGasto(id)
  //elimina los gastos del html
  const {gastos,restante} = presupuesto 
  ui.agregarGastoListado(gastos)

  ui.actualizarRestante(restante)
  ui.comprobarPresupuesto(presupuesto)
  

}


