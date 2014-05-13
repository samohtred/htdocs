

// Class 'topic_tree_gui'
function topic_tree_gui(gui_context, cb_obj, cb_onchange_fcn, cb_onclicked_fcn)
{
  this.topic_tree_gui_context = gui_context;
  this.cb_obj = cb_obj;
  this.cb_onchange_fcn = cb_onchange_fcn;
  this.cb_onclicked_fcn = cb_onclicked_fcn;
  var topic_tree_selected_item = "root";   // topic root as starting point
  var topic_tree_new_item_id = "new";

  this.create_tree = topic_tree_create_tree;
  this.print_item = topic_tree_print_item.bind(this);
  this.input_item = topic_tree_input_item;
  this.cancel_item = topic_tree_cancel_item;
  this.save_item = topic_tree_save_item;
  this.select_item = topic_tree_select_item.bind(this);
  this.markup_item = topic_tree_markup_item;
  this.mark_item_as_cut = topic_tree_mark_item_as_cut;
  this.change_symbol = topic_tree_change_symbol.bind(this);
  this.rename_item = topic_tree_rename_item;
  this.clear_item = topic_tree_clear_item;


  // constructor
  var __construct = function() 
  {
  } ()

  // constructor call (when object is created)
  __construct;
}



// create stub of a tree
function topic_tree_create_tree(islocked, rootId, rootName)
{
  // HTML-Code :
  // <DIV ... >
  //   <DIV ...>
  //     <A .../>
  //   </DIV>
  // </DIV>
  var rootDiv = document.createElement("div");
  var newDivItem = document.createElement("div");
    newDivItem.id = rootId+'_div';
  var newAItem = document.createElement("a");
    newAItem.name=rootId+'_a';
    newAItem.onclick=this.select_item; 
    if (islocked)
      newAItem.innerHTML='<span>['+rootName+']</span>';    
    else
      newAItem.innerHTML='<span>'+rootName+'</span>';
    newAItem.style.cssText = 'display: block; padding: 0.2em 1em;';
  var newUlRootItem = document.createElement("ul");
    newUlRootItem.id = rootId+"_ul";
  newDivItem.appendChild(newAItem);
  rootDiv.appendChild(newDivItem);
  rootDiv.appendChild(newUlRootItem);
  this.topic_tree_gui_context.innerHTML = '';
  this.topic_tree_gui_context.appendChild(rootDiv);
}


// add a single item to the current tree (without input field)
function topic_tree_print_item(islocked, parentId, itemId, itemName, SymbolFilePath)
{
  if ((parentId == undefined) || (islocked))
  {
    this.create_tree(islocked, itemId, itemName);
  }
  else
  {
                                    // prepare input form GUI element for displaying
    var newLiItem = document.createElement("li");
        newLiItem.id = new String(itemId+"_li");
	      newLiItem.style.cssText = 'list-style: none; width:100%; margin: 0.1em; padding: 0; vertical-align: top; margin-left:-1.5em; padding: 0;';
    var newImgItem = document.createElement("img");
        newImgItem.id = itemId+"_sym";
        newImgItem.src = SymbolFilePath; 
        newImgItem.align = "left";
        newImgItem.width = 22;  
	      newImgItem.height = 22;
    var newDivItem = document.createElement("div");
        newDivItem.id = new String(itemId+"_div");    
    var newAItem = document.createElement("a");
	      newAItem.name=itemId+'_a';
	      newAItem.onclick=this.select_item; 
	      newAItem.innerHTML='<span>'+itemName+'</span>';	    
	      newAItem.style.cssText = 'display: block; padding: 0.2em 1em;';
    var newUlItem = document.createElement("ul");
        newUlItem.id = itemId+"_ul";
                                    // connect items
    newDivItem.appendChild(newAItem);

    var parentUlItem = document.getElementById(parentId+"_ul");    
    newLiItem.appendChild(newImgItem);    
    newLiItem.appendChild(newDivItem);
    newLiItem.appendChild(newUlItem);
    parentUlItem.appendChild(newLiItem);
  }
}


// insert new list element under parent 'ul' element with text input form          
function topic_tree_input_item(parentId, SymbolFilePath)
{    
  
  // HTML-Code :
  // <LI ... >
  //   <IMG ...>...</IMG>
  //   <DIV ...>
  //     <INPUT .../>
  //   </DIV>
  // </LI>

    // create items
                                    // prepare input form GUI element for displaying
    var newLiItem = document.createElement("li");
        newLiItem.id = new String("give_name_li");
	newLiItem.style.cssText = 'list-style: none; width:100%; margin: 0.1em; padding: 0; vertical-align: top; margin-left:-1.5em; padding: 0;';
    var newImgItem = document.createElement("img");
        newImgItem.id = "give_name_sym";     
        newImgItem.src = SymbolFilePath; 
        newImgItem.align = "left";
        newImgItem.width = 22;  
	newImgItem.height = 22;
    var newDivItem = document.createElement("div");     
    var newInputItem = document.createElement("input");     
	newInputItem.id = "give_name_input";
	newInputItem.name = "new_name";
	newInputItem.type = "text";
	newInputItem.onchange=this.cb_onchange_fcn;
    var parentUlItem = document.getElementById(parentId+"_ul");

    // connect items
    newDivItem.appendChild(newInputItem);
    newLiItem.appendChild(newImgItem);    
    newLiItem.appendChild(newDivItem);
    parentUlItem.appendChild(newLiItem); 
  
                                    // put a focus on input item
    document.getElementById("give_name_input").focus();
                                    // Debug Output
//    this.topic_tree_gui_context.innerHTML = '<textarea COLS=80 ROWS=30 disabled="true" style="border: none;background-color:white;">' + document.getElementById("topic_tree_col").innerHTML + '</textarea>';    
}      


