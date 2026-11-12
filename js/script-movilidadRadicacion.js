import {DEPENDENCIAS} from './dependencias.js';
import { UBICACIONES_POR_PAIS } from './ubicaciones.js';
import { TIPOSOLICITUD } from './tipoSolicitud.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {
       
        cargarDependencia();
        cargarPaises();
        cargarDepartamentos();
        document.getElementById('cmbPais')?.addEventListener('change', cambiarPais);
        cargarTiposSolicitudDinamicos();
        configurarValidaciones();
        
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

function cargarDependencia() {

    const parametros = new URLSearchParams(window.location.search);

    const claveDependencia = parametros.get('dep');
    const funcionUrl = parametros.get('funcion');
    const radicadoUrl = parametros.get('radicado');
    const funcionBaseUrl = parametros.get('funcionBase') || '';
    const subfuncionUrl = parametros.get('subfuncion') || '';
    const numeroComisionUrl = parametros.get('numeroComision') || '';
    const numeroRadicadoSeguimientoUrl = parametros.get('numeroRadicadoSeguimiento') || '';

    window.history.replaceState({}, document.title, window.location.pathname);

   

    dependenciaActual = DEPENDENCIAS[claveDependencia];

    if(!dependenciaActual){

        alert('Dependencia no encontrada');

        window.location.href = 'index.html';

        return;
    }

   
    document.getElementById('nombreDependencia').textContent = dependenciaActual.nombre;
    document.getElementById('codigoDependencia').textContent = dependenciaActual.codigo;
    
    
    switch (claveDependencia) {


        case "contravenciones":
             inicializarContravenciones(funcionUrl,radicadoUrl);
        break;

        case "despacho":

            if (funcionBaseUrl === "Requerimiento Entes de Control") {
                inicializarDespachoEntesControl( funcionUrl,subfuncionUrl,numeroComisionUrl,numeroRadicadoSeguimientoUrl);
            }else{

                cargarFunciones();
        
            if(funcionUrl){

             const radios = document.querySelectorAll('input[name="funcionDependencia"]');

                radios.forEach(radio => {

                if(radio.value === funcionUrl){

                    radio.checked = true;

                    seleccionarFuncion(radio);

                }

                });

            }

            }

            
            
        break;
    
        default:

        cargarFunciones();
        
        if(funcionUrl){

             const radios = document.querySelectorAll('input[name="funcionDependencia"]');

                radios.forEach(radio => {

                if(radio.value === funcionUrl){

                    radio.checked = true;

                    seleccionarFuncion(radio);

                }

                });

        }

        break;
    }

} 

