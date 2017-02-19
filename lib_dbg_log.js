// Class 'lib_dbg_log'
function lib_dbg_log()
{
  // import params
  
  // object functions
  this.create_log = lib_dbg_log_create_log.bind(this);
  this.add_entry = lib_dbg_log_add_entry.bind(this);
  this.create_email = lib_dbg_log_create_email.bind(this);
                    
  // object variables
  this.log_array = [];
  this.path = "";

  // constructor call
  this.create_log();
}



function lib_dbg_log_create_log()
{
  if (window.location.host == "localhost")  //  (this.data_src_path.toLowerCase() == "local")
  {
    this.path = "http://localhost/";    
  }
  else
  {
    var myPath = window.location.pathname;
    if (myPath.indexOf(".php") >= 0)
    {
      var lastSlashIdx =  myPath.lastIndexOf("/");
      myPath = myPath.substring(0, lastSlashIdx+1);
      this.path = "http://" + window.location.host + myPath;
    }
    else
      this.path = "http://" + window.location.host + window.location.pathname;    
  }
    
  var dateObj = document.getElementById('GLOBAL_DATE');
  var now = new Date();
  var new_log_entry = now.toLocaleString()+ ' | # LOG-START # | instance:' + this.path;
  
  this.log_array[this.log_array.length] = new_log_entry;
}


// get field content
function lib_dbg_log_add_entry(iparams)
{
                                    // if maximum number of log entries is reached -> kill oldest
  if (this.log_array.length > global_setup.dbg_log_max_entries)  
  {
    this.log_array.splice(0,1); 
  }
  var new_log_entry = "";
  var dateObj = document.getElementById('GLOBAL_DATE');
  var now = new Date();


  if (iparams.module == "uc_brow_disp_keyb_proc")
    new_log_entry = now.toLocaleString()+ ' | #' + iparams.module + '# | key:' + iparams.sub_function + ' | fctn keys:' + iparams.side_condition + ' | action:' + iparams.action;
  if (iparams.module == "uc_browsing_dispatcher_clicked_at")
    new_log_entry = now.toLocaleString()+ ' | #' + iparams.module + '# | sender:' + iparams.sender + ' | submodule:' + iparams.submodule + ' | item:' + iparams.item;
 
  
  this.log_array[this.log_array.length] = new_log_entry;
}


function lib_dbg_log_create_email()
{
  var message = "";
  for (var i=0; i<this.log_array.length; i++)
  {
    message = message + this.log_array[i] + '\\n';   // oder '\\n'
  }

//  var MailMSG = "mailto:allusion@gmx.de" 
//         + "?subject=[X-Tree-M Error Log]" 
//         + "&body=" + message; 
//  window.location.href = MailMSG; 

 
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    var xmlhttp = new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }


//  var path = "";
//  if (this.data_src_path.toLowerCase() == "local")
//  {
//    path = "http://" + window.location.host + window.location.pathname + this.data_src_params.php_name;
//  }
//  else
//  {
//    path = "http://" + this.data_src_path + "/" + this.data_src_params.php_name;
//  }
//  xhr.open("POST", path, true);
  
  

                                    // to make sure that the Browser doesn't use a cached version of the file
  var php_path = this.path+"lib_dbg_log2email.php";                                   
  xmlhttp.open("POST",php_path,true);
  // objHTTP.setRequestHeader("Content-Type", "application/xml; charset=utf-8");
  // objHTTP.setRequestHeader("Accept", "application/xml; charset=utf-8");
  // objHTTP.setRequestHeader("Content-Length", post_data.length);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(message);
}

 