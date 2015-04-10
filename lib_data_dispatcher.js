// https://piratenpad.de/p/3dCFdjUeoUAPY
// http://jsfiddle.net/rniemeyer/LkqTU/
// http://jsfiddle.net/stevegreatrex/RZXyT/1/
// http://knockoutjs.com/examples/clickCounter.html


function lib_data_dispatcher(defaultParentStorage, data_src_type, data_src_path, data_src_params)
{
  // take over params
  this.defaultParentStorage = defaultParentStorage;
  this.data_src_type = data_src_type;
  this.data_src_path = data_src_path;
  this.data_src_params = data_src_params;
  
  // bind local functions
  this.init = lib_data_dispatcher_init.bind(this);
  this.command = lib_data_dispatcher_command.bind(this);
  this.get_multi_parents = lib_data_dispatcher_get_multi_parents.bind(this);
  this.get_tree = lib_data_dispatcher_get_tree.bind(this);
  this.get_tree_item_parents = lib_data_dispatcher_get_tree_item_parents.bind(this);
  this.get_tree_item_content = lib_data_dispatcher_get_tree_item_content.bind(this);
  this.set_default_parents = lib_data_dispatcher_set_default_parents.bind(this);
  this.delete_items = lib_data_dispatcher_delete_items.bind(this);
  this.move_items = lib_data_dispatcher_move_items.bind(this);
  this.copy_items = lib_data_dispatcher_copy_items.bind(this);
  this.sort = lib_data_dispatcher_sort.bind(this);
  this.quick_sort = lib_data_dispatcher_quick_sort.bind(this);
  
  // object variables
  this.db_obj = null;
  
  // start constructor
  this.init();
}


function lib_data_dispatcher_init() 
{
  switch (this.data_src_type)
  {
    case c_DATA_SOURCE_TYPE_ID_XML :
        this.db_obj                     = new lib_data_xml(this.data_src_path, this.data_src_params); 
    break;
    case c_DATA_SOURCE_TYPE_ID_DISCO :
//        this.db_obj                     = new lib_data_disco();  
    break;
    default :
    break;
  }
  
}


function lib_data_dispatcher_command(iparams, cmd_name)
{
  var ovalues = [];
  switch (cmd_name)
  {
    case "get_tree"                     : ovalues = this.get_tree(iparams); break;
    case "get_parents"                  : ovalues = this.get_tree_item_parents(iparams); break;
    case "get_content"                  : ovalues = this.get_tree_item_content(iparams); break; 
    case "set_default_parents"          : this.set_default_parents(iparams); break;
    case "set_content"                  : this.db_obj.change_tree_item_field(iparams.elem_id, "content", escape(iparams.content));this.db_obj.update_db(); break;
    case "create_item"                  : this.db_obj.create_tree_item(iparams.parent_elem_id, iparams.name, iparams.type);       this.db_obj.update_db(); break;
    case "change_item_field"            : this.db_obj.change_tree_item_field(iparams.item_id, iparams.field_id, iparams.content); this.db_obj.update_db(); break;
    case "delete_item"                  : this.delete_items(iparams.elem);                                                        this.db_obj.update_db(); break;
    case "move_item"                    : this.move_items(iparams.src_elem, iparams.dst_elem);                                    this.db_obj.update_db(); break;
    case "copy_item"                    : this.copy_items(iparams.src_elem, iparams.dst_elem);                                    this.db_obj.update_db(); break;
    case "db_update"                    : this.db_obj.update_db(); break;
    // The following commands can be applied to several items in a loop. Therefore you have to take care of the database update
    // for yourself !
    case "set_type"                     : this.db_obj.change_tree_item_field(iparams.elem_id, "type", iparams.content); break; 
    default : 
      alert(c_LANG_LIB_DATA_MSG_UNKNOWN_COMMAND[global_setup.curr_lang] + cmd_name);
      ovalues = null;
    break; 
  }
  return ovalues; 
}


function lib_data_dispatcher_get_multi_parents(elem_id, my_parents)
{
  var parent_from_storage = this.defaultParentStorage.read(elem_id);
  if (parent_from_storage == undefined)
    return my_parents[0]; 
  else
    return parent_from_storage;   
}


