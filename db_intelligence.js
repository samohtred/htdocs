// create a local copy of a database part using XML
//
// Usecases : 
//	- Import data from database
//	- Navigate through tree
//	- Track changes (GUI + local content storage + database)
//
// important links :
// 	http://msdn.microsoft.com/en-us/library/ie/ms767625%28v=vs.85%29.aspx
//	http://test-disco.merkstduwas.de/api/odata/$metadata
// 	http://test-disco.merkstduwas.de/
//	http://test-disco.merkstduwas.de/api/Help



// Class 'db_intelligence'
function db_intelligence(debug_window)
{

//  var this.gui_fields = ['Content', 'Chat', 'Voting'];
  this.debug_window = debug_window;
  this.bufferUrl = window.location.protocol + "//" + window.location.host + "/db_init.xml";
  this.db_buffer = "";
  this.latest_id = 0;

  // tree functions
  this.create_tree = db_intelligence_create_tree.bind(this);
  this.update_db = db_intelligence_update_db.bind(this);
  this.set_latest_id = db_intelligence_set_latest_id.bind(this);
  this.dump_tree = db_intelligence_dump_tree.bind(this);

  // item functions
  this.create_tree_item = db_intelligence_create_tree_item.bind(this);
  this.delete_tree_item = db_intelligence_delete_tree_item.bind(this);
  this.get_tree_item_parents = db_intelligence_get_tree_item_parents.bind(this);
  this.get_tree_item_children = db_intelligence_get_tree_item_children.bind(this);
  this.attach_to_parent = db_intelligence_attach_to_parent.bind(this);
  this.detach_from_parent = db_intelligence_detach_from_parent.bind(this);

  // field functions
  this.create_tree_item_field = db_intelligence_create_tree_item_field.bind(this);
  this.change_tree_item_field = db_intelligence_change_tree_item_field.bind(this);
  this.get_tree_item_field = db_intelligence_get_tree_item_field.bind(this);

  // constructor call
  this.create_tree(this.bufferUrl);
}


//################################################################################################
//### Tree functions
//################################################################################################


// Import tree stub from XML file
function db_intelligence_create_tree(bufferUrl)
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    var xmlhttp = new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
                                    // to make sure that the Browser doesn't use a cached version of the file
  var myRandom = Math.random();
  xmlhttp.open("GET",bufferUrl+"?n="+myRandom,false);
  xmlhttp.send(null);
  this.db_buffer = xmlhttp.responseXML;

  this.dump_tree();
}


// update XML data in database on webserver
function db_intelligence_update_db(uploadUrl)
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    var xhr = new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open("POST", uploadUrl, false);
  var strContent = (new XMLSerializer()).serializeToString(this.db_buffer);
  xhr.send(strContent);
}


// set next ID
function db_intelligence_set_latest_id(latest_id)
{
  this.latest_id = latest_id;
}


// dump XML content
function db_intelligence_dump_tree()
{
  var dump_root = this.db_buffer.getElementsByTagName("db_root")[0];

  if (dump_root.innerHTML != null)
    this.debug_window.innerHTML = '<textarea style="border: none;background-color:white;width=100%;">' + dump_root.innerHTML + '</textarea>';
  else
  {
    var serializer = new XMLSerializer();                       
		var serialized = serializer.serializeToString(dump_root);    
//		this.debug_window.innerHTML = '<textarea style="border: none;background-color:white;width=100%;">' + serialized + '</textarea>';
  }
  
}



//################################################################################################
//### Item functions
//################################################################################################


