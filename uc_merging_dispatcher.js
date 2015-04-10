function uc_browsing_dispatcher( cb_clicked_at_str )
{
  // take over params into object
  this.cb_clicked_at_str = cb_clicked_at_str;
  
  // bind functions to object
  this.select_by_id = uc_browsing_dispatcher_select_by_id.bind(this);
  this.select_item = uc_browsing_dispatcher_select_item.bind(this);
  this.select_parent = uc_browsing_dispatcher_select_parent.bind(this);
  this.open_parent_menu = uc_browsing_dispatcher_open_parent_menu.bind(this);
  this.extract_ticker_params = uc_browsing_dispatcher_extract_ticker_params.bind(this);
  this.create_infopanel_iparams = uc_browsing_dispatcher_create_infopanel_iparams.bind(this);
  this.is_loop = uc_browsing_dispatcher_is_loop.bind(this);
  this.process_elem_menu = uc_browsing_dispatcher_process_elem_menu.bind(this);
  this.process_type_menu = uc_browsing_dispatcher_process_type_menu.bind(this);  
  this.process_fav_menu = uc_browsing_dispatcher_process_fav_menu.bind(this);    
  this.keyb_proc = uc_browsing_dispatcher_keyb_proc.bind(this);
  this.clicked_at = uc_browsing_dispatcher_clicked_at.bind(this);
  this.load_setup = uc_browsing_dispatcher_load_setup.bind(this);
  this.save_setup = uc_browsing_dispatcher_save_setup.bind(this);
  this.init = uc_browsing_dispatcher_init.bind(this);
  this.lang_change = uc_browsing_dispatcher_lang_change.bind(this);
  this.update_info_panel = uc_browsing_dispatcher_update_info_panel.bind(this);


  // object variables
                                    // Storage Objects
  this.db_obj;
  this.def_parent_storage;
                                    // GUI Objects
  this.menubar;
  this.toolbar;
  this.tree_panel;
  this.content_panel;
  this.info_panel;
                                    // control variables
  this.panel1_selected_items = [];
  this.panel1_cut_items = [];
  this.panel1_copied_items = [];  
  this.panel1_select_idx = 1;
  this.panel1_elem_type = 0;
  this.panel1_new_tree_item_input = false;
  this.panel1_saved_rename_item = null;
  this.text_focus = 0;

  // constructor call
  this.init();    
} 

function uc_browsing_dispatcher_lang_change()
{                                 
  this.menubar.init();
  this.toolbar.init(this.panel1_elem_type);
  this.tree_panel.print_title();
  this.content_panel.print_title();
  this.info_panel.print_title();
  this.info_panel.init_gui(this.create_infopanel_iparams());
  this.features_panel.print_title();
}


function uc_browsing_dispatcher_select_by_id(elem_id)
{
                              // print whole tree + create new selection
  var curr_tree_part = this.db_obj.command({elemId:elem_id, lock_id:uc_browsing_setup.tree_locked_item}, "get_tree");
  this.panel1_selected_items = [];                            
  this.panel1_selected_items[0] = this.tree_panel.print_tree(curr_tree_part, elem_id);
  this.panel1_select_idx = 1;
                              // markup cut items
  for (var i=0; i<this.panel1_cut_items.length; i++)
  {                                    
                              // extract elem_id from cut items collected from (possibly) old tree
    var my_elem_id = this.panel1_cut_items[i].elem_id;
    var my_parent_elem_id = this.panel1_cut_items[i].parent_elem_id;    
                              // get GUI Id's if element appears in current tree
    var my_gui_id = this.tree_panel.get_gui_id(my_elem_id);
                              // does element exist in current tree ?
    if (my_gui_id.length > 0)
    {
      for (var j=0; j<my_gui_id.length; j++)
      {
        if (this.tree_panel.get_item_data(my_gui_id[j]).parent_elem_id == my_parent_elem_id)
          document.getElementById(my_gui_id[j] + '_a').style.color = '#D0D0D0';
      }
    }
  }
                              // save setup
  uc_browsing_setup.tree_last_selected = this.panel1_selected_items[0].elem_id;
  this.save_setup();
                              // load content of currently selected into Panel 2
  this.content_panel.load_item_content(this.db_obj.command(uc_browsing_setup.tree_last_selected, "get_content"));
}


