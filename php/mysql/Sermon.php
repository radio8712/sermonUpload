<?php error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once("db_conn.php");

class Sermon {

	protected $db;
	public $id;

	public function __construct(PDO $database) {
			$this->db = $database;
	}

	function add_sermon($date, $service, $speaker, $sermon_title, $book, $start_chap, $start_verse, $end_chap, $end_verse, $sermon_type, $special_info, $filename) {
		$query = $this->db->prepare("INSERT INTO archives
( date,  service,  speaker,  sermon_title,  book,  start_chap,  start_verse,  end_chap,  end_verse,  sermon_type,  special_info,  filename) VALUES
(:date, :service, :speaker, :sermon_title, :book, :start_chap, :start_verse, :end_chap, :end_verse, :sermon_type, :special_info, :filename)");
		$query->execute(array(":date"					=> $date,
													":service"			=> $service,
													":speaker"			=> $speaker,
													":sermon_title"	=> $sermon_title,
													":book"					=> $book,
													":start_chap"		=> $start_chap,
													":start_verse"	=> $start_verse,
													":end_chap"			=> $end_chap,
													":end_verse"		=> $end_verse,
													":sermon_type"	=> $sermon_type,
													":special_info"	=> $special_info,
													":filename"			=> $filename));
		return $this->db->lastInsertId();
	}

	function get_sermons() {
		$query = $this->db->prepare("SELECT speakers.speaker, titles.title, speakers.title_id, speakers.speaker_id FROM speakers JOIN titles ON titles.id = speakers.title_id");
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}
}

?>