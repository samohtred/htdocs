// Class 'uc_browsing_content' -> Panel2
function uc_browsing_content(gui_headline_context, lang_headline, gui_content_context, current_usecase, current_panel, cb_clicked_at_str)
{
  // save params to object
  this.gui_headline_context = gui_headline_context;
  this.lang_headline = lang_headline;
  this.gui_content_context = gui_content_context;
  this.current_usecase = current_usecase;
  this.current_panel = current_panel;
  this.cb_clicked_at_str = cb_clicked_at_str;

  // bind object functions
  this.print_title = uc_browsing_content_print_title.bind(this);
  this.init_gui = uc_browsing_content_init_gui.bind(this);
  this.load_item_content = uc_browsing_load_item_content.bind(this);
 
  // object variables
  this.item_content = {};
  
  this.print_title();
  this.init_gui();
}


function uc_browsing_content_print_title()
{                                  
  setInnerHTML(document.getElementById(this.gui_headline_context), '<B>' + this.lang_headline[global_setup.curr_lang] + '</B>');
}


function uc_browsing_content_init_gui()
{
  var my_html = '';
  var on_focus_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'content\', \'on_focus\', c_KEYB_MODE_NONE);";  
  var on_blur_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'content\', \'on_blur\', c_KEYB_MODE_NONE);";    
  my_html = my_html + '                  <H2><div id=\'' + this.current_panel + '_content_headline\' style=\"padding-left:0.5em; margin-top:-0.6em; margin-bottom:0.0em;\">' + c_LANG_MSG_LOADING[global_setup.curr_lang] + '</div></H2>';
  my_html = my_html + '                  <div id=\'' + this.current_panel + '_content_description\' style=\"margin-left:0.7em; margin-top:-1.0em; padding-left:0.1em; padding-right:0.1em; padding-bottom:0.1em; width:944px; height:300px; border-width:0.2em; border-style:solid; border-color:#C0C0F0;\">';
  my_html = my_html + '                    <div id=\'' + this.current_panel + '_content_fulltext\' contenteditable=\"true\" onfocus=\"' + on_focus_str + '\" onblur=\"' + on_blur_str + '\" name=\"myname\" wrap=physical style=\"width:100%; height:100%; background-color:#FFFFFF; border-style:none;\">';  
  my_html = my_html + '                      ' + c_LANG_MSG_LOADING[global_setup.curr_lang];
  my_html = my_html + '                    </div>';
  my_html = my_html + '                  </div>';  
//  my_html = my_html + '                  <H4><U><a id=\'' + this.current_panel + '_optional_cb_button\' href="" style=\"padding-left:0.7em; margin-top:-0.6em; margin-bottom:0.0em;\"></a></U></H4>';  

  setInnerHTML(document.getElementById(this.gui_content_context), my_html);
}


function uc_browsing_load_item_content(item_content)
{
  this.item_content = item_content;
  setInnerHTML(document.getElementById(this.current_panel + "_content_headline"), item_content.name); 
//  document.getElementById(this.current_panel + "_content_fulltext").value = item_content.description;
  setInnerHTML(document.getElementById(this.current_panel + "_content_fulltext"), item_content.description);
  // further item content :
  //    - voting
  //    - history
  //    - forum discussion
  //    ...
}