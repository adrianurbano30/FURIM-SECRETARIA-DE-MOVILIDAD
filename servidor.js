
const express = require('express');
const ExcelJS = require('exceljs');
const fs = require('node:fs');
const path = require('node:path');
const { PDFDocument } = require('pdfkit');
const { resolve } = require('node:dns');
const nodemailer = require('nodemailer');
const JsBarcode = require('jsbarcode');

const app = express();
const PUERTO = 3000;

const ENDPOINT_GOOGLE_CALIFICACIONES = 'https://script.google.com/macros/s/AKfycbyedgGZ9JY_JnY269h1UAjryY7jLSnRD8mYa1OGxt9IoPkUz2m0qSX6UiGfM-ldSq20SA/exec';


// Archivo Excel que contendrá las radicaciones.
const RUTA_EXCEL = path.join(__dirname, 'Registro_FURIM.xlsx');

app.use(express.json({ limit: '1mb' }));

// Permitir solicitudes desde Live Server durante las pruebas.
const origenesPermitidos = new Set(['http://127.0.0.1:5500','http://localhost:5500']);

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

///funcion genear  PDF



function generarPdfRadicacion(datos, radicado, fechaRadicacion) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'LETTER',
            margins: { top: 72, bottom: 50, left: 71, right: 71 }
        });

        const partes = [];

        doc.on('data', parte => partes.push(parte));
        doc.on('end', () => resolve(Buffer.concat(partes)));
        doc.on('error', reject);

        const anonima = Boolean(datos.anonima);

        const nombreCompleto = [
            datos.primerNombre,
            datos.segundoNombre,
            datos.primerApellido,
            datos.segundoApellido
        ].filter(Boolean).join(' ').trim();

        const remitente = anonima
            ? 'Solicitante anónimo'
            : datos.tipoSolicitante === 'juridica'
                ? datos.razonSocial || nombreCompleto || 'Solicitante'
                : nombreCompleto || datos.razonSocial || 'Solicitante';

        const tiposSolicitante = {
            natural: 'Persona natural',
            juridica: 'Persona jurídica',
            menor: 'Niño, niña o adolescente',
            apoderado: 'Apoderado o tercero'
        };

        const tipoSolicitante = anonima
            ? 'Anónimo'
            : tiposSolicitante[datos.tipoSolicitante]
                || datos.tipoSolicitante
                || 'No indicado';

        const fecha = new Intl.DateTimeFormat('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Bogota'
        }).format(new Date(fechaRadicacion));

        const anchoPagina = doc.page.width;
        const margenIzquierdo = 71;
        const anchoTexto = anchoPagina - margenIzquierdo - 71;

        // Ficha superior del radicado
        const cajaX = 244;
        const cajaY = 34;
        const cajaAncho = anchoPagina - cajaX - 40;
        const cajaAlto = 159;

        doc.roundedRect(cajaX, cajaY, cajaAncho, cajaAlto, 20)
            .fillAndStroke('#F2F3F5', '#1F2F52');

        const filasCabecera = [
            ['Destino', 'SECRETARÍA DE MOVILIDAD'],
            ['Remitente', remitente],
            ['Tipo solicitante', tipoSolicitante],
            ['Tipo radicación', datos.tipoSolicitud || 'Petición'],
            ['Fecha radicación', fecha]
        ];

        let yCabecera = cajaY + 20;

        filasCabecera.forEach(([etiqueta, valor]) => {
            doc.font('Helvetica')
                .fontSize(7.5)
                .fillColor('#232D3C')
                .text(etiqueta, cajaX + 15, yCabecera, { width: 74 });

            doc.font('Helvetica-Bold')
                .fontSize(7.5)
                .fillColor('#111827')
                .text(String(valor || '-').slice(0, 52), cajaX + 92, yCabecera, {
                    width: cajaAncho - 105,
                    ellipsis: true
                });

            yCabecera += 14;
        });

        // Generar CODE128 con JsBarcode y dibujarlo como vectores en PDFKit
        const resultadoCodigo = {};

        JsBarcode(resultadoCodigo, String(radicado), {
            format: 'CODE128',
            displayValue: false,
            margin: 0
        });

        const bitsCodigo = resultadoCodigo.encodings?.[0]?.data;

        if (!bitsCodigo) {
            throw new Error('No se pudo generar el código de barras del radicado.');
        }

        const anchoMaximoCodigo = cajaAncho - 30;
        const anchoModulo = Math.min(1.25, anchoMaximoCodigo / bitsCodigo.length);
        const anchoCodigo = bitsCodigo.length * anchoModulo;
        const xCodigo = cajaX + (cajaAncho - anchoCodigo) / 2;
        const yCodigo = cajaY + 105;
        const altoCodigo = 31;

        doc.fillColor('#111827');

        for (let i = 0; i < bitsCodigo.length; i++) {
            if (bitsCodigo[i] === '1') {
                doc.rect(
                    xCodigo + i * anchoModulo,
                    yCodigo,
                    anchoModulo,
                    altoCodigo
                );
            }
        }

        doc.fill();

        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#111827')
            .text(String(radicado), cajaX, cajaY + 140, {
                width: cajaAncho,
                align: 'center'
            });

        // Cuerpo de la radicación
        doc.x = margenIzquierdo;
        doc.y = 207;

        const agregarParrafo = (
            texto,
            { negrita = false, tamano = 11, espacio = 0.5, alineacion = 'left' } = {}
        ) => {
            doc.font(negrita ? 'Helvetica-Bold' : 'Helvetica')
                .fontSize(tamano)
                .fillColor('#192332')
                .text(String(texto || ''), {
                    width: anchoTexto,
                    align: alineacion,
                    lineGap: 2
                });

            doc.moveDown(espacio);
        };

        agregarParrafo(`Santiago de Cali, ${fecha}`, { gap: 0.8 });
        const esEntesControlDespacho =
    datos.dependencia === 'Despacho del Secretario de Movilidad' &&
    String(datos.funcion || '').startsWith('Requerimiento Entes de Control');

        const diasRespuesta = Number(datos.diasRespuesta);

        if (esEntesControlDespacho && Number.isInteger(diasRespuesta) && diasRespuesta >= 1 && diasRespuesta <= 30) {
        agregarParrafo(`Tiempo de respuesta: ${diasRespuesta} días hábiles`,{ negrita: true, espacio: 0.5 });
        }
        agregarParrafo('Señores,', { espacio: 0.3 });
        agregarParrafo('SECRETARÍA DE MOVILIDAD', { negrita: true, espacio: 0.3 });
        agregarParrafo('Alcaldía Distrital de Santiago de Cali', { espacio: 0.8 });

        agregarParrafo('Asunto:', { negrita: true, espacio: 0.3 });
        agregarParrafo(datos.asunto || 'Sin asunto registrado', {
            espacio: 0.7,
            alineacion: 'justify'
        });

        agregarParrafo('Solicitud:', { negrita: true, espacio: 0.3 });
        agregarParrafo(datos.contenido || 'Sin descripción registrada', {
            espacio: 1,
            alineacion: 'justify'
        });

        agregarParrafo('Atentamente,', { espacio: 1.5 });

        // Mantener juntos la línea de firma y los datos del solicitante
        if (doc.y + 125 > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
        }

        doc.moveDown(0.5);
        doc.moveTo(margenIzquierdo, doc.y)
            .lineTo(margenIzquierdo + 255, doc.y)
            .strokeColor('#374151')
            .lineWidth(0.8)
            .stroke();

        doc.moveDown(0.3);

        agregarParrafo(`Peticionario: ${remitente}`, {
            negrita: true,
            tamano: 10,
            espacio: 0.25
        });

        agregarParrafo(`Tipo de solicitante: ${tipoSolicitante}`, {
            tamano: 10,
            espacio: 0.25
        });

        if (!anonima) {
            if (datos.documento) {
                agregarParrafo(
                    `${datos.tipoDocumento || 'Documento'}: ${datos.documento}`,
                    { tamano: 10, espacio: 0.25 }
                );
            }

            if (datos.correo) {
                agregarParrafo(`Correo: ${datos.correo}`, {
                    tamano: 10,
                    espacio: 0.25
                });
            }

            if (datos.direccion) {
                agregarParrafo(`Dirección: ${datos.direccion}`, {
                    tamano: 10,
                    espacio: 0.25
                });
            }

            const telefono = datos.celular || datos.fijo;

            if (telefono) {
                agregarParrafo(`Teléfono: ${telefono}`, {
                    tamano: 10,
                    espacio: 0.25
                });
            }
        }

        if (datos.anexo1 || datos.anexo2 || datos.anexo3) {
            agregarParrafo('Ver archivos adjuntos en el sistema.', {
                tamano: 9,
                espacio: 0.25
            });
        }

        doc.end();
    });
}


