<?php

/**************************************************
*	Thom Williams
*	201102W0001
*	CET-482
*	Senior Project - Sermon Uploader
**************************************************/

error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once("db_conn.php");

// create a class to manage MySQL queries for the file conversion process
// This class allows the file conversion progress bar to update
class Lame {

	protected $localdb;
	protected $remotedb;
	public $id;

	public function __construct(PDO $local_db) {
		$this->localdb = $local_db;
	}

	// Initialize the table with a new percentage marker and return the resulting ID
	function init() {
	$query = $this->localdb->prepare('INSERT INTO percent VALUES (NULL, 0)');
	$query->execute();
		return $this->localdb->lastInsertId();
	}
	function set_percent($id, $percent) {
		$query = $this->localdb->prepare("UPDATE percent SET number=:percent WHERE id=:id");
		$query->execute(array(":id" => $id, ":percent" => $percent));
	}

	function get_percent($id) {
		$query = $this->localdb->prepare("SELECT number FROM percent WHERE id=:id");
		$query->execute(array(":id" => $id));
		return $query->fetch(PDO::FETCH_ASSOC);
	}
	
	function remove_id($id) {
		$query = $this->localdb->prepare("DELETE FROM percent WHERE id IN (:id)");
		$query->execute(array(":id" => $id));
		return $query->errorCode();
	}
}

?>