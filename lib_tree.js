// Class 'lib_tree'
function lib_tree(gui_headline_context, lang_headline, gui_tree_context, current_usecase, current_panel, cb_clicked_at_str)
{
  // save params to object
  this.gui_headline_context = gui_headline_context;
  this.lang_headline = lang_headline;
  this.gui_tree_context = gui_tree_context;
  this.current_usecase = current_usecase;
  this.current_panel = current_panel;
  this.cb_clicked_at_str = cb_clicked_at_str;

  // bind object functions
  this.init = lib_tree_init.bind(this);
  this.print_title = lib_tree_print_title.bind(this);
  this.create_stub = lib_tree_create_stub.bind(this);
  this.print_tree = lib_tree_print_tree.bind(this);
  this.print_item = lib_tree_print_item.bind(this);
  this.print_multi_parent_menu = lib_tree_print_multi_parent_menu.bind(this);
  this.get_gui_path = lib_tree_get_gui_path.bind(this);
  this.markup_items = lib_tree_markup_items.bind(this); 
  this.get_item_data = lib_tree_get_item_data.bind(this); 
  this.get_gui_id = lib_tree_get_gui_id.bind(this);   
  this.input_item = lib_tree_input_item.bind(this);

//  this.cancel_item = topic_tree_cancel_item.bind(this);
//  this.save_item = topic_tree_save_item.bind(this);
//  this.select_item = topic_tree_select_item.bind(this);

//  this.mark_item_as_cut = topic_tree_mark_item_as_cut.bind(this);
//  this.change_symbol = topic_tree_change_symbol.bind(this);
//  this.rename_item = topic_tree_rename_item.bind(this);
//  this.clear_item = topic_tree_clear_item.bind(this);
//

  // object attributes
  this.curr_tree_obj = [];
  this.saved_a_tag = "";

  // constructor  
  this.init();
}


function lib_tree_init()
{
  this.print_title();
}


// for init and for language change
function lib_tree_print_title()
{                                  
  setInnerHTML(document.getElementById(this.gui_headline_context), '<B>' + this.lang_headline[global_setup.curr_lang] + '</B>');
}


// create stub of a tree
function lib_tree_create_stub(rootDiv, curr_node, onclickStr)
{
  // HTML-Code :
  //   <IMG ... /IMG>  
  //   <DIV ...>
  //     <span><A .../A></span>
  //   </DIV>
  //   <UL .../UL>
  var gui_id = curr_node.gui_id + '_a';
  var newImgItem = document.createElement("img");
    if (curr_node.type != "none")
    {
      newImgItem.id = curr_node.gui_id+"_sym";
      newImgItem.src = lib_tree_get_symb(curr_node.type);
      newImgItem.align = "left";
      newImgItem.width = 20;  
	    newImgItem.height = 20;    
	  }    
  var newDivItem = document.createElement("div");
    newDivItem.id = curr_node.gui_id+'_div';
    newDivItem.style.cssText = 'display: block; list-style: none; width:100%; margin: 0.1em; padding: 0; vertical-align: top; margin-left:-1.5em;';
    setInnerHTML(newDivItem, '<span><a id=\"' + gui_id + '\" onclick=\"' + onclickStr + '\" style=\"display: block; padding-top:0.2em; padding-left:1em;\">' + curr_node.name + '</a></span>');  
  var newUlRootItem = document.createElement("ul");
    newUlRootItem.id = curr_node.gui_id+"_ul";
    newUlRootItem.style.cssText = 'margin: 0;';
  rootDiv.appendChild(newImgItem);    
  rootDiv.appendChild(newDivItem);
  rootDiv.appendChild(newUlRootItem);
}