//end funcion generar PDF


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

        const esEntesControlDespacho = radicacion.dependencia === 'Despacho del Secretario de Movilidad' && String(radicacion.funcion || '').startsWith('Requerimiento Entes de Control');

        if (esEntesControlDespacho) {
        const dias = Number(radicacion.diasRespuesta);

        if (!Number.isInteger(dias) || dias < 1 || dias > 30) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tiempo de respuesta debe estar entre 1 y 30 días hábiles.'
            });
        }

        radicacion.diasRespuesta = dias;
        } else {
            radicacion.diasRespuesta = '';
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
                { header: 'Anexo 3', key: 'anexo3', width: 28 },
                { header: 'Días de respuesta (hábiles)', key: 'diasRespuesta', width: 28 }
            ];

            hoja.getRow(1).font = { bold: true };
        }

        const columnaDiasRespuesta = 30; // AD

        if (!hoja.getCell(1, columnaDiasRespuesta).value) {
            hoja.getCell(1, columnaDiasRespuesta).value ='Días de respuesta (hábiles)';
            hoja.getCell(1, columnaDiasRespuesta).font = { bold: true };
            hoja.getColumn(columnaDiasRespuesta).width = 28;
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


    //texto(radicacion.radicado),
    const fechaRadicacion = new Date();
    const nuevaFila = hoja.addRow([
    fechaRadicacion.toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    texto(radicadoGenerado),
    texto(radicacion.dependencia),
    texto(radicacion.codigoDependencia),
    texto(radicacion.asunto),
    texto(radicacion.funcion),
    texto(radicacion.tipoSolicitante ? radicacion.tipoSolicitante : 'Anonimo'),
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
    texto(radicacion.anexo3),
    texto(radicacion.diasRespuesta)
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


let pdfGenerado = false;
let pdfBuffer;
//let vistaCorreoPrueba = null; 



try {

    pdfBuffer = await generarPdfRadicacion(
          radicacion,
          radicadoGenerado,
          fechaRadicacion
    );

    // const rutaPdf = path.join(
    //     __dirname,
    //     `Comprobante-prueba-${radicadoGenerado}.pdf`
    // );

    // await fs.promises.writeFile(rutaPdf, pdfBuffer);
    console.log('PDF generado en memoria:', pdfBuffer.length, 'bytes');
    pdfGenerado = true;

    // //console.log('PDF de prueba guardado en:', rutaPdf);
    } catch (errorPdf) {
        // El Excel ya se guardó; un fallo del PDF no debe reportar
        // como fallida toda la radicación.
        console.error('Error al generar el PDF de prueba:', errorPdf);  
    }


    //bloque de envio

    if (!radicacion.anonima && radicacion.correo && pdfBuffer) {
       try {
       

        const usuarioSMTP = process.env.FURIM_SMTP_USER;
        const claveSMTP = process.env.FURIM_SMTP_APP_PASSWORD;

        if (!usuarioSMTP || !claveSMTP) {
            throw new Error('Faltan las variables SMTP de prueba.');
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
            user: usuarioSMTP,
            pass: claveSMTP
        }
       });

       const escaparHtml = valor => String(valor ?? '').replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
       }[caracter]));

       const radicadoHtml = escaparHtml(radicadoGenerado);
       const dependenciaHtml = escaparHtml(radicacion.dependencia);
       const fechaCorreo = new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/Bogota'
      }).format(fechaRadicacion);


       
        const info = await transporter.sendMail({
    from: `Formulario FURIM <${usuarioSMTP}>`,
    to: radicacion.correo,
    subject: `Comprobante de radicación ${radicadoGenerado}`,

    text: `Cordial saludo.

Hemos recibido la información enviada a través del Formulario de Radicación.

Número de radicado: ${radicadoGenerado}
Fecha de recepción: ${fechaCorreo}
Dependencia: ${radicacion.dependencia}

Adjuntamos el comprobante en PDF. Le recomendamos conservar el número de radicado para futuras consultas.

Atentamente,
Formulario de Radicación
Secretaría de Movilidad
Alcaldía Distrital de Santiago de Cali`,

    html: `
        <!doctype html>
        <html lang="es">
        <body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                            style="width:100%;max-width:600px;background:#ffffff;border:1px solid #dbe3ec;border-radius:12px;overflow:hidden;">
                            <tr>
                                <td style="padding:24px 30px;background:#002855;border-bottom:5px solid #DB8700;color:#ffffff;">
                                    <div style="font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
                                        Alcaldía Distrital de Santiago de Cali
                                    </div>
                                    <div style="margin-top:6px;font-size:20px;font-weight:bold;">
                                        Secretaría de Movilidad
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:30px;">
                                    <h1 style="margin:0 0 16px;color:#002855;font-size:21px;">
                                        Comprobante de radicación
                                    </h1>

                                    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">
                                        Cordial saludo. Hemos recibido la información enviada a través del
                                        Formulario de Radicación.
                                    </p>

                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                        style="margin:0 0 20px;border-collapse:collapse;background:#f8fafc;border:1px solid #dbe3ec;">
                                        <tr>
                                            <td style="padding:16px 18px;">
                                                <div style="color:#64748b;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
                                                    Número de radicado
                                                </div>
                                                <div style="margin-top:6px;color:#002855;font-size:22px;font-weight:bold;word-break:break-word;">
                                                    ${radicadoHtml}
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin:0 0 8px;font-size:14px;">
                                        <strong>Fecha de recepción:</strong> ${escaparHtml(fechaCorreo)}
                                    </p>
                                    <p style="margin:0 0 20px;font-size:14px;">
                                        <strong>Dependencia:</strong> ${dependenciaHtml}
                                    </p>

                                    <p style="margin:0;font-size:14px;line-height:1.6;">
                                        Adjuntamos el comprobante en PDF. Le recomendamos conservar el número
                                        de radicado para futuras consultas.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:18px 30px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.5;">
                                    Mensaje automático del Formulario de Radicación.<br>
                                    Secretaría de Movilidad · Alcaldía Distrital de Santiago de Cali
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `,

    attachments: [{
        filename: `Radicacion-${radicadoGenerado}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
    }]
});

        // vistaCorreoPrueba = nodemailer.getTestMessageUrl(info);
        // console.log('Vista del correo de prueba:', vistaCorreoPrueba);
        console.log('Correo enviado. Id:', info.messageId);
        } catch (errorCorreo) {
        console.error('Error al enviar el correo de prueba:', errorCorreo);
        }
    }

    //endbloque de envio





return res.json({
            ok: true,
            Rad:radicadoGenerado,
            fechaRadicacion: fechaRadicacion.toISOString(),
            objetoPQR:radicacion,
            pdfBase64: pdfBuffer ? pdfBuffer.toString('base64') : null,
            pdfNombre: `Radicacion-${radicadoGenerado}.pdf`,
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
