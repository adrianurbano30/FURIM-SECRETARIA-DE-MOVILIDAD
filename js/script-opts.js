import { DEPENDENCIAS } from './dependencias.js';
import { ARBOL_CONTRAVENCIONES } from './contravenciones.js';
const ENDPOINT_CALIFICACIONES = 'http://127.0.0.1:3000/guardar-calificacion';

let nodoActual = null;
let historial = [];
let nivelActual = 0;
let dependenciaSeleccionada = "";


const opcionesRadicado = [
    "Alcance de la petición",
    "Reiteración por falta de respuesta",
    "Aporte de documentos",
    "Respuesta a un requerimiento",
    "Corrección de información",
    "Desistimiento",
    "Otro"
];


// CARGA DEL HTML opts.HTML
document.addEventListener("DOMContentLoaded", () => {

    
    const params = new URLSearchParams(window.location.search);
    const preview = document.getElementById("previewDependencia");
    const nombre = document.getElementById("previewNombre");
    const codigo = document.getElementById("previewCodigo");
    const descripcion = document.getElementById("previewDescripcion");
    const funciones = document.getElementById("previewFunciones");
    const tarjetas = document.querySelectorAll(".card-dependencia");
    const soportaHover = window.matchMedia("(hover: hover)").matches;
    const overlay = document.getElementById("previewOverlay");
    const modalInicio = document.getElementById('modalInicio');
    

    if (!params.get('nd')) {
        abrirModalInicio();
    }else{
        calificacion();
    }


    let temporizador;
    
    if (modalInicio) {
        
        modalInicio.addEventListener('click',(e)=>{

            if (e.target === modalInicio) {
                resaltarModal();
            }

        });

    }

    cargarAnoactual();

    overlay.addEventListener("click",()=>{

        ocultarPreview(preview);

    });

    tarjetas.forEach(tarjeta => {

     
    if (soportaHover) {
        
        


        tarjeta.addEventListener("mouseenter", () => {

            const dep = tarjeta.dataset.dependencia;

            

            clearTimeout(temporizador);

        
            temporizador = setTimeout(() => {

                cargarPreview(dep,tarjeta,preview,nombre,descripcion,codigo,funciones);

            }, 300);

        });

        tarjeta.addEventListener("mouseleave", () => {

            

            setTimeout(() => {

                
                if (!preview.matches(":hover")) {

                    ocultarPreview(preview);

                }

            }, 200);

            //cambios hechos hoy domingo 19
            historial = [];
            nivelActual = 0;

        });


    }else{

        tarjeta.addEventListener("click", () => {

            const dep = tarjeta.dataset.dependencia;

            cargarPreview(
                dep,
                tarjeta,
                preview,
                nombre,
                descripcion,
                codigo,
                funciones
            );

        });

    }



    });

    preview.addEventListener("mouseleave", () => {

       
        ocultarPreview(preview);

    });


});


function cargarAnoactual(){

    const anio = new Date().getFullYear();

    document.getElementById('anio').textContent = anio;
}

////////////////MODAL INICIO EVENTOS ////////////////////////////////

function abrirModalInicio() {
  const modal = document.getElementById('modalInicio');
  const contenido = document.getElementById('modalInicioContenido');

  if (!modal || !contenido) return;

  // Habilitar interacción
  modal.classList.remove('pointer-events-none');

  // Pequeña pausa para asegurar que el navegador registre la transición inicial
  setTimeout(() => {
    // Transición de opacidad del fondo
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');

    // Transición de escala y opacidad de la tarjeta
    contenido.classList.remove('scale-95', 'opacity-0');
    contenido.classList.add('scale-100', 'opacity-100');
  }, 50);
}

function cerrarModalInicio(){
  const modal = document.getElementById('modalInicio');
  const contenido = document.getElementById('modalInicioContenido');

  if (!modal || !contenido) return;

  
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0');

  contenido.classList.remove('scale-100', 'opacity-100');
  contenido.classList.add('scale-95', 'opacity-0');

  
  setTimeout(() => {
    modal.classList.add('pointer-events-none');
  }, 500);
}
window.cerrarModalInicio = cerrarModalInicio;

function resaltarModal() {
  const contenido = document.getElementById('modalInicioContenido');
  if (!contenido) return;

  // Aplicar leve aumento de tamaño
  contenido.classList.remove('scale-100');
  contenido.classList.add('scale-105');

  // Regresar al tamaño normal después de 150 milisegundos
  setTimeout(() => {
    contenido.classList.remove('scale-105');
    contenido.classList.add('scale-100');
  }, 300);
}    

