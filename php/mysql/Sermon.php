<?php 

error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once("db_conn.php");

// create a class to manage MySQL queries for Sermons
class Sermon {

	protected $db;
	public $id;

	public function __construct(PDO $database) {
			$this->db = $database;
	}

	function add_sermon($date, $day, $service, $speaker, $sermon_title, $book, $start_chap, $start_verse, $end_chap, $end_verse, $sermon_type, $special_info, $filename) {
		$query = $this->db->prepare("INSERT INTO archives
( date,  day,  service,  speaker,  sermon_title,  book,  start_chap,  start_verse,  end_chap,  end_verse,  sermon_type,  spec_info,  filename) VALUES
(:date, :day, :service, :speaker, :sermon_title, :book, :start_chap, :start_verse, :end_chap, :end_verse, :sermon_type, :spec_info, :filename)");
		$query->execute(array(":date"					=> $date,
													":day"					=> $day,
													":service"			=> $service,
													":speaker"			=> $speaker,
													":sermon_title"	=> $sermon_title,
													":book"					=> $book,
													":start_chap"		=> $start_chap,
													":start_verse"	=> $start_verse,
													":end_chap"			=> $end_chap,
													":end_verse"		=> $end_verse,
													":sermon_type"	=> $sermon_type,
													":spec_info"		=> $special_info,
													":filename"			=> $filename));
		return $query->errorCode();
	}

	function get_sermons() {
		$query = $this->db->prepare("SELECT archives.`date`, `day`, `service`, titles.`title`, speakers.`speaker`, `sermon_title`, `book`, `start_chap`, `start_verse`, `end_chap`, `end_verse`, types.`sermon_type`, `spec_info`, `filename`
FROM archives LEFT JOIN speakers ON archives.`speaker` = speakers.`speaker_id` 
LEFT JOIN titles ON speakers.`title_id` = titles.`id`
LEFT JOIN types ON archives.`sermon_type` = types.`type_id`");
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}
}

?>