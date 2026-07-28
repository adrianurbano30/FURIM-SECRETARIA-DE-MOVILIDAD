import {DEPENDENCIAS} from './dependencias.js'
import { COLOMBIA } from './ubicaciones.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {

        cargarDependencia();
        cargarDepartamentos();

    }
);


let dependenciaActual = null;
let funcionSeleccionada = "";


// OBJETO RADICACION DATOS RADICACION

const radicacion = {

    dependencia: '',
    codigoDependencia: '',
    funcion: '',

    tipoSolicitante: '',

    primerNombre: '',
    segundoNombre: '',

    primerApellido: '',
    segundoApellido: '',

    tipoDocumento: '',
    documento: '',

    correo: '',
    direccion: '',

    celular: '',
    fijo: '',

    pais:'',
    departamento: '',
    municipio: '',

    razonSocial: '',
    cualDocumento: '',

    tipoSolicitud: '',

    asunto: '',
    contenido: '',
    medioRespuesta: '',
    aceptaPolitica: false,
    anonima: false,
    anexo1: null,
    anexo2: null,
    anexo3: null

};

// END OBJETO RADICACION DATOS RADICACION


function seleccionarFuncion(radio) {

    funcionSeleccionada = radio.value;

    document.getElementById('mensajeInicio').classList.add('hidden');
    document.getElementById('seccionFormulario').classList.remove('hidden');

    radicacion.dependencia = dependenciaActual.nombre;
    radicacion.codigoDependencia = dependenciaActual.codigo;

    radicacion.funcion = funcionSeleccionada;
    radicacion.asunto = funcionSeleccionada;

    const resumen = document.getElementById('resumenSeleccion');

    const txtAsunto = document.getElementById('txtAsunto');

    if(txtAsunto){

        if (funcionSeleccionada == "Otro") {
            
            txtAsunto.removeAttribute('readonly');

            txtAsunto.value='';

            //txtAsunto.ariaPlaceholder='Escriba Otro Asunto referente a ' + radicacion.dependencia;
            
            txtAsunto.placeholder = 'Escriba otro asunto referente a ' + radicacion.dependencia;


            txtAsunto.focus();
            radicacion.asunto = '';

        }else{
            txtAsunto.setAttribute('readonly',true);
            txtAsunto.value = funcionSeleccionada;
            radicacion.asunto = funcionSeleccionada;
        }

        //txtAsunto.value = radicacion.asunto;



    }



    resumen.innerHTML = `
        <strong>Dependencia:</strong> ${radicacion.dependencia}
        <br>
        <strong>Función:</strong> ${radicacion.funcion}
    `;
    resumen.classList.add('text-slate-800');

    resumen.classList.remove('hidden');

    //console.table(radicacion);

}
window.seleccionarFuncion = seleccionarFuncion;



function inicializarContravenciones(funcionUrl, radicadoUrl){

    let tsolicitud = "peticion";
    radicacion.dependencia = dependenciaActual.nombre;
    radicacion.codigoDependencia = dependenciaActual.codigo;
    radicacion.funcion = funcionUrl;
    const tieneRadicado = radicadoUrl && radicadoUrl.trim() !== "";

    const radios = document.querySelectorAll('input[name="tipoSolicitud"]');
    const btnContinuarPaso2 = document.getElementById('btnContinuarPaso2');


    const txtAsunto = document.getElementById("txtAsunto");
    const resumen = document.getElementById("resumenSeleccion");
    
    


    if (tieneRadicado) {
        radicacion.asunto = `${funcionUrl} - Radicado ${radicadoUrl}`;
         resumen.innerHTML = `<strong>Dependencia:</strong> ${radicacion.dependencia}<br><strong>Función:</strong> ${radicacion.funcion} -  Radicado ${radicadoUrl}`;
         
         if (funcionUrl === "Respuesta a un requerimiento") {
            tsolicitud = "Requerimiento";
         }


        }else{
        radicacion.asunto = `${funcionUrl}`;
        resumen.innerHTML = `<strong>Dependencia:</strong> ${radicacion.dependencia}<br><strong>Función:</strong> ${radicacion.funcion}`;
    }

    document.getElementById("mensajeInicio").classList.add("hidden");
    document.getElementById("seccionFormulario").classList.remove("hidden");
    document.getElementById('txtDependenciaSeleccionada').value =`${radicacion.dependencia} - Código ${radicacion.codigoDependencia}`;

    txtAsunto.value = radicacion.asunto;
    radicacion.tipoSolicitud = tsolicitud;

    radios.forEach(radio => {

    
        if (radio.value === tsolicitud) {
            radio.checked = true;
        }

        radio.disabled = true;
    });

    btnContinuarPaso2.disabled = false;
    btnContinuarPaso2.classList.remove('bg-gray-400','cursor-not-allowed','opacity-60');
    btnContinuarPaso2.classList.add('bg-[#002855]','cursor-pointer');


    

    resumen.classList.remove("hidden");

    if (txtAsunto) {
        
        if (funcionUrl === "Otro") {

            txtAsunto.removeAttribute('readonly');
           
        }

    }
   

}