////////////////END MODAL INICIO EVENTOS ////////////////////////////////

//////////////////////QULIFY ENVENTS/////////////////////////////////////




function calificacion(){

    const calidad = document.getElementById("modalCalificacion");

    calidad.classList.remove("hidden");
    
}

function mostrarCampoMotivo() {
    const capaMotivo = document.getElementById('capaMotivoInsatisfecho');
    if (capaMotivo) {
        capaMotivo.classList.remove('hidden');
        
        // Animación suave de scroll al foco del textarea
        requestAnimationFrame(() => {
            document.getElementById('txtMotivo').focus();
        });
    }
}
window.mostrarCampoMotivo = mostrarCampoMotivo;


function cerrarModalCalificacion() {
    const modal = document.getElementById('modalCalificacion');
    if (modal) {
        modal.classList.add('hidden');
    }
    // Limpiamos los parámetros de la URL sin recargar la página
    window.history.replaceState({}, document.title, window.location.pathname);
}
window.cerrarModalCalificacion = cerrarModalCalificacion;

async function procesarCalificacion(nivel) {

    cerrarModalCalificacion();
    const campoMotivo = document.getElementById('txtMotivo');
    const motivo = nivel === 'Insatisfecho' ? (campoMotivo?.value || '').trim() : '';


    const datosCalificacion = {
        satisfaccion: nivel,
        motivo: motivo,
    };

    try {
        
        const respuesta = await fetch(ENDPOINT_CALIFICACIONES,{

         method:'POST',
         headers:{   
                   'Content-Type': 'application/json'
                 },
          body: JSON.stringify(datosCalificacion)          

        });

        const resultado = await respuesta.json();

         //console.log('resultado calificacion->',resultado);
        

        if (!respuesta.ok || !resultado.ok) {
            throw new Error(resultado.mensaje || 'No se pudo guardar la calificación.');
        }

       

    } catch (error) {

        console.error('Error al enviar la calificación:', error);
        alert('No se pudo confirmar el envío. Revisa la conexión e inténtalo de nuevo.');
    }

  

    
}
window.procesarCalificacion = procesarCalificacion;





//////////////////////END QULIFY ENVENTS/////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////INICIO FUNCIONES PROCESO DEPENDENCIAS RADICADO//////////////////////////////



function cargarPreview(dep,tarjeta,preview,nombre,descripcion,codigo,funciones) {

    const dependencia = DEPENDENCIAS[dep];
    nombre.textContent = dependencia.nombre;
    codigo.textContent = `Código: ${dependencia.codigo}`;
    funciones.innerHTML = "";
    
    
    switch (dependencia.nombre) {

        case "Oficina de Contravenciones":

            descripcion.textContent ="Para iniciar el proceso de radicacion, seleccione una de las opciones disponibles. Si su solicitud corresponde a un trámite nuevo, seleccione la opción 'Sí, corresponde a un trámite nuevo'. Si su solicitud corresponde a una solicitud ya radicada, seleccione la opción 'No, corresponde a una solicitud ya radicada'.";
            cargarPreviewContravenciones(dep,funciones);
             
            
        break;

        case "Despacho del Secretario de Movilidad":

            descripcion.textContent ="Para iniciar el proceso de radicación, seleccione una de las funciones disponibles del equipo de trabajo. Una vez seleccionada la función, se habilitará el formulario correspondiente.";
            cargarFuncionesDespachoSecretario(dep,dependencia,funciones);

        break; 
        default:

             descripcion.textContent ="Para iniciar el proceso de radicación, seleccione una de las funciones disponibles del equipo de trabajo. Una vez seleccionada la función, se habilitará el formulario correspondiente.";
             cargarFuncionesNormales(dep,dependencia,funciones); 

        break;
    }

  

    
    const esMovil = !window.matchMedia("(hover: hover)").matches;


    if (esMovil) {

        preview.classList.add("preview-mobile");

        document.getElementById("previewOverlay").classList.add("show");
        
    }else{

        preview.classList.remove("preview-mobile");

        const rect = tarjeta.getBoundingClientRect();

        preview.style.top =`${window.scrollY + rect.top-80}px`;

        const anchoPreview = 500;
        const margen = 2;

        if (
            rect.right + anchoPreview + margen >
            window.innerWidth
        ) {

        preview.style.left = `${rect.left - anchoPreview - margen}px`;

        } else {

            preview.style.left = `${rect.right + margen}px`;

        }

       

    }    

     preview.classList.remove(
            "opacity-0",
            "invisible",
            "-translate-x-4"
        );

}

