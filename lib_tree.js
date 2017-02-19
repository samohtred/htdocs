// Class 'lib_tree'
function lib_tree(gui_headline_context, lang_headline, gui_tree_context, current_usecase, current_panel, cb_clicked_at_str)
{
  // save params to object
  this.gui_headline_context = gui_headline_context;
  this.lang_headline = lang_headline;
  this.gui_tree_context = gui_tree_context;
  this.current_usecase = current_usecase;
  this.current_panel = current_panel;
  this.cb_clicked_at_str = cb_clicked_at_str;

  // bind object functions
  this.init = lib_tree_init.bind(this);
  this.print_title = lib_tree_print_title.bind(this);
  this.create_stub = lib_tree_create_stub.bind(this);
    this.print_disptype_tree = print_disptype_tree.bind(this);
    this.print_disptype_bubbles = print_disptype_bubbles.bind(this);
  this.print_tree = lib_tree_print_tree.bind(this);
  this.print_item = lib_tree_print_item.bind(this);
  this.print_multi_parent_menu = lib_tree_print_multi_parent_menu.bind(this);
  this.get_defpar_pairs = lib_tree_get_defpar_pairs.bind(this);
  this.markup_items = lib_tree_markup_items.bind(this); 
  this.get_tree = lib_tree_get_tree.bind(this);
  this.get_item_data = lib_tree_get_item_data.bind(this); 
  this.get_gui_id = lib_tree_get_gui_id.bind(this);    
  this.get_children = lib_tree_get_children.bind(this);
  this.input_item = lib_tree_input_item.bind(this);
  this.get_prev_sibling = lib_tree_get_prev_sibling.bind(this);
  this.get_next_sibling = lib_tree_get_next_sibling.bind(this);
  this.get_next_visible_dn = lib_tree_get_next_visible_dn.bind(this);
  this.get_next_visible_up = lib_tree_get_next_visible_up.bind(this);  

  this.mark_items_as_cut = lib_tree_mark_items_as_cut.bind(this);

//  this.cancel_item = lib_tree_cancel_item.bind(this);
//  this.save_item = lib_tree_save_item.bind(this);
//  this.select_item = lib_tree_select_item.bind(this);


//  this.change_symbol = lib_tree_change_symbol.bind(this);
//  this.rename_item = lib_tree_rename_item.bind(this);
//  this.clear_item = lib_tree_clear_item.bind(this);
//

  // object attributes
  this.curr_tree_obj = [];
  this.saved_a_tag = "";

  // constructor  
  this.init();
}


function lib_tree_init()
{
  this.print_title();
}


// for init and for language change
function lib_tree_print_title()
{
  
  var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'switch_disp\', this.id, c_KEYB_MODE_NONE, event);";                                  
  var link_html = '<span><a id=\"panel1_headline_a\" onclick=\"' + on_click_str + '\"><B>' + this.lang_headline[2+global_setup.display_type] + '</B></a></span>';
  setInnerHTML(document.getElementById(this.gui_headline_context), link_html);
}


// create stub of a tree
function lib_tree_create_stub(rootUl, curr_node, onclickStr, ul_hidden)
{
  // HTML-Code :
  // <LI>
  //   <IMG ... /IMG>  
  //   <DIV ...>
  //     <span><A .../A></span>
  //   </DIV>
  //   <UL .../UL>
  // </LI>
  var gui_id = curr_node.gui_id + '_a';
  var newLiItem = document.createElement("li");
    newLiItem.id = curr_node.gui_id+"_li";
    newLiItem.style.cssText = 'list-style: none; margin: 0; padding: 0;';    
  var newImgItem = document.createElement("img");
    if (curr_node.type != "none")
    {
      newImgItem.id = curr_node.gui_id+"_sym";
      newImgItem.src = lib_tree_get_symb(curr_node.type);
      newImgItem.align = "left";
      newImgItem.width = 20;  
	    newImgItem.height = 20;    
	  }    
  var newDivItem = document.createElement("div");
    newDivItem.id = curr_node.gui_id+'_div';
    newDivItem.style.cssText = 'display: block; list-style: none; width:100%; margin: 0.1em; padding: 0; vertical-align: top; margin-left:-1.5em;';
    setInnerHTML(newDivItem, '<span><a id=\"' + gui_id + '\" onclick=\"' + onclickStr + '\" style=\"display: block; padding-top:0.2em; padding-left:1em;\">' + curr_node.name + '</a></span>');  
  var newUlItem = document.createElement("ul");
    newUlItem.id = curr_node.gui_id+"_ul";
    newUlItem.style.cssText = 'margin: 0;';
    if (ul_hidden)
      newUlItem.className = "hide_ul";
  newLiItem.appendChild(newImgItem);    
  newLiItem.appendChild(newDivItem);
  newLiItem.appendChild(newUlItem);
  rootUl.appendChild(newLiItem);
}