function uc_browsing_dispatcher_select_item(submodule, gui_id, mode)
{
  switch (mode)
  {
    case c_KEYB_MODE_CTRL_ONLY : 
        var add_item = true;        // false : 
        for (var i=0; i<this.panel1_selected_items.length; i++)
        {
          if (this.panel1_selected_items[i].gui_id == gui_id)
          {
            add_item = false;
            if (i!=0)
            {
              this.tree_panel.markup_items(this.panel1_selected_items[i].gui_id, false);
              this.panel1_selected_items.splice(i, 1);
            }
          }       
        }
        if (add_item == true)                                              
        {
          this.panel1_selected_items[this.panel1_select_idx]=this.tree_panel.get_item_data(gui_id);
          this.tree_panel.markup_items(gui_id, true);      
          this.panel1_select_idx=this.panel1_select_idx + 1;
        }
    break;

    case c_KEYB_MODE_SHIFT_ONLY :
        // to be defined
    break;
    
    case c_KEYB_MODE_NONE :
                                    // redraw Main Tree
        if (submodule == 'tree_select')
        {
          this.db_obj.command(this.tree_panel.get_gui_path(gui_id), "set_default_parents");                                      
        }
        this.select_by_id(this.tree_panel.get_item_data(gui_id).elem_id);
    break;
    
    default :  
        alert(c_LANG_UC_BROWSING_MSG_INVALID_KEYB_MODE[global_setup.curr_lang]);
    break;
  }
}


function uc_browsing_dispatcher_select_parent(parent_id)
{
                                    // redraw Main Tree + create new selection
  this.db_obj.command({elem_id:this.panel1_selected_items[0].elem_id, parent_id:parent_id}, "set_default_parents");                                      
  var curr_tree_part = this.db_obj.command({elemId:parent_id, lock_id:uc_browsing_setup.tree_locked_item}, "get_tree")
  this.panel1_selected_items = [];                            
  this.panel1_selected_items[0] = this.tree_panel.print_tree(curr_tree_part, parent_id);
  this.panel1_select_idx = 1;
                                    // save setup
  uc_browsing_setup.tree_last_selected = this.panel1_selected_items[0].elem_id;
  this.save_setup();
}


function uc_browsing_dispatcher_open_parent_menu(gui_id)
{
  var myself = this.tree_panel.get_item_data(gui_id);
  var gui_obj_list = this.db_obj.command({elem_id:myself.elem_id}, "get_parents");
  this.tree_panel.print_multi_parent_menu(gui_obj_list);
}


function uc_browsing_dispatcher_extract_ticker_params(tree_part)
{
  var retval = {};
  retval.elem_id = tree_part.tree_nodes[0].elem_id
  retval.text = "";
  var my_gui_id = tree_part.tree_nodes[0].gui_id
  for (var i=0; i<tree_part.tree_nodes.length; i++)
  {
    if (tree_part.tree_nodes[i].parent_gui_id == my_gui_id)
    {
      retval.text = retval.text + " +++ " + tree_part.tree_nodes[i].name;
    }
  }
  return retval;
}
  
  
function uc_browsing_dispatcher_create_infopanel_iparams()
{
  var retval = {};
  retval.ticker1 = {elem_id:null,text:null};
  retval.ticker2 = {elem_id:null,text:null};
  
  // create ticker 1 params
  if ((uc_browsing_setup.info_ticker1_item_id != undefined) && (uc_browsing_setup.info_ticker1_item_id != null))
  {
                                    // get tree from point of view of current news item
    var ticker_tree_part = this.db_obj.command({elemId:uc_browsing_setup.info_ticker1_item_id, lock_id:uc_browsing_setup.info_ticker1_item_id}, "get_tree");
                                    // extract ticker params from tree part
    retval.ticker1 = this.extract_ticker_params(ticker_tree_part);
  }            

  // create ticker 2 params  
  if ((uc_browsing_setup.info_ticker2_item_id != undefined) && (uc_browsing_setup.info_ticker2_item_id != null))
  {
                                    // get tree from point of view of current news item
    var ticker_tree_part = this.db_obj.command({elemId:uc_browsing_setup.info_ticker2_item_id, lock_id:uc_browsing_setup.info_ticker2_item_id}, "get_tree");
                                    // extract ticker params from tree part
    retval.ticker2 = this.extract_ticker_params(ticker_tree_part);
  }
  
  return retval;
}          
                                 
                                 
function uc_browsing_dispatcher_is_loop(dest_item, src_items)
{
  var retval = false; 
  
  var dest_tree_part = this.db_obj.command({elemId:dest_item.elem_id, lock_id:"root"}, "get_tree");  
  for (var i=0; i<src_items.length; i++)
  {
    for (var j=0; j<dest_tree_part.explorer_path.length; j++)
    {
      if (src_items[i].elem_id == dest_tree_part.explorer_path[j].elem_id)
        retval = true;
    }
  }
  
  return retval;
}
                                 

