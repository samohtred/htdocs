function lib_data_disco_item_exists(itemId)
{
  var answer_received = false;
  var retval = true;
  discoContext.Posts.filter('it.Id == ' + itemId).toArray().then
  (
    function(response) 
    { 
      answer_received = true;
      if (response.length == 0) 
        retval = false; 
    }
  ).fail
  (
    function(response) 
    { 
      answer_received = true;      
      alert('Connection failed !'); 
      retval = false;      
    }
  );  
  
  alert('Here!                                                                                                             ');
  while (!answer_received) {}
  
  return retval;
}

function disco_test_init()
{                                                                                                                                                              
  if (lib_data_disco_item_exists('1'))
    alert("Success !");
  else
    alert("Not Found !");
    
/* 
    discoContext.Posts.filter('it.Id == 1').include('Content').toArray().then(
      function(response) {
       console.log(response); 
       alert(response[0].Content.Text);
      }
    );                                                                                                     
  */ 
//    zusätzlich für die Fehlerbehandlung kann man hinter dem .then() noch ein .fail() 
//    anhängen, welches nur dann aufgerufen wird, wenn ein Request schiefgegangen ist
     
     
    // filter(Filter-Ausdruck als String)  
    // it = das, was man sucht                                                                                                                                                             
//  var referenceFilter = discoContext.PostReferences.filter('it.ReferrerId == 14').toArray().then(function(response) {
//    console.log(response);                                                                                                                                                                 
//  });                                                                                                                                              
//    var referenceFilter = discoContext.PostReferences.filter('it.ReferrerId == 14');
//                                                                                     
//                                                                                                                                                                 
//  discoContext.Posts.filter('it.ReferredFrom.some(this.referenceFilter)', { referenceFilter: referenceFilter }).include('Content').toArray().then(function(response) {
//     console.log(response); 
//  });                                                                                                                                                            
}


// https://github.com/caolan/async
// http://jaydata.org/tutorials/how-jaydata-works
// http://test.disco-network.org/api/odata/NamedValues
// http://test.disco-network.org/explorer

// Use-Case 1 : Items auslesen 
// ==========================
// var response_content; 
// discoContext.Posts.filter('it.Id == 1').include('Content').toArray().then(
//       function(response) {
//         response_content = response;
//       }
//     );                 
// discoContext.Posts.filter('it.Id == 1').include('Content').include('ReferredFrom').toArray().then(
//       function(response) {
//         response_content = response[0];
//       }
//     );                 
// discoContext.Posts.filter('it.Id == 1').include('Content').include('ReferredFrom.Referrer.Content').toArray().then(
//       function(response) {
//         response_content = response[0];
//       }
//     );                 
//
// 
// var notExistFilter = this.context.PostReferences.filter('it.Id == 0'); //Ids sind immer größer als 0!
// this.context.Posts.filter('it.RefersTo.every(this.notExistFilter) && (it.PostTypeId == 1)', { notExistFilter: notExistFilter }).include('Content').include('RefersTo').toArray().then(function(response) {
//   var result_str = "";
//   for (var i=0; i<response.length; i++)
//     result_str = result_str + response[i].Id + ' ';
//   alert(result_str); 
// });      
// -> folgende Posts scheinen Hauptthemen zu sein : 1 3 4 5 6 7 8 9 10
//
//
// Use-Case 2 : Item anlegen
// =========================
//
// myNamedValueSet = new Disco.Ontology.NamedValueSet();
// myNamedValueSet.OriginId = '8';
// discoContext.NamedValueSets.add(myNamedValueSet);
// discoContext.saveChanges().then(
//       function(response) {
//         response_content = response;
//       }
//     );     
//                                                                                                
// ... danach neu erzeugte Id auslesen : 
// myNamedValueSet.Id
// "4"
//
// myNamedValue = new Disco.Ontology.NamedValue();
// myNamedValue.Name = 'db_root';
// myNamedValue.Value = '1';
// myNamedValue.NamedValueSetId = '3';
// discoContext.NamedValues.add(myNamedValue);
// discoContext.saveChanges();                                                                                                     
//
//
// Use-Case 3 : Item löschen
// =========================
//
// ... normalerweise erstmal per Filter holen (siehe Usecase 1)
// discoContext.NamedValueSets.remove(myNamedValueSet);                                                                                             
// discoContext.saveChanges();                                                                                                     
//
//
// Use-Case 4 : Item ändern
// =========================
//
// discoContext.NamedValues.attach(myNamedValue);
// myNamedValue.Value = '2';
// discoContext.saveChanges();                                                                                                     
//
//
//
// Weitere Infos + Codebeispiele :
// ===============================
//
// Kontext "thisObjekt" in Funktion übergeben
// funktionXY.call(thisObjekt, arg1, arg2, arg3, ...);
// 
// 
// function lib_data_disco_req_tree(elemId, lock_id, cb_fctn_str) {
//     var letztesItemId = elemId;
//     var parentSearchReady = false;
//     var childSearchReady = false;
//     var do = function() {
//         context.ladeParent(letztesItemId, function(parentId) {
//             letztesItemId = parentId;
//             if(Schluss) {
//                 parentSearchReady = true;
//                 if(teste_ob_parent_und_child_beide_fertig_sind())
// 
//                     cb_fctn_str(...);
// 
//             }
//             else
//               do();
//         });
//     }
//     do();
// }
// 
// 
// /////
// 
// funktionXY.call(thisObjekt, arg1, arg2, arg3, ...);
// 
// funktionXY() {
// 
//     alert(this);
// 
// }
// 
// 