function print_disptype_tree(tree_obj, sel_elem_id, selected_item_in_tree)
{
                                    // initialize for Explorer Bar
  var exp_bar_html = "";

  // part 1 : print Explorer Bar
  for(var i=tree_obj.explorer_path.length-1; i>=0; i--)
  {
                                    // prepare variables
    var gui_id = tree_obj.explorer_path[i].gui_id + "_a";
    var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'explorer_select\', this.id, c_KEYB_MODE_NONE, event);";
    var on_click_str_multi = "";  
                                    // root element (selected element is used as Explorer Bar)
    if (i == (tree_obj.explorer_path.length-1))
    {
      exp_bar_html = '<span><a id=\"' + gui_id + '\" onclick=\"' + on_click_str + '\">[' + tree_obj.explorer_path[i].name + ']</a></span>' + exp_bar_html;
    }
    else  
    {
      var gui_id_mult = tree_obj.explorer_path[i].gui_id + "_pmenu_a";      
      var predecessor = {};
                                    // first multi-parent item above tree      
      if (i==0)
      {
        predecessor = selected_item_in_tree;
        on_click_str_multi = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'open_parent_menu\', \'" + selected_item_in_tree.gui_id + "_a\', c_KEYB_MODE_NONE, event);";       
      }
      else
      {
        predecessor = tree_obj.explorer_path[i-1];
        on_click_str_multi = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'open_parent_menu\', \'" + tree_obj.explorer_path[i-1].gui_id + "_a\', c_KEYB_MODE_NONE, event);";          
      }

                                    // multi-parent item
      if (predecessor.isMultiPar == true)
      {
        exp_bar_html = '<span><a id=\"' + gui_id + '\" onclick=\"' + on_click_str + '\">' + tree_obj.explorer_path[i].name + '</a></span>&nbsp;<span><a id=\"' + gui_id_mult + '\" onclick=\"' + on_click_str_multi + '\">{...}</a></span> \\&nbsp;' + exp_bar_html;                      
      }
      else
      {
                                    // normal items
        exp_bar_html = '<span><a id=\"' + gui_id + '\" onclick=\"' + on_click_str + '\">' + tree_obj.explorer_path[i].name + '</a></span> \\&nbsp;' + exp_bar_html;
      }
    }
  }                        
  // add Explorer Path to GUI
  var gui_context = document.getElementById(this.gui_tree_context); 
   
  if (tree_obj.explorer_path.length > 0)
    setInnerHTML(gui_context, "&nbsp;" + exp_bar_html);
  else
    setInnerHTML(gui_context, "");
  
  // part 2 : print child elements as tree
  var retval = {};
  var treeRootUl = document.createElement("ul"); 
  treeRootUl.id = this.current_panel + '_root_ul';
  var treeRootDiv = document.createElement("div");
  treeRootDiv.style.cssText = 'margin-left:-2.3em; margin-top:-0.9em;';
  gui_context.appendChild(treeRootDiv);
  treeRootDiv.appendChild(treeRootUl);

                                    // print stub elements
  var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'tree_select\', this.id, c_KEYB_MODE_NONE, event);";
  var start_idx = 0;
  while (tree_obj.tree_nodes[start_idx].parent_gui_id == tree_obj.tree_nodes[0].parent_gui_id)
  {                                                     

    if (tree_obj.tree_nodes[start_idx].elem_id == sel_elem_id)
    {
      this.create_stub(treeRootUl, tree_obj.tree_nodes[start_idx], on_click_str, false);        
      this.markup_items(tree_obj.tree_nodes[start_idx].gui_id, true);
      retval = tree_obj.tree_nodes[start_idx];
    }
    else
      this.create_stub(treeRootUl, tree_obj.tree_nodes[start_idx], on_click_str, true);  

    if (++start_idx >= tree_obj.tree_nodes.length)
      break;
  }
                                    // first tree object equals locked item
                                    // -> needs to be marked as locked by using []
  if ((start_idx == 1) && (tree_obj.explorer_path.length == 0))
  {
    var replace_item = document.getElementById(tree_obj.tree_nodes[start_idx-1].gui_id + '_a');
    var old_item_text = getInnerHTML(replace_item);
    setInnerHTML(replace_item, '[' + old_item_text + ']');
  }
                                    // attach child items
  var parent_gui_id = ""; 
  var item_gui_id = "";
  for (var i=start_idx; i<tree_obj.tree_nodes.length; i++)
  {
    parent_gui_id = tree_obj.tree_nodes[i].parent_gui_id;
    item_gui_id = tree_obj.tree_nodes[i].gui_id;
    this.print_item(parent_gui_id, item_gui_id, tree_obj.tree_nodes[i].name, tree_obj.tree_nodes[i].type);
  }                            
                           
  // part 3 : register events
                                    // change Background on Mouseover
  $('#' + this.gui_tree_context).find('a').hover(
    function () {
      $(this).css("background-color","gray");
    },
    function () {
      $(this).css("background-color","transparent"); 
    }  
  ); 
                                    // hide all UL lists on init which have the classname ".hide_ul"
  $('#' + this.gui_tree_context).find('ul.hide_ul').hide(0); 
                                    // ... unfold them on first mouseover of according icon image
  $('#' + this.gui_tree_context).find('img').mouseenter(
    function () {
      if ($(this).siblings('ul').css("display") == "none")
        $(this).siblings('ul').show(100);
      else
        $(this).siblings('ul').hide(100);        
    }
  ); 
  
  return retval;  
}


