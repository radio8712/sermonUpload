<?php

// Local Onsite database
$host1	= "localhost";
$user1	= "thom";
$pass1	= "lepricon";
$db1		= "sermon";

// Remote web database
$host2	= "localhost";
$user2	= "thom";
$pass2	= "lepricon";
$db2		= "sermon2";

// Connect to an ODBC database using driver invocation
$dsn1 = 'mysql:dbname='.$db1.';host='.$host1;
$dsn2 = 'mysql:dbname='.$db2.';host='.$host2;

// Make sure the connections succeeded
try {
		$olddb = new PDO($dsn1, $user1, $pass1);
} catch (PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
}

try {
		$newdb = new PDO($dsn2, $user2, $pass2);
} catch (PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
}

$archive_q = $olddb->prepare("SELECT * FROM archives");
$archive_q->execute();
$archives = $archive_q->fetchAll(PDO::FETCH_ASSOC);

$speaker_q = $olddb->prepare("SELECT * FROM speakers");
$speaker_q->execute();
$speakers = $speaker_q->fetchAll(PDO::FETCH_ASSOC);

$type_q = $newdb->prepare("SELECT * FROM types ORDER BY type_id");
$type_q->execute();
$types = $type_q->fetchAll(PDO::FETCH_ASSOC);

$bible_q = $newdb->prepare("SELECT * FROM book_chap");
$bible_q->execute();
$bible_array = $bible_q->fetchAll(PDO::FETCH_ASSOC);

$bible_map = array();
$type_map = array();

foreach($bible_array as $i => $book) {
	$bible_map[$book['book']] = $book['id'];
	$bible_map[$book['abbrev']] = $book['id'];
}

foreach($types as $i => $type) {
	$type_map[$type['sermon_type']] = $type['type_id'];
}

$type_map[""] = 1;
$type_map["Acostic"] = 1;
$type_map["Anger"] = 1;
$type_map["Bitterness"] = 1;
$type_map["Blessings"] = 1;
$type_map["Boldness"] = 1;
$type_map["Christian Maturity"] = 29;
$type_map["Christian Testimony"] = 1;
$type_map["Christmas"] = 25;
$type_map["Church History"] = 1;
$type_map["Coveteousness"] = 1;
$type_map["Crucifiction"] = 15;
$type_map["Doctrinal"] = 4;
$type_map["Encouragement"] = 1;
$type_map["Explaination"] = 1;
$type_map["Fruit of The Spirit"] = 10;
$type_map["God promises"] = 11;
$type_map["God's Power"] = 1;
$type_map["God's will"] = 12;
$type_map["Government"] = 1;
$type_map["Graduation"] = 25;
$type_map["Greatness of God"] = 1;
$type_map["Hell"] = 1;
$type_map["Holy Spirit"] = 1;
$type_map["Money/Treasure"] = 1;
$type_map["Mother's Day"] = 25;
$type_map["Motivational"] = 1;
$type_map["Music"] = 1;
$type_map["My complaints"] = 1;
$type_map["Christian Living/My complaints"] = 1;
$type_map["Parenting"] = 1;
$type_map["Patriotic"] = 25;
$type_map["Persecution"] = 28;
$type_map["Preachers"] = 1;
$type_map["Reformers Unanimous"] = 21;
$type_map["Salvation"] = 24;
$type_map["Christian Living/ Salvation"] = 24;
$type_map["Spiritual Gifts"] = 26;
$type_map["Spiritual Growth"] = 29;
$type_map["Spiritual Warfare"] = 28;
$type_map["Testimonies"] = 25;
$type_map["The End Times"] = 5;
$type_map["The Gospel"] = 7;
$type_map["The Judgement Seat of Christ"] = 5;
$type_map["The Lord's Supper"] = 4;
$type_map["The Enemy"] = 28;
$type_map["Trials"] = 28;
$type_map["Trusting God"] = 8;


/*
$bible_map
1 Cor
Psalm
2 Cor
Gal 
Psalm
Joe
Prov
1 King
Psalm
Prov
Matt
Part 2
Mar
Mar
Jdg
*/


foreach($archives as $i => $archive) {
	if ($i > -1) {
/* 		echo "id: $i<br>"; */
		foreach($archive as $key => $value) {
/*
			if ($key == "service") {
				$temp = substr($value, 3);
				switch ($temp) {
					case "am":
						$service = "m";
						break;
					default;
						$service = "e";
						break;
				}
				echo "$key: $service<br>";
			} else if ($key == "date") {
				echo "$key: $value<br>";
				echo "day: ".date("D", strtotime($value))."<br>";
			} else if ($key == "sermon_type") {
				if (isset($type_map[$value])) {
					echo "$key: ".$type_map[$value]."<br>";
				} else {
					echo "$key: $value<br>";
				}
			} else if ($key == "speaker") {
				$pastorRegEx = "/\bp[astore]{2,6}\b\ /i";
				$evangelistRegEx = "/\be[vangelist]{4,10}\b\ /i";
				$missionaryRegEx = "/\bm[isonarye]{2,11}\b\ /i";
				$otherRegEx = "/(\bm[isonarye]{2,11}\b|\bp[astore]{2,6}\b|\be[vangelist]{4,10}\b|\bb[rothers]{2,7}\b\.?|\bd[octers.]{1,6}\b\.?)/i";
				echo "$key: ";
				if (preg_match($pastorRegEx, $value)) {
					$value = preg_replace($pastorRegEx, "", $value);
					echo "1 $value<br>";
				} else if (preg_match($evangelistRegEx, $value)) {
					$value = preg_replace($evangelistRegEx, "", $value);
					echo "2 $value<br>";
				} else if (preg_match($missionaryRegEx, $value)) {
					$value = preg_replace($missionaryRegEx, "", $value);
					echo "3 $value<br>";
				} else {
					$value = preg_replace($otherRegEx, "", $value);
					echo "3 $value<br>";
				}
*/
/* 			} else */ if ($key == "text") {
				$value = explode(",", $value);
				$value = explode(":", $value[0]);
				if ($value[0] == "0 0") {
					$value = array(0 => "Gen 1", 1 => "1");
				}
				$value[0] = str_replace(".", " ", $value[0]);
				$book = explode(" ", $value[0]);
				if (count($book) > 2) {
					$book = $book[0]." ".$book[1];
				} else {
					$book = $book[0];
				}
				if (isset($bible_map[$book])) {
/* 					echo $bible_map[$book]."<br>"; */
				} else {

// Need to add missing books to the bible_map array

					echo "$book<br>";
				}
/* 				echo $book[0]."<br>"; */
/*
			} else {
				echo "$key: $value<br>";
*/
			}
		}
/* 		echo "<br>"; */
	}
}


/* print_r($archives); */
/* print_r($speakers); */
/* print_r($types); */

/*
archives
speakers
titles
types
*/


/*
archives:
	id: int,
	date: date,
	day: varchar(3),
	service: enum(m,a,e),
	speaker: int,
	sermon_title: varchar(255),
	book: int(2),
	start_chap: int(3),
	start_verse: int(3),
	end_chap: int(3),
	end_verse: int(3),
	sermon_type: int(5),
	spec_info: varchar(255),
	filename: varchar(255),
*/

/*
speakers:
	speaker_id: int,
	title_id: int,
	speaker: varchar(100),
*/

/*
titles:
	id: int,
	title: varchar(50),
*/

/*
types:
	type_id: int,
	sermon_type: varchar(50),
	checked: bool,
*/


/*
book_chap
kjv
kjv_bookmap
percent
*/

?>