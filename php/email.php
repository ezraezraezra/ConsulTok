<?php
/*
 * Project: ConsulTok
 * Description: E-commerce social shopping web app featuring the OpenTok & ShopSense APIs.
 * 
 * Author: Ezra Velazquez
 * Website: http://ezraezraezra.com
 * Date: July 2011
 * 
 */
	$to = $_POST['r_field'];
	$subject = 'ConsulTok Shopping Notes';
	$message = $_POST['m_field'];
	$from = $_POST['s_field'];
	$headers = "From your ConsulTok Consultant,";
	mail($to,$subject,$message,$headers);
?>