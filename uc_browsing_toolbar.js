// Toolbar just below Menubar
function uc_browsing_toolbar( gui_elem_id, cb_clicked_at_str )
{
  // take over params into object
  this.gui_elem_id = gui_elem_id;
  this.cb_clicked_at_str = cb_clicked_at_str;
  
  // bind functions to object
  this.init = uc_browsing_toolbar_init.bind(this);
  this.set_elem_type = uc_browsing_toolbar_set_elem_type.bind(this);
  this.set_cb_url = uc_browsing_toolbar_set_cb_url.bind(this);

  // constructor call
  this.init(0);    
} 


function uc_browsing_toolbar_init(elem_type_idx)
{
  var my_panel = document.getElementById(this.gui_elem_id);
  
  var my_html = 
            '           <table>'
          + '             <tr id=\'my_info_row\' style=\"white-space:nowrap; color: white; width:100%; height:25px;\">'
          + '               <td id=\'info_row_curr_lang_td\' width=5%><B>&nbsp;&nbsp;|&nbsp;&nbsp;' + c_LANG_UC_BROWSING_MENU_LANG_TITLE[global_setup.curr_lang] + ' : </B><A id=\'info_row_curr_lang_div\'>' + c_LANG[global_setup.curr_lang] + '</A></td>'          
          + '               <td id=\'info_row_curr_item_td\' width=5%><B>&nbsp;&nbsp;|&nbsp;&nbsp;' + c_LANG_LIB_TREE_ELEMTYPE[0][global_setup.curr_lang] + ' : </B><A id=\'info_row_curr_elem_type_div\'>' + c_LANG_LIB_TREE_ELEMTYPE[elem_type_idx+1][global_setup.curr_lang] + '</A></td>'
          + '               <td id=\'info_row_curr_region_td\' width=5%><B>&nbsp;&nbsp;|&nbsp;&nbsp;' + c_LANG_UC_BROWSING_TOOLBAR_CURR_REGION[global_setup.curr_lang] + ' : </B><A id=\'info_row_curr_region_div\'><U>Global</U></A></td>';
//  my_html = my_html + '     <td id=\'info_row_other_filters_td\' width=5%><A><B>&nbsp;&nbsp;|&nbsp;&nbsp;</B><U>' + c_LANG_UC_BROWSING_TOOLBAR_OTHER_FILTERS[global_setup.curr_lang] + '</U></A></td>';
  if ((param_cb_toolname != undefined) && (param_cb_url != undefined))
  {
  my_html = my_html + '     <td id=\'info_row_opt_callbk_td\' width=5%><B>&nbsp;&nbsp;|&nbsp;&nbsp;<U><A id=\'info_row_opt_callbk_a\' href=\'' + param_cb_url + '\' style=\"white-space:nowrap; color: yellow;\">' + c_LANG_UC_BROWSING_TOOLBAR_BACK_TO_MSG[global_setup.curr_lang] + '&nbsp;' + param_cb_toolname + '</A></U></B></td>';
  }
  my_html = my_html + '     <td width=100%></td>'
  my_html = my_html + '   </tr>'
  my_html = my_html + ' </table>';

  setInnerHTML(my_panel, my_html);
}

function uc_browsing_toolbar_set_elem_type(type_idx)
{
  var myElemType = document.getElementById("info_row_curr_elem_type_div"); 
  setInnerHTML(myElemType, c_LANG_LIB_TREE_ELEMTYPE[type_idx+1][global_setup.curr_lang]);
}

function uc_browsing_toolbar_set_cb_url(elem_id)
{
  if ((param_cb_toolname != undefined) && (param_cb_url != undefined))
  {
    document.getElementById("info_row_opt_callbk_a").href = param_cb_url + '\"' + elem_id + '\"';
  }
}