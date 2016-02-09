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



// Class 'lib_data_xml'
function lib_data_xml(data_src_path, data_src_params, defaultParentStorage)
{
  // import params
  this.data_src_path = data_src_path;
  this.data_src_params = data_src_params;
  this.defaultParentStorage = defaultParentStorage;
  
  // tree functions
  this.req_tree = lib_data_xml_req_tree.bind(this);
  this.get_explorer_path = lib_data_xml_get_explorer_path.bind(this);
  this.get_tree_nodes = lib_data_xml_get_tree_nodes.bind(this);  
  this.get_tree = lib_data_xml_get_tree.bind(this);
  this.load_db_obj = lib_data_xml_load_db_obj.bind(this);
  this.get_children_max_id = lib_data_xml_get_children_max_id.bind(this);
  this.update_db = lib_data_xml_update_db.bind(this);
  this.set_next_id = lib_data_xml_set_next_id.bind(this);

  // item functions
  this.get_multi_parents = lib_data_xml_get_multi_parents.bind(this);
  this.item_exists = lib_data_xml_item_exists.bind(this);
  this.create_tree_item = lib_data_xml_create_tree_item.bind(this);
  this.delete_tree_item = lib_data_xml_delete_tree_item.bind(this);
  this.get_tree_item_parents = lib_data_xml_get_tree_item_parents.bind(this);
  this.get_tree_item_children = lib_data_xml_get_tree_item_children.bind(this);
  this.copy_items = lib_data_xml_copy_items.bind(this);
  this.move_items = lib_data_xml_move_items.bind(this);
  this.attach_to_parent = lib_data_xml_attach_to_parent.bind(this);
  this.detach_from_parent = lib_data_xml_detach_from_parent.bind(this);

  // field functions
  this.create_tree_item_field = lib_data_xml_create_tree_item_field.bind(this);
  this.change_tree_item_field = lib_data_xml_change_tree_item_field.bind(this);
  this.get_tree_item_field = lib_data_xml_get_tree_item_field.bind(this);

  // other functions                    
  this.dump_tree = lib_data_xml_dump_tree.bind(this);
  this.sort = lib_data_xml_sort.bind(this);
  this.quick_sort = lib_data_xml_quick_sort.bind(this);

                    
  // object variables
  this.db_buffer = "";
  this.next_id = 0;               // it's necessary to know which IDs can be created for new items
  this.rts_ret_struct = {};

  // constructor call
  this.load_db_obj(this.bufferUrl);
}





//################################################################################################
//### Tree functions
//################################################################################################



//function lib_data_xml_get_children_max_id(currItem)
//{
//  var childIds = this.get_tree_item_children(currItem);
//  if (currItem == uc_browsing_setup.tree_data_src_params.root_item)
//    var maxId = 0;
//  else
//    var maxId = Number(currItem);
//
//  if (childIds != undefined)
//  {
//    for (var i=0; i<childIds.length; i++)
//    {
//      var child_max_id = Number(this.get_children_max_id(childIds[i]));
//      if (maxId < child_max_id)
//        maxId = child_max_id;
//    }
//  }
//  return maxId;
//}


