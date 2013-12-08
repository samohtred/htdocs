// create a local copy of a database part using HTML instead of
// XML : 
//
// <div id='Tree' class="System">
//	<div id='08213' class="Item">
//		<div class="Name">Umwelt</div>
//		<div class="Posttype">Topic</div>
//		<div class="Content">http://de.wikipedia.org/wiki/Umwelt</div>
//		<div class="Chat">http://www.natura-forum.de/</div>
//		<div class="Voting">+2</div>
//		<div class="Is_Temporary">true</div>
//		<div class="RefersTo">
//			<div>08214</div>
//			<div>08215</div>
//			...
//		</div>
//		<div class="ReferredFrom">
//			<div>Tree</div>
//		</div>
//	</div>
//	<div id='08214' class="Item">
//		...
//	</div>
//		...
// </div>
//
// Usecases : 
//	- Daten aus Datenbank importieren
//	- Navigieren durch den Baum
//	- Änderungen verfolgen (GUI + lokale HTML-Datenhaltung + Datenbank)



// important links :
// 	http://msdn.microsoft.com/en-us/library/ie/ms767625%28v=vs.85%29.aspx
//	http://test-disco.merkstduwas.de/api/odata/$metadata
// 	http://test-disco.merkstduwas.de/
//	http://test-disco.merkstduwas.de/api/Help



// Class 'db_intelligence'
function db_intelligence()
{
  var this.gui_fields = ['Content', 'Chat', 'Voting'];
  var this.db_buffer;
  var this.latest_id = 0;

  // tree functions
  this.create_tree = db_intelligence_create_tree;

  // item functions
  this.create_tree_item = db_intelligence_create_tree_item;
  this.delete_tree_item = db_intelligence_delete_tree_item;
  this.get_tree_item_parents = db_intelligence_get_tree_item_parents;
  this.get_tree_item_children = db_intelligence_get_tree_item_children;

  // field functions
  this.create_tree_item_field = db_intelligence_create_tree_item_field;
  this.change_tree_item_field = db_intelligence_change_tree_item_field;
  this.get_tree_item_field = db_intelligence_get_tree_item_field;

  // constructor
  var __construct = function() 
  {
     this.create_tree();
  } ()

  // constructor call (when object is created)
  __construct;
}



//<div id='Tree' class="System">
//  <div class="Name">Alle Themen</div>
//  <div class="RefersTo">
//  </div>
//</div>
function db_intelligence_create_tree()
{
  db_buffer = document.createElement("div");  
    db_buffer.id = 'Tree';
    db_buffer.class = "System";
  var nameField = document.createElement("div"); 
    nameField.class = "Name";
    nameField.innerHTML = "Alle Themen";
  var refersToField = document.createElement("div");
    refersToField .class = "RefersTo";    
  db_buffer.appendChild(nameField);
  db_buffer.appendChild(refersToField);  
}


//<div id='...' class="Item">
//  <div class="Name">...</div>
//  <div class="RefersTo">
//  </div>
//  <div class="ReferredFrom">
//    <div>...</div>
//  </div>
//</div>
function db_intelligence_create_tree_item(parentId, name)
{
  parentItem = document.getElementById(parentId);

  if (parentItem != Null)
  {
    var currItem = document.createElement("div");
      currItem.id = this.latest_id;
      currItem.class = "Item";
    var nameField = document.createElement("div"); 
      nameField.class = "Name";
      nameField.innerHTML = name;
    var refersToField = document.createElement("div");
      refersToField .class = "RefersTo";    
    var referredFromField = document.createElement("div");
      refersToField .class = "ReferredFrom";    
    var referredFromEntry = document.createElement("div");
      referredFromEntry.innerHTML = parentId;
    referredFromField.appendChild(referredFromEntry);
    currItem.appendChild(nameField);
    currItem.appendChild(refersToField);
    currItem.appendChild(referredFromField);
    db_buffer.appendChild(currItem );  
    parentRefersToEntry = document.createElement("div");
      parentRefersToEntry.innerHTML = currItem.id;
    this.latest_id = this.latest_id + 1;
    parentItem.getElementByClass("RefersTo").appendChild(parentRefersToEntry);
  }
  else
    alert("Parent item doesn't exist");
}



// delete Item from tree
function db_intelligence_delete_tree_item(itemId)
{
  var currItem = getElementById(itemId);

  if (currItem != Null)
  {
                                    // get all parents ...
    var linksToParents = currItem.getElementByClass("ReferredFrom").childNodes;
    for (var i=0; i<linksToParents.length; i++)
    {  
      var parentId = linksToParents[i].innerHTML;
      var linksFromParents = getElementById(parentId).getElementByClass("RefersTo").childNodes;
      for (var k=0; k<linksToParents.length; k++)
      {  
                                    // ... remove links from them ...
        if (linksToParents[k].innerHTML == itemId)
        {
          linksToParents[k].outerHTML = ""; 
          break;
        }
      }
    }
                                    // ... and kill the item itself
    currItem.outerHTML = "";
  }
  else
    alert("Item doesn't exist");
}


// get Item's parent nodes
parentIds[] = function db_intelligence_get_tree_item_parents(itemId)
{
  var currItem = getElementById(itemId);

  if (currItem != Null)
  {
                                    // get all parents ...
    var linksToParents = currItem.getElementByClass("ReferredFrom").childNodes;
    for (var i=0; i<linksToParents.length; i++)
    {  
      parentIds[i] = linksToParents[i].innerHTML;
    }
  }
  else
    alert("Item doesn't exist");
}


// get Item's child nodes
childIds[] = function db_intelligence_get_tree_item_children(itemId)
{
  var currItem = getElementById(itemId);

  if (currItem != Null)
  {
                                    // get all children ...
    var linksToChildren = currItem.getElementByClass("RefersTo").childNodes;
    for (var i=0; i<linksToChildren.length; i++)
    {  
      childIds[i] = linksToChildren[i].innerHTML;
    }
  }
  else
    alert("Item doesn't exist");
}



// create fields of tree item
function db_intelligence_create_tree_item_field(itemId, classId, content)
{
  var currItem = getElementById(itemId);
  if (currItemField != Null) 
  {
    var currItemField = document.createElement("div");
    currItemField.class = classId;
    currItemField.innerHTML = content;
  }
  else
  { 
    alert("Item \""+itemId+"\" doesn't exist");
  }
}


// change fields of tree item
function db_intelligence_change_tree_item_field(itemId, classId, content)
{
  var currItem = getElementById(itemId);
  if (currItemField != Null) 
  {
    var currItemField = currItem .getElementByClass(classId);
    if (currItemField != Null) 
    {
      currItemField.innerHTML = content;
    }
    else
    { 
      alert("Field \""+classId+"\" doesn't exist");
    }
  else
  { 
    alert("Item \""+itemId+"\" doesn't exist");
  }
}


// get field content
result = function db_intelligence_get_tree_item_field(itemId, classId)
{
  var currItem = getElementById(itemId);
  if (currItemField != Null) 
  {
    var currItemField = currItem .getElementByClass(classId);
    if (currItemField != Null) 
    {
      return currItemField.innerHTML;
    }
    else
    { 
      alert("Field \""+classId+"\" doesn't exist");
    }
  else
  { 
    alert("Item \""+itemId+"\" doesn't exist");
  }
  return "";
}