<?php
abstract class SprocTest {
    // orchestration
    public function run_test(){
        utility_output_result($this->valid_type());
        utility_output_result($this->valid_storage());
        utility_output_result($this->check_for_nulls());
        utility_output_result($this->accurate_no_rows_returned());
        utility_output_result($this->live_tests());
    }
    //
    abstract protected function valid_type();
    /*
     * Takes in a stored procedure call and a list of column types. Checks each column matches the sql type.
     *
     * @param ($query) the stored procedure call
     * @param ($sproc_name) what is the stored procedure name
     * @param ($valid_types) the valid data types for the columns
     * @return (name)
     */
    public function valid_type_generic($query,$sproc_name,$valid_types){
        //run the store proc
        $test_result = "";
        $connection = utility_get_db_connection();
        $result = mysqli_query($connection, $query) or die("Error is " . print_r(mysqli_error( $GLOBALS["db"] )));
        // get the number of fields
        $number_of_fields = mysqli_num_fields($result);
        // Useful code for generating correct data types
        // for($i=0;$i<$number_of_fields;$i++){$type = return_type_for_mysql_type_static(mysqli_fetch_field($result)->type);print_r('"' . $type . '"' . ",");}
        // make sure this matches expectations
        if ($number_of_fields != count($valid_types)){
            $test_result .= "Stored procedure returned unexpected number of columns" . "\n";
        // make sure the result set isn't empty
        } else if ( mysqli_num_rows($result) == 0 ){
            $test_result .= "Stored procedure returned no data" . "\n";
        } else {
            for($i=0;$i<$number_of_fields;$i++){
                $field_information = mysqli_fetch_field($result);
                // translate type into a human friendly label
                $type = return_type_for_mysql_type_static($field_information->type);
                //print_r('"' . $type . '"' . ",");
                if ($type != $valid_types[$i]){
                    $test_result .= "Column " . $i . " expected " . $valid_types[$i] . " got " . $type  . "\n";
                }
            }
        }
        utility_close_db_connection($result,$connection);
        if ($test_result == ""){
            $test_result = "OK";
        }
        $test_result = $sproc_name . " results " . "valid_type:\n" . $test_result;  
        return $test_result;
    }
    
    abstract protected function valid_storage();
    /*
     * Takes in a stored procedure call and a list of column types. Checks each column matches the type. Type is defined as a specific implementation of a simple type. E.g. Checking that column is an email or file name.
     *
     * @param ($query) the stored procedure call
     * @param ($sproc_name) what is the stored procedure name
     * @param ($valid_storage) the valid storage types
     * @return (name)
     */
    public function valid_storage_generic($query,$sproc_name,$valid_storage){
        $test_result = "";
        //run the store proc
        $connection = utility_get_db_connection();
        $result = mysqli_query($connection, $query) or die("Error is " . print_r(mysqli_error( $GLOBALS["db"] )));
        // for each column, the valid types
        $row = mysqli_fetch_row($result);
        $rules_to_check = array_keys($valid_storage);
        foreach($rules_to_check as $rule){
            $rule = intval($rule);
            //echo $row[$rules_to_check] . ",";
            if ( !utility_check_if_valid_storage($valid_storage[$rule],$row[$rule]) ){
                $test_result .= "Column " . $i . " expected valid storage " . $valid_storage[$rules_to_check] . " got value " . $row[$rules_to_check]  . "\n";
            }
        }
        utility_close_db_connection($result,$connection);
        if ($test_result == ""){
            $test_result = "OK";
        }
        $test_result = $sproc_name . " results " . "valid_storage:\n" . $test_result;  
        return $test_result;
    }
    
    abstract protected function check_for_nulls();
    /*
     * Takes in a stored procedure call and a list of columns which should never be null
     *
     * @param ($query) the stored procedure call
     * @param ($sproc_name) what is the stored procedure name
     * @return (name)
     */
    public function check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows){
        //run the store proc
        $test_result = "";
        $connection = utility_get_db_connection();
        $result = mysqli_query($connection, $query) or die("Error is " . print_r(mysqli_error( $GLOBALS["db"] )));
        // for each column, the valid types
        $row_counter = 0;
        while($row = mysqli_fetch_row($result)){
            for($i=0;$i<count($no_nulls_allowed_in_these_rows);$i++){
                if ( in_array($i,$no_nulls_allowed_in_these_rows) ){
                    if ($row[$i] == null){
                        $test_result .= "Column " . $i . ", Row " . $row_counter . ", expected non null - got null" . "\n";
                    }
                }
            }
            $row_counter++;
        }
        utility_close_db_connection($result,$connection);
        if ($test_result == ""){
            $test_result = "OK";
        }
        $test_result = $sproc_name . " results " . "check_for_nulls:\n" . $test_result;  
        return $test_result;
    }
    
    abstract protected function accurate_no_rows_returned();
    /*
     * Takes in a stored procedure call armed with parameters which should return no rows.
     *
     * @param ($query) the stored procedure call
     * @param ($sproc_name) what is the stored procedure name
     * @return (name)
     */
    public function accurate_no_rows_returned_generic($query,$sproc_name){
        $test_result = "";
        //run the store proc
        $connection = utility_get_db_connection();
        $result = mysqli_query($connection, $query) or die("Error is " . print_r(mysqli_error( $GLOBALS["db"] )));
        if (mysqli_num_rows($result) != 0){
            $test_result .= "Expected no row to be returned. Instead got: " . $number_of_fields . "\n";
        }
        utility_close_db_connection($result,$connection);
        if ($test_result == ""){
            $test_result = "OK";
        }
        $test_result = $sproc_name . " results " . "accurate_no_rows_returned:\n" . $test_result;  
        return $test_result;
    }
    
    abstract protected function live_tests();
    /*
     * Takes in a stored procedure call and compares this against a simplified sql query which accomplishes the same thing.
     *
     * @param ($query) the stored procedure call
     * @param ($simplified_query) a simply query to compare the above against
     * @param ($sproc_name) what is the stored procedure name
     * @return (name)
     */
    public function live_tests_generic($query,$simplified_query,$sproc_name){
        $test_result = "";
        //run the store proc
        $connection = utility_get_db_connection();
        $result = mysqli_query($connection, $query) or die("Error is " . print_r(mysqli_error( $GLOBALS["db"] )));
        $number_of_sproc_rows = mysqli_num_rows($result);
        utility_close_db_connection($result,$connection);
        
        // run simple sql query
        $connection = utility_get_db_connection();
        $result = mysqli_query($connection, $simplified_query) or die("Error is " . print_r(mysqli_error( $GLOBALS["db"] )));
        $number_of_query_rows = mysqli_num_rows($result);
        utility_close_db_connection($result,$connection);
        // check stored procedure vs the simple query
        if ($number_of_query_rows != $number_of_sproc_rows){
            $test_result .= "Expected " . $number_of_query_rows . " rows but the stored procedure returned " . $number_of_sproc_rows . "\n";
        }
        if ($test_result == ""){
            $test_result = "OK";
        }
        $test_result = $sproc_name . " results " . "live_tests:\n" . $test_result;  
        return $test_result;
    }
}
?>