function lib_data_xml_get_children_max_id(currItem)
{
  var myStack = [currItem];
  var myStackSize = 1;
  var childIds = [];
  var myCurrItem = currItem;
  var savedChild = "";
  var parentItem = "";
  var maxId = 0;

  while (true)
  {
    childIds = this.get_tree_item_children(myCurrItem);  
    if (childIds.length > 0)
    {
      myCurrItem = childIds[0];
      for(var i=0; i<myStackSize; i++)
        if (myStack[i] == myCurrItem)
        {
          alert("Cycle detected ! : " + myStack[myStackSize-1] + "->" + myCurrItem);
          return -1;
        }
      myStack[myStackSize++] = myCurrItem;
      if (maxId < parseInt(myCurrItem))
        maxId = parseInt(myCurrItem);
    }
    else
    {
      var no_sibling_found = true;

      // try to find siblings
      while (no_sibling_found)
      {
        // either Tree Root has no children at all or all elements have been parsed
        if (myCurrItem == uc_browsing_setup.tree_data_src_params.root_item) 
          return maxId;

        parentItem = myStack[(--myStackSize)-1];
        childIds = this.get_tree_item_children(parentItem);  
        var i = 0;
        while ((childIds[i++] != myCurrItem)&&(i<childIds.length)) {}
        // myCurrItem was last child on current level 
        if (i==childIds.length)
        {
          myCurrItem = parentItem;
        }
        else
        {
          myCurrItem = childIds[i];
          for(var i=0; i<myStackSize; i++)
            if (myStack[i] == myCurrItem)
            {
              alert("Cycle detected ! : " + myStack[myStackSize-1] + "->" + myCurrItem);
              return -1;
            }
          myStack[myStackSize++] = myCurrItem;
          no_sibling_found = false; 
          if (maxId < parseInt(myCurrItem))
            maxId = parseInt(myCurrItem);
        }
      }
    }    
  }
  return maxId;
}



// help function of 'lib_data_xml_get_tree'
// -> get parents as Explorer path
function lib_data_xml_get_explorer_path(iparams)  // iparams = {elem_id, lock_id}
{
                                    // copy input params to save source on splice command
  var iparams_cp = jQuery.extend(true, {}, iparams);  
                                    // get parent of current item
  var my_parents = this.get_tree_item_parents(iparams_cp.elem_id);                                   
  if (my_parents.length > 1)
  {
                                    // read from Cookie which parent item applies here
    my_parents = this.get_multi_parents(iparams_cp.elem_id, my_parents);    
  }
                                    // start creating Explorer Path if parent items exist
  var explorer_path = [];
  var elem_id = iparams_cp.elem_id;
  var retval_ct = 0; 
  var level_ct = 0;
  var is_multi = false;
  if (my_parents.length > 0)
  {
                                    // loop until locked item comes into scope
    while (elem_id != iparams_cp.lock_id)
    {   
                                    // use last parent element as current element
      elem_id = my_parents;
                                    // calculate new parent items
      my_parents = this.get_tree_item_parents(elem_id);                                   
      is_multi = false;
      if (my_parents.length > 1)
      {
        my_parents = this.get_multi_parents(elem_id, my_parents);    
        is_multi = true; 
      }
                                    // jump to parent and save it
      level_ct++;
      explorer_path[retval_ct] = {}; 
      if (my_parents.length == 0)
      {
        my_parents = null;
        explorer_path[retval_ct].parent_elem_id = null;            
        explorer_path[retval_ct].parent_gui_id = null;                    
      }
      else
      {
        explorer_path[retval_ct].parent_elem_id = my_parents[0];
        explorer_path[retval_ct].parent_gui_id = "E" + (retval_ct + 1);
      }
      explorer_path[retval_ct].elem_id = elem_id;
      explorer_path[retval_ct].gui_id = "E" + retval_ct;      
      explorer_path[retval_ct].name = this.get_tree_item_field(elem_id, "name"); 
      explorer_path[retval_ct].isMultiPar = is_multi;
      retval_ct = retval_ct + 1;
    }
  } 
  return explorer_path;
}


