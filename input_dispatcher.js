

// Class 'input_dispatcher'
function input_dispatcher(main_tree_context)
{
  // public methods
  this.create_tree = input_dispatcher_create_tree.bind(this);
  this.key_event = input_dispatcher_key_event;
  this.clicked_at = input_dispatcher_clicked_at.bind(this);
  this.input_done = input_dispatcher_input_done.bind(this);	// bind command to make sure that 'this' is still
								// known inside function body
  this.print_subtree_get_symbol = input_dispatcher_print_subtree_get_symbol.bind(this);     
  this.quick_sort = input_dispatcher_quick_sort.bind(this);
  this.item_sort = input_dispatcher_item_sort.bind(this);
  this.print_subtree = input_dispatcher_print_subtree.bind(this);


  // private variables
  var my_main_tree_context = main_tree_context;
  this.ctrl_pressed = false;
  this.shift_pressed = false;
  this.currently_selected=["root"];
  this.select_idx=0;
  this.currently_cut=[];
  this.currently_copied="";
  this.currentItemType = 0;
  this.new_tree_item_input = false;
  var my_main_tree = new topic_tree_gui(main_tree_context, this, this.input_done, this.clicked_at);
  this.my_main_tree = my_main_tree;
  var my_db_intelligence = new db_intelligence(document.getElementById("main_features_pad"));
  this.my_db_intelligence = my_db_intelligence;
  this.saved_item_id = "";
  this.saved_item_name = "";

  // constructor
  this.create_tree();
}




function input_dispatcher_create_tree()
{
  var maxDepth = 10;
  this.my_db_intelligence.create_tree(xmlDataUrl);
  this.my_db_intelligence.set_latest_id(this.print_subtree(undefined, "root", maxDepth) + 1);
  this.my_main_tree.markup_item(this.currently_selected[0], true);
}


// find out correct symbol of item
function input_dispatcher_print_subtree_get_symbol(elemType)
{
  if (elemType == undefined)
    return "symbol_topic.gif";
  else
  {
    var elemTypeInt = -1;
    for (var i=0; i<elemTypeList.length; i++)
    {
      if (elemTypeList[i] == elemType)
        elemTypeInt = i;
    }
    if (elemTypeInt < 0)
      return "symbol_unknown.gif";
    else
      return elemSymbolList[elemTypeInt];
  }
}

