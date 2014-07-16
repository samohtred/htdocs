

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
  this.print_subtree_aux = input_dispatcher_print_subtree_aux.bind(this);
  this.print_subtree = input_dispatcher_print_subtree.bind(this);

  this.content_desc_save = input_dispatcher_content_desc_save.bind(this);


  // private variables
  this.main_tree_context = main_tree_context;
  this.ctrl_pressed = false;
  this.shift_pressed = false;
  this.currently_selected=["root"];
  this.currently_selected_favorite="";
  this.select_idx=0;
  this.currently_cut=[];
  this.currently_copied="";
  this.currentItemType = 0;
  this.new_tree_item_input = false;
  this.my_db_intelligence = new db_intelligence(document.getElementById("main_bookmark_child"), this.clicked_at);
  this.setup_user = new setup_user();
  this.my_main_tree = new topic_tree_gui(main_tree_context, this, this.input_done, this.clicked_at);
  var main_content_context = 'main_content_pad';
  this.my_main_content = new main_content_gui(main_content_context);
  var main_features_context = 'main_features_pad';
  this.my_main_features = new main_features(main_features_context, this.clicked_at, this.my_db_intelligence.get_tree_item_path, this.my_db_intelligence.get_tree_item_children, this.my_db_intelligence.get_tree_item_field, this.setup_user.getNewsElem(), this.setup_user.getDateElem(), this.setup_user.getFavorites());
  this.saved_item_id = "";
  this.saved_item_name = "";
  this.locked_topic = "root";

  // constructor
  this.create_tree();
}


function input_dispatcher_content_desc_save()
{
  this.my_db_intelligence.change_tree_item_field(this.currently_selected[0], "content", this.my_main_content.get_fulltext()); 
  this.my_db_intelligence.update_db(uploadPhpUrl);  
//  alert("saving content !");
}

function input_dispatcher_create_tree()
{
  this.my_db_intelligence.create_tree(xmlDataUrl);
//  alert("1");
  this.currently_selected[0] = this.setup_user.initCookie();
  this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);
  this.my_main_tree.markup_item(this.currently_selected[0], true);
  this.my_main_content.set_fulltext(this.my_db_intelligence.get_tree_item_field(this.currently_selected[0], "content"));          
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
function input_dispatcher_print_subtree(itemId, lockId, treeMaxParentDepth, treeMaxChildDepth)
{
                                    // clear old Main Tree
  this.main_tree_context.innerHTML = '';
                                    // print new Main Tree
  var max_id = 0;
  if (!this.my_db_intelligence.item_exists(itemId))
    max_id = this.print_subtree_aux(undefined, "root", lockId, 0, treeMaxChildDepth);
  else if (itemId == lockId)
    max_id = this.print_subtree_aux(undefined, itemId, lockId, 0, treeMaxChildDepth);
  else
    max_id = this.print_subtree_aux(this.my_db_intelligence.get_tree_item_parents(itemId)[0], itemId, lockId, treeMaxParentDepth, treeMaxChildDepth);
                                    // restore selection
  for (var i=0; i<this.currently_selected.length; i++)
  {
    this.my_main_tree.markup_item(this.currently_selected[i], true);
  }
                                    // restore cut markup
  for (var i=0; i<this.currently_cut.length; i++)
  {
    this.my_main_tree.mark_item_as_cut(this.currently_cut[i], true);
  }
  document.getElementById(this.currently_selected[0]+"_div").focus(); //.scrollIntoView(true);
  this.my_main_content.set_headline(this.my_db_intelligence.get_tree_item_field(this.currently_selected[0], "name"));
  return max_id;
}