function cargarDependencia() {

    const parametros = new URLSearchParams(window.location.search);

    const claveDependencia = parametros.get('dep');

    const funcionUrl = parametros.get('funcion');

    const radicadoUrl = parametros.get('radicado');

    

    dependenciaActual = DEPENDENCIAS[claveDependencia];

    if(!dependenciaActual){

        alert('Dependencia no encontrada');

        window.location.href = 'opts.html';

        return;
    }

    document.getElementById('nombreDependencia').textContent = dependenciaActual.nombre;

    document.getElementById('codigoDependencia').textContent = dependenciaActual.codigo;

    
    

    if (claveDependencia==="contravenciones") {
        
       
        inicializarContravenciones(funcionUrl,radicadoUrl);


    }else{

       cargarFunciones();
       if(funcionUrl){

         const radios =
             document.querySelectorAll('input[name="funcionDependencia"]');

            radios.forEach(radio => {

             if(radio.value === funcionUrl){

                 radio.checked = true;

                 seleccionarFuncion(radio);

             }

         });

        }

    } 


}   

   



    // SI VIENE UNA FUNCIÓN DESDE opts.html

    

     


function cargarFunciones() {

    const contenedor = document.getElementById('contenedorFunciones');

    contenedor.innerHTML = '';

    dependenciaActual.funciones.forEach(
        funcion => {

          contenedor.innerHTML += `
                <label class="flex items-start gap-2 hover:scale-105 transition duration-700 cursor-pointer border border-slate-200 rounded-xl p-2 shadow-md shadow-amber-400">
                    <input name="funcionDependencia"
                           value="${funcion}"  
                           onchange="seleccionarFuncion(this)"
                           type="radio">
                    <span>${funcion}</span>
                </label>
            `;

        }
    );

    // CREACION DE FUNCION OTRO CUALQUIER DEPENDENCIA

    contenedor.innerHTML += `
        <label class="flex items-start gap-2 hover:scale-105 transition duration-700 cursor-pointer border border-slate-200 rounded-xl p-2 shadow-md shadow-amber-400">
            <input
                name="funcionDependencia"
                value="Otro"
                onchange="seleccionarFuncion(this)"
                type="radio">

            <span>Otro</span>
        </label>
    `;
    

}



 function cargarDepartamentos() {

     const cmbDepartamento = document.getElementById('cmbDepartamento');

     COLOMBIA.forEach(
         item => {

             cmbDepartamento.innerHTML += `
                 <option value="${item.departamento}">
                     ${item.departamento}
                 </option>
             `;

         }
     );

 }






function cargarMunicipios(departamentoSeleccionado) {

    const cmbCiudad = document.getElementById('cmbCiudad');

    cmbCiudad.innerHTML = '<option value="" selected disabled>- Seleccione Municipio -</option>';

    const departamento =
        COLOMBIA.find(
            item => item.departamento === departamentoSeleccionado
        );

    if(!departamento)
        return;

    departamento.municipios.forEach(
        municipio => {

            cmbCiudad.innerHTML += `
                <option value="${municipio}">
                    ${municipio}
                </option>
            `;

        }
    );

}
window.cargarMunicipios = cargarMunicipios;