function print_disptype_bubbles(tree_obj, sel_elem_id, selected_item_in_tree)
{
  var gui_context = document.getElementById(this.gui_tree_context);
  setInnerHTML(gui_context, "<div id=\"bubble_home\"></div>");

  // constants
  var c_PARENT_FILL  = "#D0D0FF";   var c_PARENT_STROKE   = "#3030FF";  var c_TARGET_FOR_PARENT = 1;    var c_PARENT_LINK_COLOR   = "#00C";
  var c_SIBLING_FILL = "#80FF80";   var c_SIBLING_STROKE  = "#008000";  var c_TARGET_FOR_SIBLING = 2;   var c_SIBLING_LINK_COLOR  = "#0C0";
  var c_CHILD_FILL   = "#FF60FF";   var c_CHILD_STROKE    = "#8F008F";  var c_TARGET_FOR_CHILD = 3;     var c_CHILD_LINK_COLOR    = "#C00";

  // basic init of graph data
  var graph = {
    "nodes":[
      // Element
      {"id":selected_item_in_tree.gui_id+"_a", "name":selected_item_in_tree.name.replace(/&rsaquo;/g,'>'), "fill":"#FFFFB0", "stroke":"#0000C0", "symbol":""},    
      // Sub-Branches
      {"id":"A0_a", "name":"  ","fill":"#8080FF","stroke":"#000040", "symbol":""},         // Parents
      {"id":"A1_a", "name":"  ","fill":"#00C000","stroke":"#002000", "symbol":""},         // Siblings
      {"id":"A2_a", "name":"  ","fill":"#C000C0","stroke":"#200020", "symbol":""}          // Children
    ],
    "links":[
      // Sub-Branches
      {"source":1,"target":0,"color":"#AAA"},
      {"source":2,"target":0,"color":"#AAA"},
      {"source":3,"target":0,"color":"#AAA"}
    ]
  };
  
  var curr_node_idx = graph.nodes.length;
  var curr_link_idx = graph.links.length;  

  // Parent Nodes
  var curr_node = tree_obj.explorer_path[0];
  if (curr_node != undefined)
  {
    graph.nodes[curr_node_idx] = {};
    graph.nodes[curr_node_idx].id = curr_node.gui_id + "_a";
    graph.nodes[curr_node_idx].name = curr_node.name.replace(/&rsaquo;/g,'>');
    if (curr_node.type != "none")
      graph.nodes[curr_node_idx].symbol = lib_tree_get_symb(curr_node.type);   
    else
      graph.nodes[curr_node_idx].symbol = "symbol_unknown.gif";
    graph.nodes[curr_node_idx].fill = c_PARENT_FILL;   graph.nodes[curr_node_idx].stroke = c_PARENT_STROKE;
    
    
    graph.links[curr_link_idx] = {};
    graph.links[curr_link_idx].source = curr_node_idx++;
    graph.links[curr_link_idx].target = c_TARGET_FOR_PARENT;
    graph.links[curr_link_idx++].color = c_PARENT_LINK_COLOR;  
  }
   
  // other node types
  if (tree_obj.tree_nodes != undefined)  
  {
    for (var i=0; i<tree_obj.tree_nodes.length; i++)
    {  
      curr_node = tree_obj.tree_nodes[i];
      
      // Sibling Nodes
      if ((curr_node.parent_gui_id == selected_item_in_tree.parent_gui_id) && (curr_node.elem_id != selected_item_in_tree.elem_id))
      {
        graph.nodes[curr_node_idx] = {};
        graph.nodes[curr_node_idx].id = curr_node.gui_id + "_a";
        graph.nodes[curr_node_idx].name = curr_node.name.replace(/&rsaquo;/g,'>');      
        if (curr_node.type != "none")
          graph.nodes[curr_node_idx].symbol = lib_tree_get_symb(curr_node.type);   
        else
          graph.nodes[curr_node_idx].symbol = "symbol_unknown.gif";      
        graph.nodes[curr_node_idx].fill = c_SIBLING_FILL;   graph.nodes[curr_node_idx].stroke = c_SIBLING_STROKE;
        graph.links[curr_link_idx] = {};
        graph.links[curr_link_idx].source = curr_node_idx++;
        graph.links[curr_link_idx].target = c_TARGET_FOR_SIBLING;
        graph.links[curr_link_idx++].color = c_SIBLING_LINK_COLOR;  
      }
    
      // Child Nodes
      if (curr_node.parent_gui_id == selected_item_in_tree.gui_id)
      {
        graph.nodes[curr_node_idx] = {};
        graph.nodes[curr_node_idx].id = curr_node.gui_id + "_a";
        graph.nodes[curr_node_idx].name = curr_node.name.replace(/&rsaquo;/g,'>');      
        if (curr_node.type != "none")
          graph.nodes[curr_node_idx].symbol = lib_tree_get_symb(curr_node.type);   
        else
          graph.nodes[curr_node_idx].symbol = "symbol_unknown.gif";      
        graph.nodes[curr_node_idx].fill = c_CHILD_FILL;   graph.nodes[curr_node_idx].stroke = c_CHILD_STROKE;
        graph.links[curr_link_idx] = {};                  
        graph.links[curr_link_idx].source = curr_node_idx++;
        graph.links[curr_link_idx].target = c_TARGET_FOR_CHILD;
        graph.links[curr_link_idx++].color = c_CHILD_LINK_COLOR;  
      }
    }
  }
  
  on_click_str = "window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'explorer_select\', this.id, c_KEYB_MODE_NONE, event);";          
  
  var width = 960,
      height = 500;
  
  var color = d3.scale.category20();
  
  var force = d3.layout.force()
      .charge(-1000)
      .linkDistance(60)
      .size([width, height]);
  
  var svg = d3.select("#bubble_home").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  var drawGraph = function(graph) {
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
  
    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
        .style("stroke", function(d) { return d.color; });             
  
    var gnodes = svg.selectAll('g.gnode')
       .data(graph.nodes)
       .enter()
       .append('g')
       .classed('gnode', true);
      
    var elementHeight = 15;
    var elementWidth = 9;  // size per letter 

    var node = gnodes.append("rect")
        .attr("id", function(d) { return d.id;})
        .attr("class", "node")
        .attr("height", elementHeight)
        .attr("width", function(d) { return elementWidth*d.name.length; })
//        .on('mouseover', function() { alert('over1'+this.id); } )
//        .on('mouseout', function() { alert('out1'+this.id); } )        
        .on("click", function(event) { eval(on_click_str); return;} )            
        .style("fill", function(d) { return d.fill; })
        .style("stroke", function(d) { return d.stroke; }) 
        .style("stroke-width", function(d) { if (d.index==0) return "2.5px"; else return "1.5px";})           
        .call(force.drag);
  
      var mysymbs = gnodes.append("svg:image")
          .attr("xlink:href", function(d) { return d.symbol; })
          .attr("width", 20)  
          .attr("height", 20)
          .attr("x","2")
          .attr("y","-22");
  
    var labels = gnodes.append("text")
        .text(function(d) { return d.name; })
        .attr("id", function(d) { return d.id;})
        .style("fill", function(d) { return d.stroke; })                        
        .attr("text-anchor", "start")
        .attr("x","2")
        .attr("y","12")
//        .on('mouseover', function() { alert('over2'+this.id); } )            
//        .on('mouseout', function() { alert('out2'+this.id); } )                
//        .on("click", function(event) {alert('click2'+this.id); eval(on_click_str);  return;}.bind(on_click_str))
        .on("click", function(event) { eval(on_click_str);  return;} )            
        .style("font", function(d) { if (d.index==0) return "10pt courier"; else return "10pt courier";})
        .call(force.drag);
  
      
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      gnodes.attr("transform", function(d) { 
          return 'translate(' + [d.x-(elementWidth*d.name.length/2), d.y-(elementHeight/2)] + ')'; 
      });        
    });
  }.bind(on_click_str);
  
  drawGraph(graph);  
  
  return selected_item_in_tree;
}