// Marc Piwecki & Paul ...

// Fragen :
//
// 1.) Es gibt angeblich keine Semaphoren in Javascript, weil es nur eine Single-Task-
//      Umgebung ist.
//      -> Wie werden dann Events abgearbeitet ? Wird der zuerst ankommende Event abgearbeitet
//          und alle nachfolgenden landen in einer Queue und werden nacheinander abgearbeitet 
//          oder können sich die Events gegenseitig unterbrechen ? -> Wichtig wegen möglicher
//          gemeinsamer Ressoucen-Nutzung versch. Events (z.B. Datenzugriffe auf gleiche Datenquelle)




// ##############################################################################################

//// alle Hauptthemen auslesen
//// =========================
//var notExistFilter = this.context.PostReferences.filter('it.Id == 0'); //Ids sind immer größer als 0!
//this.context.Posts.filter('it.RefersTo.every(this.notExistFilter) && (it.PostTypeId == 1)', { notExistFilter: notExistFilter }).include('Content').include('RefersTo').toArray().then(function(response) {
//  var result_str = "";
//  for (var i=0; i<response.length; i++)
//    result_str = result_str + response[i].Id + ' ';
//  alert(result_str); 
//});      
//// -> folgende Posts scheinen Hauptthemen zu sein : 1 3 4 5 6 7 8 9 10
//
//
//// Root-Knoten ("Alle Themen") erzeugen
//// ====================================
//myContent = new Disco.Ontology.Content();
//myContent.Text = "Hier fangen alle Hauptthemen an.";
//myContent.Title = "Alle Themen";
//myContent.CultureId = "2";
//this.context.Content.add(myContent);                                    
//this.context.saveChanges().then(
//      function(response) {
//        response_content = response;
//      }
//    );     
//myContent.Id -> 592
//
//myPost = new Disco.Ontology.Post();
//myPost.PostTypeId = "1";
//myPost.ContentId = "592";
//this.context.Posts.add(myPost);                                    
//this.context.saveChanges().then(
//      function(response) {
//        response_content = response;
//      }
//    ); 
//myPost.Id -> 575
//
//
//Verknüpfungen erstellen
//=======================
//
//var TopicList = [];
//var TopicNum = 0;
//var CurrTopic = 0;
//var RootObj = [];
//var CurrRelObj = {};
//
//var create_relation = function() 
//{
//  CurrRelObj = new Disco.Ontology.PostReference();
//  CurrRelObj.ReferrerId = TopicList[CurrTopic].Id;
//  CurrRelObj.ReferreeId = RootObj[0].Id;
//  CurrRelObj.ReferenceTypeId = "1";
//  this.context.PostReferences.add(CurrRelObj);                                    
//  this.context.saveChanges().then(
//    function(response) {
//      connect_relation_root(); 
//    }
//  );      
//}.bind(this)
//
//var connect_relation_root = function() 
//{
//  this.context.Posts.attach(RootObj[0]);
//  RootObj[0].ReferredFrom = CurrRelObj.Id;
//  this.context.saveChanges().then(
//    function(response) {
//      connect_relation_topic(); 
//    }
//  );        
//}.bind(this)
//
//var connect_relation_topic = function() 
//{
//  this.context.Posts.attach(TopicList[CurrTopic]);
//  TopicList[CurrTopic++].RefersTo = CurrRelObj.Id;
//  this.context.saveChanges().then(
//    function(response) {
//      if (CurrTopic < TopicList.length)
//        create_relation();
//    }
//  );           
//}.bind(this)
//
//
//var notExistFilter = this.context.PostReferences.filter('it.Id == 0'); //Ids sind immer größer als 0!
//this.context.Posts.filter('it.RefersTo.every(this.notExistFilter) && (it.PostTypeId == 1)', { notExistFilter: notExistFilter }).include('Content').include('RefersTo').toArray().then(function(response) {
//  // clone results to PostList
//  for (var i=0; i<response.length; i++)
//    if (response[i].Id == "575")
//    {
//      RootObj = jQuery.extend(true, {}, response.splice(i,1));
//      break;
//    }
//  TopicList = jQuery.extend(true, [], response);
//  TopicNum = TopicList.length;
//  create_relation();
//});      