function cargarTiposDocumento(tipoSolicitante) {

    const txtTipoDoc = document.getElementById('txtTipoDoc');

    txtTipoDoc.innerHTML = '<option value="" disabled selected>- Seleccione -</option>';

    let opciones = [];

    switch(tipoSolicitante) {

        case 'natural':

            opciones = [
                ['CC','Cédula de Ciudadanía (CC)'],
                ['CE','Cédula de Extranjería (CE)'],
                ['RC','Registro Civil (RC)'],
                ['OTRO','Otro tipo de documento']
            ];

        break;

        case 'juridica':

            opciones = [
                ['NIT','NIT']
            ];

        break;

        case 'menor':

            opciones = [
                ['TI','Tarjeta de Identidad (TI)'],
                ['RC','Registro Civil (RC)'],
                ['CE','Cédula de Extranjería (CE)'],
                ['OTRO','Otro tipo de documento']
            ];

        break;

        case 'apoderado':

            opciones = [
                ['CC','Cédula de Ciudadanía (CC)'],
                ['CE','Cédula de Extranjería (CE)'],
                ['RC','Registro Civil (RC)'],
                ['OTRO','Otro tipo de documento']
            ];

        break;
    }

    opciones.forEach(opcion => {

        txtTipoDoc.innerHTML += `
            <option value="${opcion[0]}">
                ${opcion[1]}
            </option>
        `;

    });

}




function alternarAnonimo(check) {

    radicacion.anonima = check.checked;

    
    const btn = document.getElementById('btnContinuarPaso1');
    const ubicacionGeografica = document.getElementById('bloqueubicacionGeografica');
    const bloqueSelectorMaestro = document.getElementById('bloqueSelectorMaestro');
    const bloqueDatosPersonales = document.getElementById('bloqueDatosPersonales');
    const campoRazonSocial = document.getElementById('campoRazonSocial');
   const bloqueDocumentoOtro = document.getElementById('bloqueDocumentoOtro');

    if(check.checked)
    {
        document.getElementById('modalAnonimo').classList.remove('hidden');
        btn.disabled = true;
        bloqueSelectorMaestro.classList.add('hidden');
        bloqueDatosPersonales.classList.add('hidden');
        campoRazonSocial.classList.add('hidden');
        bloqueDocumentoOtro.classList.add('hidden');

        ubicacionGeografica.classList.remove('hidden');
    }else
    {
        ubicacionGeografica.classList.add('hidden');
        bloqueSelectorMaestro.classList.remove('hidden');
         bloqueDatosPersonales.classList.add('hidden');

        btn.disabled = false;

            ////DESHABILITAR BOTON CONTINUAR PASO 1

            btn.classList.remove(
                'bg-[#002855]',
                'cursor-pointer'
            );

            btn.classList.add(
                'bg-gray-400',
                'cursor-not-allowed',
                'opacity-60'
            );

    }

}
window.alternarAnonimo = alternarAnonimo;



function cerrarModalAnonimo() {
    document.getElementById('modalAnonimo').classList.add('hidden');
}
window.cerrarModalAnonimo = cerrarModalAnonimo;



//////////////////////VALIDAR PASO 2

function validarPaso2() {

    const seleccionado = document.querySelector('input[name="tipoSolicitud"]:checked');

    if(!seleccionado) {

        alert('Debe seleccionar un tipo de solicitud.');
        return false;
    }

    radicacion.tipoSolicitud = seleccionado.value;

    return true;
}

//////////////////////END VALIDAR PASO 2


//////////////////////VALIDAR PASO 1

function validarPaso1() {

     const btn = document.getElementById('btnContinuarPaso1');

    if(radicacion.anonima) {

        const departamento = document.getElementById('cmbDepartamento').value;

        const municipio = document.getElementById('cmbCiudad').value;

        if(!departamento || !municipio) {

            alert('Debe seleccionar departamento y municipio.');

            return false;
        }
        
        return true;

       

    }

    
    return validarSolicitante();
    //return true;
}



