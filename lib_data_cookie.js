// http://codeinthehole.com/writing/javascript-cookie-objects-using-prototype-and-json/
// http://www.phpied.com/json-javascript-cookies/
// https://ananti.wordpress.com/2013/03/16/cookie-using-json-format-javascript/
// http://techpatterns.com/downloads/javascript_cookies.php
// http://www.quirksmode.org/js/cookies.html

function lib_data_cookie(tool, path, submodule)
{
 
  // object functions
  this.write = lib_data_cookie_write.bind(this);
  this.read = lib_data_cookie_read.bind(this); 
  this.delete = lib_data_cookie_delete.bind(this);

  if (path != "")
    this.cookie_name = tool + "_" + path + "_" + submodule;
  else
    this.cookie_name = tool + "_" + submodule;
}


function lib_data_cookie_write(elem_name, value) 
{
//  alert("4c");
	var years = 1;
	var date = new Date();
//  alert("4d");	
	date.setTime(date.getTime()+(years*366*24*60*60*1000));
//	alert("4e");
	var expires = "; expires="+date.toGMTString();
//	alert("4f");
//	alert(this.cookie_name + "_" + elem_name+"="+escape(JSON.stringify(value))+expires+"; path=localhost/");
  var my_json_text = JSON.stringify(value); 
  var cookie_raw_data = this.cookie_name + "_" + elem_name+"="+escape(my_json_text)+expires+"; path=localhost/";
	document.cookie = cookie_raw_data;
//	document.cookie = this.cookie_name + "_" + elem_name+"="+escape(value)+expires+"; path=localhost/";  
//  alert("4g");
}


function lib_data_cookie_read(elem_name) 
{  
//  alert("2a");
	var ca = document.cookie.split(';');
//	alert(ca);
//  alert("2b");	
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		var my_str = this.cookie_name + "_" + elem_name;
		if (c.indexOf(my_str) == 0) 
		{
//		  alert("Cookie-Wert : "+ c.substring(my_str.length+1,c.length));
//		  return unescape(c.substring(my_str.length+1,c.length));  // 
		  return JSON.parse(unescape(c.substring(my_str.length+1,c.length))); 
		}
	}
//  alert("2c");
	return null;
}


function lib_data_cookie_delete(elem_name) 
{
//  alert("4c");
	var years = 1;
	var date = new Date();
//  alert("4d");	
                                    // set date in the past to make this Cookie expire
	date.setTime(date.getTime()-(years*366*24*60*60*1000));
//	alert("4e");
	var expires = "; expires="+date.toGMTString();
//	alert("4f");
//	alert(this.cookie_name + "_" + elem_name+"="+escape(JSON.stringify(""))+expires+"; path=localhost/");
	document.cookie = this.cookie_name + "_" + elem_name+"="+escape(JSON.stringify(""))+expires+"; path=localhost/";  
//  alert("4g");
}