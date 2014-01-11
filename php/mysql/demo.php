<?php

/**************************************************
*	Thom Williams
*	201102W0001
*	CET-482
*	Senior Project - Sermon Uploader
**************************************************/

error_reporting(E_ALL);
ini_set('display_errors', '1');
$require_once("db_conn.php");

// example template class
class MyNewClass {

	protected $db;
	public $id;

	public function __construct(PDO $database) {
			$this->db = $database;
	}

	// Add a new customer or update the localdb
	function set_and_get_id() {
		$query = $this->db->prepare('');
		$query->execute();
		return $this->db->lastInsertId();
	}

	function set_something() {
		$query = $this->db->prepare('');
		$query->execute();
	}

	function get_something($id) {
		$query = $this->db->prepare('');
		$query->execute(array(':id' => $id));
		return $query->fetch(PDO::FETCH_ASSOC);
	}
		
	function get_column($id) {
		$query = $this->db->prepare('');
		$query->execute(array(':id' => $id));
		return $query->fetch(PDO::FETCH_COLUMN);
	}
	
	function get_all_of_something($id) {
		$query = $this->db->prepare('');
		$query->execute(array(':id' => $id));
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}
}

?>