// help function of 'lib_data_xml_get_tree'
// -> get children as tree
function lib_data_xml_get_tree_nodes(iparams)  // iparams = {elem_id, explorer_path}
{
                                    // copy input params to save source on splice command
  var iparams_cp = jQuery.extend(true, {}, iparams);  

  var level_ct = 0;
  var retval_ct = 0;
  var tree_nodes = [];
  var my_parents = [];
  
  if (iparams.explorer_path.length > 0)
  {
    my_parents = [];
    my_parents[0] = iparams.explorer_path[0];
  }
  else  // element == uc_browsing_setup.tree_data_src_params.root_item
  {
    tree_nodes[retval_ct] = {};                            
    tree_nodes[retval_ct].parent_elem_id = null;    
    tree_nodes[retval_ct].parent_gui_id = null;
    tree_nodes[retval_ct].elem_id = iparams_cp.elem_id;
    tree_nodes[retval_ct].gui_id = "T" + retval_ct;             
    tree_nodes[retval_ct].name = this.get_tree_item_field(iparams_cp.elem_id, "name");
    tree_nodes[retval_ct].type = this.get_tree_item_field(iparams_cp.elem_id, "type");
    if (this.get_tree_item_parents(iparams_cp.elem_id).length > 1)
      tree_nodes[retval_ct].isMultiPar = true;
    else
      tree_nodes[retval_ct].isMultiPar = false;
    my_parents = [tree_nodes[retval_ct]];
    retval_ct = retval_ct + 1;
  }  
  
                                    // continue through the levels downwards to leaves
  do
  {
    var curr_level_children = [];
    var child_idx = 0;
                                    // traverse children
    for(var a=0; a<my_parents.length; a++)
    {
                                    // neue Kind-Knoten der aktuellen Parent-Knoten ermitteln
      var curr_item_child_ids = this.get_tree_item_children(my_parents[a].elem_id);
      if (curr_item_child_ids.length > 0)
        my_parents[a].name = my_parents[a].name + ' &rsaquo;';
      curr_item_child_ids = this.sort(curr_item_child_ids);
      for(var b=0; b<curr_item_child_ids.length; b++)
      {
                                    // save children in output array
        tree_nodes[retval_ct] = {};                            
        tree_nodes[retval_ct].parent_elem_id = my_parents[a].elem_id;                
        tree_nodes[retval_ct].parent_gui_id = my_parents[a].gui_id;                
        tree_nodes[retval_ct].elem_id = curr_item_child_ids[b];             
        tree_nodes[retval_ct].gui_id = "T" + retval_ct;             
        tree_nodes[retval_ct].name = this.get_tree_item_field(curr_item_child_ids[b], "name");
        tree_nodes[retval_ct].type = this.get_tree_item_field(curr_item_child_ids[b], "type");
        if (this.get_tree_item_parents(curr_item_child_ids[b]).length > 1)   
        {
          this.defaultParentStorage.write(curr_item_child_ids[b], my_parents[a].elem_id);
          tree_nodes[retval_ct].isMultiPar = true;
        }
        else
          tree_nodes[retval_ct].isMultiPar = false;  
        curr_level_children[child_idx++] = tree_nodes[retval_ct]; 
        retval_ct = retval_ct + 1;
      }
    }
                                    // change children found out in this level to parents for next level
    my_parents = curr_level_children;
    level_ct = level_ct + 1;
  } while ((my_parents.length > 0) && (level_ct < global_setup.tree_max_child_depth));
  return tree_nodes;
}



