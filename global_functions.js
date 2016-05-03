// #############################################################################
// ###  compatibility functions
// #############################################################################

var ljsf;
var schonEingebunden = ""; // Speichert die bereits eingebundenen Scripts
function loadJSFile(filename,einmaligEinbinden) {
        if (einmaligEinbinden) {
            // schon einbebunden?
            if (schonEingebunden.indexOf("|"+filename+"|")!=-1) return true;
            // Nein, in die Liste damit
            schonEingebunden = schonEingebunden + "|" + filename + "|";
        }

        // Instanz einmalig erstellen
        if (ljsf == null) ljsf = (navigator.userAgent.indexOf("MSIE")+1)?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest;
       
        ljsf.open('get',filename,true);
        ljsf.setRequestHeader("Connection","close");
        ljsf.onreadystatechange = function() {
                if(ljsf.readyState == 4){
                        eval(ljsf.responseText);
                        if (ljsf.responseText != "")       
                          global_dispatcher_init();                        
                }

        }
        ljsf.send(null);
}

// grundlegendes Escape, um Text in HTML-Elementen nicht uminterpretiert zu bekommen
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// find out current width of window object "my_window"
function get_total_win_width(my_window)
{
  var ret_val = 0;

  // IE
  if(!my_window.innerWidth)
  {
    if(!(my_window.documentElement.clientWidth == 0))
    {
      //strict mode
      ret_val = my_window.documentElement.clientWidth;
    } 
    else
    {
      //quirks mode
      ret_val = my_window.body.clientWidth;
    } 
  } 
  else 
  {
    //w3c
    ret_val = my_window.innerWidth;
  }
  return ret_val;
}

// find out current height of window object "my_window"
function get_total_win_height(my_window)
{
  var ret_val = 0;

  // IE
  if(!window.innerHeight)
  {
    if(!(document.documentElement.clientHeight == 0))
    {
      //strict mode
      ret_val = document.documentElement.clientHeight;
    } 
    else
    {
      //quirks mode
      ret_val = document.body.clientHeight;
    } 
  } 
  else 
  {
    //w3c
    ret_val = window.innerHeight;
  }

  return ret_val;
}



// code to make sure that the method of a class can see its own instance "this"
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


// contains function
function arrayContains(arr, findValue) {
    var i = arr.length;
     
    while (i--) {
        if (arr[i] === findValue) return true;
    }
    return false;
}// See more at: http://www.codemiles.com/javascript-examples/check-array-contains-a-value-using-javascript-t7796.html#sthash.urq6GPZj.dpuf


function strStartsWith(myString, mySubstring)
{
  return myString.indexOf(mySubstring) == 0;
}

function strEndsWith(str, suffix) {                                  
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}                                                                 

// change GUI item ID (parentID#itemID) to item ID
function get_id(gui_id)
{
  var sep_idx = gui_id.indexOf("#");
  return gui_id.substring(sep_idx + 1, gui_id.length);
}

// extract parent ID from GUI item ID
function get_parent_id(gui_id)
{
  var sep_idx = gui_id.indexOf("#");
  return gui_id.substring(0, sep_idx);
}


function getParentIdx(parentId, parentItems)
{
  var parentIdx = -1;
  for (var i=0; i<parentItems.length; i++)
    if (parentItems[i] == parentId)
      return i;
  return null;
}

function getChildren(myObj)
{
  if (myObj.children != null)
    return myObj.children;
  else
    return myObj.childNodes;
}

function getDBElementById(domObj, id) 
{
  var myChildNodes = getChildren(getChildren(domObj)[0]);

  for (var i = 0; i < myChildNodes.length; i++) 
  {
    if (myChildNodes[i].attributes != null)
    {
      if (myChildNodes[i].attributes.length != 0)
      {
        if (myChildNodes[i].attributes["id"] != undefined)
        {
          if (myChildNodes[i].attributes["id"].value == id) 
            return myChildNodes[i];
        }
      }
    }
  }
  return undefined;
}



function getXMLElementById(domObj, id) 
{
  var myChildNodes = domObj.children;

  for (var i = 0; i < myChildNodes.length; i++) 
  {
    if (myChildNodes[i].attributes.length != 0)
    {
      if (myChildNodes[i].attributes["id"] != undefined)
      {
        if (myChildNodes[i].attributes["id"].value == id) 
          return myChildNodes[i];
      }
    }
    
    return getXMLElementById(myChildNodes[i], id);
  }
  return undefined;
}


function setInnerHTML(myObj, content)
{
  var is_value = false;
  if (myObj.value != undefined)
  {
    if (isNaN(myObj.value))
    {
      is_value = true;
    }
  }
  if (is_value == true)
    myObj.value = content;
  else
    if (myObj.innerHTML != undefined)
      myObj.innerHTML = content;
    else
      myObj.textContent = content;

/*
  if (myObj.innerHTML != undefined)
    myObj.innerHTML = content;
  else
    if (myObj.textContent != undefined)
      myObj.textContent = content;
    else
      myObj.value = content;
*/
}


function getInnerHTML(myObj)
{
  if (myObj.value != undefined)
    return myObj.value;
  else
    if (myObj.innerHTML != undefined)
      return myObj.innerHTML;
    else 
      return myObj.textContent;  
/*  
  if (myObj.innerHTML != undefined)
    return myObj.innerHTML;
  else
    if (myObj.textContent != undefined)
      return myObj.textContent;
    else 
      return myObj.value;
*/
}