function validarSolicitante() {

    if(!radicacion.tipoSolicitante) {

        alert('Debe seleccionar un tipo de solicitante.');
        return false;
    }

    if(!radicacion.primerNombre) {

        alert('Debe ingresar el primer nombre.');
        return false;
    }

    if(!radicacion.primerApellido) {

        alert('Debe ingresar el primer apellido.');
        return false;
    }

    if(radicacion.tipoSolicitante === 'juridica' && !radicacion.razonSocial) {
        alert('Debe ingresar la razón social.');
        return false;
    }

    if(!radicacion.tipoDocumento) {

        alert('Debe seleccionar el tipo de documento.');
        return false;
    }

    if(!radicacion.documento) {

        alert('Debe ingresar el número de documento.');
        return false;
    }

    if(radicacion.tipoDocumento === 'OTRO' && !radicacion.cualDocumento) {

        alert('Debe especificar cuál es el tipo de documento.');
        return false;
    }

    if(!radicacion.correo) {

        alert('Debe ingresar el correo electrónico.');
        return false;
    }

    if(!radicacion.direccion) {

        alert('Debe ingresar la dirección.');
        return false;
    }

    if(!radicacion.departamento) {

        alert('Debe seleccionar un departamento.');
        return false;
    }

    if(!radicacion.municipio) {

        alert('Debe seleccionar un municipio.');
        return false;
    }

    return true;
}



function irAlPaso(paso) {

    const capa1= document.getElementById('capa-paso1');
    const capa2= document.getElementById('capa-paso2');
    const capa3= document.getElementById('capa-paso3');

    

    guardarDatosSolicitante();


    if (paso === 1) {

        actualizarTabs(1);

        capa1.classList.remove('hidden');
        capa2.classList.add('hidden');
        capa3.classList.add('hidden');

    }

    if (paso === 2) {

        if(!validarPaso1()) {
            return;
        }

        actualizarTabs(2);


        //console.log("dependencia actual->",dependenciaActual.nombre);

        if (dependenciaActual.nombre === "Oficina de Contravenciones") {
            console.table(dependenciaActual);
            capa1.classList.add('hidden');
            capa2.classList.add('hidden');
            capa3.classList.remove('hidden');
            actualizarTabs(3);
        }else{
            capa1.classList.add('hidden');
            capa2.classList.remove('hidden');
            capa3.classList.add('hidden');
        }

        

    }

    if (paso === 3) {

         if(!validarPaso1()) {
            return;
        }
        if (!validarPaso2()) {
            return;
        }

        actualizarTabs(3);

        document.getElementById('txtAsunto').value = radicacion.asunto;
        document.getElementById('txtDependenciaSeleccionada').value =`${radicacion.dependencia} - Código ${radicacion.codigoDependencia}`;
        //document.getElementById('txtDependenciaSeleccionada').value =`${radicacion.dependencia}`;

        capa1.classList.add('hidden');
        capa2.classList.add('hidden');
        capa3.classList.remove('hidden');

}

}
window.irAlPaso = irAlPaso;


function actualizarTabs(pasoActual) {

    const tabs = [
        'tab-paso1',
        'tab-paso2',
        'tab-paso3'
    ];

    tabs.forEach(id => {

        const tab = document.getElementById(id);

        tab.classList.remove(
            'border-[#002855]',
            'text-[#002855]'
        );

        tab.classList.add(
            'border-transparent',
            'text-slate-400'
        );

    });

    const tabActiva =
        document.getElementById(
            `tab-paso${pasoActual}`
        );

    tabActiva.classList.remove(
        'border-transparent',
        'text-slate-400'
    );

    tabActiva.classList.add(
        'border-[#002855]',
        'text-[#002855]'
    );

}


