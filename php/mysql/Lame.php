<?php error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once("db_conn.php");

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

//	$query = $this->localdb->prepare('INSERT INTO customer VALUES (NULL, :name, :email, NULL, :password, :dob, NULL, NULL, :subscription) ON DUPLICATE KEY UPDATE name=:name, email=:email, password=:password, birthdate=:dob, subscription=:subscription');
    return $this->localdb->lastInsertId();
  }
  function set_percent($id, $percent) {
  	$query = $this->localdb->prepare("UPDATE percent SET number=:percent WHERE id=:id");
  	$query->execute(array(":id" => $id, ":percent" => $percent));
  }

  function get_percent($id) {
  	$query = $this->localdb->prepare("Select number FROM percent WHERE id=:id");
  	$query->execute(array(":id" => $id));
  	return $query->fetch(PDO::FETCH_ASSOC);
  }
//   function set_email($id, $email) {
// 	  $query = $this->localdb->prepare('UPDATE customer SET email=:email WHERE id=:id');
// 	  $query->execute(array(':id' => $id, ':email' => $email ));
//   }
// 
//   function get_address($id) {
// 	  $query = $this->localdb->prepare('SELECT address.address, address2, city, state, zip, country FROM address JOIN customer_address ON address.id = customer_address.address WHERE customer_address.customer=:id');
// 	  $query->execute(array(':id' => $id));
// 	  return $query->fetch(PDO::FETCH_ASSOC);
//   }
}

?>