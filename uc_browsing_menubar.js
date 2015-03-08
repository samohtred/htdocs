function uc_browsing_menubar(gui_elem_id, current_usecase, my_dispatcher_name, cb_clicked_at_str, menu_data)
{
  // take over params into object
  this.gui_elem_id = gui_elem_id;
  this.current_usecase = current_usecase;
  this.my_dispatcher_name = my_dispatcher_name;
  this.cb_clicked_at_str = cb_clicked_at_str;
  this.menu_data = menu_data;
  
  // bind functions to object
  this.add_submenu = uc_browsing_menubar_add_submenu.bind(this);
  this.init = uc_browsing_menubar_init.bind(this);

  this.old_item = undefined;
  this.old_submenu = undefined;

  // constructor call
  this.init();    
} 


function uc_browsing_menubar_add_submenu(sub_ul, submenu_data)
{                        
  var sub_title_li = document.createElement("li");  
  sub_title_li.style.cssText = 'background-color: #ccc; float:left; position:relative; display:block;';
  var sub_title_a = document.createElement("a");
  sub_title_a.style.cssText = 'color:#000000; display:block; width:130px; height: 25px; text-decoration:none; text-align:center;  margin:5px;';
  setInnerHTML(sub_title_a, submenu_data[0][global_setup.curr_lang]);
  sub_title_li.appendChild(sub_title_a);  
  sub_ul.appendChild(sub_title_li); 

  var sub_child_ul = document.createElement("ul");
  sub_child_ul.style.cssText = 'position:absolute; display:none; padding:0px; top:0;left:100%;';
  sub_title_li.appendChild(sub_child_ul);
  
  if (strStartsWith(submenu_data[1][0],'#'))
  {
    var feature_type = -1;
    var command = "";
    var my_feature = submenu_data[1];
    if (my_feature[0] == '#output_list')
    {
      command = my_feature[1];
      for (var i=2; i<my_feature.length; i++)
      {
        var sub_item_li = document.createElement("li");  
        sub_item_li.style.cssText = 'background-color: #ccc; float:left; position:relative; display:block;';
        var sub_item_a_style_str   = 'style=\"color:#000000; display:block; width:130px; height: 25px; text-decoration:none; text-align:center; margin:5px;\" ';
        var sub_item_a_onclick_str = "onclick=\"" + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.my_dispatcher_name + "\', \'" + submenu_data[0][0] + "\', \'" + new String(i-2) + "\', c_KEYB_MODE_NONE);\"";
        var sub_item_a_str = '<a id=\"' + submenu_data[0][0]+ new String(i-2) + '_a\" ' + sub_item_a_style_str + sub_item_a_onclick_str + '>' + my_feature[i] + '</a>';        
        setInnerHTML(sub_item_li, sub_item_a_str);
        sub_child_ul.appendChild(sub_item_li); 
      }
    }
    if (my_feature[0] == '#input_field')
    {
      var my_input_item = document.createElement("input");     
  	  my_input_item.id = my_feature[1] + "_input";
  	  my_input_item.type = "text";
  	  my_input_item.style.cssText = 'color:#000000; display:block; width:130px; height: 25px; text-decoration:none; text-align:center; padding:4px;';
  	  sub_child_ul.appendChild(my_input_item); 
  	  my_input_item.focus();
    }
  }
  else
  {
    for (var i=1; i<submenu_data.length; i++)
    {
      if (Array.isArray(submenu_data[i][0]))
      {
        sub_child_ul = this.add_submenu(sub_child_ul, submenu_data[i]);
      }
      else
      {                
        // multilinguale Einträge als Blätter
      }
    }                          
  }

  return sub_ul;
}


function uc_browsing_menubar_init()
{
  var main_ul = document.createElement("ul");
  var main_ul_id = this.my_dispatcher_name + '_ul';
  main_ul.id = main_ul_id;
  main_ul.style.cssText = 'color:#000000; padding:0px; list-style:none; position:absolute; margin-top:-10px;';

  // traverse all menus
  for (var i=0; i<this.menu_data.length; i++)
  {
    var menu = this.menu_data[i];
    // create menu title
    var menu_title_li = document.createElement("li");
    menu_title_li.style.cssText = 'background-color: #ccc; float:left; position:relative; margin-right:1px;';
    var menu_title_a = document.createElement("a");
    menu_title_a.style.cssText = 'color:#000000; text-decoration:none; text-align:center; padding:1px 5px;';
    setInnerHTML(menu_title_a, menu[0][global_setup.curr_lang]);
    menu_title_li.appendChild(menu_title_a);
    var menu_ul = document.createElement("ul");
    menu_ul.style.cssText = 'position:absolute; left:0; top:100%; display:none; padding:0px;'; 
    // traverse all other items
    for (var j=1; j<menu.length; j++)
    {
      if (Array.isArray(menu[j][0]))
      {
        menu_ul = this.add_submenu(menu_ul, menu[j]);
      }
      else
      {
        var menu_item_li = document.createElement("li"); 
        menu_item_li.style.cssText = 'background-color: #ccc; float:left; position:relative; display:block;';
        var menu_item_a_style_str   = 'style=\"color:#000000; display:block; width:130px; height: 25px; text-decoration:none; text-align:center; margin:5px;\" ';
        var menu_item_a_onclick_str = "onclick=\"" + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.my_dispatcher_name + "\', \'" + menu[0][0] + "\', \'" + menu[j][0] + "\', c_KEYB_MODE_NONE);\"";
        var menu_item_a_str = '<a id=\"' + menu[j][0] + '_a\" ' + menu_item_a_style_str + menu_item_a_onclick_str + '>' + menu[j][global_setup.curr_lang] + '</a>';        
        setInnerHTML(menu_item_li, menu_item_a_str)
        menu_ul.appendChild(menu_item_li);
      }        
    }
    menu_title_li.appendChild(menu_ul);
    main_ul.appendChild(menu_title_li);  
  }                          
  var my_panel = document.getElementById(this.gui_elem_id); 
  setInnerHTML(my_panel, "");
  my_panel.appendChild(main_ul);
  var onclick_str = "alert('doof')";

                                    // hovering in jQuery
  $('#' + main_ul_id).find('li').hover(
    function () {
      //show its submenu
      $(this).children('ul').stop().show(100);    
    },
    function () {
      //hide its submenu
      $(this).children('ul').stop().delay(100).hide(100);      
    }
  );
  $('#' + main_ul_id).find('a').hover(
    function () {
      $(this).parent('li').css("background-color","gray");
    },
    function () {
      $(this).parent('li').css("background-color","#ccc"); 
    }  
  );
}
 


