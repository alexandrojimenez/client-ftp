<?php
class Connection
{
	private $hostname;
	private $id;

	public function __construct($hostname)
	{
		$this->hostname = $hostname;
		$this->id = ftp_connect($this->hostname);
	}

	public function connectionFTP($user, $password)
	{
		if(@ftp_login($this->id, $user, $password))
		{
			$_SESSION["ID"] = $this->id;
			$_SESSION["Hostname"] = $this->hostname;
			$_SESSION["User"] = $user;
			$_SESSION["Password"] = $password;
			//return TRUE;
			return $this->id;
		}
		else
		{
			return FALSE;
		}
	}
}


/*
function conectarFTP($server, $port, $user, $password, $mode){
	$id_ftp = ftp_connect($server,$port); // Obtiene un manejador del Servidor FTP
	ftp_login($id_ftp,$user,$password); //	Se loguea al srvidor FTP
	ftp_pasv($id_ftp, $mode);	// Activa el modo de conexion
	return $id_ftp; //	Devuelve el manejador del servidor.
}*/
?>