function uc_browsing_dispatcher_process_elem_menu(item)
{
  if (item != "paste_item")
  {
    this.panel1_cut_items = [];
    this.panel1_copied_items = [];     
  }
  
  switch (item)
  {
    case "input_item" :
        // input new item
        if (this.panel1_selected_items.length==1)
        {
          this.panel1_new_tree_item_input = true;
          this.tree_panel.input_item(true, this.panel1_selected_items[0].gui_id, this.panel1_selected_items[0].type);
        }
        else
          alert(c_LANG_WARNING_SINGLE_ITEM_NEEDED[global_setup.curr_lang]);
        break;          
    case "change_item" :
        if (this.panel1_selected_items.length==1)
        {
          this.panel1_saved_rename_item = this.panel1_selected_items[0];
          this.tree_panel.input_item(false, this.panel1_selected_items[0].gui_id, this.panel1_selected_items[0].type);
        }
        else
          alert(c_LANG_WARNING_SINGLE_ITEM_NEEDED[global_setup.curr_lang]);
        break;          
    case "delete_item" :
        if (this.panel1_selected_items.length!=0) 
        {
          if (this.panel1_selected_items[0].elem_id != "root")
          {
                                      // new selection : parent of current selection
            var new_sel0 = this.tree_panel.get_item_data(this.panel1_selected_items[0].parent_gui_id);      
                                      // delete all selected items from database
            this.db_obj.command({elem:this.panel1_selected_items}, "delete_item");
                                      // update tree in GUI
            this.panel1_selected_items=[];
            this.panel1_selected_items[0]= new_sel0;
            this.select_by_id(this.panel1_selected_items[0].elem_id);           
            this.panel1_select_idx = 1; 
          }
          else
            alert(c_LANG_WARNING_WRONG_SELECTION[global_setup.curr_lang]);
        }
        else
          alert(c_LANG_WARNING_NOTHING_SELECTED[global_setup.curr_lang]);
        break;
    case "copy_item"   :
        this.panel1_copied_items = JSON.parse(JSON.stringify(this.panel1_selected_items));
        break;
    case "cut_item"    :
        this.panel1_cut_items = this.panel1_selected_items;
        this.select_by_id(this.panel1_selected_items[0].elem_id);            
        break;
    case "paste_item"  :
                                    // number of destination nodes which are selected == 1
        if (this.panel1_selected_items.length==1) 
        {
          if (this.panel1_cut_items.length != 0) 
          {
            if (!this.is_loop(this.panel1_selected_items[0], this.panel1_cut_items)) 
            {
                                    // move items in database
              this.db_obj.command({src_elem:this.panel1_cut_items, dst_elem:this.panel1_selected_items[0]}, "move_item"); 
                                    // any further paste operations are only copy operations
                                    // because the source items cannot be removed any more
              this.panel1_copied_items = this.panel1_cut_items;
              this.panel1_cut_items = [];             
                                    // reload tree
              this.select_by_id(this.panel1_selected_items[0].elem_id);                                    
            }
            else
              alert(c_LANG_WARNING_CYCLE_DETECTED[global_setup.curr_lang]);
          }
          else if (this.panel1_copied_items.length != 0)
          {
            if (!this.is_loop(this.panel1_selected_items[0], this.panel1_copied_items)) 
            {
                                    // copy items in database
              this.db_obj.command({src_elem:this.panel1_copied_items, dst_elem:this.panel1_selected_items[0]}, "copy_item"); 
                                    // reload tree
              this.select_by_id(this.panel1_selected_items[0].elem_id);                                    
            }
            else
              alert(c_LANG_WARNING_CYCLE_DETECTED[global_setup.curr_lang]);
          }
          else
            alert(c_LANG_WARNING_NOTHING_IN_MEMORY[global_setup.curr_lang]); 
        }
        else
          alert(c_LANG_WARNING_SINGLE_ITEM_NEEDED[global_setup.curr_lang]);        
        break;
    case "lock_topic"  :
        if (this.panel1_selected_items.length==1) 
        {
                                    // unlock topic if it is locked for the second time
          if (this.panel1_selected_items[0].elem_id == uc_browsing_setup.tree_locked_item)
            uc_browsing_setup.tree_locked_item = "root";
          else  
            uc_browsing_setup.tree_locked_item = this.panel1_selected_items[0].elem_id;
          this.save_setup();
                                    // redraw tree
          var curr_tree_part = this.db_obj.command({elemId:this.panel1_selected_items[0].elem_id, lock_id:uc_browsing_setup.tree_locked_item}, "get_tree");
          var saved_selection = this.panel1_selected_items[0];
          this.panel1_selected_items = []; 
          this.panel1_selected_items[0] = this.tree_panel.print_tree(curr_tree_part, saved_selection.elem_id);
          this.panel1_select_idx = 1;
        }
        else
          alert(c_LANG_WARNING_SINGLE_ITEM_NEEDED[global_setup.curr_lang]);      
        break;
    case "as_news"     :
        if (this.panel1_selected_items.length==1) 
        {
          uc_browsing_setup.info_ticker1_item_id = this.panel1_selected_items[0].elem_id;
          this.save_setup();
          this.info_panel.init_gui(this.create_infopanel_iparams());
        }
        else
          alert(c_LANG_WARNING_SINGLE_ITEM_NEEDED[global_setup.curr_lang]);      
        break;
    case "as_date"     :
        if (this.panel1_selected_items.length==1) 
        {
          uc_browsing_setup.info_ticker2_item_id = this.panel1_selected_items[0].elem_id;
          this.save_setup();
          this.info_panel.init_gui(this.create_infopanel_iparams());
        }
        else
          alert(c_LANG_WARNING_SINGLE_ITEM_NEEDED[global_setup.curr_lang]);      
        break;
    default : 
      alert(c_LANG_UC_BROWSING_MSG_UNKNOWN_COMMAND[global_setup.curr_lang] + item);
    break;
  }
//  alert(item);
}


