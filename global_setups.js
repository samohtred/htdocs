var plugin_name = "X-Tree-M";

/*
 * ---------------------------------------------------------------------------------------
 * Version	Datum		Inhalt
 * ---------------------------------------------------------------------------------------
 * V0.0.0.3	2013/09/01	Primitiver Test der DB-Anbindung
 * V0.0.0.4	2013/09/05	Menü klappt (verdrängend), Resize ohne Scrolling wegen
 * 				prozentualen Größen; Datenbank-Anbindung klappt zusammen
 * 				mit Darstellung (Aktualisierung : DB-Anbindung mittler-
 * 				weile veraltet)
 * V0.0.0.5	2013/09/30 	Mouseover, Menü und y-Scrolling klappt; blauer Hintergrund;
 * 				Navigationsleiste
 * V0.0.0.6	2013/10/01	Menü jetzt überlappend statt verdrängend
 * V0.0.0.7	2013/10/07	Resize funktioniert (x-Resize nur prozentual;
 * 				deshalb kein x-Scrolling)
 * V0.0.0.8	2013/10/10	x-Scrolling klappt (x-Resize auch in Pixeln) und
 * 				neue Markierung der Spalten (allerdings noch kein
 * 				eleganter Code)
 * V0.0.0.15    2013/11/11      Version wird unter Hilfe-Menü angezeigt
 * V0.0.0.16    2013/11/13      IE Keyboard access didn't work on server -> fixed
 * V0.0.0.17    2013/12/16      db_intelligence : create and delete works fine
 * V0.0.0.18    2014/02/04      incompatibility to IE but database can be stored on
 *                              Server, cut and paste was added, rename is integrated
 * V0.0.0.19    2014/02/19      load / save to webserver now even working with caching
 *                              switched on; several element types introduced (working)
 * V0.0.0.20    2014/02/21      compatibility to IE reestablished
 * V0.0.0.21    2014/03/11      multiple selection if CTRL is kept down
 * V0.0.0.22    2014/03/16      Item sort by element type and alphabet; 'idea' as new 
 *                              element type
 * ---------------------------------------------------------------------------------------
 */


var plugin_version = "version : 0.0.0.22";
var plugin_date = "created : 2014/03/16";


// ---------------------------------------------------------------------------------------


var databaseUrl = "http://test-disco.merkstduwas.de";
//var databaseUrl = "http://disco.merkstduwas.de";

var debugMode = false;

//var xmlDataUrl = window.location.protocol + "//" + window.location.host + "/db_init.xml";
var xmlDataUrl = "db_init.xml";
var uploadPhpUrl = window.location.protocol + "//" + window.location.host + "/upload.php";
var downloadPhpUrl = window.location.protocol + "//" + window.location.host + "/download.php";

var elemTypeList    = ["Thema"            , "Fakt"            , "Pro-Arg"           , "Kontra-Arg"        , "Frage"               , "Problem"           , "Idee"            , "Ziel"          , "Region"            ]; // Attention ! No more than 13 Elements to prevent Alt-N from being removed
var elemSymbolList  = ["symbol_topic.gif" , "symbol_fact.gif" , "symbol_pro_arg.gif", "symbol_con_arg.gif", "symbol_question.gif" , "symbol_problem.gif", "symbol_idea.gif" , "symbol_aim.gif", "symbol_region.gif" ]; // Attention ! No more than 13 Elements to prevent Alt-N from being removed

// #######################################################################################

// useful links :
//      http://www.jquerysample.com/#menuHome2
//      http://www.noupe.com/jquery/50-amazing-jquery-examples-part1.html



// compatibility for IE
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
  if (myObj.innerHTML != null)
    myObj.innerHTML = content;
  else
    myObj.textContent = content;
}


function getInnerHTML(myObj)
{
  if (myObj.innerHTML != null)
    return myObj.innerHTML;
  else
    return myObj.textContent;
}



/*
 onclickAttr = button.attributes["onclick"];
            alert ("The value of the onclick attribute: " + onclickAttr.value);


  if (domObj.getElementById) 
  {
    var test = domObj.getElementById(id);
    if (typeof(test)!== 'undefined') 
      return test;
  }
  return findID(domObj, id);
} 
*/