function cargarFuncionesNormales(dep, dependencia, funciones) {


    

    dependencia.funciones.forEach(funcion => {

        const label = document.createElement("label");

        label.className =
            "flex items-start gap-1  transition duration-700 hover:text-slate-800 text-slate-600 cursor-pointer border-1 border-slate-400 rounded-xl p-1 mb-1 shadow-sm shadow-amber-300";

        label.innerHTML = `
            <input
                type="radio"
                name="previewFuncion"
                class="mt-1">

            <span>${funcion}</span>
        `;

        label
            .querySelector("input")
            .addEventListener("change", () => {

                const url =`dependencia.html?dep=${dep}&funcion=${encodeURIComponent(funcion)}`;

                window.location.href = url;

            });

        funciones.appendChild(label);

    });

}





////////////CARGUE VALIDACION DEPENDENCIA CONTRAVENCIONES//////////////////

function cargarPreviewContravenciones(dep, funciones) {

    dependenciaSeleccionada = dep;

    funciones.innerHTML = `

        <p class="font-semibold text-lg text-slate-800 mb-3 shadow-md shadow-slate-100 rounded-md">
            ¿Su solicitud corresponde a un trámite nuevo?
        </p>

        <label class="flex gap-2 mb-2 cursor-pointer hover:text-slate-600 transition duration 500">

            <input type="radio" name="tipoSolicitud" value="nuevo">

            <span><span class="font-bold">Sí</span>, corresponde a un trámite nuevo.</span>

        </label>

        <label class="flex gap-2 mb-4 cursor-pointer hover:text-slate-600 transition duration 500">

            <input type="radio" name="tipoSolicitud" value="radicado">

            <span><span class="font-bold">No</span>, corresponde a una solicitud ya radicada.</span>

        </label>



        <div id="rutaContravenciones" class="hidden mb-1 rounded-xl border border-[#DB8700] bg-amber-50 p-1 text-sm"></div>

        <div id="contenedorContravenciones"></div>

        

    `;


    
    const radios = funciones.querySelectorAll("input[name='tipoSolicitud']");

    radios.forEach(radio => {

        radio.addEventListener("change", () => {

            if (radio.value === "radicado") {

                mostrarSolicitudRadicada(dep);

            } else {

                
                    historial=[];

                    nodoActual = ARBOL_CONTRAVENCIONES.tramiteNuevo;

                    actualizarRuta();

                    mostrarPregunta(nodoActual);

            }

        });

    });

}

function mostrarPregunta(nodo){

    nodoActual = nodo;

    //document.getElementById("btnContinuarArbol")?.classList.add("hidden");

    const contenedor = document.getElementById("contenedorContravenciones");

    contenedor.innerHTML="";

    let html=`
        <h3 class="font-bold text-lg mb-2 rounded-lg text-center p-1 shadow-md shadow-amber-300">

            ${nodo.pregunta}

        </h3>
    `;

    nodo.opciones.forEach(opcion=>{

        html+=`

            <label class="flex items-start gap-1  border-1 border-slate-300 shadow-sm shadow-amber-200 cursor-pointer border  rounded-xl p-1 mb-2">

                <input
                    type="radio"
                    name="decision"

                    value="${opcion.id}"

                    onchange="seleccionarDecision('${opcion.id}')">

                <span>

                    ${opcion.label}

                </span>

            </label>

        `;

    });

    contenedor.innerHTML=html;

}


function seleccionarDecision(id){

    //const btnContinuar = document.getElementById("btnContinuarArbol");

    if(!nodoActual) return;

    const opcion = nodoActual.opciones.find(item=>item.id===id);

   

    if(!opcion) return;

    
    historial[nivelActual] = {
        opcion,
        nodo: nodoActual
    };

    historial.length = nivelActual + 1;

    actualizarRuta();

    if (opcion.siguiente) {

        nivelActual++;

        mostrarPregunta(opcion.siguiente);

    } else {

        //btnContinuar.classList.remove("hidden");

        //btnContinuar.addEventListener("click",continuarArbol);

        continuarArbol();

    }


}
window.seleccionarDecision = seleccionarDecision;