// avoid too much intelligence in the gui module
// -> guiId is the GUI ID of the currently selected item which contains 
//    the parent ID and the current ID
function lib_data_dispatcher_get_tree(iparams)
{
  var ret_struct = {};
  var elem_id = iparams.elemId;
  var retval_ct = 0; 
  var level_ct = 0;
  var is_multi = false;
                                    
  // part 1 : get parents as Explorer path
                                    // get parent of current item
  var my_parents = this.db_obj.get_tree_item_parents(elem_id);                                   
  if (my_parents.length > 1)
  {
                                    // read from Cookie which parent item applies here
    my_parents = this.get_multi_parents(elem_id, my_parents);    
  }
                                    // start creating Explorer Path if parent items exist
  ret_struct.explorer_path = [];
  if (my_parents.length > 0)
  {
                                    // loop until locked item comes into scope
    while (elem_id != iparams.lock_id)
    {   
                                    // use last parent element as current element
      elem_id = my_parents;
                                    // calculate new parent items
      my_parents = this.db_obj.get_tree_item_parents(elem_id);                                   
      is_multi = false;
      if (my_parents.length > 1)
      {
        my_parents = this.get_multi_parents(elem_id, my_parents);    
        is_multi = true; 
      }
                                    // jump to parent and save it
      level_ct++;
      ret_struct.explorer_path[retval_ct] = {}; 
      if (my_parents.length == 0)
      {
        my_parents = null;
        ret_struct.explorer_path[retval_ct].parent_elem_id = null;            
        ret_struct.explorer_path[retval_ct].parent_gui_id = null;                    
      }
      else
      {
        ret_struct.explorer_path[retval_ct].parent_elem_id = my_parents[0];
        ret_struct.explorer_path[retval_ct].parent_gui_id = "E" + (retval_ct + 1);
      }
      ret_struct.explorer_path[retval_ct].elem_id = elem_id;
      ret_struct.explorer_path[retval_ct].gui_id = "E" + retval_ct;      
      ret_struct.explorer_path[retval_ct].name = this.db_obj.get_tree_item_field(elem_id, "name"); 
      ret_struct.explorer_path[retval_ct].isMultiPar = is_multi;
      retval_ct = retval_ct + 1;
    }
  } 
  
  // part 2 : get children as tree
  level_ct = 0;
  retval_ct = 0;
  ret_struct.tree_nodes = [];
  if (ret_struct.explorer_path.length > 0)
  {
    my_parents = [];
    my_parents[0] = ret_struct.explorer_path[0];
  }
  else  // element == "root"
  {
    ret_struct.tree_nodes[retval_ct] = {};                            
    ret_struct.tree_nodes[retval_ct].parent_elem_id = null;    
    ret_struct.tree_nodes[retval_ct].parent_gui_id = null;
    ret_struct.tree_nodes[retval_ct].elem_id = iparams.elemId;             
    ret_struct.tree_nodes[retval_ct].gui_id = "T" + retval_ct;             
    ret_struct.tree_nodes[retval_ct].name = this.db_obj.get_tree_item_field(iparams.elemId, "name");
    ret_struct.tree_nodes[retval_ct].type = this.db_obj.get_tree_item_field(iparams.elemId, "type");
    if (this.db_obj.get_tree_item_parents(iparams.elemId).length > 1)
      ret_struct.tree_nodes[retval_ct].isMultiPar = true;
    else
      ret_struct.tree_nodes[retval_ct].isMultiPar = false;
    my_parents = [ret_struct.tree_nodes[retval_ct]];
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
      var curr_item_child_ids = this.db_obj.get_tree_item_children(my_parents[a].elem_id);
      if (curr_item_child_ids.length > 0)
        my_parents[a].name = my_parents[a].name + ' &rsaquo;';
      curr_item_child_ids = this.sort(curr_item_child_ids);
      for(var b=0; b<curr_item_child_ids.length; b++)
      {
                                    // save children in output array
        ret_struct.tree_nodes[retval_ct] = {};                            
        ret_struct.tree_nodes[retval_ct].parent_elem_id = my_parents[a].elem_id;                
        ret_struct.tree_nodes[retval_ct].parent_gui_id = my_parents[a].gui_id;                
        ret_struct.tree_nodes[retval_ct].elem_id = curr_item_child_ids[b];             
        ret_struct.tree_nodes[retval_ct].gui_id = "T" + retval_ct;             
        ret_struct.tree_nodes[retval_ct].name = this.db_obj.get_tree_item_field(curr_item_child_ids[b], "name");
        ret_struct.tree_nodes[retval_ct].type = this.db_obj.get_tree_item_field(curr_item_child_ids[b], "type");
        if (this.db_obj.get_tree_item_parents(curr_item_child_ids[b]).length > 1)   
        {
          this.defaultParentStorage.write(curr_item_child_ids[b], my_parents[a].elem_id);
          ret_struct.tree_nodes[retval_ct].isMultiPar = true;
        }
        else
          ret_struct.tree_nodes[retval_ct].isMultiPar = false;  
        curr_level_children[child_idx++] = ret_struct.tree_nodes[retval_ct]; 
        retval_ct = retval_ct + 1;
      }
    }
                                    // change children found out in this level to parents for next level
    my_parents = curr_level_children;
    level_ct = level_ct + 1;
  } while ((my_parents.length > 0) && (level_ct < global_setup.tree_max_child_depth));
  
  return ret_struct;
}