// print part of a tree in the respective GUI element
function lib_tree_print_tree(tree_obj, sel_elem_id)
{
                                    // save tree data object as local object variable
  this.curr_tree_obj = jQuery.extend(true, {}, tree_obj);  
  
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // look up data in node array
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
  var k=0;
                                    // find selected item among Tree Nodes
  while (k<tree_obj.tree_nodes.length)
  {
    if (tree_obj.tree_nodes[k].elem_id == sel_elem_id) 
      break;
    else
      k++;
  }
  var selected_item_in_tree = tree_obj.tree_nodes[k];

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // execute print function for selected display type
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
  var retval;
  if (global_setup.display_type == 0)
    retval = this.print_disptype_tree(tree_obj, sel_elem_id, selected_item_in_tree);
  else
    retval = this.print_disptype_bubbles(tree_obj, sel_elem_id, selected_item_in_tree);
  
  return retval;
}


function lib_tree_get_type_no(typeInternalStr)
{
  for (var i=0; i<c_LANG_LIB_TREE_ELEMTYPE.length; i++)
  {
    if (typeInternalStr == c_LANG_LIB_TREE_ELEMTYPE[i][0])
      return i - 1;
  }
  return -1;
}


// find respective symbol depending on item type
function lib_tree_get_symb(itemType)
{
  for (var i=0; i<c_LANG_LIB_TREE_ELEMTYPE.length; i++)
  {
    if (itemType == c_LANG_LIB_TREE_ELEMTYPE[i][0])
      return "symbol_" + c_LANG_LIB_TREE_ELEMTYPE[i][0] + ".gif";
  }
  return "symbol_unknown.gif";
}


