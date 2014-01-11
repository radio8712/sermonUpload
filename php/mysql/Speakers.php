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

// create a class to manage MySQL queries for Speakers
class Speaker {

	protected $db;
	public $id;

	public function __construct(PDO $database) {
			$this->db = $database;
	}

	function add_new_speaker($title_id, $name) {
		$query = $this->db->prepare("INSERT INTO speakers (title_id, speaker) VALUES (:title_id, :name)");
		$query->execute(array(":title_id" => $title_id, ":name" => $name));
		return $this->db->lastInsertId();
	}

	function get_speakers() {
		$query = $this->db->prepare("SELECT speakers.speaker, titles.title, speakers.title_id, speakers.speaker_id FROM speakers JOIN titles ON titles.id = speakers.title_id");
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}

	function get_speaker_by_name($name) {
		$query = $this->db->prepare("SELECT speakers.speaker, titles.title, speakers.title_id FROM speakers JOIN titles ON titles.id = speakers.title_id WHERE speakers.speaker LIKE :name");
		$query->execute(array(":name" => $name));
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}

	function get_sermon_types() {
		$query = $this->db->prepare("select type_id, sermon_type from types order by type_id");
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);

	}


}

?>