function lib_data_dispatcher_get_tree_item_parents(iparams)
{
  var my_parents = this.db_obj.get_tree_item_parents(iparams.elem_id);
  var ret_struct = [];

  for(var a=0; a<my_parents.length; a++)
  {
    ret_struct[a] = {};
    ret_struct[a].elem_id = my_parents[a];
    ret_struct[a].name = this.db_obj.get_tree_item_field(my_parents[a], "name");
  } 
  return ret_struct;
}


function lib_data_dispatcher_get_tree_item_content(elem_id)
{
  var ret_struct = {};
  ret_struct.name = this.db_obj.get_tree_item_field(elem_id, "name");
  ret_struct.description = unescape(this.db_obj.get_tree_item_field(elem_id, "content"));
  return ret_struct;
}


function lib_data_dispatcher_set_default_parents(link_list)
{
  for (var i=0; i<link_list.length; i++)
  {
                                    // for multi-parent nodes : save current default path
    if (this.db_obj.get_tree_item_parents(link_list[i].elem_id).length > 1)
    {
      this.defaultParentStorage.write(link_list[i].elem_id, link_list[i].parent_id);
    }
  }
}


function lib_data_dispatcher_delete_items(elems)
{
  // to be done
  for (var i=0; i<elems.length; i++)
  {
    // detach from parent
    this.db_obj.detach_from_parent(elems[i].parent_elem_id, elems[i].elem_id);    
    // falls keine Parents mehr existieren : löschen
    if (this.db_obj.get_tree_item_parents(elems[i].elem_id) == 0)
      this.db_obj.delete_tree_item(elems[i].elem_id);
  }
}


function lib_data_dispatcher_move_items(src_elems, dst_elem)
{
  for (var i=0; i<src_elems.length; i++)
  {
    this.db_obj.detach_from_parent(src_elems[i].parent_elem_id, src_elems[i].elem_id);    
    this.db_obj.attach_to_parent(dst_elem.elem_id, src_elems[i].elem_id);
  }
}


function lib_data_dispatcher_copy_items(src_elems, dst_elem)
{
  for (var i=0; i<src_elems.length; i++)
  {
    this.db_obj.attach_to_parent(dst_elem.elem_id, src_elems[i].elem_id);
  }
}


function lib_data_dispatcher_quick_sort(my_item_list, name_list)
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
function lib_data_dispatcher_sort(my_item_list)
{
                                    // get name and type of the items in "my_item_list" (lists with same order)
  var name_list = [];
  var type_list = [];
  var result_list = [];
  for (var i=0; i<my_item_list.length; i++)
  {
    name_list[i] = this.db_obj.get_tree_item_field(my_item_list[i], "name");
    type_list[i] = this.db_obj.get_tree_item_field(my_item_list[i], "type");    
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
      if (c_LANG_LIB_TREE_ELEMTYPE[i][2] == type_list[j])
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