function input_dispatcher_quick_sort(my_item_list, name_list)
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
function input_dispatcher_item_sort(my_item_list)
{
                                    // get name and type of the items in "my_item_list" (lists with same order)
  var name_list = [];
  var type_list = [];
  var result_list = [];
  for (var i=0; i<my_item_list.length; i++)
  {
    name_list[i] = this.my_db_intelligence.get_tree_item_field(my_item_list[i], "name");
    type_list[i] = this.my_db_intelligence.get_tree_item_field(my_item_list[i], "type");    
  }
                                    // go though all types 
  for (var i=0; i<elemTypeList.length; i++)
  {
    var type_item_ids = [];
    var type_item_names = [];    
    var type_item_list_idx = 0;
                                    // find all items of current type
    for (var j=0; j<my_item_list.length; j++)
    {
      if (elemTypeList[i] == type_list[j])
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



// recursively print tree or part of a tree until maximum depth is reached
function input_dispatcher_print_subtree(parentId, itemId, maxDepth)
{
                                    // Init
  var curr_level = 1;
  var max_id = parseInt(itemId) || 0;
  var is_num = typeof "5";
  var curr_child_id;
                                    // get info about myself
  var itemName = this.my_db_intelligence.get_tree_item_field(itemId, "name");
  var elemType = this.my_db_intelligence.get_tree_item_field(itemId, "type");
  var mySymbol = this.print_subtree_get_symbol(elemType);
                                    // print myself in tree
  this.my_main_tree.print_item(parentId, itemId, itemName, mySymbol);
                                    // get my children and apply same function again
  var myChildren = this.my_db_intelligence.get_tree_item_children(itemId);
  if ((myChildren.length > 0) && (maxDepth != 0))
  {
    myChildren= this.item_sort(myChildren);
    for (var i=0; i<myChildren.length; i++)
    {
      curr_child_id = parseInt(this.print_subtree(itemId, myChildren[i].toString(), maxDepth-1));
      if (curr_child_id != NaN)
        if (curr_child_id > max_id)
          max_id = curr_child_id;
    }
  }
//  if (itemId == "root")
//    alert("Print Subtree");
  return max_id;
}



function input_dispatcher_key_event(e)
{
  var is_ie = false; 
  
  if (this.currently_selected[0] == undefined)
    this.currently_selected = [];
                                    // special treatment for Internet Explorer
  if (e==undefined)
  {
    is_ie = true;
    var e = window.event;
  }

  // Ctrl
  if(e.keyCode==17)
  { 
    if (e.type=='keydown')
      this.ctrl_pressed = true;
    else
      this.ctrl_pressed = false;
  }
  
  // Shift
  if(e.keyCode==16) 
  { 
    if (e.type=='keydown')
      this.shift_pressed = true;
    else
      this.shift_pressed = false;
  }


  if (e.type=='keyup' || is_ie)
  {
    if(e.ctrlKey)
    {
      // STRG+C  -> later : for double parent link
      if(e.keyCode==67)
      { 
//        alert("STRG-C");
        this.clicked_at("main_menu", "copy_item");
      }

      // STRG+X
      if(e.keyCode==88)
      { 
//        alert("STRG-X");
        this.clicked_at("main_menu", "cut_item");
      }

      // STRG+V
      if(e.keyCode==86)
      { 
//        alert("STRG-V");
        this.clicked_at("main_menu", "paste_item");
      }
    }    
    
    if (e.altKey)
    {
      // Alt+0..9
      if(e.keyCode<58 && e.keyCode>47)
      { 
//        alert("ALT-"+(e.keyCode-48));        
        this.clicked_at("main_menu_elem_type", new String(e.keyCode-48));
      }

      // ALT+N
      if(e.keyCode==78)
      { 
//        alert("ALT-N");
        this.clicked_at("main_menu", "input_item");
      }
    }
    
    // ENTER
    if(e.keyCode==13 && ((this.new_tree_item_input == true)||(this.saved_item_id != "")))
    { 
//      alert("Enter");
      // this should only be executed when a new input element was created before
      this.input_done();
    }

    // ESC
    if(e.keyCode==27)
    { 
//      alert("ESC");
      this.clicked_at("main_menu", "cancel_item");
    }

    // F2
    if(e.keyCode==113)
    { 
//      alert("F2");
      this.clicked_at("main_menu", "change_item");
    }
    
    // DEL
    if(e.keyCode==46)
    { 
//      alert("DEL");
      this.clicked_at("main_menu", "delete_item");
    }
  }
}


// catch mouse clicks and process forwarded keyboard inputs
function input_dispatcher_clicked_at(panel, item)
{
  // choose element type
  if (panel == "main_menu_elem_type")
  {
    var item_int = parseInt(item);
    if (item_int < elemTypeList.length)
    {
      var myElemType = document.getElementById("info_row_curr_elem_type_div");    
      myElemType.innerHTML = elemTypeList[item_int];
      if (this.currently_selected.length!=0)
      {
        for (var i=0; i<this.currently_selected.length ; i++)
        {
          if (this.currently_selected[i]!="root") 
          {
                                    // change type field in database
            var currentType = this.my_db_intelligence.get_tree_item_field(this.currently_selected[i], "type");
            if (currentType == undefined)
              this.my_db_intelligence.create_tree_item_field(this.currently_selected[i], "type", elemTypeList[item_int]);
            else
              this.my_db_intelligence.change_tree_item_field(this.currently_selected[i], "type", elemTypeList[item_int]);
                                    // change element type on screen
            this.my_main_tree.change_symbol(this.currently_selected[i], elemSymbolList[item_int]);
          }
        }
                                    // write changes to database
        this.my_db_intelligence.update_db(uploadPhpUrl);
        this.print_subtree(undefined, "root", 100);
        for (var i=0; i<this.currently_selected.length; i++)
        {
          this.my_main_tree.markup_item(this.currently_selected[i], true);
        }
//    alert("ALT-"+(e.keyCode-48));
      }
      this.currentItemType = item_int;
    }
  }


  // input new item
  if (panel == "main_menu" && item == "input_item")
  {
    if (this.currently_selected.length==1)
    {
      this.new_tree_item_input = true;
      this.my_main_tree.input_item(this.currently_selected[0], elemSymbolList[this.currentItemType]);
    }
    else
      alert("New items can only be created if exactly one element is selected !");
  }


  // cancel new item
  if (item == "cancel_item")
    this.my_main_tree.cancel_item(this.new_tree_item_input, this.saved_item_id, this.saved_item_name);


  // change item
  if (panel == "main_menu" && item == "change_item")
    if (this.currently_selected.length==1) 
    {
      if (this.currently_selected[0]!="root") 
      {
	      this.saved_item_id = this.currently_selected[0];
	      this.saved_item_name = this.my_db_intelligence.get_tree_item_field(this.currently_selected[0], "name");
        this.my_main_tree.rename_item(this.currently_selected[0]);
      }
    }
    else
      alert("Renaming can only be applied to exactly one selected element !");


  // delete item
  if (panel == "main_menu" && item == "delete_item")
    if (this.currently_selected.length!=0) 
    {
      for (var i=0; i<this.currently_selected.length; i++)
      {
        if (this.currently_selected[i]!="root") 
        {
          this.my_main_tree.clear_item(this.currently_selected[i]);
          this.my_db_intelligence.delete_tree_item(this.currently_selected[i]);
        }
      }
                                    // clear selection and write to database
      this.currently_selected=[];
      this.select_idx = 0;
      this.my_db_intelligence.update_db(uploadPhpUrl);
    }
    else
      alert("Nothing selected!");


  // copy item (by link) -> later : for double parent link
  if (panel == "main_menu" && item == "copy_item")
    if (this.currently_selected!="") 
    {
      if (this.currently_selected!="root") 
      {
        if (this.currently_cut.length != 0)
// ==========================================================================
          for (var i=0; i<this.currently_cut.length; i++)
            this.my_main_tree.mark_item_as_cut(this.currently_cut[i], false);  
// ==========================================================================
        if (this.currently_selected.length == 1)
          this.currently_copied = this.currently_selected[0];
        else
          alert("You cannot copy (by link) more than one item at once !");
//        this.currently_cut = [];  -> later reactivated
      }
    }
    else
      alert("Nothing selected!");


  // cut item
  if (panel == "main_menu" && item == "cut_item")
    if (this.currently_selected.length!=0) 
    {
      this.currently_cut = [];
      for (var i=0; i<this.currently_selected.length; i++)
      {
        if (this.currently_selected!="root") 
        {
	        this.currently_cut[i] = this.currently_selected[i];
          this.currently_copied = "";
          this.my_main_tree.markup_item(this.currently_selected[i], false);
          this.my_main_tree.mark_item_as_cut(this.currently_cut[i], true);  
        }
      }
      this.currently_selected=[];
      this.select_idx = 0;       
    }
    else
      alert("Nothing selected!");


  // paste cut item (later also copied item)
  if (panel == "main_menu" && item == "paste_item")
  {
    if (this.currently_cut.length!=0) 
    {
      if (this.currently_selected.length==1)
      {
        var newParentId = this.currently_selected;

        for (var i=0; i<this.currently_cut.length; i++)
        {
          var itemId = this.currently_cut[i]; 
          var oldParentId = this.my_db_intelligence.get_tree_item_parents(itemId)[0];
          var itemName = this.my_db_intelligence.get_tree_item_field(itemId, "name");
                                    // create new link (DB, GUI)
          this.my_db_intelligence.attach_to_parent(newParentId, itemId);
                                    // destroy old link (DB, GUI)
          this.my_db_intelligence.detach_from_parent(oldParentId, itemId);
        }
                                    // update database
        this.my_db_intelligence.update_db(uploadPhpUrl); 
        this.print_subtree(undefined, "root", 100); 
        this.currently_cut = [];  
        this.currently_selected=[];    
      }
      else
        alert("Paste operation only possible if exactly one element is selected !");
    }
    else
      alert("Nothing in memory !");
  }

  // select item
  if (panel == "main_tree")
  {
    if (this.ctrl_pressed)
    {
                                    // create new selection item
      this.currently_selected[this.select_idx]=(new String(item)).replace("_a", "");                
      this.my_main_tree.markup_item(this.currently_selected[this.select_idx], true);      
      this.select_idx=this.select_idx+1;
    }
    else
    {
      if (this.shift_pressed)
      {
        // to be defined
      }
      else
      {
        if (this.currently_selected.length!=0)
        {
                                    // unmarkup previos selections
          for (var i=0; i<this.currently_selected.length; i++)
          { 
            this.my_main_tree.markup_item(this.currently_selected[i], false);
          }
          this.currently_selected=[];
        }
                                    // create new selection
        this.currently_selected[0]=(new String(item)).replace("_a", "");          
        this.select_idx = 1;
        this.my_main_tree.markup_item(this.currently_selected[0], true);
      }    
    }
  }
}




// when new item was given a name and it was saved by pressing <ENTER>
function input_dispatcher_input_done()
{
//  alert("save");
  var inputItem = document.getElementById("give_name_input");
  var newName;
  if (inputItem != null)
    newName = inputItem.value;
  else 
    alert('No inputItem !');

  if (this.new_tree_item_input == true)
  {
    var newId = this.my_db_intelligence.create_tree_item(this.currently_selected, newName, elemTypeList[this.currentItemType]);
    this.my_main_tree.save_item(newId, this.new_tree_item_input, newName, elemSymbolList[this.currentItemType]);
    this.new_tree_item_input = false;
  }
  else
  {
    this.my_db_intelligence.change_tree_item_field(this.saved_item_id, "name", newName )
    this.my_main_tree.save_item(this.saved_item_id, this.new_tree_item_input, newName );
    this.saved_item_id = "";
  }
  this.my_db_intelligence.update_db(uploadPhpUrl);  
  this.print_subtree(undefined, "root", 100);
  this.my_main_tree.markup_item(this.currently_selected[0], true);
}
