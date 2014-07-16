// Class 'main_features'
function main_features(gui_context, cb_onclicked_fcn, cb_get_path, cb_get_children, cb_get_field, news_item, date_item, favorites)
{
  this.main_features_gui_context = gui_context;
  this.cb_onclicked_fcn = cb_onclicked_fcn;
  this.cb_get_path = cb_get_path;
  this.cb_get_children = cb_get_children;
  this.cb_get_field = cb_get_field;
  
  
  this.update_news_ticker = main_features_update_news_ticker.bind(this);
  this.update_date_ticker = main_features_update_date_ticker.bind(this);
  this.load_favorites = main_features_load_favorites.bind(this);
  this.select_item = main_features_select_item.bind(this);
  this.markup_item = main_features_markup_item.bind(this);
  
  this.update_news_ticker(news_item);
  this.update_date_ticker(date_item);
  this.load_favorites(favorites);
  
  // constructor
  var __construct = function() 
  {
  } ()

  // constructor call (when object is created)
  __construct;  
}


function main_features_update_news_ticker(list_item)
{
  var ticker_text = "";
  if (list_item != null)
  {
    var elem_list = this.cb_get_children(list_item);
    for (var i=0; i<elem_list.length; i++)
    {
      ticker_text = ticker_text + "  +++  " + this.cb_get_field(elem_list[i], "name");
    }
    ticker_text = ticker_text + "  +++  ";
  }
  else
  {
    ticker_text = "+++ Sie haben noch keinen Eintrag ausgewählt, dessen Inhalt hier als aktuelle Nachrichten dargestellt werden können ! +++ Selektieren Sie dazu bitte einen Eintrag im Baum und wählen Sie Element\als News-Rubrik etc. ! +++";
  }
  document.getElementById("scrolltext_news").innerHTML = ticker_text;
}


function main_features_update_date_ticker(list_item)
{
  var ticker_text = "";
  if (list_item != null)
  {
    var elem_list = this.cb_get_children(list_item);
    for (var i=0; i<elem_list.length; i++)
    {
      ticker_text = ticker_text + "  +++  " + this.cb_get_field(elem_list[i], "name");
    }
    ticker_text = ticker_text + "  +++  ";  
  }
  else
  {
    ticker_text = "+++ Sie haben noch keinen Eintrag ausgewählt, dessen Inhalt hier als aktuelle Termine dargestellt werden können ! +++ Selektieren Sie dazu bitte einen Eintrag im Baum und wählen Sie Element\als Termine-Rubrik etc. ! +++";
  }
  document.getElementById("scrolltext_dates").innerHTML = ticker_text;
}


// print complete favorite list to screen
function main_features_load_favorites(favorites_list)
{
  document.getElementById("main_bookmark_pad").innerHTML = "";
  if (favorites_list != undefined)
  {
    if (favorites_list.length > 0)
    {
      for (var i=0; i<favorites_list.length; i++)
      {
        var newDivItem = document.createElement("div");
          newDivItem.id = favorites_list[i]+"_dfa";
        var newAItem = document.createElement("a");
          newAItem.name=favorites_list[i]+"_fa";
          newAItem.onclick=this.select_item; 
          newAItem.innerHTML = this.cb_get_path("root", favorites_list[i], false);
        newDivItem.appendChild( newAItem );   
        document.getElementById("main_bookmark_pad").appendChild( newDivItem );   
      }
    }
  }
//  else    
//    alert("Parameter doesn't exist");
}


// click / select favorite item
function main_features_select_item(e)
{
  if (e) 
    this.cb_onclicked_fcn('main_features',e.target.name);
  else
    this.cb_onclicked_fcn('main_features',window.event.srcElement.name);
}     


// take care of selection by mouse
function main_features_markup_item(item_id, do_markup)
{
    var curr_item = document.getElementById(item_id+"_dfa");
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