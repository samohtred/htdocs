// Class 'main_content_gui'
function main_content_gui(gui_context)  //, cb_obj, cb_onchange_fcn, cb_onclicked_fcn)
{
  this.main_content_gui_context = gui_context;

  this.set_headline = main_content_set_headline.bind(this);
  this.get_fulltext = main_content_get_fulltext.bind(this);
  this.set_fulltext = main_content_set_fulltext.bind(this);
}


function main_content_set_headline(itemName)
{
  document.getElementById("main_content_headline").innerHTML = itemName; 
}                                                    

function main_content_get_fulltext()
{
  return document.getElementById("main_content_fulltext").innerHTML;  
}

function main_content_set_fulltext(mytext)
{
  document.getElementById("main_content_fulltext").innerHTML = mytext;  
}