//////RUTA SELECCIONES ESCOGIDAS 

function actualizarRuta(){

    const div = document.getElementById("rutaContravenciones");

    if(historial.length===0){

        div.classList.add("hidden");
        div.innerHTML="";
        return;

    }

    div.classList.remove("hidden");

    div.innerHTML = historial
        .map((item,indice)=>`

            <span
                class="cursor-pointer  hover:underline  rounded-md  transition duration-300   text-slate-700 px-1 py-1  font-semibold"
                onclick="volverNivel(${indice})">

                ${item.opcion.label}

            </span>

        `)
        .join(` <span class="text-gray-500 font-bold">></span> `);

}


function volverNivel(indice){

    historial = historial.slice(0, indice + 1);

    nivelActual = indice;

    actualizarRuta();

    mostrarPregunta(historial[indice].nodo);

}
window.volverNivel = volverNivel;

function continuarArbol() {

    // Última opción seleccionada del árbol
    const ultimaOpcion = historial[historial.length - 1].opcion;

    // Validar trámites presenciales
    if (ultimaOpcion.id === "cambioInfractor") {

        mostrarModalInformativo("Este trámite requiere realizarse de manera presencial en la Secretaría de Movilidad.");
        return;
    }

    if (ultimaOpcion.id === "acuerdosdepago") {

        mostrarModalInformativo("Los acuerdos de pago, consultas e incumplimientos se realizan únicamente de manera presencial en la Secretaría de Movilidad.");
        return;
    }

    const funcion = historial.map(item => item.opcion.label).join(" > ");

    window.location.href =`dependencia.html?dep=${dependenciaSeleccionada}&funcion=${encodeURIComponent(funcion)}`;

}
window.continuarArbol = continuarArbol;

function mostrarModalInformativo(mensaje){

    const modal = document.getElementById("modalInformativo");

    document.getElementById("mensajeModal").textContent = mensaje;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.getElementById("btnCerrarModal")
    .addEventListener("click", () => {

        document
            .getElementById("modalInformativo")
            .classList.add("hidden");

        document
            .getElementById("modalInformativo")
            .classList.remove("flex");

    });

}

//RESPUESTA A OPCION TRAMITE NUEVO NO, CORRESPONDE A UNA SOLICITUD YA RADICADA


function mostrarSolicitudRadicada(dep) {

    const contenedor = document.getElementById("contenedorContravenciones");

    contenedor.innerHTML = `

        <hr class="my-4 border-slate-400">

        <div class="flex flex-row items-center justify-between gap-2"> 
        <input
            id="txtRadicadoPreview"
            title="ingresa el número de Radicado para continuar"
            autocomplete="off"
            type="text"
            maxlength="18"
            autofocus
            inputmode="numeric"
            class="w-full  transition duration-500 focus:outline-none border-2 border-slate-400 focus:border-[#DB8700] rounded-lg p-1 mb-2"
            placeholder="Ingrese número de radicado">
        <div class="relative group">
                        <div class="border-2 border-orange-700 font-bold bg-orange-500 rounded-full text-white text-lg h-7 w-7 flex transition-duration-300 items-center justify-center">
                          ?
                        </div>
                        <div class="absolute z-50 -left-30 -translate-x-1/2 -top-10  mt-2 w-64 h-auto text-justify rounded-md bg-white text-slate-800  text-md p-1 shadow-md shadow-orange-200 opacity-0 pointer-events-none transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                                Escribe el número de radicado del tramite de 18 digitos
                        </div>
        </div> 
        </div>    

         <h3 class="text-base text-slate800 text-start my-1 font-bold">Tramites</h3>

        <div id="CopcionesRadicado"></div>
        
    `;


        const txtRadicado = document.getElementById("txtRadicadoPreview");
        const contenedorOpciones = document.getElementById("CopcionesRadicado");
       
        txtRadicado.focus();
        txtRadicado.addEventListener("input", function () {

            this.value = this.value.replace(/\D/g, "");

            if (this.value.length > 18) {
                this.value = this.value.slice(0, 18);
            }

           enviarSiCompleto(dep);


        });

        opcionesRadicado.forEach(opcion => {

            const label = document.createElement("label");

            label.className = "flex gap-1 mb-1 cursor-pointer border border-slate-400 transition duration-500 rounded-lg p-1 focus:border-[#DB8700] hover:text-slate-600";

            label.innerHTML = `
                <input
                type="radio"
                name="opcionRadicado"
                value="${opcion}">

            <span>${opcion}</span>
            `;

            label.querySelector("input").addEventListener("change",()=>{


                if (!txtRadicado.value.trim()) {
                    txtRadicado.focus();
                    return;
                }
                
                enviarSiCompleto(dep);

            });

            contenedorOpciones.appendChild(label);

        });


}