// Request data from database
function lib_data_xml_req_tree(iparams)  // iparams = {elemId, lock_id, favIds, tickerIds, cb_fct_call, mode}
//
// possible values for "mode" :
//    "load_all"      -> on X-Tree-M start
//    "tree_only"     -> when only tree item is requested (Explorer Path + Tree-Nodes)
//    "fav_only"      -> only when favorite item is requested (only Explorer Path)
//    "ticker_only"   -> only when new ticker item is selected (only child nodes -> Tree Nodes)
//
{
                                    // copy input params to save source on splice command
  var iparams_cp = jQuery.extend(true, {}, iparams);
  
  this.rts_ret_struct.fav = [];
  this.rts_ret_struct.ticker = [];  
  this.rts_ret_struct.explorer_path = [];
  
  // Explorer Path applications
                                    // kill invalid Favorite ids
  if ((iparams_cp.favIds.length > 0) && ( (iparams.mode == "load_all") || (iparams.mode == "fav_only") ))
  {
    for (var i=0; i<iparams_cp.favIds.length; i++)
    {
      if (iparams_cp.favIds[i] == null)
      {
        this.rts_ret_struct.fav[i] = {};      
        this.rts_ret_struct.fav[i].elem_id = null;
        this.rts_ret_struct.fav[i].name = null;
        this.rts_ret_struct.fav[i].text = null;
      }
      else
      { 
        this.rts_ret_struct.fav[i] = this.get_explorer_path({elem_id:iparams_cp.favIds[i], lock_id:uc_browsing_setup.tree_data_src_params.root_item});
        var myself_elem = {};
        myself_elem.elem_id = iparams_cp.favIds[i];
        myself_elem.name = this.get_tree_item_field(iparams_cp.favIds[i], "name");
        myself_elem.text = "";
        this.rts_ret_struct.fav[i].unshift(myself_elem);
      }      
    }   
  }      
  if ( (iparams.mode == "load_all") || (iparams.mode == "tree_only") )
    this.rts_ret_struct.explorer_path = this.get_explorer_path({elem_id:iparams_cp.elemId[0], lock_id:iparams_cp.lock_id});

  // Tree Node applications
                                    // kill invalid ticker ids
  if ((iparams_cp.tickerIds.length > 0) && ( (iparams.mode == "load_all") || (iparams.mode == "ticker_only") ))
  {
                // kill invalid ticker ids
    for (var i=0; i<iparams_cp.tickerIds.length; i++)
    {
      if (iparams_cp.tickerIds[i] == null)
      {
        this.rts_ret_struct.ticker[i] = {};      
        this.rts_ret_struct.ticker[i].elem_id = null;
        this.rts_ret_struct.ticker[i].name = null;
        this.rts_ret_struct.ticker[i].text = null;
      }
      else
      { 
        var temp_tree = this.get_tree_nodes({elem_id:iparams_cp.tickerIds[i], explorer_path:[]});
                                    // create ticker itself ...
        this.rts_ret_struct.ticker[i] = {};      
        this.rts_ret_struct.ticker[i].elem_id = temp_tree[0].elem_id;
        this.rts_ret_struct.ticker[i].name = temp_tree[0].name; 
                                    // ... and its children
        this.rts_ret_struct.ticker[i].text = " +++ ";                
        for (var j=1; j<temp_tree.length; j++)
        {
          if (temp_tree[j].parent_elem_id == temp_tree[0].elem_id)
            this.rts_ret_struct.ticker[i].text = this.rts_ret_struct.ticker[i].text + temp_tree[j].name + " +++ ";
        }
      }      
    }   
  }                
  if ( (iparams.mode == "load_all") || (iparams.mode == "tree_only") )
    this.rts_ret_struct.tree_nodes = this.get_tree_nodes({elem_id:iparams_cp.elemId[0], explorer_path:this.rts_ret_struct.explorer_path});
  
  
  // alert("req_get_tree");
  if (iparams.mode == "load_all")
                                        // The "load all" option is usually loaded while the "curr_uc_dispatcher" 
                                        // is being created. Since the object is marked as undefined in the 
                                        // global_dispatcher unless its init function has finished and 
                                        // we are now in a sub-call of this init function we need to postpone the 
                                        // call of the callback function using the resulting but still not available
                                        // dispatcher object. A value of 100ms should halt the callback function until
                                        // the dispatcher object is created.
    setTimeout(iparams.cb_fct_call, 100);
  else     
    eval(iparams.cb_fct_call);
}



function lib_data_xml_get_tree(iparams)   // iparams = {elemId, lock_id, favIds, tickerIds, cb_fct_call, mode}
{
  return this.rts_ret_struct;  
}


