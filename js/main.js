///////////////////////////////
//          VARIABLES        //
///////////////////////////////

var path;
var host;
var user;
var pass;
var stream;
var list = new Array();

$(document).ready(function(){

    ///////////////////////////////
    //          SING IN          //
    ///////////////////////////////

     $("#ventana-sesion").fadeIn();
     $("#connect").click(function(){
         var arrayFormulario = new FormData(document.getElementById("form-connection"));
         arrayFormulario.append("type" , "connection");
         $.ajax({
             url: "php/main.php",
             type: "post",
             datatype: "html",
             data: arrayFormulario,
             cache: false,
             contentType: false,
             processData: false,
             success:function(result){
                 //alert(result);
                 if(result){
                     updateTable(result);
                     $('#host-label').text($('#host').val());
                     $('#port-label').text('21');
                     $('#path-label').text('/');
                     path = '/';
                     list.push('/');
                     host = $('#host').val();
                     user = $('#user').val();
                     pass = $('#password').val();
                     $("#ventana-sesion").fadeOut(300);
                 }// Si no hay conexion abre un mensaje
                 else{
                     alert("Error en la conexion : "+ result);
                 }

             }

         }).done( function() {
             //alert( 'Success!!' );
         }).fail( function(jqXHR, textStatus, errorThrown) {
             alert( 'jqXHR: '+jqXHR );
             alert( 'textStatus: '+textStatus );
             alert( 'errorThrown: '+errorThrown );
         });
     });

    ///////////////////////////////
    //          DELETE           //
    ///////////////////////////////

    $('#form-delete').on("submit", function(evento){
        evento.preventDefault();
        var formData = new FormData(document.getElementById("form-delete"));
        var listToString =list.toString();
        formData.append("host" , host);
        formData.append("user" , user);
        formData.append("password" , pass);
        formData.append("path" , listToString);
        formData.append('type', 'delete');
        $.ajax({
            url: "php/main.php",
            type: "post",
            datatype: "html",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                alert("File deleted!");
                updateTable(data);
            }
        })
    });

    ///////////////////////////////
    //      NEW FOLDER           //
    ///////////////////////////////

    $('#form-new-folder').on("submit",function(evento){
        evento.preventDefault();
        var datos = new FormData(document.getElementById("form-new-folder"));
        var listToString =list.toString();
        datos.append("host" , host);
        datos.append("user" , user);
        datos.append("password" , pass);
        datos.append("path" , listToString);
        //alert(listToString);
        //alert(document.getElementsByName("name-new-folder")[0].value);
        datos.append("type" , "create-folder");
        $.ajax({
            url: "php/main.php",
            type: "post",
            datatype: "html",
            data: datos,
            cache: false,
            contentType: false,
            processData: false,
            success:function(result){
                alert("new folder created!");
                updateTable(result);
            }

        })
    });

    ///////////////////////////////
    //        UPLOAD             //
    ///////////////////////////////

    $("#formUploadAjax").on("submit", function(evento){
        evento.preventDefault();
        var formData = new FormData(document.getElementById("formUploadAjax"));
        var listToString =list.toString();
        formData.append("host" , host);
        formData.append("user" , user);
        formData.append("password" , pass);
        formData.append("path" , listToString);
        formData.append('type', 'upload');
        $.ajax({
            url: "php/main.php",
            type: "post",
            datatype: "html",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                alert("File uploaded");
                updateTable(data);
            }
        })
    });

    ///////////////////////////////
    //          DOWNLOAD         //
    ///////////////////////////////

    $("#form-download").on("submit", function(evento){
        evento.preventDefault();
        var formData = new FormData(document.getElementById("form-download"));
        var listToString =list.toString();
        formData.append("host" , host);
        formData.append("user" , user);
        formData.append("password" , pass);
        formData.append("path" , listToString);
        formData.append('type', 'download');
        $.ajax({
            url: "php/main.php",
            type: "post",
            datatype: "html",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                alert("File downloaded");
            }
        })
    });

    ///////////////////////////////
    //          SING IN          //
    ///////////////////////////////

    $('#sing-out').click(function() {
           // Recargo la página
           location.reload();
       });

}); // FIN DEL .ready