function enviarSiCompleto(dep) {

    const txtRadicado = document.getElementById("txtRadicadoPreview");

    const opcion = document.querySelector("input[name='opcionRadicado']:checked");

    if (!opcion) return;

    if (txtRadicado.value.length !== 18) return;

    window.location.href = `dependencia.html?dep=${dep}` + `&funcion=${encodeURIComponent(opcion.value)}` + `&radicado=${encodeURIComponent(txtRadicado.value)}`;

}

////////////END CARGUE VALIDACION DEPENDENCIA CONTRAVENCIONES//////////////////



/////CARGUE DESPLIEGUE OPCION ESPECIAL  DESPACHO DEL SECRETARIO///////////////////    

function cargarFuncionesDespachoSecretario(dep, dependencia, funciones) {

    dependencia.funciones.forEach(funcion => {
        const item = document.createElement("div");
        item.className = "mb-2";

        const label = document.createElement("label");
        label.className =
            "flex items-start gap-1 transition duration-700 hover:text-slate-800 " +
            "text-slate-600 cursor-pointer border border-slate-400 rounded-xl " +
            "p-2 shadow-sm shadow-amber-300";

        label.innerHTML = `
            <input type="radio" name="previewFuncion" class="mt-1">
            <span>${funcion}</span>
        `;

        const subfunciones = document.createElement("div");
        subfunciones.className =
            "hidden mt-2 ml-3 rounded-xl border-2 border-[#DB8700] " +
            "bg-amber-50 p-3";

        label.querySelector("input").addEventListener("change", () => {
            if (funcion === "Requerimiento Entes de Control") {
                
                subfunciones.classList.remove("hidden");
                mostrarSubfuncionesEntesControl(dep, subfunciones);

                requestAnimationFrame(()=>{

                    subfunciones.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                });

                return;
            }

            navegarADependencia(dep, funcion);
        });

        item.append(label, subfunciones);
        funciones.appendChild(item);
    });
}

function mostrarSubfuncionesEntesControl(dep,contenedor){

    
        contenedor.innerHTML = `
        <h3 class="font-semibold text-slate-800 mb-2">
            Seleccione el ente de control
        </h3>
        <div id="listaSubfuncionesEntes" class="space-y-1"></div>
        <div id="camposPersonerias" class="hidden mt-3 space-y-2">
            <label class="block text-sm font-medium">
                N.º de Comisión
                <div class="flex flex-row items-center gap-2"> 
                <input id="numeroComision" type="text" autofocus inputmode="numeric" autocomplete="off" placeholder="obligatorio" class="w-full border border-slate-400 bg-white rounded-lg p-2 focus:outline-none focus:border-[#DB8700]">
                 <div class="relative group">
                        <div class="border-2 border-orange-700 font-bold bg-orange-500 rounded-full text-white text-lg h-7 w-7 flex transition-duration-300 items-center justify-center">
                          ?
                        </div>
                        <div class="absolute z-50 -left-30 -translate-x-1/2 -top-10  mt-2 w-64 h-auto text-justify rounded-md bg-white text-slate-800  text-md p-1 shadow-md shadow-orange-200 opacity-0 pointer-events-none transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                                Escribe cual es el numero de comisión 
                        </div>
                </div>
                </div>
                </label>
            <label class="block text-sm font-medium">
                N.º de Radicado Seguimiento Trámite
                <div class="flex flex-row items-center gap-2"> 
                <input id="numeroRadicadoSeguimiento" type="text" maxlength="18" inputmode="numeric" autocomplete="off" placeholder="obligatorio" class="w-full border border-slate-400 rounded-lg p-2 bg-white focus:outline-none focus:border-[#DB8700]">
                <div class="relative group">
                        <div class="border-2 border-orange-700 font-bold bg-orange-500 rounded-full text-white text-lg h-7 w-7 flex transition-duration-300 items-center justify-center">
                          ?
                        </div>
                        <div class="absolute z-50 -left-30 -translate-x-1/2 -top-10  mt-2 w-64 h-auto text-justify rounded-md bg-white text-slate-800  text-md p-1 shadow-md shadow-orange-200 opacity-0 pointer-events-none transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                                Escribe cual es el numero de Radicado Pendiente del tramite de 18 digitos
                        </div>
                </div>
               </div>
            </label>
            <button id="btnContinuarPersonerias" type="button" disabled
                class="w-full rounded-lg bg-gray-400 text-white p-2 cursor-not-allowed">
                Continuar
            </button>
        </div>
    `;

    const opciones = [
        "Contraloría General de la República",
        "Procuraduría General de la Nación",
        "Defensoría del Pueblo",
        "Personerías Distritales y Municipales"
    ];

    const lista = contenedor.querySelector("#listaSubfuncionesEntes");

    opciones.forEach(subfuncion => {
        const label = document.createElement("label");
        label.className =
            "flex items-start gap-2 cursor-pointer border border-slate-300 " +
            "rounded-lg p-2 mb-1";

        label.innerHTML = `
            <input type="radio" name="subfuncionEnteControl">
            <span>${subfuncion}</span>
        `;

        label.querySelector("input").addEventListener("change", () => {
            if (subfuncion === "Personerías Distritales y Municipales") {
                configurarCamposPersonerias(dep, subfuncion, contenedor);

                requestAnimationFrame(()=>{
                    label.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                });

            } else {
                navegarADependencia(dep, "Requerimiento Entes de Control", subfuncion);
            }
        });

        lista.appendChild(label);
    });

}

