<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 5.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>                    
    <title>X-Tree-M Export</title>   
    <script>
      // for parametrized call, e.g. : main.x-tree-m.bplaced.net/disco/index.php?item_id="575"&cb_toolname="qKonsens"&cb_url="http://main.x-tree-m.bplaced.net/disco/index.php\?item_id="
      var param_url = <?php echo isset($_GET['url']) ? $_GET['url'] : "undefined"; ?>;                      // original URL
      var param_item_id = <?php echo isset($_GET['item_id']) ? $_GET['item_id'] : "undefined"; ?>;          // Id of currently selected Post
      var param_db_path = <?php echo isset($_GET['db_path']) ? $_GET['db_path'] : "undefined"; ?>;          // URL to Database
      var param_db_type = parseInt(<?php echo isset($_GET['db_type']) ? $_GET['db_type'] : "undefined"; ?>);// Database Type
      var param_root_item = <?php echo isset($_GET['root_item']) ? $_GET['root_item'] : "undefined"; ?>;    // Root Item of database
      var param_db_name = <?php echo isset($_GET['db_name']) ? $_GET['db_name'] : "undefined"; ?>;          // Name of Database File
      var param_php_name = <?php echo isset($_GET['php_name']) ? $_GET['php_name'] : "undefined"; ?>;       // Name of PHP skript    
      // workaround to fix global dependencies of database libraries
      var global_setup = {};
      global_setup.curr_lang = 2;
      global_setup.tree_max_child_depth = 100000;
      var uc_browsing_setup = {};
      uc_browsing_setup.tree_data_src_params = {};
      uc_browsing_setup.tree_data_src_params.root_item = param_root_item;
    </script>
    <script src="jquery.js"></script>                                                                                                                                                                
    <script src="global_defs.js"></script>
    <script src="global_functions.js"></script>
    <script src="lib_tree_lang.js"></script>
    <script src="lib_data_xml.js"></script>
    <script src="lib_data_disco.js"></script>    
    <script src="lib_data_lang.js"></script>
    <script src="lib_data_cookie.js"></script>
    <script src="lib_data_dispatcher.js"></script>
    <script src="datajs.js"></script>                                                                                        
    <script src="jaydata.js"></script>                                                                                       
    <script src="oDataProvider.js"></script>                                                                
    <script src="disco.ontology.js"></script>                                                                                
    <script>
      //disco.js                                                                                                                                                 
      var __extends = this.__extends || function (d, b) {                                                                                                        
        for (var p in b) 
          if (b.hasOwnProperty(p)) d[p] = b[p];                                                                                                     
        function __() { this.constructor = d; }                                                                                                                    
        __.prototype = b.prototype;                                                                                                                                
        d.prototype = new __();                                                                                                                                    
      };                                                                                                                                                             
      var Context = (function (_super) {                                                                                                                         
          __extends(Context, _super);                                                                                                                            
          function Context(serviceUri) {                                                                                                                         
              var config = {                                                                                                                                     
                  name: 'oData',                                                                                                                                 
                  oDataServiceHost: serviceUri,                                                                                                                  
                  maxDataServiceVersion: '3.0',                                                                                                                  
                  Accept: 'application/json;odata=nometadata'                                                                                                    
              };                                                                                                                                                 
              _super.call(this, config);                                                                                                                         
          }                                                                                                                                                      
          return Context;                                                                                                                                        
      })(Default.Container);                                                                                                                                     
      $data.EntityContext.prototype['prepareRequest'] = function (r) {                                                                                           
          var __encodeBase64 = $data['Authentication'].BasicAuth.BasicAuth.prototype.__encodeBase64;                                                             
          if (this.context.authData) {                                                                                                                           
              var auth = this.context.authData();                                                                                                                
              if (auth.user != null)                                                                                                                             
                  r[0].headers['Authorization'] = "Basic  " + __encodeBase64(auth.user + ':' + auth.password);                                                   
          }                                                                                                                                                      
      };                            

      // Function to handle Filling in of Database Data into this HTML Sheet
      function process_tree()
      {                    
        // get tree from database
        var tree = this.db_obj.command({}, "get_tree");    
        
        // miscellaneous functions
        var get_children = function(tree, arr_idx) 
        {
          var retVal = [];
          var curr_idx = 0;
          for (var i=arr_idx; i<tree.tree_nodes.length; i++)
          {          
            if (tree.tree_nodes[i].parent_gui_id == tree.tree_nodes[arr_idx].gui_id)
              retVal[curr_idx++] = i;                
          }
          return retVal;
        }
        var get_parent_enum = function(tree, arr_idx)
        {
          var retVal = -1;
          var parent_gui_id = tree.tree_nodes[arr_idx].parent_gui_id;
          for (var i=0; i<tree.tree_nodes.length; i++)
          {          
            if (tree.tree_nodes[i].gui_id == parent_gui_id)
              return tree.tree_nodes[i].enum;
          }
          return retVal;
        }
        var draw_toc_item = function(tree, arr_idx)
        {
          var gui_id = tree.tree_nodes[arr_idx].gui_id;
          var content = '<span><a id=\"' + gui_id + '_TOC_TITLE_a\" href=\"#' + gui_id + '_CONTENT_TITLE_a\" style=\"display : block; padding: 0.1em; text-decoration: none\">' + tree.tree_nodes[arr_idx].enum + ' - ' + tree.tree_nodes[arr_idx].name + '</a></span>';    
          content = content + '<div id=\"' + gui_id + '_TOC_CHILD_div\" style="margin-left: 0.9em;\"></div>';
          var myObj = {};
          if (arr_idx==0)
            myObj = document.getElementById("TOC_CONTENT");
          else
            myObj = document.getElementById(tree.tree_nodes[arr_idx].parent_gui_id+'_TOC_CHILD_div');
          setInnerHTML(myObj, getInnerHTML(myObj)+content);
        }
        var draw_content_item = function(tree, arr_idx)
        {
          // create actual content
          var gui_id = tree.tree_nodes[arr_idx].gui_id;
          var content = '<span><a id=\"' + gui_id + '_CONTENT_TITLE_a\" style=\"display: block; padding: 0.1em;"\><font size=\"4\"><B>' + tree.tree_nodes[arr_idx].enum + ' - ' + tree.tree_nodes[arr_idx].name + '</B></font></a></span>';                    
          content = content + '<div id=\"' + gui_id + '_CONTENT_FULLTEXT_div\" style=\"padding:1.2em; width:80%\">' + tree.tree_nodes[arr_idx].description + '</div>';
          // create navigation
          var nav_str = "<div style=\"padding:1.2em; padding-bottom:3em;\">";
                                    // add "up" item
          if (arr_idx==0) 
            nav_str = nav_str + '<div style=\"float:left; width:11%; color:#D0D0D0;\">hoch</div>';
          else
            nav_str = nav_str + '<a href=\"#' + tree.tree_nodes[arr_idx].parent_gui_id + '_CONTENT_TITLE_a\" style=\"float:left; width:11%;\">hoch</a>';
                                    // add "previous" item
          var prev_avail = true; 
          if (arr_idx==0) 
            prev_avail = false;
          else
            prev_avail = (tree.tree_nodes[arr_idx-1].parent_gui_id != tree.tree_nodes[arr_idx].parent_gui_id) ? false : true;                                   
          if (!prev_avail)
            nav_str = nav_str + '<div style=\"float:left; width:11%; color:#D0D0D0;\">vorheriges</div>';
          else
            nav_str = nav_str + '<a href=\"#' + tree.tree_nodes[arr_idx-1].gui_id + '_CONTENT_TITLE_a\" style=\"float:left; width:11%;\">vorheriges</a>';
                                    // add TOC item
          nav_str = nav_str + '<a href=\"#' + tree.tree_nodes[arr_idx].gui_id + '_TOC_TITLE_a\" style=\"float:left; width:11%;\">Inhaltsverzeichnis</a>';
                                    // add "next" item
          var next_avail = true; 
          if (arr_idx>=tree.tree_nodes.length-1) 
            next_avail = false;
          else
            next_avail = (tree.tree_nodes[arr_idx+1].parent_gui_id != tree.tree_nodes[arr_idx].parent_gui_id) ? false : true;                                   
          if (!next_avail)
            nav_str = nav_str + '<div style=\"float:left; width:11%; color:#D0D0D0;\">nächstes</div>';
          else
            nav_str = nav_str + '<a href=\"#' + tree.tree_nodes[arr_idx+1].gui_id + '_CONTENT_TITLE_a\" style=\"float:left; width:11%;\">nächstes</a>';
                                    // add "down" item
          var myChildren = get_children(tree, arr_idx);
          if (myChildren.length==0) 
            nav_str = nav_str + '<div style=\"float:left; width:11%; color:#D0D0D0;\">runter</div>';
          else
            nav_str = nav_str + '<a href=\"#' + tree.tree_nodes[myChildren[0]].gui_id + '_CONTENT_TITLE_a\" style=\"float:left; width:11%;\">runter</a>';
          nav_str = nav_str + '</div>';
          content = content + nav_str;
          // put it all into a DIV
          var myself = document.createElement('div');
            myself.id = gui_id + '_CONTENT_div';
            setInnerHTML(myself, content);
          // append it at the correct position
          var myObj = {};
          if (arr_idx==0)
          {
            myObj = document.getElementById("ITEMS_CONTENT");
            myObj.appendChild(myself);         
          }
          else
          {
                                        // if previous sibling exists, append to it; otherwise take parent
            if (tree.tree_nodes[arr_idx-1].parent_gui_id == tree.tree_nodes[arr_idx].parent_gui_id)
              myObj = document.getElementById(tree.tree_nodes[arr_idx-1].gui_id+'_CONTENT_div');
            else
              myObj = document.getElementById(tree.tree_nodes[arr_idx].parent_gui_id+'_CONTENT_div');            
            myObj.parentNode.insertBefore(myself, myObj.nextSibling);
          }
        }
        var parents_items = [0];
        var child_items = [];
        tree.tree_nodes[0].enum = "1";
        // complete tree traversion
        do {
          child_items = [];
          var parent_enum = "";
          var parent_enum_q = "";
          var rel_idx = 1;
          // traverse all parents
          for (var i=0; i<parents_items.length; i++)
          {        
            // draw parent
            if (tree.tree_nodes[parents_items[i]].enum == undefined)
            {
              parent_enum = get_parent_enum(tree, parents_items[i]);
              if (parent_enum != parent_enum_q)
                rel_idx = 1;
              tree.tree_nodes[parents_items[i]].enum = get_parent_enum(tree, parents_items[i]) + '.' + (rel_idx++);
              parent_enum_q = parent_enum;
            }
            draw_toc_item(tree, parents_items[i]);
            draw_content_item(tree, parents_items[i]);
            // get children
            child_items = child_items.concat(get_children(tree, parents_items[i]));
          }
          // copy child_items to parent items
          parents_items = jQuery.extend(true, [], child_items);
        }
        while (child_items.length > 0); 

        var head = document.getElementsByTagName('head');
        setInnerHTML(head, '<title>X-Tree-M Export</title>');           
      }

      function onload_fnc()
      {
        window.scrollTo(0,0);
        
        // set date
        dateObj = document.getElementById('GLOBAL_DATE');
        var now = new Date();
        var myDate = now.getFullYear()+ '/' + (now.getMonth()+1 < 10 ? '0'+(now.getMonth()+1) : now.getMonth()+1) + '/' + (now.getDate()<10 ? '0'+now.getDate() : now.getDate());
        setInnerHTML(dateObj, myDate);        
                
        // get Tree from Database
        var my_path_raw = window.location.pathname;
        my_path = my_path_raw.replace(/\//g,''); 
        var def_parent_storage = new lib_data_cookie("X-Tree-M-Export", my_path, "Default_Parents");
        db_obj = new lib_data_dispatcher(def_parent_storage, param_db_type, param_db_path, {root_item:param_root_item, db_name:param_db_name, php_name:param_php_name }, global_setup );
        var req_tree_cb_str = "window.process_tree();";            
        db_obj.command({elemId:[param_item_id], lock_id:param_item_id, favIds:[], tickerIds:[param_item_id, param_item_id], cb_fct_call:req_tree_cb_str, mode:"tree_only"}, "req_tree");          
      }
    </script>                                                                                                                                                      
    
    <style>
/*      .voting { display:none; }*/
    </style>                
  </head>
  <body onload="onload_fnc();" style="margin:0em; border:0em; padding:0em;">
    <div id="GLOBAL_HEADLINE" style="color:#3030C0; padding-left:0.3em"><b><h1>X-Tree-M Export - <span id="GLOBAL_DATE">2016/03/09</span></h1></b></div>
    <div id="TOC_HEADLINE" style="background-color:#0000D0; color:#B0B0FF; padding-left:0.3em"><b><font size="5">Inhaltsverzeichnis</font></b></div>
    <div id="TOC_CONTENT" style="background-color: rgb(223, 239, 255);color:#3030C0;padding:0.6em">
    </div>
    <div id="ITEMS_HEADLINE" style="background-color:#0000D0; color:#B0B0FF; margin:0em; padding:0em; padding-left:0.3em"><b><font size="5">Ausführliche Informationen</font></b></div>
    <div id="ITEMS_CONTENT" style="background-color: rgb(223, 239, 255);color:#3030C0;padding:0.6em">      

    </div>
  </body>
</html>