function uc_browsing_dispatcher_process_type_menu(item)
{
  // choose element type
  var item_int = lib_tree_get_type_no(item);
  if (item_int >= 0)
  {                                                   
                                    // set type in Info Bar
    this.toolbar.set_elem_type(item_int);
                                    // set new type for all selected items
    if (this.panel1_selected_items.length > 0)
    {
      for (var i=0; i<this.panel1_selected_items.length ; i++)
      {
        if (this.panel1_selected_items[i].elem_id != "root") 
        {
                                    // change type field in database
          this.db_obj.command({elem_id:this.panel1_selected_items[i].elem_id, content:c_LANG_LIB_TREE_ELEMTYPE[item_int+1][2]}, "set_type");                                    
        }
      }
                                    // write changes to database
      this.db_obj.command({}, "db_update");             
                                    // redraw tree from database content
      var curr_tree_part = this.db_obj.command({elemId:this.panel1_selected_items[0].elem_id, lock_id:uc_browsing_setup.tree_locked_item}, "get_tree");
      this.panel1_selected_items[0] = this.tree_panel.print_tree(curr_tree_part, this.panel1_selected_items[0].elem_id);
      for (var i=0; i<this.panel1_selected_items.length ; i++)
        this.tree_panel.markup_items(this.panel1_selected_items[i].gui_id, true);  
    }
    this.panel1_elem_type = item_int;
  }
  else
    alert(c_LANG_UC_BROWSING_MSG_UNKNOWN_ELEM_TYPE[global_setup.curr_lang]);
}


function uc_browsing_dispatcher_process_fav_menu(item)                             
{
  switch (item)
  {
    // save currently selected tree item as favorite
    case c_LANG_UC_BROWSING_MENUBAR[2][1][0] :
      if (this.panel1_selected_items.length==1) 
      {
                                        // save currently selected item to last index of favorite item array
        uc_browsing_setup.favorites[uc_browsing_setup.favorites.length] = this.panel1_selected_items[0].elem_id;
                                        // write this setup into Setups Memory
        this.save_setup();
                                        // load favorites in respective panel
        this.features_panel.load_favorites(uc_browsing_setup.favorites);
      }
      else
        alert(c_LANG_WARNING_WRONG_SELECTION[global_setup.curr_lang]);  
      break;
    
    // load currently selected favorite as selected tree item
    case c_LANG_UC_BROWSING_MENUBAR[2][2][0] :
      if (this.curr_sel_favorite_id!=-1) 
      {
        this.select_by_id(uc_browsing_setup.favorites[this.curr_sel_favorite_id]); 
      }
      else
        alert(c_LANG_WARNING_WRONG_SELECTION[global_setup.curr_lang]);  
      break;
    
    // delete currently selected favorite
    case c_LANG_UC_BROWSING_MENUBAR[2][3][0] :
      if (this.curr_sel_favorite_id!=-1) 
      {
                                    // delete element from list
        uc_browsing_setup.favorites.splice(this.curr_sel_favorite_id, 1);
                                    // write list to cookies
        this.save_setup();
                                    // change GUI accordingly
        this.features_panel.load_favorites(uc_browsing_setup.favorites);          
        this.curr_sel_favorite_id = -1;
      }
      else
        alert(c_LANG_WARNING_WRONG_SELECTION[curr_lang]);  
      break;

    // delete all favorites
    case c_LANG_UC_BROWSING_MENUBAR[2][4][0] :
                                    // delete element from list
      uc_browsing_setup.favorites = [];
                                    // write list to cookies
      this.save_setup();
                                    // change GUI accordingly
      this.features_panel.load_favorites(uc_browsing_setup.favorites);          
      break;
  }
  
//  alert(item);
}


