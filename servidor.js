
const express = require('express');
const ExcelJS = require('exceljs');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
const PUERTO = 3000;

const ENDPOINT_GOOGLE_CALIFICACIONES = 'https://script.google.com/macros/s/AKfycbyedgGZ9JY_JnY269h1UAjryY7jLSnRD8mYa1OGxt9IoPkUz2m0qSX6UiGfM-ldSq20SA/exec';


// Archivo Excel que contendrá las radicaciones.
const RUTA_EXCEL = path.join(__dirname, 'Registro_FURIM.xlsx');

app.use(express.json({ limit: '1mb' }));

// Permitir solicitudes desde Live Server durante las pruebas.
const origenesPermitidos = new Set([
    'http://127.0.0.1:5500',
    'http://localhost:5500'
]);

app.use((req, res, next) => {
    const origen = req.headers.origin;

    if (origenesPermitidos.has(origen)) {
        res.setHeader('Access-Control-Allow-Origin', origen);
    }

    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});



// Comprobar que el servidor está funcionando.
app.get('/estado', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Servidor local FURIM funcionando'
    });
});

// Recibir una radicación y guardarla en Excel.
app.post('/guardar-radicacion', async (req, res) => {
    try {
        const radicacion = req.body;

        // Validar la estructura básica de los datos recibidos.
        if (!radicacion || typeof radicacion !== 'object' || Array.isArray(radicacion)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Los datos recibidos no son válidos.'
            });
        }

        if (typeof radicacion.dependencia !== 'string' || !radicacion.dependencia.trim()) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La dependencia es obligatoria.'
            });
        }

        // Crear el libro en memoria.
        const libro = new ExcelJS.Workbook();

        // Abrir el archivo si ya existe.
        if (fs.existsSync(RUTA_EXCEL)) {
            await libro.xlsx.readFile(RUTA_EXCEL);
        }

        // Buscar la hoja o crearla si es la primera radicación.
        let hoja = libro.getWorksheet('Radicaciones');

        if (!hoja) {
            hoja = libro.addWorksheet('Radicaciones');

            hoja.columns = [
                { header: 'Fecha de registro', key: 'fechaRegistro', width: 22 },
                { header: 'Radicado demo', key: 'radicado', width: 22 },
                { header: 'Dependencia', key: 'dependencia', width: 28 },
                { header: 'Código dependencia', key: 'codigoDependencia', width: 22 },
                { header: 'Asunto', key: 'asunto', width: 40 },
                { header: 'Función', key: 'funcion', width: 28 },
                { header: 'Tipo solicitante', key: 'tipoSolicitante', width: 22 },
                { header: 'Primer nombre', key: 'primerNombre', width: 20 },
                { header: 'Segundo nombre', key: 'segundoNombre', width: 20 },
                { header: 'Primer apellido', key: 'primerApellido', width: 20 },
                { header: 'Segundo apellido', key: 'segundoApellido', width: 20 },
                { header: 'Tipo documento', key: 'tipoDocumento', width: 20 },
                { header: 'Documento', key: 'documento', width: 22 },
                { header: 'Correo', key: 'correo', width: 32 },
                { header: 'Dirección', key: 'direccion', width: 32 },
                { header: 'Celular', key: 'celular', width: 18 },
                { header: 'Teléfono fijo', key: 'fijo', width: 18 },
                { header: 'País', key: 'pais', width: 18 },
                { header: 'Departamento', key: 'departamento', width: 22 },
                { header: 'Municipio', key: 'municipio', width: 22 },
                { header: 'Razón social', key: 'razonSocial', width: 28 },
                { header: 'Tipo solicitud', key: 'tipoSolicitud', width: 24 },
                { header: 'Contenido', key: 'contenido', width: 60 },
                { header: 'Medio respuesta', key: 'medioRespuesta', width: 24 },
                { header: 'Solicitud anónima', key: 'anonima', width: 18 },
                { header: 'Acepta política', key: 'aceptaPolitica', width: 18 },
                { header: 'Anexo 1', key: 'anexo1', width: 28 },
                { header: 'Anexo 2', key: 'anexo2', width: 28 },
                { header: 'Anexo 3', key: 'anexo3', width: 28 }
            ];

            hoja.getRow(1).font = { bold: true };
        }

        // Convertir los valores a texto para evitar valores indefinidos.
        const texto = (valor) => {
            if (valor === null || valor === undefined) {
                return '';
            }

            return String(valor);
        };


   const  anoActual = new Date().getFullYear();
   const aleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6,'0');     

   const radicadoGenerado = anoActual + radicacion.codigoDependencia + aleatorio + 2;     
   console.log('tipo solicitante ->', radicacion.tipoSolicitante);

        // Añadir una fila nueva por cada envío.
        // hoja.addRow({
        //     fechaRegistro: new Date().toLocaleString('es-CO'),
        //     radicado: texto(radicacion.radicado),
        //     dependencia: texto(radicacion.dependencia),
        //     codigoDependencia: texto(radicacion.codigoDependencia),
        //     funcion: texto(radicacion.funcion),
        //     tipoSolicitante: texto(radicacion.tipoSolicitante),
        //     primerNombre: texto(radicacion.primerNombre),
        //     segundoNombre: texto(radicacion.segundoNombre),
        //     primerApellido: texto(radicacion.primerApellido),
        //     segundoApellido: texto(radicacion.segundoApellido),
        //     tipoDocumento: texto(radicacion.tipoDocumento),
        //     documento: texto(radicacion.documento),
        //     correo: texto(radicacion.correo),
        //     direccion: texto(radicacion.direccion),
        //     celular: texto(radicacion.celular),
        //     fijo: texto(radicacion.fijo),
        //     pais: texto(radicacion.pais),
        //     departamento: texto(radicacion.departamento),
        //     municipio: texto(radicacion.municipio),
        //     razonSocial: texto(radicacion.razonSocial),
        //     tipoSolicitud: texto(radicacion.tipoSolicitud),
        //     asunto: texto(radicacion.asunto),
        //     contenido: texto(radicacion.contenido),
        //     medioRespuesta: texto(radicacion.medioRespuesta),
        //     anonima: radicacion.anonima ? 'Sí' : 'No',
        //     aceptaPolitica: radicacion.aceptaPolitica ? 'Sí' : 'No',
        //     anexo1: texto(radicacion.anexo1),
        //     anexo2: texto(radicacion.anexo2),
        //     anexo3: texto(radicacion.anexo3)
        // });


    //texto(radicacion.radicado),
    const fechaRadicacion = new Date();
    const nuevaFila = hoja.addRow([
    fechaRadicacion.toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    texto(radicadoGenerado),
    texto(radicacion.dependencia),
    texto(radicacion.codigoDependencia),
    texto(radicacion.asunto),
    texto(radicacion.funcion),
    texto(radicacion.tipoSolicitante ? 'anónimo' : radicacion.tipoSolicitante),
    texto(radicacion.primerNombre),
    texto(radicacion.segundoNombre),
    texto(radicacion.primerApellido),
    texto(radicacion.segundoApellido),
    texto(radicacion.tipoDocumento),
    texto(radicacion.documento),
    texto(radicacion.correo),
    texto(radicacion.direccion),
    texto(radicacion.celular),
    texto(radicacion.fijo),
    texto(radicacion.pais),
    texto(radicacion.departamento),
    texto(radicacion.municipio),
    texto(radicacion.razonSocial),
    texto(radicacion.tipoSolicitud),
    texto(radicacion.contenido),
    texto(radicacion.medioRespuesta),
    radicacion.anonima ? 'Sí' : 'No',
    radicacion.aceptaPolitica ? 'Sí' : 'No',
    texto(radicacion.anexo1),
    texto(radicacion.anexo2),
    texto(radicacion.anexo3)
]);