// auxiliary function that belongs to 'input_dispatcher_print_subtree'
function input_dispatcher_print_subtree_aux(parentId, itemId, lockId, treeMaxParentDepth, treeMaxChildDepth)
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
  
                                    // reached highest accessible parent level
  if ((treeMaxParentDepth <= 0) || (itemId == lockId))
  {
                                    // print root item in current view
    if (treeMaxParentDepth == 0)
    {
      itemName = this.my_db_intelligence.get_tree_item_path(lockId, itemId , true);
      this.my_main_tree.print_item(this.my_main_tree.c_ITEM_ROOT, parentId, itemId, itemName, mySymbol);
    }
                                    // print children of root item in current view
    else
      this.my_main_tree.print_item(this.my_main_tree.c_ITEM_OTHERS, parentId, itemId, itemName, mySymbol);        

                                    // get my children and apply same function again
    var myChildren = this.my_db_intelligence.get_tree_item_children(itemId);
    if ((myChildren.length > 0) && (treeMaxChildDepth != 0))
    {
      myChildren= this.item_sort(myChildren);
      for (var i=0; i<myChildren.length; i++)
      {
        if (treeMaxChildDepth > 0)
          curr_child_id = parseInt(this.print_subtree_aux(itemId, myChildren[i].toString(), lockId, -1, treeMaxChildDepth - 1));
        else           
          curr_child_id = parseInt(this.print_subtree_aux(itemId, myChildren[i].toString(), lockId, treeMaxParentDepth - 1, treeMaxChildDepth));
        if (curr_child_id != NaN)
          if (curr_child_id > max_id)
            max_id = curr_child_id;
      }
    }
//  if (itemId == "root")
//    alert("Print Subtree");
  }
                                    // search for root in current view before printing the tree
  else
  {                           
    var myParents = this.my_db_intelligence.get_tree_item_parents(itemId);
    var myGrannies = this.my_db_intelligence.get_tree_item_parents(myParents[0]);
    var addChild = 1;
    if (treeMaxChildDepth < 0)
      addChild = 0;
    if (treeMaxParentDepth<0)
      if (myGrannies == undefined)
        this.print_subtree_aux(undefined, myParents[0], lockId, treeMaxParentDepth, treeMaxChildDepth+addChild);      
      else
        this.print_subtree_aux(myGrannies[0], myParents[0], lockId, treeMaxParentDepth, treeMaxChildDepth+addChild);      
    else
      if ((treeMaxParentDepth == 1) || (myGrannies == undefined))
        this.print_subtree_aux(undefined, myParents[0], lockId, treeMaxParentDepth - 1, treeMaxChildDepth+addChild);
      else
        this.print_subtree_aux(myGrannies[0], myParents[0], lockId, treeMaxParentDepth - 1, treeMaxChildDepth+addChild);

  }
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
      this.ctrl_pressed = false; // wird komischerweise bei Loslassen von Ctrl-L nicht ausgelöst
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
      
      // STRG+Shift+Alt+L (
      if ((e.keyCode==76) && (e.shiftKey) && (e.altKey))
      { 
//        alert("STRG-L");
        this.clicked_at("main_menu", "lock_topic");
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
//            this.my_main_tree.change_symbol(this.currently_selected[i], elemSymbolList[item_int]);
          }
        }
                                    // write changes to database
        this.my_db_intelligence.update_db(uploadPhpUrl);
        this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);  
                    
