var main_input_dispatcher;
var win_width = 0;
var win_height = 0;
var panel_names = new Array("main_tree", "main_content", "main_features");
var content_setups = new Array(new Array("10%","10%","10%"),new Array("20%","20%","20%"),new Array("30%","30%","30%")); 
var last_item = 0;


function get_total_width()
{
  var w = 0;

  // IE
  if(!window.innerWidth)
  {
    if(!(document.documentElement.clientWidth == 0))
    {
      //strict mode
      w = document.documentElement.clientWidth;
    } 
    else
    {
      //quirks mode
      w = document.body.clientWidth;
    } 
  } 
  else 
  {
    //w3c
    w = window.innerWidth;
  }

  return w;
}

function get_total_height()
{
  var h = 0;

  // IE
  if(!window.innerHeight)
  {
    if(!(document.documentElement.clientHeight == 0))
    {
      //strict mode
      h = document.documentElement.clientHeight;
    } 
    else
    {
      //quirks mode
      h = document.body.clientHeight;
    } 
  } 
  else 
  {
    //w3c
    h = window.innerHeight;
  }

  return h;
}


function main_table_init()
{
//  alert("init0");
  var main_tree_context = document.getElementById("main_tree_pad");  
  main_input_dispatcher = new input_dispatcher(main_tree_context);

  try {

    if (window.addEventListener)
    {
      window.addEventListener("keydown", main_table_call_input_dispatcher, false);
      window.addEventListener("keyup", main_table_call_input_dispatcher, false);
    } 
    else
      window.onkeydown =  main_table_call_input_dispatcher;    

  } catch (e) {
        alert(e);
  }


//  alert("init1");
  win_width = get_total_width();
  win_height = get_total_height();
  var elem;
  var my_width;
  my_width = Math.round((win_width-32) * 0.8);
  elem = document.getElementById("main_tree");
  elem.style.width = new String(my_width) + "px";
  elem = document.getElementById("main_tree_child");
  elem.style.width = new String(my_width) + "px";
  my_width = Math.round((win_width-32) * 0.1);
  elem = document.getElementById("main_content");
  elem.style.width = new String(my_width) + "px";
  elem = document.getElementById("main_content_child");
  elem.style.width = new String(my_width) + "px";
  elem = document.getElementById("main_features");
  elem.style.width = new String(my_width) + "px";
  elem = document.getElementById("main_features_child");
  elem.style.width = new String(my_width) + "px";
//  alert("init2");
  main_table_resize();
//  alert("init3");
}


function main_table_resize()
{
//  alert("resize1");
  win_width = get_total_width();
  win_height = get_total_height();
  var new_content_height = Math.round((win_height - 75)*0.8);
  var new_bookmark_height = Math.round((win_height - 75)*0.2);
  var new_content_height_str = new String(new_content_height) + "px";
  var new_bookmark_height_str = new String(new_bookmark_height) + "px";
  var new_content_height_child_str = new String(new_content_height-20) + "px";

//  alert("resize2");
  var elem;
  elem = document.getElementById("content_table"); elem.style.height = new_content_height_str;
//  alert("resize3");
  elem = document.getElementById("main_tree"); elem.style.height = new_content_height_str;
  elem = document.getElementById("main_tree_child"); elem.style.height = new_content_height_child_str;
  elem = document.getElementById("main_content"); elem.style.height = new_content_height_str;
  elem = document.getElementById("main_content_child"); elem.style.height = new_content_height_child_str;
  elem = document.getElementById("main_features"); elem.style.height = new_content_height_str;
  elem = document.getElementById("main_features_child"); elem.style.height = new_content_height_child_str;
  elem = document.getElementById("main_bookmark"); elem.style.height = new_bookmark_height_str;
  elem = document.getElementById("main_bookmark_child"); elem.style.height = new_bookmark_height_str;
//  alert("resize4");

  var new_big_width = new String(Math.round((win_width - 32)*0.8)) + "px";
  var new_small_width = new String(Math.round((win_width - 32)*0.1)) + "px";
  for (var i=0; i<3; i++)
  {
    elem1 = document.getElementById(panel_names[i]);
    elem2 = document.getElementById(panel_names[i]+"_child");
    if (i==last_item)
      {elem1.style.width = new_big_width; elem2.style.width = new_big_width;}
    else
      {elem1.style.width = new_small_width; elem2.style.width = new_small_width;}
  }
//  alert("resize5");

  elem = document.getElementById("main_bookmark"); elem.style.height = new_bookmark_height_str;
  elem = document.getElementById("main_bookmark_child"); elem.style.height = new_bookmark_height_str;
//  alert("resize6");
}


function main_table_content_resize(setup_id)
{
  var elem;
//  alert("cresize1");
  elem = document.getElementById(panel_names[last_item]);
  elem.style.width = new String(Math.round((win_width-32) * 0.1)) + "px";
  elem = document.getElementById(panel_names[last_item]+"_child");
  elem.style.width = new String(Math.round((win_width-32) * 0.1)) + "px";
//  alert("cresize2");
  elem = document.getElementById(panel_names[setup_id]);
  elem.style.width = new String(Math.round((win_width-32) * 0.8)) + "px";
  elem = document.getElementById(panel_names[setup_id]+"_child");
  elem.style.width = new String(Math.round((win_width-32) * 0.8)) + "px";

  last_item = setup_id;

}


function main_table_call_input_dispatcher(e)
{
//  alert("input");
  main_input_dispatcher.key_event(e);
}