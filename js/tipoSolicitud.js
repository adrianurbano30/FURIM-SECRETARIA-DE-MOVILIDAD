export {TIPOSOLICITUD}

const TIPOSOLICITUD = {

    peticion: {
        nombre: "Peticiones",
        tipos:[
            {
               nombre:"Petición Congresista",
               informacion:"Respuesta en 5 Días hábiles Ley o Norma: Ley 5 de 1992, artículo 258"
            },
            {
               nombre:"Petición Prioritaria",
               informacion:"Respuesta en 15 Días hábiles"
            },
            {
               nombre:"Petición entre Autoridades",
               informacion:"Respuesta en 10 Días hábiles"
            },
            {
               nombre:"Entes de Control",
               informacion:"Respuesta en 10 Días hábiles"
            },
            {
               nombre:"Petición de Información",
               informacion:"Respuesta en 10 Días hábiles"
            },
            {
               nombre:"Petición Consulta",
               informacion:"Respuesta en 30 Días hábiles"
            },
            {
               nombre:"Petición General",
               informacion:"Respuesta en 15 Días hábiles"
            },

        ]
   },
    
   queja: {
        nombre:"Queja",
        tipos:[

            {
               nombre:"Queja disciplinaria",
               informacion:"Respuesta en 90 Días hábiles Ley o Norma: norma asociada la Ley 2094 del 2021, artículo 7Dependencia: Departamento Administrativo de Control Disciplinario Interno"
            },
            {
               nombre:"Queja",
               informacion:"Respuesta en 15 Días hábiles"
            },

        ]
   },

   Acciones:{

      nombre:"Acciones",
      tipos:[
         {
            nombre:"Acción cumplimiento",
            informacion:"Respuesta en 15 Días hábiles"
         },
         {
            nombre:"Acción Popular",
            informacion:"Respuesta en 15 Días hábiles"
         },
      ]

   },

   Recursos:{

      nombre:"Recursos",
      tipos:[
         {
            nombre:"Recurso Apelación",
            informacion:"Respuesta en 60 Días hábiles"
         },
         {
            nombre:"Recurso Reconsideración",
            informacion:"Respuesta en 365 Días hábiles"
         },
         {
            nombre:"Solicitudes de Revocatoria Directa",
            informacion:"Respuesta en 365 Días hábiles"
         },
         {
            nombre:"Recurso Repocición",
            informacion:"Respuesta en 60 Días hábileLey o Norma:"
         },
      ]

   },

   Tutelas:{

      nombre:"Tutelas",
      tipos:[

         {
            nombre:"Insidente de Desacato",
            informacion:"Respuesta en 15 Días hábiles"
         },
         {
            nombre:"Tutela",
            informacion:"Respuesta en 15 Días hábiles"
         },

      ]

   },

   Tramitesyservicios:{

      nombre:"Tramites y servicios",
      tipos:[
         {
            nombre:"Inscripción o autorización para la circulación vial",
            informacion:"Respuesta en 15 Días hábiles"
         },
         {
            nombre:"Plan de manejo de tránsito",
            informacion:"Respuesta en 15 Días hábiles"
         },
         {
            nombre:"Permiso con formalidades plenas para movilización de carga indivisible, extradimensionada y/o extrapesada",
            informacion:"Respuesta en 3 Días hábiles"
         },

      ]
   },

   Otros:{

      nombre:"Otros",
      tipos:[
          { 
            nombre:"Otros",
            informacion:""

          }
      ]

   }
    

};