function lib_data_xml_load_db_obj()
{
  var path = "";
  if (this.data_src_path.toLowerCase() == "local")
  {
    path = "http://" + window.location.host + window.location.pathname + this.data_src_params.db_name;
  }
  else
  {
    path = "http://" + this.data_src_path + "/" + this.data_src_params.db_name;
  }
  
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
  xmlhttp.open("GET",path+"?n="+myRandom,false);
  xmlhttp.send(null);
  this.db_buffer = xmlhttp.responseXML;

  if (this.db_buffer == null)  
  {
    alert(c_LANG_LIB_DATA_MSG_DATABASE_DOESNT_EXIST[global_setup.curr_lang]);
  }
  else
  {
    this.next_id = this.get_children_max_id(uc_browsing_setup.tree_data_src_params.root_item) + 1;
  }
}


// update XML data in database on webserver
function lib_data_xml_update_db()
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    var xhr = new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var path = "";
  if (this.data_src_path.toLowerCase() == "local")
  {
    path = "http://" + window.location.host + window.location.pathname + this.data_src_params.php_name;
  }
  else
  {
    path = "http://" + this.data_src_path + "/" + this.data_src_params.php_name;
  }
  xhr.open("POST", path, true);
//  var strContent = 'db_name=' + this.data_src_params.db_name + '&content=' + (new XMLSerializer()).serializeToString(this.db_buffer);
  var strContent = (new XMLSerializer()).serializeToString(this.db_buffer);  
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(strContent);
}


// set next ID
function lib_data_xml_set_next_id(next_id)
{
  this.next_id = next_id;
}


// dump XML content
function lib_data_xml_dump_tree()
{

}



function lib_data_xml_quick_sort(my_item_list, name_list)
{
  var smaller_id = [];
  var smaller_name = [];  
  var bigger_id = [];
  var bigger_name = [];  
  var pivot_idx = my_item_list.length - 1;  
  var bigger_idx = 0;
  var smaller_idx = 0;
  
  if (pivot_idx < 0)
    return [];
  else
    if (pivot_idx == 0)
      return [my_item_list[pivot_idx]];
    else
      for (var i=0; i<(my_item_list.length - 1); i++)
      {
        if (name_list[pivot_idx] < name_list[i])
        {
          bigger_id[bigger_idx] = my_item_list[i];
          bigger_name[bigger_idx] = name_list[i];
          bigger_idx = bigger_idx + 1;
        }
        else
        {
          smaller_id[smaller_idx] = my_item_list[i];
          smaller_name[smaller_idx] = name_list[i]; 
          smaller_idx = smaller_idx + 1;
        }
      }
      smaller_id = this.quick_sort(smaller_id, smaller_name);
      smaller_id[smaller_id.length] = my_item_list[pivot_idx];
      return smaller_id.concat(this.quick_sort(bigger_id, bigger_name));
 
}
  

// sort a list of tree items
function lib_data_xml_sort(my_item_list)
{
                                    // get name and type of the items in "my_item_list" (lists with same order)
  var name_list = [];
  var type_list = [];
  var result_list = [];
  for (var i=0; i<my_item_list.length; i++)
  {
    name_list[i] = this.get_tree_item_field(my_item_list[i], "name");
    type_list[i] = this.get_tree_item_field(my_item_list[i], "type");    
  }
                                    // go though all types 
  for (var i=1; i<c_LANG_LIB_TREE_ELEMTYPE.length; i++)
  {
    var type_item_ids = [];
    var type_item_names = [];    
    var type_item_list_idx = 0;
                                    // find all items of current type
    for (var j=0; j<my_item_list.length; j++)
    {
      if (c_LANG_LIB_TREE_ELEMTYPE[i][0] == type_list[j])
      {
        type_item_ids[type_item_list_idx] = my_item_list[j]; 
        type_item_names[type_item_list_idx] = name_list[j];         
        type_item_list_idx = type_item_list_idx + 1;
      }
    }
                                    // sort items of current type by name
    type_item_ids = this.quick_sort(type_item_ids, type_item_names);
                                    // append list of items to result list
    result_list = result_list.concat( type_item_ids);
  }
  return result_list;
}


