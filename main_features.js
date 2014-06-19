// Class 'main_features'
function main_features(gui_context, cb_get_children, cb_get_field, news_item, date_item)
{
  this.main_features_gui_context = gui_context;
  this.cb_get_children = cb_get_children;
  this.cb_get_field = cb_get_field;
  
  this.update_news_ticker = main_features_update_news_ticker.bind(this);
  this.update_date_ticker = main_features_update_date_ticker.bind(this);
  
  this.update_news_ticker(news_item);
  this.update_date_ticker(date_item);
  
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