function actualizarEstadoBotonPaso1() {

    const btn = document.getElementById('btnContinuarPaso1');
    const pais = document.getElementById('cmbPais').value;
    const departamento = document.getElementById('cmbDepartamento').value;
    const municipio = document.getElementById('cmbCiudad').value;

    radicacion.pais = pais;
    radicacion.departamento = departamento;
    radicacion.municipio = municipio;

    //console.table(radicacion);

    if(radicacion.anonima) {

       
        if(departamento && municipio) {

            btn.disabled = false;

            btn.classList.remove(
                'bg-gray-400',
                'cursor-not-allowed',
                'opacity-60'
            );

            btn.classList.add(
                'bg-[#002855]',
                'cursor-pointer'
            );

        } else {

            btn.disabled = true;

            btn.classList.remove(
                'bg-[#002855]',
                'cursor-pointer'
            );

            btn.classList.add(
                'bg-gray-400',
                'cursor-not-allowed',
                'opacity-60'
            );
        }
    }else {

    let formularioCompleto =
    radicacion.tipoSolicitante &&
    radicacion.primerNombre &&
    radicacion.primerApellido &&
    radicacion.tipoDocumento &&
    radicacion.documento &&
    radicacion.correo &&
    radicacion.direccion &&
    radicacion.departamento &&
    radicacion.municipio;


    if(radicacion.tipoSolicitante === 'juridica' && !radicacion.razonSocial){
        formularioCompleto = false;
    }

    if(radicacion.tipoDocumento === 'OTRO' && !radicacion.cualDocumento){
        formularioCompleto = false;
    }

    if(formularioCompleto) {

        btn.disabled = false;

        btn.classList.remove(
            'bg-gray-400',
            'cursor-not-allowed',
            'opacity-60'
        );

        btn.classList.add(
            'bg-[#002855]',
            'cursor-pointer'
        );

    } else {

        btn.disabled = true;

        btn.classList.remove(
            'bg-[#002855]',
            'cursor-pointer'
        );

        btn.classList.add(
            'bg-gray-400',
            'cursor-not-allowed',
            'opacity-60'
        );

    }

}


}
window.actualizarEstadoBotonPaso1 = actualizarEstadoBotonPaso1;



// function actualizarEstadoBotonPaso2() {

//     const btn = document.getElementById('btnContinuarPaso2');

//     const seleccionado = document.querySelector('input[name="tipoSolicitud"]:checked');

//     if(seleccionado) {

//         btn.disabled = false;

//         btn.classList.remove(
//             'bg-gray-400',
//             'cursor-not-allowed',
//             'opacity-60'
//         );

//         btn.classList.add(
//             'bg-[#002855]',
//             'cursor-pointer'
//         );

//     } else {

//         btn.disabled = true;

//         btn.classList.remove(
//             'bg-[#002855]',
//             'cursor-pointer'
//         );

//         btn.classList.add(
//             'bg-gray-400',
//             'cursor-not-allowed',
//             'opacity-60'
//         );

//     }

// }



function controlarFlujoCampos(tipoSolicitante) {

    radicacion.tipoSolicitante = tipoSolicitante;
    cargarTiposDocumento(tipoSolicitante);

    const bloqueDatosPersonales = document.getElementById('bloqueDatosPersonales');

    const campoRazonSocial = document.getElementById('campoRazonSocial');

    const txtTipoDoc = document.getElementById('txtTipoDoc');

    const bloqueUbicacionGeografica = document.getElementById('bloqueubicacionGeografica');

    if(!tipoSolicitante) {

        bloqueDatosPersonales.classList.add('hidden');

        return;
    }

    bloqueDatosPersonales.classList.remove('hidden');
    bloqueUbicacionGeografica.classList.remove('hidden');

    if(tipoSolicitante === 'juridica') {

        campoRazonSocial.classList.remove('hidden');

        txtTipoDoc.value = 'NIT';

        radicacion.tipoDocumento = 'NIT';

    } else {

        campoRazonSocial.classList.add('hidden');

        if(txtTipoDoc.value === 'NIT') {

            txtTipoDoc.value = '';

            radicacion.tipoDocumento = '';
        }
    }

    radicacion.tipoSolicitante = tipoSolicitante;

}
window.controlarFlujoCampos = controlarFlujoCampos;



function evaluarsubDocumentoOtro(tipoDocumento) {

    const bloqueDocumentoOtro = document.getElementById('bloqueDocumentoOtro');

    const txtCualDocumento = document.getElementById('txtCualDocumento');

    if(tipoDocumento === 'OTRO') {

        bloqueDocumentoOtro.classList.remove('hidden');

    } else {

        bloqueDocumentoOtro.classList.add('hidden');

        txtCualDocumento.value = '';

        radicacion.cualDocumento = '';
    }

    radicacion.tipoDocumento = tipoDocumento;

    actualizarEstadoBotonPaso1();
    //console.table(radicacion);

}
window.evaluarsubDocumentoOtro = evaluarsubDocumentoOtro;



