// Class 'uc_browsing_features' -> Panel4
function uc_browsing_features(gui_headline_context, lang_headline, gui_features_context, current_usecase, current_panel, cb_clicked_at_str, db_obj)
{
  // save params to object
  this.gui_headline_context = gui_headline_context;
  this.lang_headline = lang_headline;
  this.gui_features_context = gui_features_context;
  this.current_usecase = current_usecase;
  this.current_panel = current_panel;
  this.cb_clicked_at_str = cb_clicked_at_str;
  this.db_obj = db_obj;

  // bind object functions
  this.print_title = uc_browsing_features_print_title.bind(this);
  this.init_gui = uc_browsing_features_init_gui.bind(this);
  this.load_favorites = uc_browsing_features_load_favorites.bind(this);
 
  // object variables


  // constructor  
  this.print_title();
  this.init_gui();
}


function uc_browsing_features_print_title()
{                                  
  setInnerHTML(document.getElementById(this.gui_headline_context), '<B>' + this.lang_headline[global_setup.curr_lang] + '</B>');
}


function uc_browsing_features_init_gui(iparams)
{
  
  var my_html = '';
    
  setInnerHTML(document.getElementById(this.gui_features_context), my_html);
}


function uc_browsing_features_load_favorites(favorites_array)
{
  var gui_context = document.getElementById(this.gui_features_context);
  setInnerHTML(gui_context, "");
  
  for (var i=0; i<favorites_array.length; i++)
  {
    var my_div = document.createElement("div");
    my_div.id = 'favorite' + i + '_div';
    var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'favorites\', \'" + i + "\', c_KEYB_MODE_NONE );";    
    var fav_text = "";
    for (var j=0; j<favorites_array[i].length; j++)
      fav_text = ' \\ ' + favorites_array[i][j].name + fav_text;
    setInnerHTML(my_div, '<a id=\"favorite' + i + '\" onclick=\"' + on_click_str + '\" style=\"display: block; padding-left:0.2em;\">' + fav_text + '<br/></a>');  
    gui_context.appendChild(my_div);
  }
  
  $('#' + this.gui_features_context).find('a').hover(
    function () {
      $(this).css("background-color","gray");
    },
    function () {
      $(this).css("background-color","transparent"); 
    }  
  ); 

}