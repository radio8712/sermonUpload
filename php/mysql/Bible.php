<?php error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once("db_conn.php");

// Create a class to handle MySQL access to the Bible database
class Bible {

	protected $db;
	public $id;

	public function __construct(PDO $database) {
		$this->db = $database;
	}

	function get_books() {
		$query = $this->db->prepare("SELECT bnum, bname FROM kjv_bookmap ORDER BY bnum");
		$query->execute();
		$books = $query->fetchAll(PDO::FETCH_ASSOC);

		return $books;
	}

	function get_chapters_by_book($book) {
		$query = $this->db->prepare("SELECT num_chaps FROM book_chap WHERE id=:book");
		$query->execute(array(":book" => $book));
		$chapNum = $query->fetch(PDO::FETCH_ASSOC);
		return $chapNum['num_chaps'];
	}
	
	function get_verses_by_chapter($book, $chapter) {
		$query = $this->db->prepare("SELECT cnum, COUNT(vnum) FROM kjv WHERE bnum=:book AND cnum=:chapter");
		$query->execute(array(":book" => $book, ":chapter" => $chapter));
		$verses = $query->fetchAll(PDO::FETCH_ASSOC);
		return $verses[0]['COUNT(vnum)'];
	}

	function get_verse_text($book, $startVerse, $startChapter, $endVerse, $endChapter = 0) {
		if ($endChapter == 0 || $endChapter <= $startChapter) {
			$endChapter = $startChapter;
			$query = $this->db->prepare("select vnum, vtext from kjv where bnum=:book and cnum=:startChapter and vnum>=:startVerse and vnum<=:endVerse");
			$query->execute(array(":book" => $book, ":startChapter" => $startChapter, ":startVerse" => $startVerse, ":endVerse" => $endVerse));
		} else {
			$query = $this->db->prepare("select vnum, vtext from kjv where bnum=:book and ((cnum=:startChapter and vnum>=:startVerse) or (cnum=:endChapter and vnum<=:endVerse) or (cnum>:startChapter and cnum<:endChapter))");
			$query->execute(array(":book" => $book, ":startChapter" => $startChapter, ":startVerse" => $startVerse, ":endChapter" => $endChapter, ":endVerse" => $endVerse));
		}
		$result = $query->fetchAll(PDO::FETCH_ASSOC);

		$search  = array('<','.>','[',']');
		$replace = array('<p><i>','.</i></p>|','<i>','</i>');

		$output = "";
		foreach ($result as $key => $verse)
		{
			$verse['vtext'] = str_replace($search, $replace, $verse['vtext']);
			if (stripos($verse['vtext'], "|") !== FALSE)
			{
				$verse['vtext'] = explode("|", $verse['vtext']);
				$output .= "<p>".$verse['vtext'][0]."</p><p>$verse[vnum]. ".$verse['vtext'][1]."</p>";
			}
			else $output .= "<p>$verse[vnum]. $verse[vtext]</p>";
		}
		return $output;

	}
}

?>