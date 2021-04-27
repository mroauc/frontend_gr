import Axios from "axios";
import html2pdf from "html2pdf.js";


async function finalizarGeneracionPDF(subProyectos, id_proyecto){
    const token = localStorage.getItem('token');
    var imprimir = '';
    var secciones = [];
    var nombreProyecto = '';

    await Axios.get(localStorage.getItem('url') + `/api/proyecto/${id_proyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
    .then(response=>{
        nombreProyecto = response.data.nombre;
    });

    await Axios.get(localStorage.getItem('url') + `/api/seccion/id_proyecto/${id_proyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
    .then(response=>{
        secciones = response.data;
    });

    imprimir = imprimir + '<div class="formatoProyecto"><div class="cabeceraProyecto"><h4>Proyecto <strong>'+ nombreProyecto +'</strong></h4></div>';
    for (let index = 0; index < secciones.length; index++) {            
        imprimir = imprimir+ '<strong>' + secciones[index].nombre_seccion + '</strong><br>' + secciones[index].contenido_seccion + '<br>';
    }
    imprimir = imprimir+'</div>';


    for (let index = 0; index < subProyectos.length; index++) {
        imprimir = imprimir + '<div class="formatoSubproyecto"><div class="cabeceraSubProyecto"><h4>Módulo <strong>'+ subProyectos[index].nombre_subProyecto +'</strong></h4></div>';
        await Axios.get(localStorage.getItem('url') + `/api/requerimiento/obtener/${subProyectos[index].id_subProyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            var rusa = response.data.filter(req => req.categoria === 'RUSA');
            var rusl = response.data.filter(req => req.categoria === 'RUSL');
            var rusj = response.data.filter(req => req.categoria === 'RUSJ');
            var rusc = response.data.filter(req => req.categoria === 'RUSC');
            var russ = response.data.filter(req => req.categoria === 'RUSS');
            var reqf = response.data.filter(req => req.categoria === 'REQF');
            var renf = response.data.filter(req => req.categoria === 'RENF');
            
            if(rusa.length > 0){
                imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Analista</h5></div><br>'; //apertura y cierre cabecera celeste
                for (let index = 0; index < rusa.length; index++) {    
                    imprimir = imprimir + '<strong>' + rusa[index].nombre + '</strong><br><br>' + rusa[index].descripcion + '<br>';
                }
                imprimir = imprimir + '</div>';
            }

            if(rusl.length > 0){
                imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Líder de Subproyecto</h5></div><br>'; //apertura y cierre cabecera celeste
                for (let index = 0; index < rusl.length; index++) {    
                    imprimir = imprimir + '<strong>' + rusl[index].nombre + '</strong><br><br>' + rusl[index].descripcion + '<br>';
                }
                imprimir = imprimir + '</div>';
            }

            if(rusj.length > 0){
                imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Jefe de Proyecto</h5></div><br>'; //apertura y cierre cabecera celeste
                for (let index = 0; index < rusj.length; index++) {    
                    imprimir = imprimir + '<strong>' + rusj[index].nombre + '</strong><br><br>' + rusj[index].descripcion + '<br>';
                }
                imprimir = imprimir + '</div>';
            }

            if(rusc.length > 0){
                imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Cliente</h5></div><br>'; //apertura y cierre cabecera celeste
                for (let index = 0; index < rusc.length; index++) {    
                    imprimir = imprimir + '<strong>' + rusc[index].nombre + '</strong><br><br>' + rusc[index].descripcion + '<br>';
                }
                imprimir = imprimir + '</div>';
            }

            if(russ.length > 0){
                imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Administrador del Sistema</h5></div><br>'; //apertura y cierre cabecera celeste
                for (let index = 0; index < russ.length; index++) {    
                    imprimir = imprimir + '<strong>' + russ[index].nombre + '</strong><br><br>' + russ[index].descripcion + '<br>';
                }
                imprimir = imprimir + '</div>';
            }

            if(reqf.length > 0){
                imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos Funcionales</h5></div><br>'; //apertura y cierre cabecera celeste
                for (let index = 0; index < reqf.length; index++) {    
                    imprimir = imprimir + '<strong>' + reqf[index].nombre + '</strong><br><br>' + reqf[index].descripcion + '<br>';
                }
                imprimir = imprimir + '</div>';
            }

            if(renf.length > 0){
                imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos No Funcionales</h5></div><br>'; //apertura y cierre cabecera celeste
                for (let index = 0; index < renf.length; index++) {    
                    imprimir = imprimir + '<strong>' + renf[index].nombre + '</strong><br><br>' + renf[index].descripcion + '<br>';
                }
                imprimir = imprimir + '</div>';
            }
        })
        imprimir = imprimir + '</div><br>';
    }

    var opt = {
        margin: 0.2,
        filename: 'documento_' + nombreProyecto + '.pdf',
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait', putOnlyUsedFonts: true},
        pagebreak: { mode: ['avoid-all', 'legacy'] }
    };

    html2pdf().from(imprimir).set(opt).save();
}

export default finalizarGeneracionPDF;