function lib_tree_print_multi_parent_menu(parent_list)
{
  var html_text = "&nbsp;<I>" + c_LANG_LIB_TREE_MSG_MULTI_CHOICE[global_setup.curr_lang] + " :</I><BR><BR>";
  var gui_context = document.getElementById(this.gui_tree_context);
  for(var a=0; a<parent_list.length; a++)
  {
    var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'parent_menu_select\', this.id, c_KEYB_MODE_NONE, event);"; 
    html_text = html_text + '&nbsp;<a id=\"' + parent_list[a].elem_id + '_a\" onclick=\"' + on_click_str + '\">' + parent_list[a].name + '</a><br>';
  }
  setInnerHTML(gui_context, html_text);
}


// get pairs of elems and their default parents
function lib_tree_get_defpar_pairs(gui_id)
{
  var parent_found = false;
  var retval_idx = 0;
  var retval = [];
  var srch_gui_id = gui_id;
                                    // search through all nodes from currently clicked to root 
                                    // and find all multi parent pairs to be set by default
  for (var i=(this.curr_tree_obj.tree_nodes.length-1); i>=0; i--)
  {
                                    // found currently searched item
    if (this.curr_tree_obj.tree_nodes[i].gui_id == srch_gui_id)
    {
      if (this.curr_tree_obj.tree_nodes[i].isMultiPar)
      {
        retval[retval_idx] = {};
        retval[retval_idx].elem_id = this.curr_tree_obj.tree_nodes[i].elem_id;
        retval[retval_idx].parent_id = this.curr_tree_obj.tree_nodes[i].parent_elem_id;
        retval_idx++;
      } 
      srch_gui_id = this.curr_tree_obj.tree_nodes[i].parent_gui_id;
      start_idx = i-1;
      break;
    }
  }
  return retval;
}



