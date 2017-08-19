<?php
  Auth::routes();
  Route::post('post/add', 'PostsController@add')->middleware('auth');
  Route::post('post/add', function() {
    return 'Post added';
  });
  
  header("Content-Type:application/json; charset=utf-8");
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  // json response array
  $locate = $_POST['post_data']." 주변 지하철역";
  $client_id = "7rxySx5aIRXRGtWXULIS";
  $client_secret = "JGkB8R8zo5";
  $encText = urlencode($locate);
  $url = "https://openapi.naver.com/v1/search/local.json?&query=".$encText; // json 결과

  $is_post = false;
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, $is_post);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $headers = array();
  $headers[] = "X-Naver-Client-Id: ".$client_id;
  $headers[] = "X-Naver-Client-Secret: ".$client_secret;
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  $response = curl_exec ($ch);
  $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

  if($status_code == 200) {
     echo $response;
    //echo "dddd";
    //echo json_encode($response,JSON_UNESCAPED_UNICODE);
  } else {
    echo "Error 내용:".$response;
  }
  curl_close ($ch);
?>