//######################s##########################################################################
//### Item functions
//################################################################################################


function lib_data_xml_get_multi_parents(elem_id, my_parents)
{
  var parent_from_storage = this.defaultParentStorage.read(elem_id);
  if (parent_from_storage == undefined)
    return my_parents[0]; 
  else
    return parent_from_storage;   
}

// find out whether or not an item exists
function lib_data_xml_item_exists(itemId)
{
  var item = getDBElementById(this.db_buffer, itemId);
  return item != undefined;
}


// create new tree item
function lib_data_xml_create_tree_item( iparams )  // iparams = {parent_elem_id, name, type, lock_id, cb_fctn_str}  
{
  var iparams_cp = jQuery.extend(true, {}, iparams);   
  var rootItem = this.db_buffer.getElementsByTagName("db_root")[0];
  var parentItem = getDBElementById(this.db_buffer, iparams_cp.parent_elem_id);
  var newId = "-1";

  if (parentItem != undefined)
  {
    var currItem = this.db_buffer.createElement("item");
      currItem.setAttribute("id",this.next_id); 
    var nameField = this.db_buffer.createElement("name"); 
      setInnerHTML(nameField,iparams_cp.name);
    var typeField = this.db_buffer.createElement("type"); 
      setInnerHTML(typeField, iparams_cp.type);      
    var refersToField = this.db_buffer.createElement("refers_to");
    var referredFromField = this.db_buffer.createElement("referred_from");
    var referredFromEntry = this.db_buffer.createElement("sep");
      setInnerHTML(referredFromEntry, iparams_cp.parent_elem_id);
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
    newId = this.next_id+'';
    this.next_id = this.next_id + 1;
    var referToItem = parentItem.getElementsByTagName("refers_to")[0];
    referToItem.appendChild(parentRefersToEntry);
  }
  else
    alert(c_LANG_WARNING_PARENT_MISSING[global_setup.curr_lang]);
//  this.dump_tree();
  this.update_db();                
  this.req_tree({elemId:[iparams_cp.parent_elem_id], lock_id:iparams_cp.lock_id, favIds:[], tickerIds:[], cb_fct_call:iparams_cp.cb_fctn_str, mode:"tree_only"});
  return newId;
}



// delete item and all of its children
function lib_data_xml_delete_tree_item(iparams)  // iparams = {parentId, itemId, lock_id, cb_fctn_str}
{
                                    // save params
  var iparams_cp = jQuery.extend(true, {}, iparams);
    
  if (iparams_cp.itemId != uc_browsing_setup.tree_data_src_params.root_item)
  {
    var currItem = getDBElementById(this.db_buffer, iparams_cp.itemId);
    var myChildren = this.get_tree_item_children(iparams_cp.itemId);
    
    if (myChildren.length > 0)
    {
      for (var i=0; i<myChildren.length; i++)
      {
        this.delete_tree_item(myChildren[i]);
      }
    }
    
    this.detach_from_parent(iparams_cp.parentId, iparams_cp.itemId);
    
    if (currItem.outerHTML != null)
      currItem.outerHTML = "";
    else
      currItem.parentNode.removeChild(currItem);               
  }    
  else
    alert(c_LANG_LIB_DATA_ROOT_ITEM_NOT_ERASABLE[global_setup.curr_lang]);

  this.update_db();                
  this.req_tree({elemId:[iparams_cp.parentId], lock_id:iparams_cp.lock_id, favIds:[], tickerIds:[], cb_fct_call:iparams_cp.cb_fctn_str, mode:"tree_only"});
}



// get Item's parent nodes
function lib_data_xml_get_tree_item_parents(itemId)
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
//    alert(c_LANG_WARNING_CURRENT_MISSING[global_setup.curr_lang]);
  return [];
}



// get Item's child nodes
function lib_data_xml_get_tree_item_children(itemId)
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
    alert(c_LANG_WARNING_CURRENT_MISSING[global_setup.curr_lang]);
  return [];
}