// take care of selection by mouse
function lib_tree_markup_items(item_id, do_markup)
{
  if (global_setup.display_type == 0)
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
  }
}
                          
function lib_tree_get_tree()
{
  return this.curr_tree_obj;
}                            
                          

function lib_tree_get_item_data(gui_id)
{
  var index = parseInt(gui_id.substring(1,gui_id.length)); 
  if (strStartsWith(gui_id, "E"))
    return this.curr_tree_obj.explorer_path[index];
  else
  {
    for (var i=0; i<this.curr_tree_obj.tree_nodes.length; i++)
    {
      if (this.curr_tree_obj.tree_nodes[i].gui_id == gui_id)
        return this.curr_tree_obj.tree_nodes[i];
    }
  }
  return null;
}
                       
                       
function lib_tree_get_gui_id(elem_id)
{
  var retval = [];
  var retval_idx = 0;
  if (this.curr_tree_obj.explorer_path != undefined)
  {
                                    // search through Explorer Path
    for (var i=0; i<this.curr_tree_obj.explorer_path.length; i++)
      if (this.curr_tree_obj.explorer_path[i].elem_id == elem_id)
        retval[retval_idx++] = this.curr_tree_obj.explorer_path[i].gui_id;
  }
  if (this.curr_tree_obj.tree_nodes != undefined)
  {
                                    // search through Tree Path
    for (var i=0; i<this.curr_tree_obj.tree_nodes.length; i++)
      if (this.curr_tree_obj.tree_nodes[i].elem_id == elem_id)
        retval[retval_idx++] = this.curr_tree_obj.tree_nodes[i].gui_id;
  }
      
  return retval;
}
           
function lib_tree_get_children(gui_id)
{
  var retval = [];
  var retval_idx = 0;
  
  for (var i=0; i<this.curr_tree_obj.tree_nodes.length; i++)
    if (this.curr_tree_obj.tree_nodes[i].parent_gui_id == gui_id)
      retval[retval_idx++] = this.curr_tree_obj.tree_nodes[i].gui_id;
  return retval;
}