///////////////////////////////
//  OPEN AND CLOSE FOLDER    //
///////////////////////////////

function openFolder(nameFolder){
    var direc = "";
    if(list.length == 1){
        direc = nameFolder+'/';
    }else {
        direc = '/'+nameFolder+'/';
    }
    list.push(direc);
    var listToString =list.toString();
    var datos = new FormData();
    datos.append("host" , host);
    datos.append("user" , user);
    datos.append("password" , pass);
    datos.append("type", "open-folder");
    datos.append("path", listToString);
    $.ajax({
        url: "php/main.php",
        type: "post",
        datatype: "html",
        data: datos,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            //alert(data);
            updateTable(data);
            var temp = "";
            for (var i = 0; i < list.length; i++) {
                temp += list[i];
            }
            $('#path-label').text(temp);
        }
    })
}

function back(){
    list.pop();
    var listToString =list.toString();
    var datos = new FormData();
    datos.append("host" , host);
    datos.append("user" , user);
    datos.append("password" , pass);
    datos.append("type", "back");
    datos.append("path", listToString);
    $.ajax({
        url: "php/main.php",
        type: "post",
        datatype: "html",
        data: datos,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            //alert(data);
            updateTable(data);
            var temp = "";
            for (var i = 0; i < list.length; i++) {
                temp += list[i];
            }
            $('#path-label').text(temp);
        }
    })
}

///////////////////////////////
//          METHODS          //
///////////////////////////////
function updateTable(listFiles){
    var temp = new Array();
    temp = JSON.parse(listFiles);
    $("#tableList").empty();
    var rows = '<tr ><th>Type</th><th>Name</th><th>Size</th><th>Date</th><th>Permissions</th><th>Download</th><th>Delete</th></tr>';
    if(list.length > 1){
        rows +='<tr><td><i class="fa fa-caret-left" aria-hidden="true"></i></td><td><button class="btn-link open-folder" onClick=back();>back</button></td><td></td>'
                            +'<td></td>'
                            +'<td></td>'
                            +'<td></td>'
                            +'<td></td>'
                        +'</tr>';
    }
    $.each(temp, function (ind, elem) {
            if(elem[0] == "-"){
                rows += '<tr>'
                        +'<td>'
                            +'<i class="fa fa-file-text-o" aria-hidden="true"></i>'
                        +'</td>'
                        +'<td>'+elem[1]+'</td>'
                        +'<td>'+elem[2]+'</td>'
                        +'<td>'+elem[3]+'</td>'
                        +'<td>'+elem[4]+'</td>'
                        +'<td>'
                        +"<button class=\"btn btn-default btn-xs\" data-toggle=\"modal\" data-target=\"#ventana-download\" onClick=\"btnDownloadFile('"+elem[1]+"');\">Download</button>"
                        +'</td>'
                        +'<td>'
                        +"<button class=\"btn btn-default btn-xs\" data-toggle=\"modal\" data-target=\"#ventana-delete\" onClick=\"btnDeleteFile('"+elem[1]+"');\">Delete</button>"
                                +'</td>'
                            +'</tr>';
            }
            //si es un folder
            if (elem[0] == "d") {
                rows += '<tr>'
                                    +'<td>'
                                        +'<i class="fa fa-folder-o" aria-hidden="true"></i>'
                                    +'</td>'
                                    +'<td>'
                                        +'<button class="btn-link open-folder" value="'+elem[1]+'" onClick=openFolder("'+elem[1]+'");>'+elem[1]+'</button>'
                                    +'</td>'
                                    +'<td>'+elem[2]+'</td>'
                                    +'<td>'+elem[3]+'</td>'
                                    +'<td>'+elem[4]+'</td>'
                                    +'<td></td>'
                                    +'<td></td>'
                                +'</tr>';


            }
        //}
    });
    $(rows).appendTo("#tableList");
}

function btnDeleteFile(name){
    document.getElementById("name-file").value = name;
}

function btnDownloadFile(nameFile){
    //alert(nameFile);
    document.getElementById("fileToDownload").value = nameFile;
}