function uc_browsing_dispatcher_keyb_proc(my_key, my_extra_keys)
{
                                    // ... otherwise use these options
  switch (my_extra_keys)
  {
    // No extra key
    case c_KEYB_MODE_NONE :
        
        switch (my_key)
        {
          // ENTER
          case 13 :
            //alert("Enter");
            this.text_focus = 0;
            this.clicked_at("enter_key", "", "input_done", c_KEYB_MODE_NONE)
            break;

          // ESC
          case 27 :
            //alert("ESC");
            this.text_focus = 0;            
            this.clicked_at("esc_key", "", "cancel_item", c_KEYB_MODE_NONE)            
          break;

          // F2
          case 113 :
            //alert("F2");
            if (this.text_focus == 0)
            {
              this.text_focus = 1;
              this.clicked_at("menubar", c_LANG_UC_BROWSING_MENUBAR[0][0][0], "change_item", c_KEYB_MODE_NONE);            
            }
          break;
    
          // DEL
          case 46 :
            //alert("DEL");
            if (this.text_focus == 0)
              this.clicked_at("menubar", c_LANG_UC_BROWSING_MENUBAR[0][0][0], "delete_item", c_KEYB_MODE_NONE);
          break;
          
          // arrow left
          case 37 :
              var curr_ul = document.getElementById(this.panel1_selected_items[0].gui_id + '_ul');
              curr_ul.style.display="none";
              break;

          // arrow up
          case 38 : 
                                    // unmark all selected items
              var new_selected_gui_id = this.tree_panel.get_next_visible_up(this.panel1_selected_items[0].gui_id);  
              if (new_selected_gui_id != null)
              {
                for (var i=0; i<this.panel1_selected_items.length; i++)
                  this.tree_panel.markup_items(this.panel1_selected_items[i].gui_id, false);

                this.panel1_selected_items = [];
                                    // renew selection
                this.panel1_selected_items[0] = this.tree_panel.get_item_data(new_selected_gui_id);
                this.tree_panel.markup_items(this.panel1_selected_items[0].gui_id, true);                                                             
                                    // save setup
                uc_browsing_setup.tree_last_selected = this.panel1_selected_items[0].elem_id;
                this.save_setup();                
                                    // scroll into view
                document.getElementById(this.panel1_selected_items[0].gui_id + '_div').scrollIntoView();
                                    // load content
                this.content_panel.load_item_content(this.db_obj.command(uc_browsing_setup.tree_last_selected, "get_content"));                
              }
              else
                document.getElementById('div_panel1_content').scrollTop = 0;
              break; 
          // arrow right
          case 39 :
              var curr_ul = document.getElementById(this.panel1_selected_items[0].gui_id + '_ul');
              curr_ul.style.display="block";
              break;
              
          // arrow down
          case 40 : 
              var new_selected_gui_id = this.tree_panel.get_next_visible_dn(this.panel1_selected_items[0].gui_id);  
              if (new_selected_gui_id != null)
              {
                                    // unmark all selected items
                for (var i=0; i<this.panel1_selected_items.length; i++)
                  this.tree_panel.markup_items(this.panel1_selected_items[i].gui_id, false);
                
                this.panel1_selected_items = [];
                                    // renew selection
                this.panel1_selected_items[0] = this.tree_panel.get_item_data(new_selected_gui_id);
                this.tree_panel.markup_items(this.panel1_selected_items[0].gui_id, true);                                                             
                                    // save setup
                uc_browsing_setup.tree_last_selected = this.panel1_selected_items[0].elem_id;
                this.save_setup();                
                                    // scroll into view
                document.getElementById(this.panel1_selected_items[0].gui_id + '_div').scrollIntoView();                
                                    // load content
                this.content_panel.load_item_content(this.db_obj.command(uc_browsing_setup.tree_last_selected, "get_content"));                
              }
              break;
  
          
          default : 
            break;
        }
    break;  // No extra key


    // CTRL
    case c_KEYB_MODE_CTRL_ONLY :

        switch (my_key)
        {
          // CTRL + C
          case 67 :
            //alert("CTRL-C");
            if (this.text_focus == 0)            
              this.clicked_at("menubar", c_LANG_UC_BROWSING_MENUBAR[0][0][0], "copy_item", c_KEYB_MODE_CTRL_ONLY);
          break;

          // CTRL + V
          case 86 :
            //alert("CTRL-V");
            if (this.text_focus == 0)                        
              this.clicked_at("menubar", c_LANG_UC_BROWSING_MENUBAR[0][0][0], "paste_item", c_KEYB_MODE_CTRL_ONLY);
          break;
          
          // CTRL + X
          case 88 :
            //alert("CTRL-X");
            if (this.text_focus == 0)                        
              this.clicked_at("menubar", c_LANG_UC_BROWSING_MENUBAR[0][0][0], "cut_item", c_KEYB_MODE_CTRL_ONLY);
          break;

          default : break;
        }
        
    break; // CTRL


    // ALT
    case c_KEYB_MODE_ALT_ONLY :

        switch (my_key)
        {
          
          // ALT + N          
          case 78 :
            //alert("ALT-N");
            if (this.text_focus == 0)                                    
              this.clicked_at("menubar", c_LANG_UC_BROWSING_MENUBAR[0][0][0], "input_item", c_KEYB_MODE_ALT_ONLY);            
          break;
          
          // ALT + 0..9
          default :
            if(my_key>47 && my_key<58)
            { 
              //alert("ALT-"+(my_key-48));        
              this.clicked_at("menubar", c_LANG_LIB_TREE_ELEMTYPE[0][0], new String(my_key-48), c_KEYB_MODE_ALT_ONLY);                          
            }
          break;
        }

    break; // ALT
      
      
    // CTRL + Shift + ALT
    case c_KEYB_MODE_ALT_SHIFT_CTRL :

        switch (my_key)
        {
          // STRG+Shift+ALT + L
          case 76 :
            //alert("CTRL+Shift+ALT+L");
            this.clicked_at("menubar", c_LANG_UC_BROWSING_MENUBAR[0][0][0], "lock_topic", c_KEYB_MODE_ALT_SHIFT_CTRL);               
          break; 
        
          default : break;            
        }
        
    break; // CTRL + Shift + ALT    
  }
    
//  alert(my_key);  
}