function inicializarContravenciones(funcionUrl, radicadoUrl){

    radicacion.dependencia = dependenciaActual.nombre;
    radicacion.codigoDependencia = dependenciaActual.codigo;
    radicacion.funcion = funcionUrl;
    const tieneRadicado = radicadoUrl && radicadoUrl.trim() !== "";
    const btnContinuarPaso2 = document.getElementById('btnContinuarPaso2');
    const txtAsunto = document.getElementById("txtAsunto");
    const resumen = document.getElementById("resumenSeleccion");
    const tituloFuncionesEquipo = document.getElementById("TituloFuncionesEquipo");
    
    tituloFuncionesEquipo.classList.add("hidden");


    if (tieneRadicado) {
        radicacion.asunto = `${funcionUrl} - Radicado ${radicadoUrl}`;
    }else{
        radicacion.asunto = `${funcionUrl}`;
    }

    mostrarResumenFuncion(resumen, radicacion.funcion, tieneRadicado ? radicadoUrl : '');

    document.getElementById("mensajeInicio").classList.add("hidden");
    document.getElementById("seccionFormulario").classList.remove("hidden");
    document.getElementById('txtDependenciaSeleccionada').value =`${radicacion.dependencia} - Código ${radicacion.codigoDependencia}`;

    txtAsunto.value = radicacion.asunto;
  
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


function mostrarResumenFuncion(contenedor, funcion, radicado = '') {
    const titulo = document.createElement('h1');
    titulo.className = 'text-xl font-bold';
    titulo.textContent = 'Función - Asunto:';

    const detalle = document.createElement('h2');
    detalle.className = 'text-md';
    detalle.textContent = radicado
        ? `${funcion} - Radicado ${radicado}`
        : String(funcion ?? '');

    contenedor.replaceChildren(titulo, detalle);
}


function inicializarDespachoEntesControl(funcionUrl,subfuncionUrl,numeroComisionUrl,numeroRadicadoSeguimientoUrl) {

    radicacion.dependencia = dependenciaActual.nombre;
    radicacion.codigoDependencia = dependenciaActual.codigo;
    radicacion.funcion = funcionUrl;
    radicacion.asunto = funcionUrl;


    document.getElementById("TituloFuncionesEquipo").classList.add("hidden");
    document.getElementById("mensajeInicio").classList.add("hidden");
    document.getElementById("seccionFormulario").classList.remove("hidden");
    document.getElementById("txtDependenciaSeleccionada").value =`${radicacion.dependencia} - Código ${radicacion.codigoDependencia}`;

    const txtAsunto = document.getElementById("txtAsunto");
    txtAsunto.value = funcionUrl;

    const resumen = document.getElementById("resumenSeleccion");
    mostrarResumenFuncion(resumen, funcionUrl);
    resumen.classList.remove("hidden");
}


function cargarFunciones() {

    const contenedor = document.getElementById('contenedorFunciones');

    contenedor.innerHTML = '';

    contenedor.innerHTML = dependenciaActual.funciones.filter(funcion=>funcion!=="Requerimiento Entes de Control")
    .map(funcion=>{
        return `
            <label class="flex items-start gap-2 hover:scale-105 transition duration-700 cursor-pointer border border-slate-200 rounded-xl p-2 shadow-md shadow-amber-400">
                <input name="funcionDependencia"
                       value="${funcion}"  
                       onchange="seleccionarFuncion(this)"
                       type="radio">
                <span>${funcion}</span>
            </label>
        `;
    }).join('');

    
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


function seleccionarFuncion(radio) {


    

    funcionSeleccionada = radio.value;

    document.getElementById('mensajeInicio').classList.add('hidden');
    document.getElementById('seccionFormulario').classList.remove('hidden');
    const resumen = document.getElementById('resumenSeleccion');
    const txtAsunto = document.getElementById('txtAsunto');

    radicacion.dependencia = dependenciaActual.nombre;
    radicacion.codigoDependencia = dependenciaActual.codigo;
    radicacion.funcion = funcionSeleccionada;
    radicacion.asunto = funcionSeleccionada;

    if(txtAsunto.readOnly){
        txtAsunto.classList.remove('border-red-500');
        txtAsunto.classList.add('border-slate-300');
    }   


    if (!document.getElementById("capa-paso3").classList.contains("hidden")) {

        alert("Al realizar el cambio de funcion de la dependencia cambias tambien el tipo de solicitud");

        irAlPaso(2);

    }

    

    if(txtAsunto){

        if (funcionSeleccionada == "Otro") {
            
            txtAsunto.removeAttribute('readonly');
            txtAsunto.value='';
            txtAsunto.placeholder = 'Escriba otro asunto referente a ' + radicacion.dependencia + '... Obligatorio';
            txtAsunto.focus();
            radicacion.asunto = '';
            validarEnvioFinal();

        }else{


            
            txtAsunto.setAttribute('readonly',true);
            txtAsunto.value = funcionSeleccionada;
            radicacion.asunto = funcionSeleccionada;
        }

    }



    mostrarResumenFuncion(resumen, radicacion.funcion);
    
    resumen.classList.add('text-slate-800');

    resumen.classList.remove('hidden');

    
    // CAMBIO AL SELECCIONAR OTRA FUNCION DE LA DEPENDENCIA

    cargarTiposSolicitudDinamicos();

    //END CAMBIO AL SELECCIONAR OTRA FUNCION DE LA DEPENDENCIA

}
window.seleccionarFuncion = seleccionarFuncion;






//////////////////////////////////CONFIRUACION DE VALIDACION DE CAMPOS///////////////


const camposTocados = new Set();

const reglasNombres = [
    {
        id: 'txtPrimerNombre',
        requerido: true
    },
    {
        id: 'txtSegundoNombre',
        requerido: false
    },
    {
        id: 'txtPrimerApellido',
        requerido: true
    },
    {
        id: 'txtSegundoApellido',
        requerido: false
    }
];

function configurarValidaciones() {


    //CONFIGURACION VALIDAR NOMBRES APELLIDOS///

    reglasNombres.forEach(regla => {

        const campo = document.getElementById(regla.id);

        if (!campo) return;

        campo.addEventListener('input', () => {

            validarCampoNombre(
                campo,
                regla,
                camposTocados.has(regla.id)
            );

        });

        campo.addEventListener('blur', () => {

            camposTocados.add(regla.id);

            validarCampoNombre(campo, regla, true);

        });

    });



    //CONFIGURACION VALIDAR TIPO DOCUMENTO NUMERO DOCUMENTO///

    const tipoDocumento = document.getElementById('txtTipoDoc');
    const numeroDocumento = document.getElementById('txtDoc');

         if (tipoDocumento) {
            tipoDocumento.addEventListener('change', () => {
            camposTocados.add('txtTipoDoc');
            validarCampoDocumento();
            });

            tipoDocumento.addEventListener('blur', () => {
                camposTocados.add('txtTipoDoc');
                validarCampoDocumento();
            });
         }

        if (numeroDocumento) {
            numeroDocumento.addEventListener('input', () => {
            validarCampoDocumento();
            });

            numeroDocumento.addEventListener('blur', () => {
            camposTocados.add('txtDoc');
            validarCampoDocumento();
            });
        }


        //CONFIGURACION VALIDAR OTRO TIPO DOCUMENTO CUAL ///

        const cualDocumento = document.getElementById('txtCualDocumento');

        if (cualDocumento) {
            cualDocumento.addEventListener('input', () => {
                validarCampoDocumento();
            });

            cualDocumento.addEventListener('blur', () => {
                camposTocados.add('txtCualDocumento');
                validarCampoDocumento();
                });


        }


        //CONFIGURACION VALIDAR CORREO Y DIRECCION///


        ['txtCorreo', 'txtDireccion'].forEach(id => {
            const campo = document.getElementById(id);

            if (!campo) return;

            campo.addEventListener('input', () => {
            if (camposTocados.has(id)) {
                validarCorreoDireccion();
            }
            });

            campo.addEventListener('blur', () => {
            camposTocados.add(id);
            validarCorreoDireccion();
            });
        });



        //CONFIGURACION VALIDAR CAMPOS TELEFONOS ///

        ['txtCelular', 'txtFijo'].forEach(id => {
        const campo = document.getElementById(id);

        if (!campo) return;

            campo.addEventListener('input', () => {
                if (camposTocados.has(id)) {
                validarTelefonos();
                }
            });

            campo.addEventListener('blur', () => {
                camposTocados.add(id);
                validarTelefonos();
            });
        });


        //CONFIGURACION VALIDAR CAMPOS PAIS DEPARTAMENTO CIUDAD///

        ['cmbPais', 'cmbDepartamento', 'cmbCiudad'].forEach(id => {
        const campo = document.getElementById(id);

        if (!campo) return;

            campo.addEventListener('change', () => {
                if (camposTocados.has(id)) {
                    validarUbicacionGeografica();
                }
            });

            campo.addEventListener('blur', () => {
                camposTocados.add(id);
                validarUbicacionGeografica();
            });
        });

       
        const textRazonSocial = document.getElementById('txtRazonSocial'); 

                    if (!textRazonSocial)return;

                    textRazonSocial.addEventListener('blur',()=>{
                    if (camposTocados.add('txtRazonSocial')) {
                        validarRazonSocial();
                    } 
                   });

                   textRazonSocial.addEventListener('input',()=>{
                    if (camposTocados.has('txtRazonSocial')) {
                       
                        validarRazonSocial();
                    } 
                   });

                  

        const inputAsunto = document.getElementById('txtAsunto');

        if (inputAsunto) {
            inputAsunto.addEventListener('blur', () => {
                camposTocados.add('txtAsunto');
                validarAsunto();
            });

         inputAsunto.addEventListener('input', () => {
              if (camposTocados.has('txtAsunto')) {
               validarAsunto();
             }
         });
        }           
      

        const inputContenido = document.getElementById('txtContenido');

        if (inputContenido) {
            inputContenido.addEventListener('blur', () => {
            camposTocados.add('txtContenido');
            validarCampoContenido();
            });

            inputContenido.addEventListener('input', () => {
            if (camposTocados.has('txtContenido')) {
                validarCampoContenido();
            }
            });
        }

        

}

function validarCampoNombre(campo, regla, validarVacio = false) {

    const valor = campo.value.trim();

    let valido = true;

    if (valor === '') {

        if (validarVacio && regla.requerido) {
            valido = false;
        }

    } else {

        const patron = /^[\p{L}\p{M}\s'-]+$/u;

        valido = patron.test(valor);

    }

    campo.classList.toggle('!border-red-500', !valido);
    campo.classList.toggle('!ring-1', !valido);
    campo.classList.toggle('!ring-red-500', !valido);

    campo.setAttribute('aria-invalid', String(!valido));

    return valido;

}

function validarCampoDocumento() {

    const tipo = document.getElementById('txtTipoDoc');
    const documento = document.getElementById('txtDoc');
    const cualDocumento = document.getElementById('txtCualDocumento');
    const tipoSolicitante = document.getElementById('cmbTipoSolicitante');

    if (!tipo || !documento) return false;

    const tipoValor = tipo.value.trim();
    const numeroValor = documento.value.trim();
    const esOtro = tipoValor === 'OTRO';

    const tipoValido = tipoValor !== '';
    const documentoValido = /^\d{5,11}$/.test(numeroValor);
    const documentoJuridicoValido = /^\d{9}-\d$/.test(numeroValor);


    let cualDocumentoValido = true;

    

    if (esOtro) {

        const descripcion = cualDocumento?.value.trim() ?? '';

        cualDocumentoValido = /^[\p{L}\p{M}\s'-]+$/u.test(descripcion);
    }

    const validarAhora =
        camposTocados.has('txtTipoDoc') ||
        camposTocados.has('txtDoc') ||
        camposTocados.has('txtCualDocumento');

    if (validarAhora) {
        tipo.classList.toggle('!border-red-500', !tipoValido);
        tipo.classList.toggle('!ring-1', !tipoValido);
        tipo.classList.toggle('!ring-red-500',!tipoValido);
        tipo.setAttribute('aria-invalid', String(!tipoValido));

        if (tipoSolicitante.value === 'juridica') {
            
            documento.classList.toggle(
            '!border-red-500',
            !documentoJuridicoValido
            );
            documento.classList.toggle(
            '!ring-1',
            !documentoJuridicoValido
            );
            documento.classList.toggle(
            '!ring-red-500',
            !documentoJuridicoValido
            );
            documento.setAttribute(
            'aria-invalid',
            String(!documentoJuridicoValido)
            );
            

        }else{


            documento.classList.toggle(
            '!border-red-500',
            !documentoValido
            );
            documento.classList.toggle(
            '!ring-1',
            !documentoValido
            );
            documento.classList.toggle(
            '!ring-red-500',
            !documentoValido
            );
            documento.setAttribute(
            'aria-invalid',
            String(!documentoValido)
            );

        }

        



        if (cualDocumento) {
            cualDocumento.classList.toggle(
                '!border-red-500',
                esOtro && !cualDocumentoValido
            );
            cualDocumento.classList.toggle(
                '!ring-1',
                esOtro && !cualDocumentoValido
            );
            cualDocumento.classList.toggle(
                '!ring-red-500',
                esOtro && !cualDocumentoValido
            );
            cualDocumento.setAttribute(
                'aria-invalid',
                String(esOtro && !cualDocumentoValido)
            );
        }
    }

    const esJuridica = tipoSolicitante?.value === 'juridica';

    return tipoValido &&
    (esJuridica ? documentoJuridicoValido : documentoValido) &&
    cualDocumentoValido;

    // return tipoValido &&
    //     documentoValido &&
    //     cualDocumentoValido;
}


function validarCorreoDireccion() {
    const correo = document.getElementById('txtCorreo');
    const direccion = document.getElementById('txtDireccion');

    if (!correo || !direccion) return false;

    const valorCorreo = correo.value.trim();
    const valorDireccion = direccion.value.trim();

    // Validación básica del correo electrónico.
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCorreo);

    // La dirección es obligatoria.
    
    const direccionValida = valorDireccion.length >= 7 && /^[\p{L}\p{M}\p{N}\s#°.,\-\/'()]+$/u.test(valorDireccion);


    const validarAhora =
        camposTocados.has('txtCorreo') ||
        camposTocados.has('txtDireccion');

    if (validarAhora) {
        correo.classList.toggle(
            '!border-red-500',
            !correoValido
        );
        correo.classList.toggle(
            '!ring-1',
            !correoValido
        );
        correo.classList.toggle(
            '!ring-red-500',
            !correoValido
        );
        correo.setAttribute(
            'aria-invalid',
            String(!correoValido)
        );

        direccion.classList.toggle(
            '!border-red-500',
            !direccionValida
        );
        direccion.classList.toggle(
            '!ring-1',
            !direccionValida
        );
        direccion.classList.toggle(
            '!ring-red-500',
            !direccionValida
        );
        direccion.setAttribute(
            'aria-invalid',
            String(!direccionValida)
        );
    }

    return correoValido && direccionValida;
}


function validarTelefonos() {
    const celular = document.getElementById('txtCelular');
    const fijo = document.getElementById('txtFijo');

    const campos = [
        {
            campo: celular,
            id: 'txtCelular',
            patron: /^\d{10}$/
        },
        {
            campo: fijo,
            id: 'txtFijo',
            patron: /^\d{8}$/
        }
    ];

    let todosValidos = true;

    campos.forEach(({ campo, id, patron }) => {
        if (!campo) {
            todosValidos = false;
            return;
        }

        const valor = campo.value.trim();

        // Ambos campos son opcionales.
        // Si tienen contenido, deben cumplir su longitud.
        const valido = valor === '' || patron.test(valor);

        if (!valido) {
            todosValidos = false;
        }

        if (camposTocados.has(id)) {
            campo.classList.toggle('!border-red-500', !valido);
            campo.classList.toggle('!ring-1', !valido);
            campo.classList.toggle('!ring-red-500', !valido);
            campo.setAttribute('aria-invalid', String(!valido));
        }
    });

    return todosValidos;
}

function validarUbicacionGeografica() {
    const campos = [
        document.getElementById('cmbPais'),
        document.getElementById('cmbDepartamento'),
        document.getElementById('cmbCiudad')
    ];

    let todosValidos = true;

    campos.forEach(campo => {
        if (!campo) {
            todosValidos = false;
            return;
        }

        const valor = campo.value.trim();
        const valido = valor !== '';

        if (!valido) {
            todosValidos = false;
        }

        if (camposTocados.has(campo.id)) {
            campo.classList.toggle('!border-red-500', !valido);
            campo.classList.toggle('!ring-1', !valido);
            campo.classList.toggle('!ring-red-500', !valido);

            campo.setAttribute(
                'aria-invalid',
                String(!valido)
            );
        }
    });

    return todosValidos;
}

function validarRazonSocial(){

    const razonSocial = document.getElementById('txtRazonSocial');

     if (!razonSocial) return false;

     const valorRazonSocial =  razonSocial.value.trim();
     const RazonSocialValida = valorRazonSocial.length >= 7 && /^[\p{L}\p{M}\p{N}\s#°.,\-\/'()]+$/u.test(valorRazonSocial);

     const validarAhora =  camposTocados.has('txtRazonSocial');

      if (validarAhora) {
        razonSocial.classList.toggle(
             '!border-red-500',
            !RazonSocialValida
        );
        razonSocial.classList.toggle(
             '!ring-1',
            !RazonSocialValida
        );
        razonSocial.classList.toggle(
            '!ring-red-500',
            !RazonSocialValida
        );
        razonSocial.setAttribute(
        'aria-invalid',
            String(!RazonSocialValida)
         );
      }
      return RazonSocialValida;

}

function validarAsunto() {
    const inputAsunto = document.getElementById('txtAsunto');

    if (!inputAsunto) return true;

     // Si el asunto es automático, no se aplica la validación manual.
    if (inputAsunto.readOnly) {
        inputAsunto.classList.remove('border-red-500');
        inputAsunto.classList.add('border-slate-300');

        return inputAsunto.value.trim() !== '';
    }

    const asunto = inputAsunto.value.trim();
    const asuntoValido = asunto.length >= 5 && asunto.length <= 100;

    inputAsunto.classList.toggle('border-red-500', !asuntoValido);
    inputAsunto.classList.toggle('border-slate-300', asuntoValido);
    inputAsunto.classList.toggle('!ring-1', !asuntoValido);
    inputAsunto.classList.toggle('!ring-red-500', !asuntoValido);
   

    return asuntoValido;
}  

function validarCampoContenido() {

    const inputContenido = document.getElementById('txtContenido');

    if (!inputContenido) return true;

    const contenido = inputContenido.value.trim();

    const contenidoValido =  contenido.length >= 20 && contenido.length <= 5000;

    inputContenido.classList.toggle('border-red-500',!contenidoValido);
    inputContenido.classList.toggle('border-slate-300',contenidoValido);
    inputContenido.classList.toggle('!ring-1', !contenidoValido);
    inputContenido.classList.toggle('!ring-red-500', !contenidoValido);

    return contenidoValido;
}

function validarCampoPolitica() {
    const chkPolitica = document.getElementById('chkPolitica');
    const textoPolitica = document.getElementById('textoPolitica');

    if (!chkPolitica || !textoPolitica) return false;

    const politicaValida = chkPolitica.checked;

    textoPolitica.classList.toggle(
        'text-red-600',
        !politicaValida
    );

    textoPolitica.classList.toggle(
        'text-slate-600',
        politicaValida
    );

    return politicaValida;
}

//////////////////////////////////END CONFIRUACION DE VALIDACION DE CAMPOS///////////////

function cargarPaises() {
    const cmbPais = document.getElementById('cmbPais');
    if (!cmbPais) return;

    const paisSeleccionado = cmbPais.value || 'Colombia';
    cmbPais.innerHTML = '<option value="" disabled>- Seleccione país -</option>';

    Object.keys(UBICACIONES_POR_PAIS)
        .sort((a, b) => a.localeCompare(b, 'es'))
        .forEach(pais => {
            const opcion = document.createElement('option');
            opcion.value = pais;
            opcion.textContent = pais;
            cmbPais.appendChild(opcion);
        });

    cmbPais.value = UBICACIONES_POR_PAIS[paisSeleccionado]
        ? paisSeleccionado
        : 'Colombia';
}

function cambiarPais() {
    const cmbDepartamento = document.getElementById('cmbDepartamento');
    const cmbCiudad = document.getElementById('cmbCiudad');

    cmbDepartamento.innerHTML = '<option value="" selected disabled>- Seleccione departamento -</option>';
    cmbCiudad.innerHTML = '<option value="" selected disabled>- Seleccione municipio -</option>';

    cargarDepartamentos();
    actualizarEstadoBotonPaso1();
}

function cargarMunicipios(departamentoSeleccionado) {
    const cmbPais = document.getElementById('cmbPais');
    const cmbCiudad = document.getElementById('cmbCiudad');
    if (!cmbPais || !cmbCiudad) return;

    cmbCiudad.innerHTML = '<option value="" selected disabled>- Seleccione municipio -</option>';

    const departamentosPais = UBICACIONES_POR_PAIS[cmbPais.value] || [];
    const departamento = departamentosPais.find(
        item => item.departamento === departamentoSeleccionado
    );

    if (!departamento) return;

    departamento.municipios.forEach(municipio => {
        const opcion = document.createElement('option');
        opcion.value = municipio;
        opcion.textContent = municipio;
        cmbCiudad.appendChild(opcion);
    });
}
window.cargarMunicipios = cargarMunicipios;

function cargarDepartamentos() {
    const cmbPais = document.getElementById('cmbPais');
    const cmbDepartamento = document.getElementById('cmbDepartamento');
    if (!cmbPais || !cmbDepartamento) return;

    cmbDepartamento.innerHTML = '<option value="" selected disabled>- Seleccione departamento -</option>';

    (UBICACIONES_POR_PAIS[cmbPais.value] || []).forEach(item => {
        const opcion = document.createElement('option');
        opcion.value = item.departamento;
        opcion.textContent = item.departamento;
        cmbDepartamento.appendChild(opcion);
    });
}



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
    const bloqueMedioRespuesta = document.getElementById('bloqueMedioRespuesta');

    bloqueMedioRespuesta.classList.toggle('hidden', check.checked);

    if(check.checked)
    {
        document.getElementById('modalAnonimo').classList.remove('hidden');
       // btn.disabled = true;
        bloqueSelectorMaestro.classList.add('hidden');
        bloqueDatosPersonales.classList.add('hidden');
        campoRazonSocial.classList.add('hidden');
        bloqueDocumentoOtro.classList.add('hidden');
        bloqueMedioRespuesta.classList.add('hidden');
        ubicacionGeografica.classList.remove('hidden');
        document.querySelectorAll('input[name="medioRespuesta"]')
        .forEach(radio => {
            radio.checked = false;
        });
         radicacion.medioRespuesta = '';
         // Limpiar los datos personales del objeto radicacion
        radicacion.tipoSolicitante = '';

        radicacion.primerNombre = '';
        radicacion.segundoNombre = '';

        radicacion.primerApellido = '';
        radicacion.segundoApellido = '';

        radicacion.tipoDocumento = '';
        radicacion.documento = '';

        radicacion.correo = '';
        radicacion.direccion = '';

        radicacion.celular = '';
        radicacion.fijo = '';
 
        radicacion.razonSocial = '';
        radicacion.cualDocumento = '';

        [
            'cmbTipoSolicitante',
            'txtPrimerNombre',
            'txtSegundoNombre',
            'txtPrimerApellido',
            'txtSegundoApellido',
            'txtTipoDoc',
            'txtDoc',
            'txtCorreo',
            'txtDireccion',
            'txtCelular',
            'txtFijo',
            'txtRazonSocial',
            'txtCualDocumento'
        ].forEach(id => {
            const campo = document.getElementById(id);

            if (campo) {
                campo.value = '';
            }
        });
        
    }else
    {
        // radicacion.anonima = false;

         bloqueMedioRespuesta.classList.remove('hidden');


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

    validarEnvioFinal();

}
window.alternarAnonimo = alternarAnonimo;


function abrirmodalInfoPaso3(){

  const modal = document.getElementById('modalInfoPaso3');
  const contenido = document.getElementById('modalContendioInfopaso3');

  modal.classList.remove("hidden");

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

function cerrarmodalInfoPaso3(){
    const modal = document.getElementById("modalInfoPaso3");
     const contenido = document.getElementById('modalContendioInfopaso3');
    //modal.classList.add("hidden");

     //const modal = document.getElementById('modalInicio');
 

  if (!modal || !contenido) return;

  
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0');

  contenido.classList.remove('scale-100', 'opacity-100');
  contenido.classList.add('scale-95', 'opacity-0');

  
  setTimeout(() => {
    modal.classList.add('pointer-events-none');
  }, 500);
    
}
window.cerrarmodalInfoPaso3 = cerrarmodalInfoPaso3;


function cerrarModalAnonimo() {
    document.getElementById('modalAnonimo').classList.add('hidden');
}
window.cerrarModalAnonimo = cerrarModalAnonimo;



//////////////////////VALIDAR PASO 2

function validarPaso2() {

    const seleccionado = document.querySelector('input[name="tipoSolicitudEspecifica"]:checked');

    if (!seleccionado || !radicacion.tipoSolicitud) {
        alert('Debe seleccionar un tipo de solicitud.');
        return false;
    }

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

    const nombresValidos = reglasNombres.every(regla => {

        const campo = document.getElementById(regla.id);

        if (!campo)return false;
    

        camposTocados.add(regla.id);

        return validarCampoNombre(campo, regla, true);

    });

    if (!nombresValidos) {
        return false;
    }

    camposTocados.add('txtTipoDoc');
    camposTocados.add('txtDoc');

    if (!validarCampoDocumento()) {
        return false;
    }


    camposTocados.add('txtCorreo');
    camposTocados.add('txtDireccion');

    if (!validarCorreoDireccion()) {
        return false;
    }

    if (!validarTelefonos()) {
        return false;
    }

    ['cmbPais', 'cmbDepartamento', 'cmbCiudad'].forEach(id => {
        camposTocados.add(id);
    });




     const tipoSolicitante = document.getElementById('cmbTipoSolicitante');

     if (tipoSolicitante.value==='juridica') {
        camposTocados.add('txtRazonSocial');

        if (!validarRazonSocial()) {
            return false;
        }
     }
    

    if (!validarUbicacionGeografica()) {
        return false;
    }

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

    if (radicacion.tipoSolicitante === 'juridica' && !radicacion.razonSocial) {
        alert('Debe ingresar la razón social.');
        return false;
    }

    

    return true;
}



function irAlPaso(paso) {

    const capa1= document.getElementById('capa-paso1');
    const capa2= document.getElementById('capa-paso2');
    const capa3= document.getElementById('capa-paso3');

    if (!radicacion.anonima) {
         guardarDatosSolicitante();
    }

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

          capa1.classList.add('hidden');
          capa2.classList.remove('hidden');
          capa3.classList.add('hidden');

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
        //document.getElementById('modalInfoPaso3').classList.remove("hidden");
        abrirmodalInfoPaso3();
      

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



function controlarFlujoCampos(tipoSolicitante) {

    radicacion.tipoSolicitante = tipoSolicitante;

    cargarTiposDocumento(tipoSolicitante);

    const bloqueDatosPersonales = document.getElementById('bloqueDatosPersonales');
    const campoRazonSocial = document.getElementById('campoRazonSocial');
    const txtTipoDoc = document.getElementById('txtTipoDoc');
    const bloqueUbicacionGeografica = document.getElementById('bloqueubicacionGeografica');
    const avisotipoDocNit = document.getElementById('avisoTipoDocJuridico');
    const avisotipoDocNormal = document.getElementById('avisoTipoDocNatural');
    const bloqDocumentoOtro = document.getElementById('bloqueDocumentoOtro');
    const txtDocumento = document.getElementById('txtDoc');
    const bloquecmbTipoDoc = document.getElementById('bloqueTipoIdentificacion');
    const bloquetxtNumeroDoc = document.getElementById('bloqueNumeroIdentificacion');

    if(!tipoSolicitante) {

        bloqueDatosPersonales.classList.add('hidden');

        return;
    }

    bloqueDatosPersonales.classList.remove('hidden');
    bloqueUbicacionGeografica.classList.remove('hidden');

    if(tipoSolicitante === 'juridica') {

        avisotipoDocNit.classList.remove('hidden');
        avisotipoDocNormal.classList.add('hidden');
        campoRazonSocial.classList.remove('hidden');
        bloqDocumentoOtro.classList.add('hidden');
        bloquecmbTipoDoc.classList.add('hidden');
        bloquetxtNumeroDoc.classList.add('col-span-2');
        txtDocumento.value ='';
        txtDocumento.placeholder = 'Ingrese número NIT con el guion al final';
        txtTipoDoc.value = 'NIT';
        radicacion.tipoDocumento = 'NIT';

    } else {

        if (txtTipoDoc.value==='OTRO') {
            bloqDocumentoOtro.classList.remove('hidden');
        }
        
        bloquecmbTipoDoc.classList.remove('hidden');
        bloquetxtNumeroDoc.classList.remove('col-span-2');
        txtDocumento.placeholder = 'obligatorio';
        avisotipoDocNit.classList.add('hidden');
        avisotipoDocNormal.classList.remove('hidden');
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

  

}
window.seleccionarTipoSolicitud = seleccionarTipoSolicitud;



function seleccionarMedioRespuesta(radio) {

    radicacion.medioRespuesta = radio.value;

    validarEnvioFinal();
    
   
}
window.seleccionarMedioRespuesta = seleccionarMedioRespuesta;



function guardarContenido() {

    const txtContenido = document.getElementById('txtContenido');

    radicacion.contenido = txtContenido.value.trim();

     if (camposTocados.has('txtContenido')) {
        validarCampoContenido();
    }

    validarEnvioFinal();

}
window.guardarContenido = guardarContenido;




function validarEnvioFinal() {


    const btnEnviarFormulario = document.getElementById('btnEnviarFormulario');
    const chkPolitica = document.getElementById('chkPolitica');

    if (!btnEnviarFormulario || !chkPolitica) return;

    const politicaAceptada = chkPolitica.checked;
    radicacion.aceptaPolitica = politicaAceptada;

    // Valida el asunto según su estado: automático o editable.
    const asuntoValido = validarAsunto();

    // El contenido es obligatorio y no puede superar 5000 caracteres.
    const contenidoValido = validarCampoContenido();

    // El medio de respuesta es obligatorio, excepto en solicitudes anónimas.
    const medioRespuestaValido =
        radicacion.anonima || radicacion.medioRespuesta !== '';

    const formularioValido =
        asuntoValido &&
        contenidoValido &&
        medioRespuestaValido &&
        politicaAceptada;

    btnEnviarFormulario.disabled = !formularioValido;

    btnEnviarFormulario.classList.toggle(
        'cursor-not-allowed',
        !formularioValido
    );

    btnEnviarFormulario.classList.toggle(
        'opacity-50',
        !formularioValido
    );

    btnEnviarFormulario.classList.toggle(
        'cursor-pointer',
        formularioValido
    );
}

window.validarEnvioFinal = validarEnvioFinal;




function seleccionarAnexo(input) {

    const archivo = input.files[0];

    if (!archivo) {
        return;
    }

    const extensionesPermitidas = [
        'pdf',
        'jpg',
        'png'
    ];

    const extension =
        archivo.name.split('.').pop().toLowerCase();

    if (!extensionesPermitidas.includes(extension)) {

        alert(
            'Formato no permitido. Solo PDF,JPG y PNG.'
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

  

}
window.seleccionarAnexo = seleccionarAnexo;



function volverARevision() {  
    document.getElementById('modalExito').classList.add('hidden');
}
window.volverARevision = volverARevision;

function enviarFormulario() {

    const contenedorListaDatos = document.getElementById('contenedorListaDatos');

    if (!contenedorListaDatos) {
        alert('No se encontró el contenedor del resumen.');
        return;
    }

    contenedorListaDatos.innerHTML = '';

    const datosResumen = [

        ['Dependencia', radicacion.dependencia],
        ['Código Dependencia', radicacion.codigoDependencia],
        ['Asunto', radicacion.asunto],
       // ['Función',radicacion.funcion === 'Otro'? radicacion.asunto: radicacion.funcion],
        ['Tipo Solicitud', radicacion.tipoSolicitud],
        ['Tipo Solicitante',radicacion.anonima ? 'Anónimo' : radicacion.tipoSolicitante],
        ['Nombre', radicacion.primerNombre],
        ['Segundo nombre', radicacion.segundoNombre],
        ['Apellido', radicacion.primerApellido],
        ['Segundo apellido', radicacion.segundoApellido],
        ['Documento', radicacion.documento],
        ['Correo', radicacion.correo],
        ['Celular', radicacion.celular],
        ['País', radicacion.pais],
        ['Departamento', radicacion.departamento],
        ['Municipio', radicacion.municipio],
        ['Contenido', radicacion.contenido],
        ['Medio respuesta', radicacion.medioRespuesta],
        ['Anexo 1',radicacion.anexo1 ? radicacion.anexo1.name : 'Sin anexo'],
        ['Anexo 2',radicacion.anexo2 ? radicacion.anexo2.name : 'Sin anexo'],
        ['Anexo 3',radicacion.anexo3 ? radicacion.anexo3.name : 'Sin anexo'],
    ];


    datosResumen.push(['Acepta política',radicacion.aceptaPolitica ? 'Sí' : 'No']);

    datosResumen
        .filter(([titulo, valor]) =>
            valor !== null &&
            valor !== undefined &&
            String(valor).trim() !== ''
        )
        .forEach(([titulo, valor]) => {
            const fila = document.createElement('div');
            fila.className ='px-4 py-3 text-lg sm:text-base flex justify-between items-start gap-4';

            const etiqueta = document.createElement('span');
            etiqueta.className = 'font-bold text-[#002855]';
            etiqueta.textContent = titulo;

            const contenido = document.createElement('span');
            contenido.className = 'text-right text-slate-700';
            contenido.textContent = String(valor);

            fila.append(etiqueta, contenido);
            contenedorListaDatos.appendChild(fila);
        });

    
    document.getElementById('tituloModalRadicacion').textContent ='Revisar radicación';

    document.getElementById('subtituloModalRadicacion').textContent ='Verifica la información antes de confirmar el envío.';  
        
    document.getElementById('lblResumenFecha').textContent =  new Date().toLocaleString('es-CO',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour: '2-digit',minute:'2-digit' });
    //'Pendiente de confirmación';

    
    document.getElementById('btnVolverRevision').classList.remove('hidden');
    document.getElementById('btnConfirmarRadicacion').classList.remove('hidden');
    document.getElementById('modalExito').classList.remove('hidden');

     

}
window.enviarFormulario = enviarFormulario;


async function confirmarEnvioRadicacion() {

    const btnConfirmar = document.getElementById('btnConfirmarRadicacion');
    const btnVolver = document.getElementById('btnVolverRevision');

    
    // Evitar varios clics mientras se procesa el envío.
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Guardando...';
    btnVolver.disabled = true;

    radicacion.codigoDependencia = radicacion.codigoDependencia.replaceAll('.','');
    radicacion.tipoSolicitante = radicacion.anonima ? 'Anónimo' : radicacion.tipoSolicitante;

    const datosEnvio = {
        ...radicacion,
        anexo1: radicacion.anexo1?.name || '',
        anexo2: radicacion.anexo2?.name || '',
        anexo3: radicacion.anexo3?.name || ''
    };

    try {
        const respuesta = await fetch(
            'http://127.0.0.1:3000/guardar-radicacion',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosEnvio)
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {
            throw new Error(
                resultado.mensaje || 'No se pudo guardar la radicación.'
            );
        }

        setTimeout(() => modalfinal(resultado), 1000);

      
        return;

    } catch (error) {
        console.error('Error al guardar la radicación:', error);

        alert(
            'No fue posible guardar la radicación.\n\n' + error.message + '\n\nVerifica que el servidor FURIM esté funcionando y vuelve a intentarlo.'
        );
    } finally {
    
        if (btnConfirmar) {
            btnConfirmar.disabled = false;
           // btnConfirmar.textContent = 'Confirmar envío';
        }
        if (btnVolver) {
            btnVolver.disabled = false;
        }
    }
}
window.confirmarEnvioRadicacion = confirmarEnvioRadicacion;


function modalfinal(objetofinal){
    
    const mdalfinal = document.getElementById('modfinal');
    const modafinalContenido = document.getElementById('modfinalContenido');
    const modalExito = document.getElementById('modalExito');

    
    mdalfinal.classList.remove('hidden');
    if (modalExito) {
        modalExito.classList.add('hidden');
    }

    const contenedor = document.createElement('div');
    contenedor.className = 'p-6 bg-slate-50 border flex flex-col gap-3 border-slate-700 rounded-xl';

    const subtitulo = document.createElement('h2');
    subtitulo.className = 'text-2xl text-center text-blue-900 font-bold';
    subtitulo.textContent ='✔';

    const titulo = document.createElement('h1');
    titulo.className = 'text-xl text-center text-blue-800 font-bold';
    titulo.textContent = '¡Radicación exitosa!';

    const etiquetaRadicado = document.createElement('h2');
    etiquetaRadicado.className = 'text-lg text-center text-blue-900 font-bold';
    etiquetaRadicado.textContent = 'Número de radicado';

    const valorRadicado = document.createElement('p');
    valorRadicado.className = 'text-lg text-center text-blue-950 font-bold';
    valorRadicado.textContent = String(objetofinal.Rad || '');

    const botonDescargar = document.createElement('button');
    botonDescargar.type = 'button';
    botonDescargar.className = 'w-full bg-[#DB8700] hover:bg-amber-600 text-white transition duration-500 font-bold py-2 px-2 rounded-xl cursor-pointer';
    botonDescargar.textContent = 'Descargar PDF';
    botonDescargar.addEventListener('click', async () => {
        botonDescargar.disabled = true;
        botonDescargar.textContent = 'Preparando PDF...';
        try {
            await descargarPdfRadicacion(objetofinal);
        } catch (error) {
            console.error('Error al crear el comprobante PDF:', error);
            alert('No fue posible generar el PDF. ' + error.message);
        } finally {
            botonDescargar.disabled = false;
            botonDescargar.textContent = 'Descargar PDF';
        }
    });

    const botonAceptar = document.createElement('button');
    botonAceptar.type = 'button';
    botonAceptar.className = 'w-full bg-blue-800 hover:bg-blue-900 text-white transition duration-500 font-bold py-3 px-4 rounded-xl cursor-pointer';
    botonAceptar.textContent = 'Aceptar';
    botonAceptar.addEventListener('click', finalizarTodo);

    contenedor.append(subtitulo,titulo, etiquetaRadicado, valorRadicado, botonDescargar, botonAceptar);
    modafinalContenido.replaceChildren(contenedor);




}
window.modalfinal = modalfinal;

// async function descargarPdfRadicacion(respuestaServidor) {

//     const datos = respuestaServidor.objetoPQR || {};
//     const radicado = String(respuestaServidor.Rad || '').trim();

//     if (!radicado) {
//         throw new Error('El servidor no devolvió el número de radicado.');
//     }
//     if (!window.jspdf?.jsPDF || !window.JsBarcode) {
//         throw new Error('No se cargaron las librerías locales para crear el PDF.');
//     }

//     const { jsPDF } = window.jspdf;
//     const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
//     const anchoPagina = pdf.internal.pageSize.getWidth();
//     const altoPagina = pdf.internal.pageSize.getHeight();
//     const margen = 25;
//     const anchoTexto = anchoPagina - margen * 2;
//     let y = 73;

//     const anonima = Boolean(datos.anonima);
//     const nombreCompleto = [
//         datos.primerNombre,
//         datos.segundoNombre,
//         datos.primerApellido,
//         datos.segundoApellido
//     ].filter(Boolean).join(' ').trim();
//     const remitente = anonima
//         ? 'Solicitante anónimo'
//         : (datos.tipoSolicitante === 'juridica'
//             ? (datos.razonSocial || nombreCompleto || 'Solicitante')
//             : (nombreCompleto || datos.razonSocial || 'Solicitante'));
//     const tiposSolicitante = {
//         natural: 'Persona natural',
//         juridica: 'Persona jurídica',
//         menor: 'Niño, niña o adolescente',
//         apoderado: 'Apoderado o tercero'
//     };
//     const tipoSolicitante = anonima
//         ? 'Anónimo'
//         : (tiposSolicitante[datos.tipoSolicitante] || datos.tipoSolicitante || 'No indicado');
//     const fecha = new Intl.DateTimeFormat('es-CO', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric',
//         timeZone: 'America/Bogota'
//     }).format(new Date(respuestaServidor.fechaRadicacion || new Date()));

//     const canvasCodigo = document.createElement('canvas');
//     window.JsBarcode(canvasCodigo, radicado, {
//         format: 'CODE128',
//         displayValue: true,
//         font: 'Arial',
//         fontSize: 12,
//         height: 34,
//         margin: 0,
//         width: 1.35,
//         textMargin: 2
//     });

//     pdf.setProperties({
//         title: `Comprobante de radicación ${radicado}`,
//         subject: 'Comprobante de radicación - Secretaría de Movilidad de Cali'
//     });

//     const cajaX = 86;
//     const cajaY = 12;
//     const cajaAncho = anchoPagina - cajaX - 14;
//     const cajaAlto = 56;
//     pdf.setFillColor(242, 243, 245);
//     pdf.setDrawColor(31, 47, 82);
//     pdf.setLineWidth(0.55);
//     pdf.roundedRect(cajaX, cajaY, cajaAncho, cajaAlto, 7, 7, 'FD');

//     const filasCabecera = [
//         ['Destino', 'SECRETARÍA DE MOVILIDAD'],
//         ['Remitente', remitente],
//         ['Tipo solicitante', tipoSolicitante],
//         ['Tipo radicación', datos.tipoSolicitud || 'Petición'],
//         ['Fecha radicación', fecha]
//     ];
//     let yCabecera = cajaY + 7;
//     filasCabecera.forEach(([etiqueta, valor]) => {
//         pdf.setFont('helvetica', 'normal');
//         pdf.setFontSize(7.5);
//         pdf.setTextColor(35, 45, 60);
//         pdf.text(etiqueta, cajaX + 5, yCabecera);
//         pdf.setFont('helvetica', 'bold');
//         pdf.text(String(valor || '-').slice(0, 52), cajaX + 32, yCabecera, { maxWidth: cajaAncho - 37 });
//         yCabecera += 5;
//     });

//     const barcodeData = canvasCodigo.toDataURL('image/png');
//     const barcodeAncho = Math.min(83, cajaAncho - 14);
//     pdf.addImage(barcodeData, 'PNG', cajaX + (cajaAncho - barcodeAncho) / 2, cajaY + 32, barcodeAncho, 19);

//     pdf.setFont('helvetica', 'normal');
//     pdf.setFontSize(11);
//     pdf.setTextColor(25, 35, 50);
//     pdf.text(`Santiago de Cali, ${fecha}`, margen, y);
//     y += 13;

//     const agregarParrafo = (texto, opciones = {}) => {
//         const fuente = opciones.bold ? 'bold' : 'normal';
//         const tamano = opciones.size || 11;
//         const espacio = opciones.gap ?? 5;
//         pdf.setFont('helvetica', fuente);
//         pdf.setFontSize(tamano);
//         pdf.setTextColor(25, 35, 50);
//         const lineas = pdf.splitTextToSize(String(texto || ''), anchoTexto);
//         const altoBloque = lineas.length * tamano * 0.43;
//         if (y + altoBloque > altoPagina - 27) {
//             pdf.addPage();
//             y = 24;
//         }
//         pdf.text(lineas, margen, y);
//         y += altoBloque + espacio;
//     };

//     agregarParrafo('Señores,', { gap: 1 });
//     agregarParrafo('SECRETARÍA DE MOVILIDAD', { bold: true, gap: 1 });
//     agregarParrafo('Alcaldía Distrital de Santiago de Cali', { gap: 9 });
//     agregarParrafo('Asunto:', { bold: true, gap: 1 });
//     agregarParrafo(datos.asunto || 'Sin asunto registrado', { gap: 8 });
//     agregarParrafo('Solicitud:', { bold: true, gap: 1 });
//     agregarParrafo(datos.contenido || 'Sin descripción registrada', { gap: 8 });

//     agregarParrafo('Atentamente,', { gap: 20 });
//     if (y + 35 > altoPagina - 15) {
//         pdf.addPage();
//         y = 24;
//     }
//     pdf.setDrawColor(55, 65, 81);
//     pdf.line(margen, y, margen + 88, y);
//     y += 5;
//     agregarParrafo(`Peticionario: ${remitente}`, { bold: true, size: 10, gap: 2 });
//     agregarParrafo(`Tipo de solicitante: ${tipoSolicitante}`, { size: 10, gap: 2 });

//     if (!anonima) {
//         if (datos.documento) {
//             const tipoDocumento = datos.tipoDocumento || 'Documento';
//             agregarParrafo(`${tipoDocumento}: ${datos.documento}`, { size: 10, gap: 2 });
//         }
//         if (datos.correo) agregarParrafo(`Correo: ${datos.correo}`, { size: 10, gap: 2 });
//         if (datos.direccion) agregarParrafo(`Dirección: ${datos.direccion}`, { size: 10, gap: 2 });
//         const telefono = datos.celular || datos.fijo;
//         if (telefono) agregarParrafo(`Teléfono: ${telefono}`, { size: 10, gap: 2 });
//     }

//     if (datos.anexo1 || datos.anexo2 || datos.anexo3) {
//         agregarParrafo('Ver archivos adjuntos en el sistema.', { size: 9, gap: 2 });
//     }

//     pdf.save(`Radicacion-${radicado}.pdf`);
// }

async function descargarPdfRadicacion(respuestaServidor) {

    const datos = respuestaServidor.objetoPQR || {};
    const radicado = String(respuestaServidor.Rad || '').trim();

    if (!radicado) {
        throw new Error('El servidor no devolvió el número de radicado.');
    }
    if (!window.jspdf?.jsPDF || !window.JsBarcode) {
        throw new Error('No se cargaron las librerías locales para crear el PDF.');
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const anchoPagina = pdf.internal.pageSize.getWidth();
    const altoPagina = pdf.internal.pageSize.getHeight();
    const margen = 25;
    const anchoTexto = anchoPagina - margen * 2;
    let y = 73;

    const anonima = Boolean(datos.anonima);
    const nombreCompleto = [
        datos.primerNombre,
        datos.segundoNombre,
        datos.primerApellido,
        datos.segundoApellido
    ].filter(Boolean).join(' ').trim();
    const remitente = anonima
        ? 'Solicitante anónimo'
        : (datos.tipoSolicitante === 'juridica'
            ? (datos.razonSocial || nombreCompleto || 'Solicitante')
            : (nombreCompleto || datos.razonSocial || 'Solicitante'));
    const tiposSolicitante = {
        natural: 'Persona natural',
        juridica: 'Persona jurídica',
        menor: 'Niño, niña o adolescente',
        apoderado: 'Apoderado o tercero'
    };
    const tipoSolicitante = anonima
        ? 'Anónimo'
        : (tiposSolicitante[datos.tipoSolicitante] || datos.tipoSolicitante || 'No indicado');
    const fecha = new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Bogota'
    }).format(new Date(respuestaServidor.fechaRadicacion || new Date()));

    const canvasCodigo = document.createElement('canvas');
    window.JsBarcode(canvasCodigo, radicado, {
        format: 'CODE128',
        displayValue: true,
        font: 'Arial',
        fontSize: 12,
        height: 34,
        margin: 0,
        width: 1.35,
        textMargin: 2
    });

    pdf.setProperties({
        title: `Comprobante de radicación ${radicado}`,
        subject: 'Comprobante de radicación - Secretaría de Movilidad de Cali'
    });

    const cajaX = 86;
    const cajaY = 12;
    const cajaAncho = anchoPagina - cajaX - 14;
    const cajaAlto = 56;
    pdf.setFillColor(242, 243, 245);
    pdf.setDrawColor(31, 47, 82);
    pdf.setLineWidth(0.55);
    pdf.roundedRect(cajaX, cajaY, cajaAncho, cajaAlto, 7, 7, 'FD');

    const filasCabecera = [
        ['Destino', 'SECRETARÍA DE MOVILIDAD'],
        ['Remitente', remitente],
        ['Tipo solicitante', tipoSolicitante],
        ['Tipo radicación', datos.tipoSolicitud || 'Petición'],
        ['Fecha radicación', fecha]
    ];
    let yCabecera = cajaY + 7;
    filasCabecera.forEach(([etiqueta, valor]) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(35, 45, 60);
        pdf.text(etiqueta, cajaX + 5, yCabecera);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(valor || '-').slice(0, 52), cajaX + 32, yCabecera, { maxWidth: cajaAncho - 37 });
        yCabecera += 5;
    });

    const barcodeData = canvasCodigo.toDataURL('image/png');
    const barcodeAncho = Math.min(83, cajaAncho - 14);
    pdf.addImage(barcodeData, 'PNG', cajaX + (cajaAncho - barcodeAncho) / 2, cajaY + 32, barcodeAncho, 19);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(25, 35, 50);
    pdf.text(`Santiago de Cali, ${fecha}`, margen, y);
    y += 13;

    // Función optimizada para evitar solapamientos y aplicar justificado limpio
    const agregarParrafo = (texto, opciones = {}) => {
        const fuente = opciones.bold ? 'bold' : 'normal';
        const tamano = opciones.size || 11;
        const espacio = opciones.gap ?? 5;
        const alinear = opciones.align || 'left'; 

        pdf.setFont('helvetica', fuente);
        pdf.setFontSize(tamano);
        pdf.setTextColor(25, 35, 50);

        const lineas = pdf.splitTextToSize(String(texto || ''), anchoTexto);
        // Factor de conversión seguro para puntos a milímetros según el tamaño de fuente
        const interlineado = tamano * 0.40; 
        const altoBloque = lineas.length * interlineado;

        if (y + altoBloque > altoPagina - 27) {
            pdf.addPage();
            y = 24;
        }

        lineas.forEach((linea, index) => {
            const esUltimaLinea = index === lineas.length - 1;
            
            // Solo justificar si se solicita, si hay más de una línea y no es la última línea del bloque
            if (alinear === 'justify' && !esUltimaLinea && lineas.length > 1) {
                const palabras = linea.trim().split(/\s+/);
                if (palabras.length > 1) {
                    const anchoSinEspacios = palabras.reduce((acc, palabra) => acc + pdf.getTextWidth(palabra), 0);
                    const espacioTotalSobrante = anchoTexto - anchoSinEspacios;
                    const espacioEntrePalabras = espacioTotalSobrante / (palabras.length - 1);

                    let xActual = margen;
                    palabras.forEach((palabra) => {
                        pdf.text(palabra, xActual, y);
                        xActual += pdf.getTextWidth(palabra) + espacioEntrePalabras;
                    });
                } else {
                    pdf.text(linea, margen, y);
                }
            } else {
                pdf.text(linea, margen, y);
            }
            y += interlineado;
        });

        y += (espacio - interlineado); // Añadir el espacio extra configurado tras el párrafo
    };

    agregarParrafo('Señores,', { gap: 4 });
    agregarParrafo('SECRETARÍA DE MOVILIDAD', { bold: true, gap: 4 });
    agregarParrafo('Alcaldía Distrital de Santiago de Cali', { gap: 9 });
    
    agregarParrafo('Asunto:', { bold: true, gap: 4 });
    agregarParrafo(datos.asunto || 'Sin asunto registrado', { gap: 8, align: 'justify' });
    
    agregarParrafo('Solicitud:', { bold: true, gap: 4 });
    agregarParrafo(datos.contenido || 'Sin descripción registrada', { gap: 10, align: 'justify' });

    agregarParrafo('Atentamente,', { gap: 18 });
    
    if (y + 35 > altoPagina - 15) {
        pdf.addPage();
        y = 24;
    }
    
    pdf.setDrawColor(55, 65, 81);
    pdf.line(margen, y, margen + 88, y);
    y += 6; // Espacio seguro tras la línea de firma
    
    agregarParrafo(`Peticionario: ${remitente}`, { bold: true, size: 10, gap: 4 });
    agregarParrafo(`Tipo de solicitante: ${tipoSolicitante}`, { size: 10, gap: 4 });

    if (!anonima) {
        if (datos.documento) {
            const tipoDocumento = datos.tipoDocumento || 'Documento';
            agregarParrafo(`${tipoDocumento}: ${datos.documento}`, { size: 10, gap: 4 });
        }
        if (datos.correo) agregarParrafo(`Correo: ${datos.correo}`, { size: 10, gap: 4 });
        if (datos.direccion) agregarParrafo(`Dirección: ${datos.direccion}`, { size: 10, gap: 4 });
        const telefono = datos.celular || datos.fijo;
        if (telefono) agregarParrafo(`Teléfono: ${telefono}`, { size: 10, gap: 4 });
    }

    if (datos.anexo1 || datos.anexo2 || datos.anexo3) {
        agregarParrafo('Ver archivos adjuntos en el sistema.', { size: 9, gap: 4 });
    }

    pdf.save(`Radicacion-${radicado}.pdf`);
}

function finalizarTodo() {
    
    limpiarRadicacion();

    document.getElementById('modfinal').classList.add('hidden');
    window.location.href = 'index.html?nd=true';
    
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


//////////////////PASO 2  CARGA TIPO SOLICITUD /////////////



function cargarTiposSolicitudDinamicos() {

    const contenedor = document.getElementById('contenedorTiposSolicitud');
   

    if (!contenedor) return;

    let htmlAcumulado = '';

    // ==========================================
    // REGLA ESTRICTA DE RESTRICCIÓN POR FUNCIÓN
    // ==========================================
    
    let categoriasPermitidas = Object.keys(TIPOSOLICITUD); // Por defecto muestra todo    
    let subtiposPermitidosPorFuncion = null; // Por defecto no hay filtro estricto de subtipos

    

    switch (radicacion.dependencia) {


        case "Oficina de Contravenciones":
        
         
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
                

        break;

        case "Despacho del Secretario de Movilidad":

            if (radicacion.funcion === "Expedición o ajuste de actos administrativos") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Conceptos jurídicos sobre tránsito, transporte y movilidad") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición de Información"]; 
            }
            if (radicacion.funcion === "Seguimiento a metas e indicadores del Plan de Desarrollo") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General", "Entes de Control"]; 
            }
            if (radicacion.funcion === "Capacitación y sensibilización vial a actores de la vía") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Mecanismos de participación ciudadana y control social") {
                categoriasPermitidas = ['peticion','queja']; 
                subtiposPermitidosPorFuncion = ["Petición General","Queja"]; 
            }
            if (radicacion.funcion === "Atención a medios y eventos de rendición de cuentas") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Entes de Control"]; 
            }
            if (radicacion.funcion === "Respuesta a auditorías de entes de control externos") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General", "Entes de Control"]; 
            }

            if (radicacion.funcion.includes("Requerimiento Entes de Control")) {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Entes de Control"]; 
            }
            if (radicacion.funcion === "Otro") {
                categoriasPermitidas = ['Otros']; 
                subtiposPermitidosPorFuncion = ["Otros"]; 
            }

        break;

        case "Unidad de Apoyo a la Gestión":

            if (radicacion.funcion === "Contratación - certificaciones contractuales prestadores de servicio") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Financiero - Trámites de impuestos de servicios públicos.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"];  
            }
            if (radicacion.funcion === "Desintegración de vehículos - Copia de documentos (certificados de desintegración de vehículos inmovilizados por más de un año, para carro y moto, cancelación Dijin, estudios    técnicos de identificación de organismos a partir del 2024 resolución de declaratoria de abandono.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Planeación - Seguimiento a los proyectos de la secretaría de movilidad") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Ejecución presupuestal - Presupuesto de inversión secretaria de movilidad") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Otro") {
                categoriasPermitidas = ['Otros']; 
                subtiposPermitidosPorFuncion = ["Otros"]; 
            }
            
            
        break;

        case "Subsecretaria de servicios de movilidad":

            if (radicacion.funcion === "Solicitudes Operativas") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Requerimientos sobre agentes de tránsito") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"];  
            }
            if (radicacion.funcion === "Viabilidades eventos masivos") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Alcoholometría") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Chatarrización de vehículos TPC") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Inscripción y Levantamiento De Medidas Cautelares") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Expedición De Certificados De Entidades Judiciales O Administrativas") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Solicitud De Expedientes Vehículos") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
             if (radicacion.funcion === "Registro Automotor De Transporte Público") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Otro") {
                categoriasPermitidas = ['Otros']; 
                subtiposPermitidosPorFuncion = ["Otros"]; 
            }
            
        break;

        case "Subsecretaria de movilidad sostenible y seguridad vial":

            if (radicacion.funcion === "Conceptos técnicos para reducción de emisiones, congestión y siniestralidad vial.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Proyectos de movilidad alternativa e incentivos sostenibles.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Estudios técnicos de oferta, demanda y reorganización de rutas.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Solicitud de habilitación de empresas de transporte público y fijación tarifaria.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Seguimiento técnico operacional al Sistema Integrado de Transporte Masivo (SITM-MIO).") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Solicitudes de instalación, reparación o mantenimiento de infraestructura semafórica.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Requerimientos de señalización vial vertical y demarcación horizontal.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Conceptos técnicos de ingeniería de tránsito e intersecciones viales.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Mitigación de impactos viales por ejecución de obras públicas o privadas en vía pública.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"]; 
            }
            if (radicacion.funcion === "Trámites de inscripción para circulación vial de vehículos exentos (Pico y Placa).") {
                categoriasPermitidas = ['Tramitesyservicios']; 
                subtiposPermitidosPorFuncion = ["Inscripción o autorización para la circulación vial"];  
            }
            if (radicacion.funcion === "Plan de manejo de Tramites y Servicios.") {
                categoriasPermitidas = ['Tramitesyservicios']; 
                subtiposPermitidosPorFuncion = ["Plan de manejo de tránsito"];  
            }
            if (radicacion.funcion === "Permisos para movilización de carga indivisible, extra dimensionada o extra pesada.") {
                categoriasPermitidas = ['Tramitesyservicios']; 
                subtiposPermitidosPorFuncion = ["Permiso con formalidades plenas para movilización de carga indivisible, extradimensionada y/o extrapesada"];  
            }
            if (radicacion.funcion === "Suministro de datos estadísticos, tableros de control y series históricas de siniestralidad.") {
                categoriasPermitidas = ['peticion']; 
                subtiposPermitidosPorFuncion = ["Petición General"];  
            }
            if (radicacion.funcion === "Otro") {
                categoriasPermitidas = ['Otros']; 
                subtiposPermitidosPorFuncion = ["Otros"]; 
            }
        
        break;



        default:
        break;
    }

    // ==========================================
    // 1. CONTEO PREVIO PARA SABER SI QUEDA UNA SOLA OPCIÓN EN TOTAL
    // ==========================================
    let totalOpcionesValidas = 0;
    categoriasPermitidas.forEach(claveCat => {
        const cat = TIPOSOLICITUD[claveCat];
        if (!cat) return;
        cat.tipos.forEach(tipo => {
            if (!subtiposPermitidosPorFuncion || subtiposPermitidosPorFuncion.includes(tipo.nombre)) {
                totalOpcionesValidas++;
            }
        });
    });

    const esOpcionUnica = (totalOpcionesValidas === 1);

    // ==========================================
    // 2. RENDERIZADO
    // ==========================================
    categoriasPermitidas.forEach(claveCat => {
        const categoria = TIPOSOLICITUD[claveCat];
        if (!categoria) return;

        // Si solo hay una categoría permitida o es opción única, abrimos el acordeón
        const esUnicaCategoria = categoriasPermitidas.length === 1 || esOpcionUnica;

        htmlAcumulado += `
            <div class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-2xs">
                <!-- CABECERA CLICKEABLE (ACORDEÓN) -->
                <button type="button" 
                        onclick="alternarAcordeonCategoria(this)" 
                        class="w-full px-4 py-3.5 bg-slate-100 hover:bg-slate-200/70 flex justify-between items-center text-left font-black text-[#002855] uppercase text-xs tracking-wider transition-colors cursor-pointer">
                    <span>${categoria.nombre} ${esOpcionUnica ? ' (Opción única por defecto)' : ''}</span>
                    <svg class="w-4 h-4 transform transition-transform duration-300 ${esUnicaCategoria ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- CONTENEDOR DE SUBTIPOS -->
                <div class="${esUnicaCategoria ? '' : 'hidden'} p-4 space-y-2.5 bg-white border-t border-slate-200">
        `;

        categoria.tipos.forEach(tipo => {
            if (subtiposPermitidosPorFuncion && !subtiposPermitidosPorFuncion.includes(tipo.nombre)) {
                return; 
            }

            // Si es la única opción, la auto-seleccionamos de una vez en el objeto
            if (esOpcionUnica) {
                radicacion.tipoSolicitud = `${categoria.nombre} - ${tipo.nombre}`;
            }

            htmlAcumulado += `
                <label class="block p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-[#DB8700] transition-all duration-200">
                    <div class="flex items-start gap-3">
                        <input type="radio" 
                               name="tipoSolicitudEspecifica" 
                               value="${tipo.nombre}" 
                               data-categoria="${categoria.nombre}" 
                               data-info="${tipo.informacion}"
                               ${esOpcionUnica ? 'checked' : ''} 
                               onchange="seleccionarTipoSolicitudDinamico(this)" 
                               class="mt-1 text-[#002855] focus:ring-[#002855]">
                        <div class="flex-grow">
                            <span class="text-sm font-bold text-[#002855] block">${tipo.nombre}</span>
                            <span class="text-xs text-slate-500 block mt-0.5 leading-relaxed">${tipo.informacion}</span>
                        </div>
                    </div>
                </label>
            `;
        });

        htmlAcumulado += `
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = htmlAcumulado;

    // Si es opción única, habilitamos el botón de continuar de inmediato
    if (esOpcionUnica) {
        const btnContinuarPaso2 = document.getElementById('btnContinuarPaso2');
        if (btnContinuarPaso2) {
            btnContinuarPaso2.disabled = false;
            btnContinuarPaso2.classList.remove('bg-gray-400', 'cursor-not-allowed', 'opacity-60');
            btnContinuarPaso2.classList.add('bg-[#002855]', 'cursor-pointer');
        }
    }
}


function alternarAcordeonCategoria(btn) {
    const contenedorSubtipos = btn.nextElementSibling;
    const flecha = btn.querySelector('svg');
    const estaAbierto = !contenedorSubtipos.classList.contains('hidden');

    // Opcional: Si quieres que al abrir una se cierren las demás, puedes descomentar estas líneas:
    /*
    document.querySelectorAll('#contenedorTiposSolicitud > div > div').forEach(div => {
        if (div !== contenedorSubtipos) div.classList.add('hidden');
    });
    document.querySelectorAll('#contenedorTiposSolicitud button svg').forEach(svg => {
        if (svg !== flecha) svg.classList.remove('rotate-180');
    });
    */

    // Alternar visibilidad del contenedor actual
    contenedorSubtipos.classList.toggle('hidden', estaAbierto);
    flecha.classList.toggle('rotate-180', !estaAbierto);

    // Si se acaba de abrir, aplicamos tu animación de scroll suave con requestAnimationFrame
    if (!estaAbierto) {
        requestAnimationFrame(() => {
            btn.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }
}
window.alternarAcordeonCategoria = alternarAcordeonCategoria;

function seleccionarTipoSolicitudDinamico(radio) {
    const categoria = radio.getAttribute('data-categoria');
    const info = radio.getAttribute('data-info');
    const subtipo = radio.value;
    

    // Se guarda la categoría y el subtipo concatenados en la propiedad existente
    radicacion.tipoSolicitud = `${categoria} - ${subtipo} - ${info}`;

    // Habilitar el botón de continuar del Paso 2
    const btnContinuarPaso2 = document.getElementById('btnContinuarPaso2');
    if (btnContinuarPaso2) {
        btnContinuarPaso2.disabled = false;
        btnContinuarPaso2.classList.remove('bg-gray-400', 'cursor-not-allowed', 'opacity-60');
        btnContinuarPaso2.classList.add('bg-[#002855]', 'cursor-pointer');
    }
}
window.seleccionarTipoSolicitudDinamico = seleccionarTipoSolicitudDinamico;
