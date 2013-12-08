

// Class 'input_dispatcher'
function input_dispatcher(main_tree_context)
{
  // public methods
  this.key_event = input_dispatcher_key_event;
  this.clicked_at = input_dispatcher_clicked_at.bind(this);
  this.input_done = input_dispatcher_input_done.bind(this);	// bind command to make sure that 'this' is still
								// known inside function body
  


  // private variables
  var my_main_tree_context = main_tree_context;
  this.currently_selected="root";
  this.new_tree_item_input = false;
  var my_main_tree = new topic_tree_gui(main_tree_context, this, this.input_done, this.clicked_at);
  this.my_main_tree = my_main_tree;
  this.new_item_id = 0;
  this.saved_item_id = "";

  // constructor
  var __construct = function() 
  {

    my_main_tree.create_tree("root", "Alle Themen");
  } ()


  // constructor call (when object is created)
  __construct;
}


function input_dispatcher_key_event(e)
{
  var is_ie = false; 
                                    // special treatment for Internet Explorer
  if (e==undefined)
  {
    is_ie = true;
    var e = window.event;
  }


  // ALT+N
  if(e.altKey && e.keyCode==78 && (e.type=='keyup' || is_ie))
  { 
//    alert("ALT-N");
    this.clicked_at("main_menu", "input_item");
  }

  // ENTER
  if(e.keyCode==13 && (e.type=='keyup' || is_ie) && ((this.new_tree_item_input == true)||(this.saved_item_id != "")))
  { 
//    alert("Enter");
    // actually this should only be executed when a new input element was 
    // created before
    this.input_done();
  }

  // ESC
  if(e.keyCode==27 && (e.type=='keyup' || is_ie))
  { 
//    alert("ESC");
    this.clicked_at("main_menu", "cancel_item");
  }

  // F2
  if(e.keyCode==113 && (e.type=='keyup' || is_ie))
  { 
//    alert("F2");
    this.clicked_at("main_menu", "change_item");
  }

  // DEL
  if(e.keyCode==46 && (e.type=='keyup' || is_ie))
  { 
//    alert("DEL");
    this.clicked_at("main_menu", "delete_item");
  }

}


// catch mouse clicks and process forwarded keyboard inputs
function input_dispatcher_clicked_at(panel, item)
{
  // input new item
  if (panel == "main_menu" && item == "input_item")
  {
    if (this.currently_selected!="")
    {
      this.new_tree_item_input = true;
      this.my_main_tree.input_item(this.currently_selected, "symbol_topic.gif");
    }
    else
      alert("Nothing selected!");
  }

  // cancel new item
  if (item == "cancel_item")
    this.my_main_tree.cancel_item();

  // change item
  if (panel == "main_menu" && item == "change_item")
    if (this.currently_selected!="") 
    {
      if (this.currently_selected!="root") 
      {
	this.saved_item_id = this.currently_selected;
        this.my_main_tree.rename_item(this.currently_selected);
      }
    }
    else
      alert("Nothing selected!");

  // delete item
  if (panel == "main_menu" && item == "delete_item")
    if (this.currently_selected!="") 
    {
      if (this.currently_selected!="root") 
      {
        this.my_main_tree.clear_item(this.currently_selected);
        this.currently_selected="";
      }
    }
    else
      alert("Nothing selected!");

  // select item
  if (panel == "main_tree")
  {
    if (this.currently_selected!="")
      this.my_main_tree.markup_item(this.currently_selected, false);
    this.currently_selected=(new String(item)).replace("_a", "");
    this.my_main_tree.markup_item(this.currently_selected, true);
  }
}




// when new item was given a name and it was saved by pressing <ENTER>
function input_dispatcher_input_done()
{
//  alert("save");

  if (this.new_tree_item_input == true)
  {
    this.my_main_tree.save_item(this.new_item_id, this.new_tree_item_input, document.getElementById("give_name_input").value);
    this.new_item_id = this.new_item_id + 1;
    this.new_tree_item_input = false;
  }
  else
  {
    this.my_main_tree.save_item(this.saved_item_id, this.new_tree_item_input, document.getElementById("give_name_input").value);
    this.saved_item_id = "";
  }
}