// create new tree item
function db_intelligence_create_tree_item(parentId, name, type)
{
  var rootItem = this.db_buffer.getElementsByTagName("db_root")[0];
  var parentItem = getDBElementById(this.db_buffer, parentId);
  var newId = "-1";

  if (parentItem != undefined)
  {
    var currItem = this.db_buffer.createElement("item");
      currItem.setAttribute("id",this.latest_id); 
    var nameField = this.db_buffer.createElement("name"); 
      setInnerHTML(nameField,name);
    var typeField = this.db_buffer.createElement("type"); 
      setInnerHTML(typeField, type);      
    var refersToField = this.db_buffer.createElement("refers_to");
    var referredFromField = this.db_buffer.createElement("referred_from");
    var referredFromEntry = this.db_buffer.createElement("sep");
      setInnerHTML(referredFromEntry, parentId);
    referredFromField.appendChild(referredFromEntry);
    currItem.appendChild(nameField);
    currItem.appendChild(typeField);    
    currItem.appendChild(refersToField);
    currItem.appendChild(referredFromField);
    rootItem.appendChild(currItem );  
    parentRefersToEntry = this.db_buffer.createElement("sep");
    if (currItem.id != null)
      setInnerHTML(parentRefersToEntry, currItem.id);
    else
      setInnerHTML(parentRefersToEntry, currItem.getAttribute("id"));      
    newId = this.latest_id+'';
    this.latest_id = this.latest_id + 1;
    var referToItem = parentItem.getElementsByTagName("refers_to")[0];
    referToItem.appendChild(parentRefersToEntry);
  }
  else
    alert("Parent item doesn't exist");
  this.dump_tree();
  return newId;
}



// delete item and all of its children
function db_intelligence_delete_tree_item(itemId)
{
  var currItem = getDBElementById(this.db_buffer, itemId);
  var myChildren = this.get_tree_item_children(itemId);

  if (myChildren.length > 0)
  {
    for (var i=0; i<myChildren.length; i++)
    {
      this.delete_tree_item(myChildren[i]);
    }
  }

  this.detach_from_parent(this.get_tree_item_parents(itemId)[0], itemId);

  if (currItem.outerHTML != null)
    currItem.outerHTML = "";
  else
    currItem.parentNode.removeChild(currItem);               
    
  this.dump_tree();
}



// get Item's parent nodes
function db_intelligence_get_tree_item_parents(itemId)
{
  var currItem = getDBElementById(this.db_buffer, itemId);
  var parentLinks = currItem.getElementsByTagName("referred_from");

  if ((currItem != undefined)&&(parentLinks.length > 0)) 
  {
                                    // get all parents ...
    var linksToParents = getChildren(parentLinks[0]);
    var parentIds = [];
    for (var i=0; i<linksToParents.length; i++)
    {  
      parentIds[i] = getInnerHTML(linksToParents[i]);
    }
    return parentIds;
  }
  else
//    alert("Item doesn't exist");
  return undefined
}



// get Item's child nodes
function db_intelligence_get_tree_item_children(itemId)
{
  var currItem = getDBElementById(this.db_buffer, itemId);

  if (currItem != undefined)
  {
                                    // get all children ...
    var linksToChildren = getChildren(currItem.getElementsByTagName("refers_to")[0]);
    var childIds = []; 
    for (var i=0; i<linksToChildren.length; i++)
    {  
      childIds[i] = getInnerHTML(linksToChildren[i]);
    }
    return childIds;
  }
  else
    alert("Item doesn't exist");
  return undefined;
}


// cut&paste operations (later : for copy by reference) 
function db_intelligence_attach_to_parent(parentId, itemId)
{
  var parentItem = getDBElementById(this.db_buffer, parentId);
  var currentItem = getDBElementById(this.db_buffer, itemId);

  if ((parentItem != undefined) && (currentItem != undefined))
  {
    var parentItems = this.get_tree_item_parents(itemId);
    var already_attached = 0;
    for (i=0; i<parentItems.length; i++)
      if (parentItems[i] == parentId)
        already_attached = 1;
    if (!already_attached)
    {
      var referredFromEntry = this.db_buffer.createElement("sep");
        setInnerHTML(referredFromEntry, parentId);      
      var referredFromField = currentItem.getElementsByTagName("referred_from")[0];
      referredFromField.appendChild(referredFromEntry);
    }

    var childItems = this.get_tree_item_children(parentId);
    already_attached = 0;
    for (i=0; i<childItems.length; i++)
      if (childItems[i] == itemId)
        already_attached = 1;
    if (!already_attached)
    {
      var parentRefersToEntry = this.db_buffer.createElement("sep");
        setInnerHTML(parentRefersToEntry, itemId);
      var refersToField = parentItem.getElementsByTagName("refers_to")[0];
      refersToField.appendChild(parentRefersToEntry);
    }
  }
  else
    alert("Item doesn't exist");
  this.dump_tree();
}