function guardarDatosSolicitante() {

    radicacion.primerNombre = document.getElementById('txtPrimerNombre').value;

    radicacion.segundoNombre = document.getElementById('txtSegundoNombre').value;

    radicacion.primerApellido = document.getElementById('txtPrimerApellido').value;

    radicacion.segundoApellido = document.getElementById('txtSegundoApellido').value;

    radicacion.documento = document.getElementById('txtDoc').value;

    radicacion.correo = document.getElementById('txtCorreo').value;

    radicacion.direccion = document.getElementById('txtDireccion').value;

    radicacion.celular = document.getElementById('txtCelular').value;

    radicacion.fijo = document.getElementById('txtFijo').value;

    radicacion.razonSocial = document.getElementById('txtRazonSocial').value;

    radicacion.cualDocumento = document.getElementById('txtCualDocumento').value;

    //console.table(radicacion);

}
window.guardarDatosSolicitante = guardarDatosSolicitante;



function actualizarDatosSolicitante() {

    radicacion.primerNombre = document.getElementById('txtPrimerNombre').value.trim();

    radicacion.segundoNombre = document.getElementById('txtSegundoNombre').value.trim();

    radicacion.primerApellido = document.getElementById('txtPrimerApellido').value.trim();

    radicacion.segundoApellido = document.getElementById('txtSegundoApellido').value.trim();

    radicacion.razonSocial = document.getElementById('txtRazonSocial').value.trim();

    radicacion.documento = document.getElementById('txtDoc').value.trim();

    radicacion.correo = document.getElementById('txtCorreo').value.trim();

    radicacion.direccion = document.getElementById('txtDireccion').value.trim();

    radicacion.celular = document.getElementById('txtCelular').value.trim();

    radicacion.fijo = document.getElementById('txtFijo').value.trim();

    radicacion.cualDocumento = document.getElementById('txtCualDocumento').value.trim();

    //console.table(radicacion);

    actualizarEstadoBotonPaso1();
}
window.actualizarDatosSolicitante = actualizarDatosSolicitante;



function seleccionarTipoSolicitud(radio) {

    radicacion.tipoSolicitud = radio.value;

    const btnContinuarPaso2 = document.getElementById('btnContinuarPaso2');

    btnContinuarPaso2.disabled = false;

    btnContinuarPaso2.classList.remove(
        'bg-gray-400',
        'cursor-not-allowed',
        'opacity-60'
    );

    btnContinuarPaso2.classList.add(
        'bg-[#002855]',
        'cursor-pointer'
    );

   // console.table(radicacion);

}
window.seleccionarTipoSolicitud = seleccionarTipoSolicitud;



function seleccionarMedioRespuesta(radio) {

    radicacion.medioRespuesta = radio.value;

    validarEnvioFinal();
    
    //console.table(radicacion);

}
window.seleccionarMedioRespuesta = seleccionarMedioRespuesta;



function guardarContenido() {

    const txtContenido = document.getElementById('txtContenido');

    radicacion.contenido = txtContenido.value.trim();

    validarEnvioFinal();

    //console.table(radicacion);

}
window.guardarContenido = guardarContenido;



function validarEnvioFinal() {

    const btnEnviarFormulario =
        document.getElementById(
            'btnEnviarFormulario'
        );

    const politicaAceptada =
        document.getElementById(
            'chkPolitica'
        ).checked;

    radicacion.aceptaPolitica =
        politicaAceptada;

    const formularioValido =

        radicacion.asunto.trim() !== '' &&
        radicacion.contenido.trim() !== '' &&
        radicacion.medioRespuesta !== '' &&
        politicaAceptada;

    if(formularioValido){

        btnEnviarFormulario.disabled = false;

        btnEnviarFormulario.classList.remove(
            'cursor-not-allowed',
            'opacity-50'
        );

        btnEnviarFormulario.classList.add(
            'cursor-pointer'
        );

    } else {

        btnEnviarFormulario.disabled = true;

        btnEnviarFormulario.classList.add(
            'cursor-not-allowed',
            'opacity-50'
        );

        btnEnviarFormulario.classList.remove(
            'cursor-pointer'
        );

    }

}
window.validarEnvioFinal = validarEnvioFinal;



