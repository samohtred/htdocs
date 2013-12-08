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
 * ---------------------------------------------------------------------------------------
 */


var plugin_version = "version : 0.0.0.16";
var plugin_date = "created : 2013/11/13";


// ---------------------------------------------------------------------------------------


var databaseUrl = "http://test-disco.merkstduwas.de";
//var databaseUrl = "http://disco.merkstduwas.de";

var debugMode = false;





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