function configurarCamposPersonerias(dep, subfuncion, contenedor) {
    const campos = contenedor.querySelector("#camposPersonerias");
    const comision = contenedor.querySelector("#numeroComision");
    const radicado = contenedor.querySelector("#numeroRadicadoSeguimiento");
    const boton = contenedor.querySelector("#btnContinuarPersonerias");
   


    campos.classList.remove("hidden");

    [comision, radicado].forEach(campo => {
        campo.addEventListener("input", () => {

           
            campo.value = campo.value.replace(/\D/g, "");

            if(campo.id==="numeroRadicadoSeguimiento"){
               if (campo.value.length > 18) {
                  campo.value = campo.value.slice(0, 18);
               }
             
            }
            if(campo.id==="numeroComision"){
               if (campo.value.length > 6) {
                  campo.value = campo.value.slice(0, 6);
               }
           
            }



            const listo = comision.value.trim() !== "" &&  radicado.value.trim() !== "" && comision.value.length ===6 && radicado.value.length===18;

            boton.disabled = !listo;
            boton.classList.toggle("bg-gray-400", !listo);
            boton.classList.toggle("cursor-not-allowed", !listo);
            boton.classList.toggle("bg-[#002855]", listo);
            boton.classList.toggle("cursor-pointer", listo);
        });
    });

    boton.addEventListener("click", () => {
        if (!comision.value.trim() || !radicado.value.trim()) return;

        navegarADependencia(
            dep,
            "Requerimiento Entes de Control",
            subfuncion,
            {
                numeroComision: comision.value.trim(),
                numeroRadicadoSeguimiento: radicado.value.trim()
            }
        );
    });
}    

function navegarADependencia(dep, funcion, subfuncion = "", datos = {}) {
    
    const partesRuta = [funcion];

    if (subfuncion) partesRuta.push(subfuncion);

    if (datos.numeroComision) {
        partesRuta.push(`N.º de Comisión ${datos.numeroComision}`);
    }

    if (datos.numeroRadicadoSeguimiento) {
        partesRuta.push(
            `N.º de Radicado Seguimiento Trámite ${datos.numeroRadicadoSeguimiento}`
        );
    }

    const parametros = new URLSearchParams({
        dep,
        funcion: partesRuta.join(" > "),
        funcionBase: funcion,
        ...datos
    });

    if (subfuncion) {
        parametros.set("subfuncion", subfuncion);
    }

    

    window.location.href = `dependencia.html?${parametros.toString()}`;
}

/////END CARGUE DESPLIEGUE DESPACHO DEL SECRETARIO///////////////////

function ocultarPreview(preview) {

     //cambios hechos hoy domingo 19
            historial = [];
            nivelActual = 0;
    
    preview.classList.add(
        "opacity-0",
        "invisible",
        "-translate-x-4"
    );

    preview.classList.remove("preview-mobile");
    document.getElementById("previewOverlay").classList.remove("show");

}