// print part of a tree in the respective GUI element
function lib_tree_print_tree(tree_obj, sel_elem_id)
{
                                    // save tree data object as local object variable
  this.curr_tree_obj = tree_obj;
                                    // initialize for Explorer Bar
  var tree_elem_idx = 0;
  var gui_context = document.getElementById(this.gui_tree_context);
  var exp_bar_html = "";

  // part 1 : print Explorer Bar
  for(var i=tree_obj.explorer_path.length-1; i>=0; i--)
  {
                                    // prepare variables
    var gui_id = tree_obj.explorer_path[i].gui_id + "_a";
    var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'explorer_select\', this.id, c_KEYB_MODE_NONE);";
    var on_click_str_multi = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'open_parent_menu\', this.id, c_KEYB_MODE_NONE);";          
                                    // root element (selected element is used as Explorer Bar)
    if (i == (tree_obj.explorer_path.length-1))
    {
      exp_bar_html = '<span><a id=\"' + gui_id + '\" onclick=\"' + on_click_str + '\">[' + tree_obj.explorer_path[i].name + ']</a></span>' + exp_bar_html;
    }
    else  
    {
                                    // normal multi-parent item
      if ((tree_obj.explorer_path[i].isMultiPar == true) && (i < (tree_obj.explorer_path.length - 2)))
                                    // menu button is printed together with parent item but current item
                                    // is used for 'clicked at'
        exp_bar_html = exp_bar_html + '&nbsp;<span><a id=\"' + gui_id + '\" onclick=\"' + on_click_str_multi + '\">{...}</a></span>&nbsp;\\ <span><a id=\"' + gui_id + '\" onclick=\"' + on_click_str + '\">' + tree_obj.explorer_path[i].name + '</a></span>';      
      else 
                                    // normal items
        exp_bar_html = exp_bar_html + ' \\ <span><a id=\"' + gui_id + '\" onclick=\"' + on_click_str + '\">' + tree_obj.explorer_path[i].name + '</a></span>';
                                    // first multi-parent item above tree
      if ((i==0) && (tree_obj.tree_nodes[0].isMultiPar == true) && (tree_obj.explorer_path.length > 1))
      {
        gui_id_mult = "E0" + "_a";
        on_click_str_multi = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'open_parent_menu\', \'T0_a\', c_KEYB_MODE_NONE);"; 
        exp_bar_html = exp_bar_html + '&nbsp;<span><a id=\"' + gui_id_mult + '\" onclick=\"' + on_click_str_multi + '\">{...}</a></span>&nbsp;';                      
      }
    }
  } 
  if (tree_obj.explorer_path.length > 0)
    setInnerHTML(gui_context, "&nbsp;" + exp_bar_html);
  else
    setInnerHTML(gui_context, "");
  
  // part 2 : print child elements as tree
  var treeRootDiv = document.createElement("div"); 
  var retval = {};
  treeRootDiv.id = 'gui_root_div';
  gui_context.appendChild(treeRootDiv);
                                    // print stub elements
  var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'tree_select\', this.id, c_KEYB_MODE_NONE );";
  var start_idx = 0;
  while (tree_obj.tree_nodes[start_idx].parent_gui_id == tree_obj.tree_nodes[0].parent_gui_id)
  {                                                     
    this.create_stub(treeRootDiv, tree_obj.tree_nodes[start_idx], on_click_str);  
    if (tree_obj.tree_nodes[start_idx].elem_id == sel_elem_id)
    {
      this.markup_items(tree_obj.tree_nodes[start_idx].gui_id, true);
      retval = tree_obj.tree_nodes[start_idx];
    }

    if (++start_idx >= tree_obj.tree_nodes.length)
      break;
  }
                                    // first tree object equals locked item
                                    // -> needs to be marked as locked by using []
  if ((start_idx == 1) && (tree_obj.explorer_path.length == 0))
  {
    var replace_item = document.getElementById(tree_obj.tree_nodes[start_idx-1].gui_id + '_a');
    var old_item_text = getInnerHTML(replace_item);
    setInnerHTML(replace_item, '[' + old_item_text + ']');
  }
                                    // attach child items
  var parent_gui_id = ""; 
  var item_gui_id = "";
  for (var i=start_idx; i<tree_obj.tree_nodes.length; i++)
  {
    parent_gui_id = tree_obj.tree_nodes[i].parent_gui_id;
    item_gui_id = "T" + i;
    this.print_item(parent_gui_id, item_gui_id, tree_obj.tree_nodes[i].name, tree_obj.tree_nodes[i].type);
  }                            
                           
  // part 3 : register events
                                    // change Background on Mouseover
  $('#' + this.gui_tree_context).find('a').hover(
    function () {
      $(this).css("background-color","gray");
    },
    function () {
      $(this).css("background-color","transparent"); 
    }  
  ); 
                                    // hide all UL lists on init which have the classname ".hide_ul"
  $('#' + this.gui_tree_context).find('ul.hide_ul').hide(0); 
                                    // ... unfold them on first mouseover of according icon image
  $('#' + this.gui_tree_context).find('img').hover(
    function () {
      $(this).siblings('ul').show(0);
    }
  ); 
  
  return retval;  
}