// copy function
function lib_data_xml_copy_items(iparams)  // iparams = {src_elem, dst_elem, lock_id, cb_fctn_str}
{
  for (var i=0; i<iparams.src_elem.length; i++)
  {
    this.attach_to_parent(iparams.dst_elem.elem_id, iparams.src_elem[i].elem_id);
  }
  this.update_db();                
  this.req_tree({elemId:[iparams.dst_elem.elem_id], lock_id:iparams.lock_id, favIds:[], tickerIds:[], cb_fct_call:iparams.cb_fctn_str, mode:"tree_only"});
}


// move function
function lib_data_xml_move_items(iparams)  // iparams = {src_elem, dst_elem, old_parent_id ,lock_id, cb_fctn_str}
{
  for (var i=0; i<iparams.src_elem.length; i++)
  {
    this.detach_from_parent(iparams.old_parent_id, iparams.src_elem[i].elem_id);    
    this.attach_to_parent(iparams.dst_elem.elem_id, iparams.src_elem[i].elem_id);
  }  
  this.update_db();                
  this.req_tree({elemId:[iparams.dst_elem.elem_id], lock_id:iparams.lock_id, favIds:[], tickerIds:[], cb_fct_call:iparams.cb_fctn_str, mode:"tree_only"});
}


// cut&paste operations (later : for copy by reference) 
function lib_data_xml_attach_to_parent(parentId, itemId)
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
    alert(c_LANG_WARNING_CURRENT_MISSING[global_setup.curr_lang]);
  this.dump_tree();
}


// cut&paste operations (later : for copy by reference) 
function lib_data_xml_detach_from_parent(parentId, itemId)
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
    alert(c_LANG_WARNING_CURRENT_MISSING[global_setup.curr_lang]);
  this.dump_tree();
}



//################################################################################################
//### Field functions
//################################################################################################

// create fields of tree item
function lib_data_xml_create_tree_item_field(itemId, fieldId, content)
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
      alert(c_LANG_WARNING_FIELD_REDUNDANCE[global_setup.curr_lang] + fieldId + " !");
    }
  }
  else
  { 
    alert(c_LANG_WARNING_ITEM_MISSING[global_setup.curr_lang] + itemId + " !");
  }
  this.dump_tree();
}



// change fields of tree item
function lib_data_xml_change_tree_item_field(iparams)      // iparams = {items, field_id, content, lock_id, cb_fctn_str}
{
                                    // save params
  var iparams_cp = jQuery.extend(true, {}, iparams);
      
  var currItem = getDBElementById(this.db_buffer, iparams_cp.items[0].elem_id);

  if (currItem != undefined) 
  {
    var myItemField = currItem.getElementsByTagName(iparams_cp.field_id);
    if ((myItemField != undefined) && (myItemField.length > 0))
    {
      setInnerHTML(myItemField[0], iparams_cp.content);
    }
    else
    {
      this.create_tree_item_field(iparams_cp.items[0].elem_id, iparams_cp.field_id, iparams_cp.content);
//      alert(c_LANG_MSG_FIELD_CREATED[global_setup.curr_lang] + iparams_cp.field_id + " !");
    }
  }
  else
  { 
    alert(c_LANG_WARNING_ITEM_MISSING[global_setup.curr_lang] + iparams_cp.field_id + " !");
  }
  this.update_db();                
//  this.dump_tree();
  this.req_tree({elemId:[iparams_cp.items[0].elem_id], lock_id:iparams_cp.lock_id, favIds:[], tickerIds:[], cb_fct_call:iparams_cp.cb_fctn_str, mode:"tree_only"});
}



// get field content
function lib_data_xml_get_tree_item_field(itemId, fieldId)
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
    alert(c_LANG_WARNING_ITEM_MISSING[global_setup.curr_lang] + itemId + " !");
  }
  this.dump_tree();
  return undefined;
}