function seleccionarAnexo(input) {

    const archivo = input.files[0];

    if (!archivo) {
        return;
    }

    const extensionesPermitidas = [
        'pdf',
        'docx',
        'xlsx',
        'jpg',
        'jpeg',
        'png'
    ];

    const extension =
        archivo.name.split('.').pop().toLowerCase();

    if (!extensionesPermitidas.includes(extension)) {

        alert(
            'Formato no permitido. Solo PDF, DOCX, XLSX, JPG y PNG.'
        );

        input.value = '';

        return;
    }

    const TAMANO_MAXIMO =
        30 * 1024 * 1024;

    if (archivo.size > TAMANO_MAXIMO) {

        alert(
            'El archivo supera el tamaño máximo permitido de 30 MB.'
        );

        input.value = '';

        return;
    }

    radicacion[input.id] = archivo;

   // console.table(radicacion);

}
window.seleccionarAnexo = seleccionarAnexo;



function enviarFormulario() {

    const modalExito = document.getElementById('modalExito');

    const lblResumenFecha = document.getElementById('lblResumenFecha');

    const contenedorListaDatos = document.getElementById('contenedorListaDatos');

    lblResumenFecha.textContent = new Date().toLocaleString('es-CO');

    contenedorListaDatos.innerHTML = '';

    const datosResumen = [

        ['Dependencia', radicacion.dependencia],
        ['Código Dependencia', radicacion.codigoDependencia],
        ['Función', radicacion.funcion==='Otro'?radicacion.asunto:radicacion.funcion],

        ['Tipo Solicitud', radicacion.tipoSolicitud],
        ['Tipo Solicitante', radicacion.tipoSolicitante],

        ['Documento', radicacion.documento],
        ['Correo', radicacion.correo],
        ['Celular', radicacion.celular],

        ['País', radicacion.pais],
        ['Departamento', radicacion.departamento],
        ['Municipio', radicacion.municipio],

        ['Asunto', radicacion.asunto],
        ['Contenido', radicacion.contenido],

        ['Medio Respuesta', radicacion.medioRespuesta]
    ];

    if (radicacion.anexo1) {

        datosResumen.push([
            'Anexo 1',
            radicacion.anexo1.name
        ]);

    }

    if (radicacion.anexo2) {

        datosResumen.push([
            'Anexo 2',
            radicacion.anexo2.name
        ]);

    }

    if (radicacion.anexo3) {

        datosResumen.push([
            'Anexo 3',
            radicacion.anexo3.name
        ]);

    }

    datosResumen.push([
        'Acepta Política',
        radicacion.aceptaPolitica ? 'Sí' : 'No'
    ]);

    datosResumen.forEach(([titulo, valor]) => {

        const fila = document.createElement('div');

        fila.className =
            'px-4 py-3 flex justify-between items-start gap-4';

        fila.innerHTML = `
            <span class="font-bold text-[#002855]">
                ${titulo}
            </span>

            <span class="text-right text-slate-700">
                ${valor || '-'}
            </span>
        `;

        contenedorListaDatos.appendChild(fila);

    });

    modalExito.classList.remove('hidden');

   // console.table(radicacion);

}
window.enviarFormulario = enviarFormulario;



function finalizarTodo() {

    const modalExito = document.getElementById('modalExito');

    modalExito.classList.add('hidden');

    limpiarRadicacion();

    //console.log('RADICACION LIMPIADA');

   // console.table(radicacion);

    window.location.href = 'opts.html';

}
window.finalizarTodo = finalizarTodo;



function limpiarRadicacion() {

    Object.keys(radicacion).forEach(key => {

        if(typeof radicacion[key] === 'boolean'){

            radicacion[key] = false;

        }else{

            radicacion[key] = '';

        }

    });

    radicacion.anexo1 = null;
    radicacion.anexo2 = null;
    radicacion.anexo3 = null;

}

function actualizarAsunto() {

    radicacion.asunto = document.getElementById('txtAsunto').value.trim();
    validarEnvioFinal();
}
window.actualizarAsunto = actualizarAsunto;
