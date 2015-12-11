// Class 'uc_browsing_infopanel' -> Panel3
function uc_browsing_infopanel(gui_headline_context, lang_headline, gui_infopanel_context, current_usecase, current_panel, cb_clicked_at_str, gui_params)
{
  // save params to object
  this.gui_headline_context = gui_headline_context;
  this.lang_headline = lang_headline;
  this.gui_infopanel_context = gui_infopanel_context;
  this.current_usecase = current_usecase;
  this.current_panel = current_panel;
  this.cb_clicked_at_str = cb_clicked_at_str;
  this.gui_params = gui_params;

  // bind object functions
  this.print_title = uc_browsing_infopanel_print_title.bind(this);
  this.init_gui = uc_browsing_infopanel_init_gui.bind(this);
 
  // object variables


  // constructor  
  this.print_title();
  this.init_gui(this.gui_params);
}


function uc_browsing_infopanel_print_title()
{                                  
  setInnerHTML(document.getElementById(this.gui_headline_context), '<B>' + this.lang_headline[global_setup.curr_lang] + '</B>');
}


function uc_browsing_infopanel_init_gui(iparams)
{
  // iparams[].elem_id
  // iparams[].name
  // iparams[].text
  
  var my_html = '';
                                    // find Menu Index of Ticker-Titles to avoid
                                    // errors when menu changes  
  var as_news_idx = -1;
  var as_dates_idx = -1;
  for (var i=0; i<c_LANG_UC_BROWSING_MENUBAR[0].length; i++)
  {
    if (c_LANG_UC_BROWSING_MENUBAR[0][i][0] == "as_news")
      as_news_idx = i;
    if (c_LANG_UC_BROWSING_MENUBAR[0][i][0] == "as_date")
      as_dates_idx = i;
  }

  if ((iparams != undefined) && (iparams != null))
  {
    // ticker1 - item link
    if ((iparams[0].elem_id != undefined) && (iparams[0].elem_id != null))
    {
      var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'ticker_item_link\', \'" + iparams[0].elem_id + "\', c_KEYB_MODE_NONE);";
      my_html = my_html + '                  &nbsp<u><a id=\'' + this.current_panel + '_ticker1_item_link\' onclick=\"' + on_click_str + '\">' + c_LANG_UC_BROWSING_PANEL3_TICKER1_TITLE[global_setup.curr_lang] + '</a></u><br>';      
    }
    else
      my_html = my_html + '                  &nbsp<a id=\'' + this.current_panel + '_ticker1_item_link\'><u id=\'' + this.current_panel + '_ticker1_title\'>' + c_LANG_UC_BROWSING_PANEL3_TICKER1_TITLE[global_setup.curr_lang] + '</u></a><br>';

    // ticker1 - text
    if ((iparams[0].text != undefined) && (iparams[0].text != null))
      my_html = my_html + '                  &nbsp<marquee bgcolor=#0000AA scrollamount=\"2\" scrolldelay=\"5\"><font color=#BBBBBB><div id=\'' + this.current_panel + '_ticker1_text\'>' + iparams[0].text + '</div></font></marquee><br>';
    else
      my_html = my_html + '                  &nbsp<marquee bgcolor=#0000AA scrollamount=\"2\" scrolldelay=\"5\"><font color=#BBBBBB><div id=\'' + this.current_panel + '_ticker1_text\'>' + c_LANG_TICKER_DEFAULT_TEXT[global_setup.curr_lang] + c_LANG_UC_BROWSING_MENUBAR[0][0][global_setup.curr_lang] + '\\' + c_LANG_UC_BROWSING_MENUBAR[0][as_news_idx][global_setup.curr_lang] + ' ! +++</div></font></marquee><br>';

    // ticker2 - item link
    if ((iparams[1].elem_id != undefined) && (iparams[1].elem_id != null))
    {
      var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'ticker_item_link\', \'" + iparams[1].elem_id + "\', c_KEYB_MODE_NONE);";
      my_html = my_html + '                  &nbsp<u><a id=\'' + this.current_panel + '_ticker2_item_link\' onclick=\"' + on_click_str + '\">' + c_LANG_UC_BROWSING_PANEL3_TICKER2_TITLE[global_setup.curr_lang] + '</a></u><br>';      
    }
    else
      my_html = my_html + '                  &nbsp<a id=\'' + this.current_panel + '_ticker2_item_link\'><u id=\'' + this.current_panel + '_ticker2_title\'>' + c_LANG_UC_BROWSING_PANEL3_TICKER2_TITLE[global_setup.curr_lang] + '</u></a><br>';

    // ticker2 - text
    if ((iparams[1].text != undefined) && (iparams[1].text != null))
      my_html = my_html + '                  &nbsp<marquee bgcolor=#0000AA scrollamount=\"2\" scrolldelay=\"5\"><font color=#BBBBBB><div id=\'' + this.current_panel + '_ticker2_text\'>' + iparams[1].text + '</div></font></marquee><br>';
    else
      my_html = my_html + '                  &nbsp<marquee bgcolor=#0000AA scrollamount=\"2\" scrolldelay=\"5\"><font color=#BBBBBB><div id=\'' + this.current_panel + '_ticker2_text\'>' + c_LANG_TICKER_DEFAULT_TEXT[global_setup.curr_lang] + c_LANG_UC_BROWSING_MENUBAR[0][0][global_setup.curr_lang] + '\\' + c_LANG_UC_BROWSING_MENUBAR[0][as_dates_idx][global_setup.curr_lang] + ' ! +++</div></font></marquee><br>';
  }
  else
    alert(c_LANG_WARNING_WRONG_PARAM[global_setup.curr_lang] + "undefined");
    
  setInnerHTML(document.getElementById(this.gui_infopanel_context), my_html);
}