// cut&paste operations (later : for copy by reference) 
function db_intelligence_detach_from_parent(parentId, itemId)
{
  var currItem = getDBElementById(this.db_buffer, itemId);

  if (currItem != undefined)
  {
                                    // get all links to parents ...
    var referredFromItem = currItem.getElementsByTagName("referred_from")[0];
    var linksToParents = getChildren(referredFromItem);

    for (var i=0; i<linksToParents.length; i++)
    {  
                                    // delete desired link from parent to current item
      var currentParentId = getInnerHTML(linksToParents[i]);
      if (currentParentId == parentId)
      {
        var parentItem = getDBElementById(this.db_buffer, currentParentId);
        var linksFromParents = getChildren(parentItem.getElementsByTagName("refers_to")[0]);
        for (var k=0; k<linksFromParents.length; k++)
        {  
          if (getInnerHTML(linksFromParents[k]) == itemId)
          {
            if (linksFromParents[k].outerHTML != null)
              linksFromParents[k].outerHTML = ""; 
            else
              linksFromParents[k].parentNode.removeChild(linksFromParents[k]);               
          }
        }
        if (linksToParents[i].outerHTML != null)
          linksToParents[i].outerHTML = ""; 
        else
          linksToParents[i].parentNode.removeChild(linksToParents[i]);               
      }
    }
  }
  else
    alert("Item doesn't exist");
  this.dump_tree();
}



//################################################################################################
//### Field functions
//################################################################################################

// create fields of tree item
function db_intelligence_create_tree_item_field(itemId, fieldId, content)
{
  var currItem = getDBElementById(this.db_buffer, itemId);

  if (currItem != undefined) 
  {
                                        // field not yet created ? -> Good !
    if (currItem.getElementsByTagName(fieldId).length == 0)
    {
      var myItemField = this.db_buffer.createElement(fieldId);
      setInnerHTML(myItemField, content);
      currItem.appendChild(myItemField);
    }
    else
    {
                                        // output if field already exists	
      alert("Field \""+fieldId+"\" already exists");
    }
  }
  else
  { 
    alert("Item \""+itemId+"\" doesn't exist");
  }
  this.dump_tree();
}



// change fields of tree item
function db_intelligence_change_tree_item_field(itemId, fieldId, content)
{
  var currItem = getDBElementById(this.db_buffer, itemId);

  if (currItem != undefined) 
  {
    var myItemField = currItem.getElementsByTagName(fieldId);
    if ((myItemField != undefined) && (myItemField.length > 0))
    {
      setInnerHTML(myItemField[0], content);
    }
    else
    {
      this.create_tree_item_field(itemId, fieldId, content);
//      alert("Field \""+fieldId+"\" was created !");
    }
  }
  else
  { 
    alert("Item \""+itemId+"\" doesn't exist");
  }
  this.dump_tree();
}



// get field content
function db_intelligence_get_tree_item_field(itemId, fieldId)
{

  var currItem = getDBElementById(this.db_buffer, itemId);

  if (currItem != undefined) 
  {

    var myItemField = currItem.getElementsByTagName(fieldId);
    if (myItemField.length != 0)
    {
      return getInnerHTML(myItemField[0]);
    }
    else
    { 
      if (fieldId == "type")
      {
        this.create_tree_item_field(itemId, fieldId, elemTypeList[0]);
        return elemTypeList[0];
      }
      else
      {
        this.create_tree_item_field(itemId, fieldId, "");
        return "";
      }
    }
  }
  else
  { 
    alert("Item \""+itemId+"\" doesn't exist");
  }
  this.dump_tree();
  return undefined;
}