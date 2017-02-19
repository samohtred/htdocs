// https://piratenpad.de/p/3dCFdjUeoUAPY
// http://jsfiddle.net/rniemeyer/LkqTU/
// http://jsfiddle.net/stevegreatrex/RZXyT/1/
// http://knockoutjs.com/examples/clickCounter.html


function lib_data_dispatcher(defaultParentStorage, data_src_type, data_src_path, data_src_params, global_setup)
{
  // take over params
  this.defaultParentStorage = defaultParentStorage;
  this.data_src_type = data_src_type;
  this.data_src_path = data_src_path;
  this.data_src_params = data_src_params;
  this.global_setup = global_setup;
  
  // bind local functions
  this.init = lib_data_dispatcher_init.bind(this);
  this.command = lib_data_dispatcher_command.bind(this);
  this.get_tree_item_parents = lib_data_dispatcher_get_tree_item_parents.bind(this);
  this.get_tree_item_content = lib_data_dispatcher_get_tree_item_content.bind(this);
  this.set_default_parents = lib_data_dispatcher_set_default_parents.bind(this);
  
  // object variables
  this.db_obj = null;
  
  // start constructor
  this.init();
}


function lib_data_dispatcher_init() 
{
  switch (this.data_src_type)
  {                               
    case c_DATA_SOURCE_TYPE_ID_HTML :
        this.db_obj                     = new lib_data_html(this.data_src_path, this.data_src_params, this.defaultParentStorage, this.global_setup);     
    break;
    case c_DATA_SOURCE_TYPE_ID_XML :
        this.db_obj                     = new lib_data_xml(this.data_src_path, this.data_src_params, this.defaultParentStorage, this.global_setup); 
    break;
    case c_DATA_SOURCE_TYPE_ID_DISCO :
        this.db_obj                     = new lib_data_disco(this.data_src_path, this.data_src_params, this.defaultParentStorage, this.global_setup);  
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
    case "req_tree"                     : this.db_obj.req_tree(iparams); break;
    case "get_tree"                     : ovalues = this.db_obj.get_tree(iparams); break;
    case "write_tree"                   : this.db_obj.write_tree(iparams); break;
    case "delete_item"                  : this.db_obj.delete_tree_item(iparams); break;
    case "create_item"                  : this.db_obj.create_tree_item(iparams); break;
    case "change_item_field"            : this.db_obj.change_tree_item_field(iparams); break;
    case "copy_item"                    : this.db_obj.copy_items(iparams); break;
    case "move_item"                    : this.db_obj.move_items(iparams); break;
    case "req_all_parents"              : this.db_obj.req_all_parents(iparams); break;
    case "get_all_parents"              : ovalues = this.db_obj.get_all_parents(iparams); break;
    
    case "set_default_parents"          : this.set_default_parents(iparams); break;
    default : 
      alert(c_LANG_LIB_DATA_MSG_UNKNOWN_COMMAND[global_setup.curr_lang] + cmd_name);
      ovalues = null;
    break; 
  }
  return ovalues; 
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
    this.defaultParentStorage.write(link_list[i].elem_id, link_list[i].parent_id);
  }
}