function uc_browsing_dispatcher_clicked_at(sender, submodule, item, mode)
{
//  alert("Sender : " + sender + " # Submodule : " + submodule + " # Item : " + item);
  
  switch (sender)
  {
    case "menubar" :
    
        switch (submodule)
        { 
          case c_LANG_UC_BROWSING_MENUBAR[0][0][0] : //  c_LANG_UC_BROWSING_MENUBAR[0][0][0] :   // elem_menu
              this.process_elem_menu(item);
              break;
          case c_LANG_UC_BROWSING_MENUBAR[1][0][0] : // type_menu
              this.process_type_menu(item);
              break;
          case c_LANG_UC_BROWSING_MENUBAR[2][0][0] : // fav_menu
              this.process_fav_menu(item);
              break;          
          case c_LANG_UC_BROWSING_MENUBAR[3][1][0][0] : // setup_menu.lang_menu
              global_setup.curr_lang = parseInt(item) + 1;
              global_dispatcher_save_setup();
              this.lang_change();
              break;          
          case c_LANG_UC_BROWSING_MENUBAR[4][0][0] : // help_menu
              alert(plugin_name + '\n ' + '\n' + c_LANG_UC_BROWSING_HELP_VERSION[global_setup.curr_lang] + plugin_version + '\n' + c_LANG_UC_BROWSING_HELP_CREATED[global_setup.curr_lang] + plugin_date);
              break;          
          default :
              alert(c_LANG_UC_BROWSING_MSG_UNKNOWN_SUBMODULE[global_setup.curr_lang] + submodule);
          break;
        }
    break;
    
    case "enter_key" :
        if (this.panel1_new_tree_item_input == true)
        {
                                    // get new name from lib_tree
          var item_name = document.getElementById("N0_input").value;
                                    // create item in database
          this.db_obj.command({parent_elem_id:this.panel1_selected_items[0].elem_id, name:item_name, type:c_LANG_LIB_TREE_ELEMTYPE[this.panel1_elem_type+1][2]}, "create_item");
                                    // reload tree from database
          this.select_by_id(this.panel1_selected_items[0].elem_id)                                    
                                    // clear flag
          this.panel1_new_tree_item_input = false;
        }
        if (this.panel1_saved_rename_item != null)
        {
                                    // get new name from lib_tree
          var item_name = document.getElementById(this.panel1_saved_rename_item.gui_id + "_input").value;
                                    // create item in database
          this.db_obj.command({item_id:this.panel1_selected_items[0].elem_id, field_id:"name", content:item_name}, "change_item_field");
                                    // reload tree from database
          this.select_by_id(this.panel1_selected_items[0].elem_id)                                    
                                    // clear flag
          this.panel1_saved_rename_item = null;
        }
        break;

    case "esc_key" :
        if (this.panel1_new_tree_item_input == true)
        {
                                    // remove newly created gui item
          var item_to_clear = document.getElementById("N0_li");
          item_to_clear.parentNode.removeChild(item_to_clear);
                                    // clear flag
          this.panel1_new_tree_item_input = false;
        }
        if (this.panel1_saved_rename_item != null)
        {
                                    // reload tree from database
          this.select_by_id(this.panel1_selected_items[0].elem_id)                                    
                                    // clear flag
          this.panel1_saved_rename_item = null;
        }
        break;
    
    case "panel1" :
                                    // extract GUI ID
        var gui_id = item.substring(0, item.indexOf("_a"));

        switch (submodule)
        {
                                    // normal element selection in Explorer Path or Tree
          case "explorer_select" :
          case "tree_select" :      
            this.select_item(submodule, gui_id, mode);
          break;
          
                                    // open up Menu to choose desired parent node after clicking {...} button
          case "open_parent_menu" :
            this.panel1_selected_items[0]=this.tree_panel.get_item_data(gui_id);
            this.panel1_select_idx = 1;
            this.open_parent_menu(gui_id);
          break;
          
          case "parent_menu_select" :
            this.select_parent(gui_id);
          break;
          
          default :
            alert(c_LANG_UC_BROWSING_MSG_UNKNOWN_SUBMODULE[global_setup.curr_lang] + submodule);
        }
    break;

    case "panel2" :
        switch (submodule)
        {
          case "content" :
              if (item == "on_focus")
              {
                                    // if new item or change item command still active :
                                    // fire cancel to it
                if (this.text_focus != 0)
                {
                  this.clicked_at("esc_key", "", "cancel_item", c_KEYB_MODE_NONE);
                }
                this.text_focus = 1;
              }
              if (item == "on_blur")
              {
                this.text_focus = 0;
                                    // save text content to database
                this.db_obj.command({elem_id:uc_browsing_setup.tree_last_selected, content:getInnerHTML(document.getElementById("panel2_content_fulltext"))}, "set_content");
              }                
              
          break;
        }
    break;

    case "panel3" :
        switch (submodule)
        {
          case "ticker_item_link" :
              this.select_by_id(item);
              break;
          case "update_info_panel" :
              this.update_info_panel(item);
              break;
        }
    break;

    case "panel4" :
        switch (submodule)
        {
          case "favorites" :
              this.curr_sel_favorite_id = parseInt(item);
              for (var i=0; i<uc_browsing_setup.favorites.length; i++)
              {
                if (i==this.curr_sel_favorite_id) 
                  document.getElementById('favorite' + i + '_div').style.backgroundColor = '#C0C0F0';
                else
                  document.getElementById('favorite' + i + '_div').style.backgroundColor = 'transparent';
              }
              break;        
        }
    break;
    
    default :
        alert(c_LANG_UC_BROWSING_MSG_UNKNOWN_SENDER[global_setup.curr_lang] + sender);
    break;
  }
}