console.log('Número de fila creada:', nuevaFila.number);
console.log('Valores de la fila:', nuevaFila.values);
console.log('Filas después de addRow:', hoja.rowCount);



console.log('Hojas del libro:', libro.worksheets.map(h => h.name));
console.log('Hoja utilizada:', hoja.name);
console.log('Filas antes de guardar:', hoja.rowCount);

        // Guardar el archivo antes de confirmar el éxito.
await libro.xlsx.writeFile(RUTA_EXCEL);

console.log('Filas después de guardar:', hoja.rowCount);
console.log('Archivo guardado correctamente.');

console.log('Excel guardado en:', RUTA_EXCEL);
console.log('Radicado guardado:', radicacion.radicado);


        return res.json({
            ok: true,
            Rad:radicadoGenerado,
            fechaRadicacion: fechaRadicacion.toISOString(),
            objetoPQR:radicacion,
            mensaje: 'Radicación guardada en Excel.'
        });

    } catch (error) {
        console.error('Error al guardar la radicación:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible guardar la radicación en Excel.'
        });
    }
});


app.post('/guardar-calificacion', async (req, res) => {
    const { satisfaccion, motivo = '' } = req.body || {};
    const nivelesPermitidos = [
        'Muy Satisfecho',
        'Satisfecho',
        'Insatisfecho'
    ];

    if (!nivelesPermitidos.includes(satisfaccion)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'La calificación no es válida.'
        });
    }

    try {
        const respuestaGoogle = await fetch(ENDPOINT_GOOGLE_CALIFICACIONES, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({
                satisfaccion,
                motivo: String(motivo).slice(0, 1000)
            })
        });

        const resultadoGoogle = await respuestaGoogle.json();

        if (!respuestaGoogle.ok || !resultadoGoogle.ok) {
            return res.status(502).json({
                ok: false,
                mensaje: resultadoGoogle.mensaje || 'Google no confirmó el guardado.'
            });
        }

        return res.json({ ok: true, mensaje: 'Calificación guardada.' });
    } catch (error) {
        console.error('Error enviando la calificación a Google:', error);

        return res.status(502).json({
            ok: false,
            mensaje: 'No se pudo conectar con Google Sheets.'
        });
    }
});


// Escuchar únicamente conexiones desde este computador.
app.listen(PUERTO, '127.0.0.1', () => {
    console.log(
        `Servidor FURIM disponible en http://127.0.0.1:${PUERTO}`
    );

    console.log(`Archivo Excel: ${RUTA_EXCEL}`);
});
