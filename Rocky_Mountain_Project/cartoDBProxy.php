<?php
    session_cache_limiter('nocache');
    $cache_limiter = session_cache_limiter();
    function goProxy($dataURL)
    {
        $baseURL = 'http://willoughby2.cartodb.com/api/v2/sql?';
        //                  ^ CHANGE THE 'CARTODB-USER-NAME' to your cartoDB url!
        $api = '&api_key=0PKZhjNAs2diwwzAadUkhQ';
        //             ^ENTER YOUR API KEY HERE!
        $url = $baseURL.'q='.urlencode($dataURL).$api;
        $result = file_get_contents ($url);
        return $result;
    }
?>