function uc_browsing_dispatcher_update_info_panel(source)
{
//  alert(source);
                                    // update Info Panel
  this.info_panel.init_gui(this.create_infopanel_iparams());
                                    // setup next automatic timer for Info Panel
  var on_click_str = "window." + this.cb_clicked_at_str + "(\'uc_browsing\', \'panel3\', \'update_info_panel\', \'update_info_panel\', c_KEYB_MODE_NONE);";
  setTimeout(on_click_str, uc_browsing_setup.info_timer);     
}


function uc_browsing_dispatcher_load_setup()
{
  if (global_status.global_setup_loaded == true)
  {
    switch (global_status.actual_setup_src_type)
    {
      case c_DATA_SOURCE_TYPE_ID_COOKIE :
            var setup_cookie = new lib_data_cookie(plugin_name, c_DEFAULT_UC_BROWSING_SETUP_COOKIE);
            var my_cookie_content = setup_cookie.read("data");
            if (my_cookie_content != null)
            {
              uc_browsing_setup.tree_last_selected    = my_cookie_content.tree_last_selected  ;
              uc_browsing_setup.tree_locked_item      = my_cookie_content.tree_locked_item    ; 
              uc_browsing_setup.info_ticker1_item_id  = my_cookie_content.info_ticker1_item_id;
              uc_browsing_setup.info_ticker2_item_id  = my_cookie_content.info_ticker2_item_id;
              uc_browsing_setup.favorites             = my_cookie_content.favorites;
            }
            else
              alert(c_LANG_UC_BROWSING_MSG_SETUP_LOADING_FAILED[global_setup.curr_lang]);
          break;
      default :
          break;
    }
  }
}


