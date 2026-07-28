import { DEPENDENCIAS } from './dependencias.js';
import { ARBOL_CONTRAVENCIONES } from './contravenciones.js';

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

document.addEventListener("DOMContentLoaded", () => {

    const preview = document.getElementById("previewDependencia");
    const nombre = document.getElementById("previewNombre");
    const codigo = document.getElementById("previewCodigo");
    const descripcion = document.getElementById("previewDescripcion");
    const funciones = document.getElementById("previewFunciones");

    const tarjetas = document.querySelectorAll(".card-dependencia");

    let temporizador;

    tarjetas.forEach(tarjeta => {

        tarjeta.addEventListener("mouseenter", () => {

            clearTimeout(temporizador);

            const dep = tarjeta.dataset.dependencia;

            

            temporizador = setTimeout(() => {

                cargarPreview(dep,tarjeta,preview,nombre,descripcion,codigo,funciones);

            }, 200);

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

    });

    preview.addEventListener("mouseleave", () => {

        ocultarPreview(preview);

    });

});


function cargarPreview(dep,tarjeta,preview,nombre,descripcion,codigo,funciones) {

    const dependencia = DEPENDENCIAS[dep];
    nombre.textContent = dependencia.nombre;
    codigo.textContent = `Código: ${dependencia.codigo}`;
    funciones.innerHTML = "";
    

    if (dependencia.nombre!="Oficina de Contravenciones") {
        
        descripcion.textContent ="Para iniciar el proceso de radicación, seleccione una de las funciones disponibles del equipo de trabajo. Una vez seleccionada la función, se habilitará el formulario correspondiente.";
        
        cargarFuncionesNormales(dep,dependencia,funciones)

    }else{

        descripcion.textContent ="Para iniciar el proceso de radicacion, seleccione una de las opciones disponibles. Si su solicitud corresponde a un trámite nuevo, seleccione la opción 'Sí, corresponde a un trámite nuevo'. Si su solicitud corresponde a una solicitud ya radicada, seleccione la opción 'No, corresponde a una solicitud ya radicada'.";
        cargarPreviewContravenciones(dep,funciones);
    
    } 

    
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

    preview.classList.remove(
        "opacity-0",
        "invisible",
        "-translate-x-4"
    );

}


function cargarPreviewContravenciones(dep, funciones) {

    dependenciaSeleccionada = dep;

    funciones.innerHTML = `

        <p class="font-semibold text-lg text-slate-800 mb-3 shadow-md shadow-slate-100 rounded-md">
            ¿Su solicitud corresponde a un trámite nuevo?
        </p>

        <label class="flex gap-2 mb-2 cursor-pointer hover:text-slate-600 transition duration 500">

            <input
                type="radio"
                name="tipoSolicitud"
                value="nuevo">

            <span><span class="font-bold">Sí</span>, corresponde a un trámite nuevo.</span>

        </label>

        <label class="flex gap-2 mb-4 cursor-pointer hover:text-slate-600 transition duration 500">

            <input
                type="radio"
                name="tipoSolicitud"
                value="radicado">

            <span><span class="font-bold">No</span>, corresponde a una solicitud ya radicada.</span>

        </label>



        <div id="rutaContravenciones" class="hidden mb-1 rounded-xl border-1 border-[#DB8700] bg-amber-50 p-1 text-sm"></div>

        <div id="contenedorContravenciones"></div>

        

    `;


    // <div class="mt-2 text-end ">

    //         <button id="btnContinuarArbol" class="hidden bg-blue-700  text-white px-4 py-2 rounded-xl">

    //             Continuar

    //         </button>

    // </div>


    
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

    //console.log("Opción seleccionada:", opcion);

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

        mostrarModalInformativo(
            "Este trámite requiere realizarse de manera presencial en la Secretaría de Movilidad."
        );
        return;
    }

    if (ultimaOpcion.id === "acuerdosdepago") {

        mostrarModalInformativo(
            "Los acuerdos de pago, consultas e incumplimientos se realizan únicamente de manera presencial en la Secretaría de Movilidad."
        );
        return;
    }

    const funcion = historial
        .map(item => item.opcion.label)
        .join(" > ");

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

        
        <input
            id="txtRadicadoPreview"
            title="ingresa el número de Radicado para continuar"
            type="text"
            maxlength="18"
            autofocus
            inputmode="numeric"
            class="w-full border transition duration-500 focus:outline-none border-2 border-slate-400 focus:border-[#DB8700] rounded-lg p-1 mb-2"
            placeholder="Ingrese número de radicado">

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

            label.className = "flex gap-1 mb-1 cursor-pointer border-1 border-slate-300 transition duration-500 rounded-lg p-1 focus:border-[#DB8700] hover:text-slate-600";

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

    window.location.href =
        `dependencia.html?dep=${dep}`
        + `&funcion=${encodeURIComponent(opcion.value)}`
        + `&radicado=${encodeURIComponent(txtRadicado.value)}`;

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

function ocultarPreview(preview) {

     //cambios hechos hoy domingo 19
            historial = [];
            nivelActual = 0;
    
    preview.classList.add(
        "opacity-0",
        "invisible",
        "-translate-x-4"
    );

}