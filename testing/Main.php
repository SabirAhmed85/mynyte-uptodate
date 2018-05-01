<?php

/* This directory is scanned. Each file within it should confrom to the SprocTest interface 
 * Each file will execute the run_test function. This will execute a set of tests
 */

/* Config */

print_r("WELCOME TO THE MYNYTE STORED PROCEDURE TESTING SUITE\n");
print_r("All errors report columns and rows which are counter from 0. So Row 1, column 3 is the second row and fourth column.\n");
print_r("\n");

$dir = './Tests/';
include_once("SprocTest.php");
$test_files = scandir($dir);

foreach($test_files as $file){
  if( utility_stringEndsWith($file,".php") ){
    print_r("Running test file: " . $file);
    print_r("\n");
    require_once($dir . $file);
    $class = utility_strip_php_extension($file);
    $test_case = new $class();
    $test_case->run_test();
    print_r("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    print_r("\n");
  }
}

print_r("Finished\n");

// fin
mysqli_close($connection);

/* db helper */

function utility_get_db_connection(){
    $connection;
    /* DB Access */
    $server = "localhost";
    $db = utility_get_db();
    $db_user = "qxiryynz_testinguser";
    $db_pass = "z({c86pX@{x&";
    /* Check login ok */
    if( ! $connection = mysqli_connect($server,$db_user,$db_pass,$db) ) {
        print_r('No connection: ' . mysqli_connect_error());
        return null;
    } else {
        return $connection;   
    }
}

function utility_get_db(){
    return "qxiryynz_MyNyte";
}

function utility_close_db_connection($result,$connection){
    mysqli_free_result($result);
    mysqli_close($connection);
}

/* Various utility functions */

function utility_stringEndsWith($str, $test)
{
    return (strrpos($str, $test) == strlen($str) - strlen($test));
}

function utility_output_result($result){
    print_r($result . "\n");
}

function utility_strip_php_extension($fileName){
    return str_replace(".php", "", $fileName);
}

function utility_report_sql_error($fileName,$error){
    print_r($fileName . " MySQL Error: " . $error . "\n") ;
}

function utility_check_if_valid_storage($storage_type,$data){
    if ($storage_type == "IMAGEFILE"){
        if ($data === null){
            // null - no value set. Null values validity is not the job of this class.
            return true;
        } else {
            return (preg_match("/\.(gif|png|jpg|jpeg)$/", $data));
        }
    } else if ($storage_type == "EMAIL") {
        if($data === null){
            echo 'This test returned true, however, email addresses are often likely to be required to be non-null. In this case is has come back null.';
            return true;
        } else {
            return filter_var($data, FILTER_VALIDATE_EMAIL);
        }
        //echo 'HELLO:' . $data . (filter_var($data, FILTER_VALIDATE_EMAIL));
    } else {
        return true; // default
    }
}

function return_type_for_mysql_type_static($type_id){
    $mysql_types = array(
        "1" => "NOT_NULL_FLAG",
        "2" => "PRI_KEY_FLAG",
        "3" => "INTEGER",
        "4" => "MEDIUMINT",
        "5" => "DOUBLE",
        "7" => "TIMESTAMP",
        "8" => "BIGINT",
        "9" => "UNIQUE_KEY_FLAG",
        "10" => "DATETIME",
        "11" => "TIME",
        "13" => "YEAR",
        "12" => "UNIQUE_KEY_FLAG",
        "16" => "BLOB_FLAG",
        "32" => "UNSIGNED_FLAG",
        "64" => "ZEROFILL_FLAG",
        "128" => "BINARY_FLAG",
        "252" => "BLOB",
        "253" => "STRING",
        "254" => "CHAR",
        "256" => "ENUM_FLAG",
        "612" => "AUTO_INCREMENT_FLAG",
        "1024" => "TIMESTAMP_FLAG",
        "2048" => "SET_FLAG",
        "32768" => "NUM_FLAG",
        "16384" => "PART_KEY_FLAG",
        "65536" => "UNIQUE_FLAG"
    );
    $type_id = $type_id . "";//stringify 
    return $mysql_types[$type_id];
}

?>
