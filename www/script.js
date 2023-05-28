let taskList = [];

const loadTasks = async () => { 
  // Carga las tareas que hay en el json y las visualiza en el html
  const response = await fetch('http://localhost:3000/tasks/get'); // He cambiado la direccion 
  taskList = await response.json();
  colocarTareasHtml(taskList);
}

function colocarTareasHtml(tareas) {
  // Se colocan todas las tareas que hay en la lista de tareas
  for (let i = 0; i < taskList.length; i++) {
    let nombre = taskList[i].title;
    let id = taskList[i].id;
    let done = taskList[i].done;
    anadirTareaHtml(nombre , id , done);
  }
}
let inicioX, finX;
let tInicio , tFinal , tiempo;
function anadirTareaHtml(nombre , id , done){
  // Se añade en html la tarea, con su nombre correspondiente
  lista_html = document.getElementById("lista-tareas");
  tarea_html = document.createElement("div");
  tarea_html.innerText = nombre;
  tarea_html.classList.add("tarea");
  tarea_html.id = id;
  
  if (done == true){
    // Si la tarea esta completada se añade una imagen de un tick
  const imagen = document.createElement('img');
  imagen.src = '../img/Tick.png';
  tarea_html.appendChild(imagen);}

  tarea_html.addEventListener('touchstart', function(event) {
    // Se guarda la pos inicial del dedo del usuario
    inicioX = event.changedTouches[0].clientX;
    // Se comienza el contador cuando el usuario pulsa
    tInicio = new Date().getTime();
  });

  tarea_html.addEventListener('touchend', function(event) {
    // Se comprueba que el usuario haya desplazado el dedo hacia la derecha
    finX = event.changedTouches[0].clientX;
    if (finX > inicioX + 10) {
      remove(event.target);
    } else {
      tFinal = new Date().getTime();
      tiempo = tFinal - tInicio;
      if (tiempo >= 2000) {
        toggleDone(event.target);
      }
    }
  });

  lista_html.appendChild(tarea_html); 
}

$("#mensaje_add").hide();
function mensaje_confirmacion (id){
  // Funcion que hace visible el mensaje de haber añadido una tarea
  id_jquery = "#" + id;
  $(id_jquery).show().delay(2000).fadeOut();
}

// Se cargan las tareas del json, cuando se inicia la aplicación.
window.onload = function() {
  loadTasks();
}

let nombre_tarea = document.getElementById("task-name").value;
const add = () => {
  // Guardo el nombre de la tarea y su id en variables
  nombre_tarea = document.getElementById("task-name").value;
  if (nombre_tarea != ""){
    id_tarea = idlibre();
    // Añado la tarea al html (visualmente)
    anadirTareaHtml(nombre_tarea , id_tarea , false);
    // Aviso al usuario de que se ha añadido
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    // Añado a la lista la nueva tarea
    taskList.push ({ "id": id_tarea , "title": nombre_tarea, "done": false });
    mensaje_confirmacion("mensaje_add");
    actualizar_json();
    
  }
}

function idlibre(){
  let idsUsadas = new Set();
  taskList.forEach(taskList => {
    idsUsadas.add(taskList.id);
  });
  let id = 1;
  while (idsUsadas.has(id)) {
    id++;
  }
  return id;
}

function actualizar_json (){
  // Se enviar una solicitud con el metodo post y de contenido la lista de tareas
  setTimeout(function() {
  fetch('http://127.0.0.1:3000/tasks/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskList)
  })
    window.location.reload();
  }, 1000); 
}

const remove = (elemento) => {
  // Se elimina del html la tarea
  elemento.classList.add("desaparecer");
  setTimeout(function(){
    elemento.remove();
  }, 500);
  // Se elimina de la lista de tareas la tarea con la id correspondiente
  let i = 0;
  let eliminado = false;
  while ( (i < taskList.length)  &&  (!eliminado)) {
    if (taskList[i].id == elemento.id) {
      // Se elimina de la lista la tarea
      taskList.splice(i , 1);
      eliminado = true;
    }
    i++;
  }
  actualizar_json();
}

const toggleDone = (tarea) => {
  /*$("#mensaje_add").show();*/
  let i = 0;
  let modificado = false;
  // Se busca la tarea con esa id
  while ( (i < taskList.length)  &&  (!modificado)) {
    if (taskList[i].id == tarea.id && taskList[i].done == false) {
      // Se marca la tarea como hecha
      taskList[i].done = true;
      modificado = true;
      const imagen = document.createElement('img');
      imagen.src = '../img/Tick.png';
      tarea.appendChild(imagen);
      var audio = new Audio('../img/Completado.mp3');
      audio.play();
      actualizar_json();
    }
    i++;
  }
}


const addButton = document.querySelector("#fab-add");
addButton.addEventListener("touchend", add);