function uc_browsing_dispatcher_save_setup()
{
  if (global_status.global_setup_loaded == true)
  {
    switch (global_status.actual_setup_src_type)
    {
      case c_DATA_SOURCE_TYPE_ID_COOKIE :
            var setup_cookie = new lib_data_cookie(plugin_name, c_DEFAULT_UC_BROWSING_SETUP_COOKIE);
            setup_cookie.write("data", uc_browsing_setup);
          break;
      default :
          break;
    }
  }
}


function uc_browsing_dispatcher_init()
{
  // load setup into struct 'uc_browsing_setup'
  this.load_setup();
  // prepare data sources (default parents and discussion content)
  this.def_parent_storage = new lib_data_cookie("X-Tree-M", "Default_Parents");
  this.db_obj = new lib_data_dispatcher(this.def_parent_storage, uc_browsing_setup.tree_data_src_type, uc_browsing_setup.tree_data_src_path, uc_browsing_setup.tree_data_src_params);
  // load Menu and Tool Bar                                                  
  this.menubar = new uc_browsing_menubar( 'div_menubar', 'uc_browsing', 'menubar', this.cb_clicked_at_str, c_LANG_UC_BROWSING_MENUBAR); 
  this.toolbar = new uc_browsing_toolbar( 'div_toolbar', this.cb_clicked_at_str);     
  // load Panel 1
                                    // load tree data  
  var curr_tree_part = this.db_obj.command({elemId:uc_browsing_setup.tree_last_selected, lock_id:uc_browsing_setup.tree_locked_item}, "get_tree");
                                    // print tree
  this.tree_panel = new lib_tree("div_panel1_headline", c_LANG_UC_BROWSING_PANEL1_TITLE, "div_panel1_pad", "uc_browsing", "panel1", this.cb_clicked_at_str);
  this.panel1_selected_items = [];
  this.panel1_selected_items[0] = this.tree_panel.print_tree(curr_tree_part, uc_browsing_setup.tree_last_selected);
  this.panel1_select_idx = 1;  
                                    // init content panel
  this.content_panel = new uc_browsing_content("div_panel2_headline", c_LANG_UC_BROWSING_PANEL2_TITLE, "div_panel2_pad", "uc_browsing", "panel2", this.cb_clicked_at_str);
  this.content_panel.load_item_content(this.db_obj.command(uc_browsing_setup.tree_last_selected, "get_content"));
                                    // init info panel
  this.info_panel = new uc_browsing_infopanel("div_panel3_headline", c_LANG_UC_BROWSING_PANEL3_TITLE, "div_panel3_pad", "uc_browsing", "panel3", this.cb_clicked_at_str, this.create_infopanel_iparams());                                    
                                    // setup automatic timer for Info Panel
  var on_click_str = "window." + this.cb_clicked_at_str + "(\'uc_browsing\', \'panel3\', \'update_info_panel\', \'disp_init\', c_KEYB_MODE_NONE);";
  setTimeout(on_click_str, uc_browsing_setup.info_timer); 
                                    // init features panel
  this.features_panel = new uc_browsing_features("div_panel4_headline", c_LANG_UC_BROWSING_PANEL4_TITLE, "div_panel4_pad", "uc_browsing", "panel4", this.cb_clicked_at_str, this.db_obj);
  this.features_panel.load_favorites(uc_browsing_setup.favorites);
}