function lib_tree_get_type_no(typeInternalStr)
{
  for (var i=0; i<c_LANG_LIB_TREE_ELEMTYPE.length; i++)
  {
    if (typeInternalStr == c_LANG_LIB_TREE_ELEMTYPE[i][0])
      return i - 1;
  }
  return -1;
}


// find respective symbol depending on item type
function lib_tree_get_symb(itemType)
{
  for (var i=0; i<c_LANG_LIB_TREE_ELEMTYPE.length; i++)
  {
    if (itemType == c_LANG_LIB_TREE_ELEMTYPE[i][2])
      return "symbol_" + c_LANG_LIB_TREE_ELEMTYPE[i][0] + ".gif";
  }
  return "symbol_unknown.gif";
}


function lib_tree_print_multi_parent_menu(parent_list)
{
  var html_text = "&nbsp;<I>" + c_LANG_LIB_TREE_MSG_MULTI_CHOICE[global_setup.curr_lang] + " :</I><BR><BR>";
  var gui_context = document.getElementById(this.gui_tree_context);
  for(var a=0; a<parent_list.length; a++)
  {
    var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'parent_menu_select\', this.id, c_KEYB_MODE_NONE);"; 
    html_text = html_text + '&nbsp;<a id=\"' + parent_list[a].elem_id + '_a\" onclick=\"' + on_click_str + '\">' + parent_list[a].name + '</a><br>';
  }
  setInnerHTML(gui_context, html_text);
}


function lib_tree_get_gui_path(gui_id)
{
  var path_elem_list = [];
  var path_elem_ct = 0;
  var my_ul_id = gui_id + "_ul";
  var my_ul = document.getElementById(my_ul_id);
  
                                    // climb up element-wise until GUI root
  while (my_ul.parentNode.id != 'gui_root_div')
  {
    path_elem_list[path_elem_ct] = {};
    var curr_item = this.get_item_data(gui_id);
    path_elem_list[path_elem_ct].elem_id = curr_item.elem_id;
    path_elem_list[path_elem_ct++].parent_id = this.get_item_data(curr_item.parent_gui_id).elem_id;
    
    my_ul = my_ul.parentNode.parentNode;
    my_ul_id = my_ul.id; 
    gui_id = my_ul_id.substring(0, my_ul_id.length - 3);
  }
  return path_elem_list;
}



// take care of selection by mouse
function lib_tree_markup_items(item_id, do_markup)
{
  var curr_item = document.getElementById(item_id+"_div");
                                    // selection
  if (do_markup==true)
  {
    curr_item.style.backgroundColor = '#C0C0F0'; //rgb(115, 115, 185, 0.3)';  
  }
                                    // deselection
  else
  {
    curr_item.style.backgroundColor = 'transparent'; //'rgba(255, 255, 255, 0)';
  }
}
                          