function lib_tree_print_item(parent_gui_id, item_gui_id, itemName, itemType)
{
  // HTML-Code :
  // <LI ...>
  //   <IMG ... /IMG>
  //   <DIV ...>
  //     <A .../A>
  //   </DIV>
  //   <UL ... /UL>
  // </LI>  
                                    // prepare input form GUI element for displaying
  var on_click_str = "return window." + this.cb_clicked_at_str + "(\'" + this.current_usecase + "\', \'" + this.current_panel + "\', \'tree_select\', this.id, c_KEYB_MODE_NONE, event);"; 
  var newLiItem = document.createElement("li");
      newLiItem.id = new String(item_gui_id+"_li");
	    newLiItem.style.cssText = 'display: block; list-style: none; width:100%; margin: 0.1em; padding: 0; vertical-align: top; margin-left:-1.5em; padding: 0;';
  var newImgItem = document.createElement("img");
      newImgItem.id = item_gui_id+"_sym";
      newImgItem.src = lib_tree_get_symb(itemType);
      newImgItem.align = "left";
      newImgItem.width = 22;  
	    newImgItem.height = 22;
  var newDivItem = document.createElement("div");
      newDivItem.id = new String(item_gui_id+"_div");    
      setInnerHTML(newDivItem, '<span><a id=\"' + item_gui_id + '_a\" onclick=\"' + on_click_str + '\" style=\"display: block; padding-top:0.2em; padding-left:1em;\">' + itemName + '</a></span>');
  var newUlItem = document.createElement("ul");
      newUlItem.className = "hide_ul";  
      newUlItem.id = item_gui_id+"_ul";
                                    // connect items
  var parentUlItem = document.getElementById(parent_gui_id+"_ul");    
  newLiItem.appendChild(newImgItem);    
  newLiItem.appendChild(newDivItem);
  newLiItem.appendChild(newUlItem);
  parentUlItem.style.cssText = 'display:block;';
  parentUlItem.appendChild(newLiItem);
}


// insert new list element under parent 'ul' element with text input form          
function lib_tree_input_item(is_new, gui_id, item_type)
{    
  // HTML-Code :
  // <LI ... >
  //   <IMG ...>...</IMG>
  //   <DIV ...>
  //     <INPUT .../>
  //   </DIV>
  //   <UL ... /UL>  
  // </LI>
  var my_gui_id = gui_id;
  var new_content = "";
                                    // handle input init for new item
  if (is_new)
  {
    my_gui_id = "N0";
    var parent_gui_id = gui_id;
                                    // use "print_item" to create new item ...
    this.print_item(parent_gui_id, my_gui_id, "", item_type);
  }

                                    // get a tag element for modification
  var a_item = document.getElementById(my_gui_id + "_a");

                                    // recycle old text
  if (!is_new)
  {
    new_content = getInnerHTML(a_item);
  }
                                    // create new input item            
  var newInputItem = document.createElement("input");     
  	newInputItem.id = my_gui_id + "_input";
  	newInputItem.name = my_gui_id + "_name";
  	newInputItem.type = "text";
  	newInputItem.value = new_content;
                                    // replace <A> item by <INPUT> item
  a_item.parentNode.replaceChild(newInputItem, a_item);             
                                    // put a focus on input item and select default text
  document.getElementById(my_gui_id + "_input").focus();
  document.getElementById(my_gui_id + "_input").select();
}      


function lib_tree_get_prev_sibling(curr_div_id)
{
  var retval = null;
                                    // get all <LI> elements of next parental <UL> list
  var my_siblings = document.getElementById(curr_div_id).parentNode.parentNode.childNodes;
  for (var i=0; i<my_siblings.length; i++)
  {
                                    // find own div to know at what array
                                    // position to find the next previous sibling
    if ((my_siblings[i].childNodes[1].id == curr_div_id) && (i>0))
      return my_siblings[i-1].childNodes[1].id;
  }
  return retval;
}