// erase new item on cancel
function topic_tree_cancel_item(is_new, saved_id, saved_name)
{
  if (is_new)
                                    // clear complete new item on cancel
    document.getElementById("give_name_li").outerHTML = "";
  else
  {
                                    // erase input box
    var curr_div = document.getElementById(saved_id+"_div");
      curr_div.innerHTML = "";
    var newAItem = document.createElement("a");
	    newAItem.name=saved_id+'_a';
	    newAItem.onclick=this.select_item; 
	    newAItem.innerHTML='<span>'+saved_name+'</span>';
	    newAItem.style.cssText = 'display: block; padding: 0.2em 1em;';      
    curr_div.appendChild(newAItem);
    var mySym = document.getElementById("give_name_sym");
      mySym.id = item_id+"_sym";    
  }
}


// after input
function topic_tree_save_item(item_id, is_new, item_text)
{

  // HTML-Code :
  // <LI ... >
  //   ...
  //   <DIV ...>
  //     <A .../>   	==> replace <INPUT>
  //   </DIV>
  //   <UL ...>		==> new !
  //   </UL>
  // </LI>

    var input_item = document.getElementById("give_name_input");
    var sym_item = document.getElementById("give_name_sym");    
      sym_item.id = item_id+'_sym';
    var newAItem = document.createElement("a");
	    newAItem.name=item_id+'_a';
	    newAItem.onclick=this.select_item; 
	    newAItem.innerHTML='<span>'+item_text+'</span>';
	    newAItem.style.cssText = 'display: block; padding: 0.2em 1em;';
    var parent_item = input_item.parentNode;
    parent_item.id = item_id+"_div";
    parent_item.removeChild(input_item);
    parent_item.appendChild(newAItem);

    if (is_new)
    {
      var newUlItem = document.createElement("ul");
        newUlItem.id = item_id+"_ul";

      var li_item = document.getElementById("give_name_li");
	      li_item.id = item_id+"_li";
      li_item.appendChild(newUlItem); 
    }

    // monitor created HTML code in content Panel
//    topic_tree_gui_context.innerHTML = '<textarea COLS=80 ROWS=30 disabled="true" style="border: none;background-color:white;">' + document.getElementById("topic_tree_col").innerHTML + '</textarea>';    

}
        

// click / select item
function topic_tree_select_item(e)
{
  if (e) 
    this.cb_onclicked_fcn('main_tree',e.target.parentNode.name);
  else
    this.cb_onclicked_fcn('main_tree',window.event.srcElement.parentNode.name);
}     


// take care of selection by mouse
function topic_tree_markup_item(item_id, do_markup)
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

    // monitor created HTML code in content Panel
//    topic_tree_gui_context.innerHTML = '<textarea COLS=80 ROWS=30 disabled="true" style="border: none;background-color:white;">' + document.getElementById("topic_tree_col").innerHTML + '</textarea>';       
}


// markup cut items
function topic_tree_mark_item_as_cut(item_id, do_mark)
{
    var curr_item = document.getElementById(item_id+"_div");
                                   // selection
    if (do_mark==true)
    {
        curr_item.style.color = '#D0D0D0'; //rgb(115, 115, 185, 0.3)';  
    }
                                   // deselection
    else
    {
        curr_item.style.color = 'transparent'; //'rgba(255, 255, 255, 0)';
    }

    // monitor created HTML code in content Panel
//    topic_tree_gui_context.innerHTML = '<textarea COLS=80 ROWS=30 disabled="true" style="border: none;background-color:white;">' + document.getElementById("topic_tree_col").innerHTML + '</textarea>';       
}


function topic_tree_change_symbol(item_id, symbol_path)
{
  var myItem = document.getElementById(item_id+"_sym");
  
  if (myItem != undefined)
  {
    myItem.src = symbol_path;
  } 
  else
    alert("Tree item not found !");
}

function topic_tree_rename_item(item_id, initText)
{
  var curr_div = document.getElementById(item_id+"_div");
    curr_div.innerHTML = "";
  var newInputItem = document.createElement("input");     
    newInputItem.id = "give_name_input";
    newInputItem.name = "new_name";
    newInputItem.type = "text";
    newInputItem.value = initText;
    newInputItem.onchange=this.cb_onchange_fcn;
  curr_div.appendChild(newInputItem);
  var mySym = document.getElementById(item_id+"_sym");
    mySym.id = "give_name_sym";
                                    // put a focus on input item
  document.getElementById("give_name_input").focus();

    // monitor created HTML code in content Panel
//    topic_tree_gui_context.innerHTML = '<textarea COLS=80 ROWS=30 disabled="true" style="border: none;background-color:white;">' + document.getElementById("topic_tree_col").innerHTML + '</textarea>';    
}


// erase selected item on erase command
function topic_tree_clear_item(item_id)
{

    var curr_item = document.getElementById(item_id+"_li");
    curr_item.outerHTML="";

    // monitor created HTML code in content Panel
//    topic_tree_gui_context.innerHTML = '<textarea COLS=80 ROWS=30 disabled="true" style="border: none;background-color:white;">' + document.getElementById("topic_tree_col").innerHTML + '</textarea>';    
}