function lib_tree_get_item_data(gui_id)
{
  var index = parseInt(gui_id.substring(1,gui_id.length)); 
  if (strStartsWith(gui_id, "E"))
    return this.curr_tree_obj.explorer_path[index];
  else
    return this.curr_tree_obj.tree_nodes[index];
}
                       
                       
function lib_tree_get_gui_id(elem_id)
{
  var retval = [];
  var retval_idx = 0;
                                    // search through Explorer Path
  for (var i=0; i<this.curr_tree_obj.explorer_path.length; i++)
    if (this.curr_tree_obj.explorer_path[i].elem_id == elem_id)
      retval[retval_idx++] = this.curr_tree_obj.explorer_path[i].gui_id;
                                    // search through Tree Path
  for (var i=0; i<this.curr_tree_obj.tree_nodes.length; i++)
    if (this.curr_tree_obj.tree_nodes[i].elem_id == elem_id)
      retval[retval_idx++] = this.curr_tree_obj.tree_nodes[i].gui_id;
      
  return retval;
}


function lib_tree_print_item(parent_gui_id, item_gui_id, itemName, itemType)
{
  // HTML-Code :
  // <LI ...>
  //   <IMG ... /IMG>
  //   <DIV ...>
  //     <A .../A>
  //   </DIV>
  //   <UL ... /UL>
  // </LI>  
                                    // prepare input form GUI element for displaying
  var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'tree_select\', this.id, c_KEYB_MODE_NONE);"; 
  var newLiItem = document.createElement("li");
      newLiItem.id = new String(item_gui_id+"_li");
	    newLiItem.style.cssText = 'display: block; list-style: none; width:100%; margin: 0.1em; padding: 0; vertical-align: top; margin-left:-1.5em; padding: 0;';
  var newImgItem = document.createElement("img");
      newImgItem.id = item_gui_id+"_sym";
      newImgItem.src = lib_tree_get_symb(itemType);
      newImgItem.align = "left";
      newImgItem.width = 22;  
	    newImgItem.height = 22;
  var newDivItem = document.createElement("div");
      newDivItem.id = new String(item_gui_id+"_div");    
      setInnerHTML(newDivItem, '<span><a id=\"' + item_gui_id + '_a\" onclick=\"' + on_click_str + '\" style=\"display: block; padding-top:0.2em; padding-left:1em;\">' + itemName + '</a></span>');
  var newUlItem = document.createElement("ul");
      newUlItem.className = "hide_ul";  
      newUlItem.id = item_gui_id+"_ul";
                                    // connect items
  var parentUlItem = document.getElementById(parent_gui_id+"_ul");    
  newLiItem.appendChild(newImgItem);    
  newLiItem.appendChild(newDivItem);
  newLiItem.appendChild(newUlItem);
  parentUlItem.appendChild(newLiItem);
}


// insert new list element under parent 'ul' element with text input form          
function lib_tree_input_item(is_new, gui_id, item_type)
{    
  // HTML-Code :
  // <LI ... >
  //   <IMG ...>...</IMG>
  //   <DIV ...>
  //     <INPUT .../>
  //   </DIV>
  //   <UL ... /UL>  
  // </LI>
  var my_gui_id = gui_id;
                                    // handle input init for new item
  if (is_new)
  {
    my_gui_id = "N0";
    var parent_gui_id = gui_id;
                                    // use "print_item" to create new item ...
    this.print_item(parent_gui_id, my_gui_id, "", item_type);
  }
                                    // get a tag element for modification
  var a_item = document.getElementById(my_gui_id + "_a");
                                    // create new input item            
  var newInputItem = document.createElement("input");     
  	newInputItem.id = my_gui_id + "_input";
  	newInputItem.name = my_gui_id + "_name";
  	newInputItem.type = "text";
                                    // replace <A> item by <INPUT> item
  a_item.parentNode.replaceChild(newInputItem, a_item);             
                                    // put a focus on input item
  document.getElementById(my_gui_id + "_input").focus();
}      
