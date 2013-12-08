/****************************************************************** 
 * Name         :   Ajax.JS
 * Purpose      :   This module is a library of Ajax functions
 *                  and works as low level driver to access the 
 *                  framework database of a discussion system. It 
 *                  takes care of low level communication problems
 *                  and throws back its own status IDs. It is an 
 *                  abstraction layer regarding the database commu-
 *                  nication.
 * History      :
 *      2013/09/15  wi      Created
 ******************************************************************/  


// status return codes from database
var done = 4, ok = 200, created = 201, deleted = 204;

// status return codes to upper level
var ajax_ret_ok = 0;
var ajax_ret_error = 1;
var ajax_ret_not_avail = 2;



// global module variables
var httpRequestObject = NULL;
var newId = -1;
var returnedEntity = "Spaß!";


// handles several compatibility problems among Browsers regarding 
// the creation of an XMLHttpRequest object
function create_XMLHttpRequestObject()
{
    if (httpRequestObject == NULL)
    {
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          httpRequestObject = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
          try {
            httpRequestObject = new ActiveXObject("Msxml2.XMLHTTP");
          } 
          catch (e) {
            try {
              httpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
            } 
            catch (e) {}
          }
        }
    
        if (!httpRequestObject) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
          return NULL;
        }
    }
    return httpRequestObject; 
}


// send Post to write Entity to database
function ajaxPostEntity(entityType, jsonContent, callbackFunction)
{ 
    if (debugMode) { alert('Entering "ajaxPostEntity"'); }
    newId = -1;
    var messageStr = JSON.stringify( jsonContent );    
    var http_request = create_XMLHttpRequestObject();
    http_request.open("POST", databaseUrl + "/api/odata/" + entityType, true);
    http_request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    http_request.setRequestHeader('Content-Length', messageStr.length);    
    http_request.onreadystatechange = function ()
    {
        if (debugMode) { alert('Entering "onreadystatechange"'); }
        var myStatus = http_request.status;        
        
        if (http_request.readyState == done) 
        {
            if (myStatus == created)
            {
                if (debugMode) { alert("POST response : " + http_request.responseText); }
                callbackFunction(http_request.responseText);
            }
            else
            {
                                    // http://msdn.microsoft.com/en-us/library/windows/desktop/ms767625%28v=vs.85%29.aspx
                alert("POST failed : "+http_request.status);
                callbackFunction("#ERROR#");
            }
        }
    };
    http_request.send(messageStr);
} 


// read content of Entity
function ajaxGetEntity(entityType, id, callbackFunction)
{
    if (debugMode) { alert('Entering "ajaxGetEntity"'); }
    returnedEntity = null;
    var http_request = create_XMLHttpRequestObject();
    if (http_request == null)
        alert("Request Object not created !");
    try
    {
        http_request.open("GET", databaseUrl + "/api/odata/" + entityType + "(" + new String(id) + ")", true);
        http_request.onreadystatechange = 
            function () 
            {
                if (debugMode) { alert('Entering "onreadystatechange"'); }
                var myStatus = http_request.status;
                
                if (http_request.readyState == done)
                {
                    if (myStatus == ok) 
                    {
                       if (debugMode) { alert("GET response : " + http_request.responseText); }
                       callbackFunction(http_request.responseText);
                    }
                    else
                    {
                                    // http://msdn.microsoft.com/en-us/library/windows/desktop/ms767625%28v=vs.85%29.aspx
                       alert("GET Post failed : " + myStatus);
                       callbackFunction("#ERROR#");
                    }
                }                    
            };
        http_request.send(null);   
    }
    catch(e)
    {
        return (e.Message + "--> XmlhttpGETCall");
    }         
}   


// Erase Entity
function ajaxDeleteEntity(entityType, id, callbackFunction)
{
    if (debugMode) { alert('Entering "ajaxDeleteEntity"'); }
    var http_request = create_XMLHttpRequestObject();
    http_request.open("DELETE", databaseUrl + "/api/odata/" + entityType + "(" + id + ")", true);
    http_request.onreadystatechange = function ()
    {
        if (debugMode) { alert('Entering "onreadystatechange"'); }
        var myStatus = http_request.status;

        if (http_request.readyState == done)
        {
            if (myStatus == deleted)
            {
                if (debugMode) { alert("DELETE performed !"); }
                callbackFunction("#SUCCESS#");
            }
            else
            {
                                    // http://msdn.microsoft.com/en-us/library/windows/desktop/ms767625%28v=vs.85%29.aspx
                alert("DELETE failed : "+http_request.status);
                callbackFunction("#ERROR#");
            }
        }
    };
    http_request.send();
}


// send command to change Entity content
function ajaxPatchEntity(entityType, id, jsonContent)
{
    if (debugMode) { alert('Entering "ajaxPatchEntity"'); }
    var messageStr = JSON.stringify( jsonContent );
    var http_request = create_XMLHttpRequestObject();
    http_request.open("PATCH", databaseUrl + "/api/odata/" + entityType + "(" + id + ")", true);
    http_request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    http_request.setRequestHeader('Content-Length', messageStr.length);
    http_request.onreadystatechange = function ()
    {
        if (debugMode) { alert('Entering "onreadystatechange"'); }
        var myStatus = http_request.status;

        if (http_request.readyState == done)
        {
            if (myStatus == created)
            {
                if (debugMode) { alert("PATCH response : " + http_request.responseText); }
                callbackFunction("#SUCCESS#");
            }
            else
            {
                                    // http://msdn.microsoft.com/en-us/library/windows/desktop/ms767625%28v=vs.85%29.aspx
                alert("PATCH failed : "+http_request.status);
                callbackFunction("#ERROR#");
            }
        }
    };
    http_request.send(messageStr);
}


// http://jsfiddle.net/9NhtB/7/

/*
var user = ko.observable();
ko.applyBindings(user);

jQuery.ajax({
    url: 'http://test-disco.merkstduwas.de/api/odata/Users',
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, jqXHR) { user(data); },
    error: function() { alert('ERROR!'); },
    beforeSend: setHeader
});

function setHeader(xhr) {
    // HINT: You can define the detail level of odata by either specifying 
    //       - fullmetadata
    //       - minimalmetadata
    //       - nometadata
    xhr.setRequestHeader('Accept', 'application/json;odata=fullmetadata');
}  */