//
//var notExistFilter = this.context.PostReferences.filter('it.Id == 0'); //Ids sind immer größer als 0!
//this.context.Posts.filter('it.RefersTo.every(this.notExistFilter) && (it.PostTypeId == 1)', { notExistFilter: notExistFilter }).include('Content').include('RefersTo').toArray().then(function(response) {
//  var result_str = "";
//  for (var i=0; i<response.length; i++)
//    result_str = result_str + response[i].Id + ' ';
//  alert(result_str); 
//});      
//
//
//
//this.context.Content.filter('it.Id == 596').toArray().then(
//       function(response) {
//         this.context.Content.remove(response[0]);                                                                                             
//         this.context.saveChanges().fail
//         ( 
//            function(response) {alert('failed!');}
//         );                                                                                                     
//       }.bind(this)
//     );                 
//
//
//this.context.Posts.filter('it.Id == 579').toArray().then(
//       function(response) {
//         this.context.Posts.remove(response[0]);                                                                                             
//         this.context.saveChanges().fail
//         ( 
//            function(response) {alert('failed!');}
//         );                                                                                                     
//       }.bind(this)
//     );                 
//
//
//
//
//578
//579
//580

//
//var myContent = new Disco.Ontology.Content();
//myContent.Text = "Dummy-Knoten zum Löschtest";
//myContent.Title = "Dummy-Knoten";
//myContent.CultureId = "2";
//this.context.Content.add(myContent);                                    
//this.context.saveChanges().fail(
//      function(response) {
//        alert("Content : failed");
//      }
//    );     
//-> 599
//
//var myPost = new Disco.Ontology.Post();
//myPost.PostTypeId = "1";
//myPost.ContentId = myContent.Id;
//this.context.Posts.add(myPost);                                    
//this.context.saveChanges().fail(
//      function(response) {
//        alert("Post : failed");
//      }
//    ); 
//-> 582    
//
//
//this.context.Posts.filter('it.Id == 582').toArray().then(
//       function(response) {
//         this.context.Posts.remove(response[0]);                                                                                             
//         this.context.saveChanges().fail
//         ( 
//            function(response) {alert('failed!');}
//         );                                                                                                     
//       }.bind(this)
//     );                 
//
//
//this.context.Content.filter('it.Id == 599').toArray().then(
//       function(response) {
//         this.context.Content.remove(response[0]);                                                                                             
//         this.context.saveChanges().fail
//         ( 
//            function(response) {alert('failed!');}
//         );                                                                                                     
//       }.bind(this)
//     );   



//
//4 Ebenen mit Context sind manchmal gleichzeitig möglich ! :
//
//            var resultat = {};
//            this.context.Posts.filter('it.Id == "576"').include('Content').include('ReferredFrom.Referrer.ReferredFrom.Referrer.Content').toArray().then(            
//                function(response) 
//                {
//                  resultat = jQuery.extend(true, {}, response[0]);
//                }
//             );
//             
//
//             resultat.initData.Content.initData.Title
//             resultat.ReferredFrom[1].Referrer.initData.Content.initData.Title
//             resultat.ReferredFrom[1].Referrer.initData.ReferredFrom[0].initData.Referrer.initData.Content.initData.Title             
//             resultat.ReferredFrom[1].Referrer.initData.ReferredFrom[0].initData.Referrer.initData.ReferredFrom[0].initData.Referrer.initData.Content.initData.Title
//
//
//... aber offenbar nicht von "Alle Themen" aus :
//
//            var resultat = {};
//            this.context.Posts.filter('it.Id == "575"').include('Content').include('ReferredFrom.Referrer.ReferredFrom.Referrer.Content').toArray().then(            
//                function(response) 
//                {
//                  resultat = jQuery.extend(true, {}, response[0]);
//                }
//             );
//
//            resultat.Content.Title 
//////////////////////////////////////////////////////////////////////////////////////////////
//            
// Konzept :  1.) Skelett in Richtung Parent-Knoten holen für Explorer
//            2.) checken ob Post-ID 575 ("Alle Themen") mit dabei ist (ansonsten muß noch
//                mal von den Blättern aus weitergesucht werden -> macht Server automat.
//                Zyklen-Erkennung ?)
//            3.) Post mit Array von Content-Ids,um an Titel heranzukommen
//            4.) Schritte 1-3 noch mal Richtung Child-Knoten und mit dem Unterschied, daß 
//                auch Volltexte gleich mit abgeholt werden  
//////////////////////////////////////////////////////////////////////////////////////////////