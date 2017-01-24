<?php
include "Connection.php";

//////////////////////////////////////////////////////////////////////////////
//                          FUNCTIONS                                       //
//////////////////////////////////////////////////////////////////////////////
function getDateFTP($name){
    return date("d/m/y h:i:s", ftp_mdtm($_SESSION["ID"], $name));
}

function getTypeFTP($name){
    $var = "";
    $size = ftp_size($_SESSION["ID"], $name);
    if($size == -1)
    {
        $var = "d";
    }
    else
    {
        $var = "-";
    }
    return $var;
}

function getPermissions($line){
    return substr($line[0], 1, 10);
}

function getName($line){
    $name = "";
    for($iX = 8; $iX < count($line); $iX++)
    {
        $name = $name . $line[$iX] . " ";
    }
    return trim($name);
}

function getSize($name){
    if(ftp_size($_SESSION["ID"], $name) > -1)
    {
        return ftp_size($_SESSION["ID"], $name);
    }
    else
    {
        return getFolderSize($name);
    }
}

function getFolderSize($name){
    $size = 0;
    $files = ftp_nlist($_SESSION["ID"], $name);
    if($files)
    {
        foreach ($files as $file)
        {
            $fileSize = getSize($file);
            if($fileSize != -1)
            {
                $size += $fileSize;
            }
        }
    }
    return $size;
}

function getFormatSize($size){

    if($size >= 0 && $size < 1024)
    {
        return number_format($size, 2, ".", ",") . " B";
    }
    else if($size >= 1024 && $size < 1048576)
    {
        return number_format(($size / 1024), 2, ".", ",") . " KB";
    }
    else if($size >= 1048576 && $size < 1073741824)
    {
        return number_format(($size / 1048576), 2, ".", ",") . " MB";
    }
    else if($size >= 1073741824)
    {
        return number_format(($size / 1073741824), 2, ".", ",") . " GB";
    }
    else if($size < 0)
    {
        return "0";
    }
}

function getFile($line){
    $array = array();
    $formatLine = preg_replace('/\s+/', ' ', $line);
    $arrayFormatLine = explode(" ", $formatLine);

    array_push($array, getTypeFTP(getName($arrayFormatLine)));
    array_push($array, getName($arrayFormatLine));
    array_push($array, getFormatSize(getSize(getName($arrayFormatLine))));
    array_push($array, getDateFTP(getName($arrayFormatLine)));
    array_push($array, getPermissions($arrayFormatLine));
    return $array;
}

function getFiles(){
    $list = ftp_rawlist($_SESSION["ID"], ftp_pwd($_SESSION["ID"]));
    $array = array();
    foreach ($list as $value)
    {
        $line = getFile($value);
        array_push($array, $line);
    }
    return $array;
}

function changeDirectory($arrayListDirectory){
    $directory = "";
	foreach ($arrayListDirectory as $key => $value)
	{
		$directory = $directory . $value;
	}
    ftp_chdir($_SESSION["ID"], $directory);
}

function uploadFile($file, $temp){
    ftp_pasv($_SESSION["ID"], true);
    $res = ftp_put($_SESSION["ID"], $file, $temp, FTP_BINARY)or die("Unable to upload");
    return $res;
}

function downloadFile($localPath, $remotoPath, $nameFile)
{
    ftp_get($_SESSION["ID"], $localPath . $nameFile, $remotoPath . $nameFile, FTP_BINARY, 0);

}

function deleteFile($file){
    ftp_delete($_SESSION["ID"], $file);
}

function createFolder($folder, $path){
    ftp_mkdir($_SESSION["ID"], $path.$folder);
}

//////////////////////////////////////////////////////////////////////////////
//                               MAIN                                       //
//////////////////////////////////////////////////////////////////////////////

if(!isset($_SESSION["ID"]))
{
    $connection = new Connection($_POST['host']);
    $id_connect = $connection->connectionFTP($_POST["user"], $_POST["password"]);
}
    /******** REALIZAR LA CONEXION *********************/
    if ($_POST['type'] == "connection") {
        $connection = new Connection($_POST['host']);
        $id_connect = $connection->connectionFTP($_POST["user"], $_POST["password"]);

        if ($id_connect) {
            $files = array();
            $files = getFiles();
            echo json_encode($files);
        }else {
            echo "ERROR DE CONEXION ";
        }

    /********  UPLOAD FILE    ****************/
    }elseif ($_POST['type'] == "upload") {
        $list =$_POST['path'];
        $arrayList = explode(',',$list);
        changeDirectory($arrayList);
        $res = uploadFile($_FILES['archivo']['name'], $_FILES['archivo']['tmp_name']);
        $files = array();
        $files = getFiles();
        echo json_encode($files);

    /********  DOWNLOAD FILE    **********/
    }elseif ($_POST['type'] == "download") {
        $list =$_POST['path'];
        $arrayList = explode(',',$list);
        $temp = "";
        for ($i=0; $i < count($arrayList); $i++) {
            $temp = $temp.$arrayList[$i];
        }
        changeDirectory($arrayList);
        downloadFile($_POST['local-path'], $temp, $_POST['name-file']);

    /******* DELETE FILE ******************/
    }elseif ($_POST['type'] == "delete") {
        $list =$_POST['path'];
        $arrayList = explode(',',$list);
        changeDirectory($arrayList);
        deleteFile($_POST['name-file']);
        $files = array();
        $files = getFiles();
        echo json_encode($files);

    /*********** CREATE NEW FOLDER *************/
    }elseif($_POST['type'] == "create-folder"){
        $list =$_POST['path'];
        $arrayList = explode(',',$list);
        $temp = "";
        for ($i=0; $i < count($arrayList); $i++) {
            $temp = $temp.$arrayList[$i];
        }
        changeDirectory($arrayList);
        createFolder($_POST['name-new-folder'], $temp);
        $files = array();
        $files = getFiles();
        echo json_encode($files);

    /********** OPEN FOLDER   ****************/
    }elseif ($_POST['type'] == "open-folder") {
        $list =$_POST['path'];
        $arrayList = explode(',',$list);
        changeDirectory($arrayList);
        $files = array();
        $files = getFiles();
        echo json_encode($files);

    /************* BACK *******************/
    }elseif ($_POST['type'] == "back") {
        $list =$_POST['path'];
        $arrayList = explode(',',$list);
        changeDirectory($arrayList);
        $files = array();
        $files = getFiles();
        echo json_encode($files);
    }

 ?>
