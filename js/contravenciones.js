export const ARBOL_CONTRAVENCIONES = {

    tramiteNuevo: {

        pregunta: "¿Sobre qué tema desea realizar su solicitud?", 

        opciones: [

            {
                id: "comparendos",
                label: "COMPARENDOS",

                siguiente: {

                    pregunta: "¿Qué desea hacer?",

                    opciones: [
                        //CONSULTAR INFORMACION
                        {
                            id: "consultarInformacion",
                            label: "Consultar información",

                            siguiente: {

                                pregunta: "¿Qué desea consultar?",

                                opciones: [

                                    {
                                        id: "estadoComparendo",
                                        label: "Estado del comparendo",
                                        siguiente: null
                                    },

                                    {
                                        id: "estadoproceso",
                                        label: "Estado del proceso",
                                        siguiente: null
                                    },

                                    {
                                        id: "comparendosregistrados",
                                        label: "Comparendos registrados",
                                        siguiente: null
                                    },

                                    {
                                        id: "normatividad",
                                        label: "Normatividad",
                                        siguiente: null
                                    }

                                ]

                            }
                            

                        },
                        //COomparendo IUIT(INFORME UNITCO DE INFRACCION AL TRANSPORTE)
                        {
                            id: "COMPARENDOIUIT",
                            label: "Comparendo IUIT (Informe Único De Infracción Al Transporte)",
                            siguiente: null

                            // siguiente: {

                            //     pregunta: "¿Qué desea consultar?",

                            //     opciones: [

                            //         {
                            //             id: "comparendo_iuit",
                            //             label: "Comparendo IUIT",
                            //             siguiente: null
                            //         },

                                   

                            //     ]

                            // }
                            

                        },
                        //SOLICITAR COPIA EXPEDIENTE
                        {
                            id: "copiaExpediente",
                            label: "Solicitar copia del expediente",
                            siguiente: {

                                 pregunta: "¿Qué desea solicitar?",

                                  opciones: [

                                    {
                                        id: "numeroComparendo",
                                        label: "Número de comparendo.",
                                        siguiente: null
                                    },

                                    {
                                        id: "documentoIdentidad",
                                        label: "Documento de identidad.",
                                        siguiente: null
                                    },

                                    {
                                        id: "correoelectronico",
                                        label: "Correo electrónico.",
                                        siguiente: null
                                    }

                                ]

                            }
                        },
                        //Solicitar reinicio de términos
                        {
                            id: "reinicioterminos",
                            label: "Solicitar reinicio de términos",
                            siguiente: {

                                 pregunta: "¿Qué desea solicitar?",

                                  opciones: [

                                    {
                                        id: "nofuinotificado",
                                        label: "No fui notificado.",
                                        siguiente: null
                                    },

                                    {
                                        id: "lanotificacionpresentainconsistencias",
                                        label: "La notificación presenta inconsistencias.",
                                        siguiente: null
                                    },

                                    {
                                        id: "deseoaccedernuevamentealdescuentopararealizarelpago",
                                        label: "Deseo acceder nuevamente al descuento para realizar el pago.",
                                        siguiente: null
                                    },

                                    {
                                        id: "presentederechodepeticiondentrodeltermino",
                                        label: "Presenté derecho de petición dentro del término.",
                                        siguiente: null
                                    },

                                    {
                                        id: "otro",
                                        label: "Otro.",
                                        siguiente: null
                                    }

                                ]

                            }
                        },
                         //Solicitar revocatoria
                        {
                            id: "revocatoria",
                            label: "Solicitar revocatoria",
                            siguiente: {

                                pregunta: "¿Cuál es la causal?",
                                  opciones:[

                                    {
                                        id: "indebidanotificacion",
                                        label: "Indebida notificación.",
                                        siguiente: null
                                    },

                                    {
                                        id: "caducidad",
                                        label: "Caducidad.",
                                        siguiente: null
                                    },

                                    {
                                        id: "prescripcion",
                                        label: "Prescripción.",
                                        siguiente: null
                                    },

                                    {
                                        id: "errorenlaplaca",
                                        label: "Error en la placa.",
                                        siguiente: null
                                    },

                                    {
                                        id: "errordeidentificacion",
                                        label: "Error de identificación.",
                                        siguiente: null
                                    },

                                    {
                                        id: "vehículohurtado",
                                        label: "Vehículo hurtado.",
                                        siguiente: null
                                    },

                                    {
                                        id: "fallecimientodelpropietario",
                                        label: "Fallecimiento del propietario.",
                                        siguiente: null
                                    },

                                    {
                                        id: "comparendoduplicado",
                                        label: "Comparendo duplicado.",
                                        siguiente: null
                                    },

                                    {
                                        id: "pagorealizado",
                                        label: "Pago realizado.",
                                        siguiente: null
                                    },

                                    {
                                        id: "doblecobro",
                                        label: "Doble cobro.",
                                        siguiente: null
                                    },

                                    {
                                        id: "falsedadmarcaria",
                                        label: "Falsedad marcaria.",
                                        siguiente: null
                                    },

                                    {
                                        id: "otro",
                                        label: "Otro.",
                                        siguiente: null
                                    },

                                 ]
                            }
                        },
                         //Solicitar cambio de infractor
                        {
                            id: "cambioInfractor",
                            label: "Solicitar cambio de infractor(Presencial)",
                            siguiente: null
                        }

                    ]

                }
 
            },
            {
                id: "cobrocoactivo",
                label: "COBRO COACTIVO",
                siguiente: {
                    
                    pregunta:"¿Qué desea hacer?",

                    opciones:[

                        {
                            id: "acuerdosdepago",
                            label: "ACUERDOS DE PAGO(Informacion, acuerdos, consultas, incumplimientos  manera presencial).",
                            siguiente: null
                        },

                        {
                            id: "actualizaciondeinformacion",
                            label: "Actualización de información.",
                            siguiente: null
                        },

                        {
                            id: "correcciondedatos",
                            label: "Corrección de datos.",
                            siguiente: null
                        },

                        {
                            id: "devolucionespagoenexcesopagonodebido",
                            label: "DEVOLUCIONES (Pago en exceso / Pago no debido)",
                            siguiente: null
                        },

                        {
                            id: "solicitarprescripcion",
                            label: "Solicitar prescripción.",
                            siguiente: null
                        },

                        {
                            id: "solicitarcopiadelexpediente",
                            label: "Solicitar copia del expediente.",
                            siguiente: null
                        },

                        {
                            id: "solicitarlevantamientodeembargo",
                            label: "Solicitar levantamiento de embargo.",
                            siguiente: null
                        },
                    ]

                }
            },

            {
                id: "solicituddeantecedentesadministrativos",
                label: "SOLICITUD DE ANTECEDENTES ADMINISTRATIVOS",
                siguiente: {

                    pregunta:"¿Qué desea solicitar?",

                    opciones:[

                        {
                            id: "investigacionesadministrativassiestaninvolucradosoinmersos",
                            label: "Investigaciones administrativas si estan involucrados o inmersos.",
                            siguiente: null
                        },

                         {
                            id: "informacionsobremultasdeltransporte",
                            label: "Información sobre multas del transporte.",
                            siguiente: null
                        },

                         {
                            id: "peticiondededesvinculacionadministrativa",
                            label: "Petición de de desvinculación administrativa.",
                            siguiente: null
                        },

                         {
                            id: "quejasporprestacionindevidadelserviciodeltranspotepublico",
                            label: "Quejas por prestación indevida del servicio del transpote publico.",
                            siguiente: null
                        },

                         {
                            id: "descargosdentrodelosprocesosdeinvestigacionesadministrativas",
                            label: "Descargos dentro de los procesos de investigaciones administrativas.",
                            siguiente: null
                        },

                         {
                            id: "alegatosdeconclusiondentrodelainvestigacionadministrativa",
                            label: "Alegatos de conclusión dentro de la investigacion administrativa.",
                            siguiente: null
                        },

                         {
                            id: "recursosdereposicioncontraresolucionesqueresuelvenlasinvestigacionesadministrativasyotrascontralasdedesvinculacionadministrativa",
                            label: "Recursos de reposición contra resoluciones que resuelven las  investigaciones administrativas y otras contra las de desvinculacion administrativa.",
                            siguiente: null
                        },

                    ]

                }
            }

        ]

    }

};