function lib_tree_get_next_sibling(curr_div_id)
{
  var retval = null;
                                    // get all <LI> elements of next parental <UL> list  
  var my_siblings = document.getElementById(curr_div_id).parentNode.parentNode.childNodes;
  for (var i=0; i<my_siblings.length; i++)
  {
                                    // find own div to know at what array
                                    // position to find the next previous sibling
    if ((my_siblings[i].childNodes[1].id == curr_div_id) && (i<(my_siblings.length - 1)))
      return my_siblings[i+1].childNodes[1].id;
  }
  return retval;
}



function lib_tree_get_next_visible_dn(curr_gui_id)
{
  var retval = null;
  
  var curr_ul = document.getElementById(curr_gui_id + "_ul");  
                                    // first check children of current element if this is
                                    // the next neighbour
  while ((curr_ul.childNodes.length != 0) && (curr_ul.style.display != 'none'))
  {
    curr_ul = curr_ul.childNodes[0].childNodes[2];
  }
                                    // if no child has fit the loop ...
  if (curr_ul.id == (curr_gui_id + "_ul"))
  {
                                    // ... check next sibling ...
    var next_sibling = this.get_next_sibling(curr_gui_id + "_div");
    if (next_sibling != null)
      return next_sibling.substring(0, next_sibling.indexOf("_div"));  
    else
    {
      var curr_div = curr_ul.parentNode.childNodes[1];
                                    // ... or walk up until any parent node has a valid next sibling
      while (curr_div.parentNode.parentNode.id != this.current_panel + '_root_ul')
      {
        curr_div = curr_div.parentNode.parentNode.parentNode.childNodes[1];
        if ((next_sibling = this.get_next_sibling(curr_div.id)) != null)
          return next_sibling;
      } 
    }
  }
  else 
  {
    return curr_ul.id.substring(0, curr_ul.id.indexOf("_ul"));
  }   
  return retval; 
}


function lib_tree_get_next_visible_up(curr_gui_id)
{
  var retval = null;
                                    // get previous (upper) sibling
  var upper_neighbour_div_id = this.get_prev_sibling(curr_gui_id + "_div");
                                    // check if this sibling exists
  if (upper_neighbour_div_id != null)                                                                        
  {
                                    // walk through all child UL lists (always
                                    // last LI element) to find empty or invisible
                                    // UL list
    var curr_ul = document.getElementById(upper_neighbour_div_id).parentNode.childNodes[2];
    while ((curr_ul.childNodes.length != 0) && (curr_ul.style.display != 'none'))
    {
      curr_ul = curr_ul.lastChild.childNodes[2];
    }
                                    // return clean gui_id ready for clicking
    return curr_ul.id.substring(0, curr_ul.id.indexOf("_ul"));  
  }
  else
  {
    var curr_ul = document.getElementById(curr_gui_id + "_li").parentNode;
    var my_bla = (this.current_panel + '_root_ul');
    if (curr_ul.id != (this.current_panel + '_root_ul'))
    {

      return curr_ul.id.substring(0, curr_ul.id.indexOf("_ul")); 
    }
  }
  return retval;
}


function lib_tree_mark_items_as_cut(cut_items, is_marked)
{
  for (var i=0; i<cut_items.length; i++)
  {
                              // extract elem_id from cut items collected from (possibly) old tree
    var my_elem_id = cut_items[i].elem_id;
    var my_parent_elem_id = cut_items[i].parent_elem_id;    
                              // get GUI Id's if element appears in current tree
    var my_gui_id = this.get_gui_id(my_elem_id);
                              // does element exist in current tree ?
    if (my_gui_id.length > 0)
    {
      for (var j=0; j<my_gui_id.length; j++)
      {
        if (this.get_item_data(my_gui_id[j]).parent_elem_id == my_parent_elem_id)
        {
          if (is_marked)
            document.getElementById(my_gui_id[j] + '_a').style.color = '#D0D0D0';
          else
            document.getElementById(my_gui_id[j] + '_a').style.color = '#3030C0';            
        }  
      }
    }
  }
}