//    alert("ALT-"+(e.keyCode-48));
      }
      this.currentItemType = item_int;
    }
  }


  // cancel new item
  if (item == "cancel_item")
    this.my_main_tree.cancel_item(this.new_tree_item_input, this.saved_item_id, this.saved_item_name);

  // command from menu
  if (panel == "main_menu")
  {
    // input new item
    if (item == "input_item")
    {
      if (this.currently_selected.length==1)
      {
        this.new_tree_item_input = true;
        this.my_main_tree.input_item(this.currently_selected[0], elemSymbolList[this.currentItemType]);
      }
      else
        alert("New items can only be created if exactly one element is selected !");
    }


    // change item
    if (item == "change_item")
      if (this.currently_selected.length==1) 
      {
        if (this.currently_selected[0]!="root") 
        {
  	      this.saved_item_id = this.currently_selected[0];
  	      this.saved_item_name = this.my_db_intelligence.get_tree_item_field(this.currently_selected[0], "name");
          this.my_main_tree.rename_item(this.currently_selected[0], this.saved_item_name);
        }
      }
      else
        alert("Renaming can only be applied to exactly one selected element !");


    // delete item
    if (item == "delete_item")
      if (this.currently_selected.length!=0) 
      {
        var old_sel0 = this.currently_selected[0];                                    
        var new_sel0 = this.my_db_intelligence.get_tree_item_parents(old_sel0)[0];      
  
        for (var i=0; i<this.currently_selected.length; i++)
        {
          if (this.currently_selected[i]!="root") 
          {
  //          this.my_main_tree.clear_item(this.currently_selected[i]);
            this.my_db_intelligence.delete_tree_item(this.currently_selected[i]);
          }
        }
                                      // write to database
        this.my_db_intelligence.update_db(uploadPhpUrl);
                                      // update tree in GUI
        this.currently_selected=[];
        this.currently_selected[0]= new_sel0;
        this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);        
        this.select_idx = 1; 
      }
      else
        alert("Nothing selected!");


    // copy item (by link) -> later : for double parent link
    if (item == "copy_item")
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
    if (item == "cut_item")
      if (this.currently_selected.length!=0) 
      {
        this.currently_cut = [];
        this.currently_copied = "";      
        for (var i=0; i<this.currently_selected.length; i++)
        {
          if (this.currently_selected!="root") 
          {
  	        this.currently_cut[i] = this.currently_selected[i];
          }
        }
        var old_sel0 = this.currently_selected[0];
        this.currently_selected=[];
        this.currently_selected[0]=this.my_db_intelligence.get_tree_item_parents(old_sel0)[0];
        this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);        
        this.select_idx = 1;       
      }
      else
        alert("Nothing selected!");


    // paste cut item (later also copied item)
    if (item == "paste_item")
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
          this.currently_selected = this.currently_cut; 
          this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);  
          this.currently_cut = [];  
        }
        else
          alert("Paste operation only possible if exactly one element is selected !");
      }
      else
        alert("Nothing in memory !");
    }

    // lock topic
    if (item == "lock_topic")
    {
      if (this.currently_selected.length==1) 
      {
        if (this.locked_topic == this.currently_selected[0])
          this.locked_topic = "root";
        else  
          this.locked_topic = this.currently_selected[0];
        this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);  
      }
      else
        alert("Wrong selection !");  
    }

    // set currently selected Item as News source
    if (item == "as_news")
    {
      if (this.currently_selected.length==1) 
      {
        this.setup_user.setNewsElem(this.currently_selected[0]);
        this.my_main_features.update_news_ticker(this.currently_selected[0]);
      }
      else
        alert("Wrong selection !");  
    }

    // set currently selected Item as News source
    if (item == "as_date")
    {
      if (this.currently_selected.length==1) 
      {
        this.setup_user.setDateElem(this.currently_selected[0]);
        this.my_main_features.update_date_ticker(this.currently_selected[0]);
      }
      else
        alert("Wrong selection !");  
    }
    
    // save currently selected tree item as favorite
    if (item == "save_favorite")
    {
      if (this.currently_selected.length==1) 
      {
        this.setup_user.setFavorite(this.currently_selected[0]);
        this.my_main_features.load_favorites(this.setup_user.getFavorites());
      }
      else
        alert("Wrong selection !");  
    }
    
    // load currently selected favorite as selected tree item
    if (item == "load_favorite")
    {
      if (this.currently_selected_favorite!="") 
      {
        this.clicked_at("main_tree", this.currently_selected_favorite + "_a") 
      }
      else
        alert("Wrong selection !");  
    }
    
    // delete currently selected favorite
    if (item == "delete_favorite")
    {
      if (this.currently_selected_favorite!="") 
      {
        this.setup_user.delSingleFavorite(this.currently_selected_favorite);
        this.my_main_features.load_favorites(this.setup_user.getFavorites());              
      }
      else
        alert("Wrong selection !");  
    }

    // delete all favorites
    if (item == "deleteall_favorites")
    {
      this.setup_user.delAllFavorites();
      this.my_main_features.load_favorites(this.setup_user.getFavorites());      
    }
  }

  // select tree item
  if (((panel == "main_tree")&&(item != undefined))||(panel == "info_bar"))
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
        var curr_news_item = this.setup_user.getNewsElem();
        var curr_date_item = this.setup_user.getDateElem();
        
        // display current news channel
        if (item == "news_select")
        {
          if (curr_news_item != null)
          {
                                        // clear old selection
            this.currently_selected=[];
                                        // create new selection
            this.currently_selected[0]=curr_news_item;          
          }
          else
            return;
        }
        else
        // display current date channel
        if (item == "dates_select")
        {
          if (curr_date_item != null)
          {
                                        // clear old selection
            this.currently_selected=[];
                                        // create new selection
            this.currently_selected[0]=curr_date_item;          
          }
          else
            return;        
        }
        else
        {
                  
                                      // clear old selection
          this.currently_selected=[];
                                      // create new selection
          this.currently_selected[0]=(new String(item)).replace("_a", "");          
        }
        this.select_idx = 1;
                                    // redraw Main Tree
        this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);  
        this.setup_user.setLastElem(this.currently_selected[0]);
        this.my_main_content.set_fulltext(this.my_db_intelligence.get_tree_item_field(this.currently_selected[0], "content"));        
      }    
    }
  }
  
  // select feature item
  if ((panel == "main_features")&&(item != undefined))
  {
    var old_item = this.currently_selected_favorite;
                                        // create new selection
    this.currently_selected_favorite=(new String(item)).replace("_fa", "");     
                                        // same item : select / deselect alternatively
    if (old_item == this.currently_selected_favorite)
    {
      this.my_main_features.markup_item(this.currently_selected_favorite, false);
      this.currently_selected_favorite = "";
    }
    else
    {
      this.my_main_features.markup_item(old_item, false);      
      this.my_main_features.markup_item(this.currently_selected_favorite, true);
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
  this.print_subtree(this.currently_selected[0], this.locked_topic, treeMaxParentDepth, treeMaxChildDepth);  
}
