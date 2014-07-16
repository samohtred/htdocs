// http://codeinthehole.com/writing/javascript-cookie-objects-using-prototype-and-json/
// http://www.phpied.com/json-javascript-cookies/
// https://ananti.wordpress.com/2013/03/16/cookie-using-json-format-javascript/
// http://techpatterns.com/downloads/javascript_cookies.php
// http://www.quirksmode.org/js/cookies.html

function setup_user()
{
  this.cookie_name = 'x-tree-m_user_setup_multi';
  this.cookie_val = {};

  this.setLastElem = setup_user_setLastElem.bind(this);
  this.setNewsElem = setup_user_setNewsElem.bind(this);
  this.getNewsElem = setup_user_getNewsElem.bind(this);
  this.setDateElem = setup_user_setDateElem.bind(this);
  this.getDateElem = setup_user_getDateElem.bind(this);
  this.setFavorite = setup_user_setFavorite.bind(this);
  this.delSingleFavorite = setup_user_delSingleFavorite.bind(this);
  this.delAllFavorites = setup_user_delAllFavorites.bind(this);
  this.getFavorites = setup_user_getFavorites.bind(this);

  
  this.initCookie = setup_user_initCookie.bind(this);
  this.writeCookie = setup_user_writeCookie.bind(this);
  this.readCookie = setup_user_readCookie.bind(this); 
}


function setup_user_setLastElem(lastElem)
{
  if ((this.cookie_val != {}) && (this.cookie_val != undefined))
  {
    this.cookie_val.lastElem = lastElem;
    this.writeCookie(this.cookie_val);
  }
}


function setup_user_setDateElem(dateElem)
{
  if ((this.cookie_val != {}) && (this.cookie_val != undefined))
  {
    this.cookie_val.dateElem = dateElem;
    this.writeCookie(this.cookie_val);
  }
}
function setup_user_getDateElem()
{
  this.cookie_val = this.readCookie();
  if (this.cookie_val == undefined)
    return null;
  else if (this.cookie_val.dateElem == undefined)
    return null;
  else
    return this.cookie_val.dateElem; 
}


function setup_user_setNewsElem(newsElem)
{
  if ((this.cookie_val != {}) && (this.cookie_val != undefined))
  {
    this.cookie_val.newsElem = newsElem;
    this.writeCookie(this.cookie_val);
  }
}
function setup_user_getNewsElem()
{
  this.cookie_val = this.readCookie();
  if (this.cookie_val == undefined)
    return null;
  else if (this.cookie_val.newsElem == undefined)
    return null;
  else
    return this.cookie_val.newsElem; 
}


function setup_user_setFavorite(favoriteElem)
{
  if ((this.cookie_val != {}) && (this.cookie_val != undefined))
  {
    if (this.cookie_val.favList == undefined)
      this.cookie_val.favList = [];
    if (this.cookie_val.favList.length == 0)
    {
      this.cookie_val.favList[0] = favoriteElem;
    }
    else
    {
      this.cookie_val.favList[this.cookie_val.favList.length] = favoriteElem;
    }
    this.writeCookie(this.cookie_val);
  }
}
function setup_user_delSingleFavorite(item)
{
  if ((this.cookie_val != {}) && (this.cookie_val != undefined))
  {
    for(var i=0; i<this.cookie_val.favList.length; i++) 
    {
        if(this.cookie_val.favList[i] == item) 
        {
            this.cookie_val.favList.splice(i, 1);
            i--;
        }
    }
    this.writeCookie(this.cookie_val);
  }  
}
function setup_user_delAllFavorites()
{
  if ((this.cookie_val != {}) && (this.cookie_val != undefined))
  {
    this.cookie_val.favList = [];
    this.writeCookie(this.cookie_val);
  }
}
function setup_user_getFavorites()
{
  this.cookie_val = this.readCookie();
  if (this.cookie_val == undefined)
    return null;
  else if (this.cookie_val.favList == undefined)
    return null;
  else
    return this.cookie_val.favList;          
}
                            
                            
function setup_user_initCookie()
{
//   alert("2");
  this.cookie_val = this.readCookie();
//  alert("3");
//  alert(this.cookie_val);
  if (this.cookie_val == null)
  {
    this.cookie_val = {};
//    alert("4a");
    this.cookie_val.lastElem = "root"; //{version: {maj: "001", min: "000"}, data: {last_element: "root"}};
//    alert("4b");
//    alert(this.cookie_val);
    this.writeCookie(this.cookie_val);
//    alert("4h");
  }
//  alert("5");
  return this.cookie_val.lastElem; 
  
}


function setup_user_writeCookie(value) 
{
//  alert("4c");
	var years = 1;
	var date = new Date();
//  alert("4d");	
	date.setTime(date.getTime()+(years*366*24*60*60*1000));
//	alert("4e");
	var expires = "; expires="+date.toGMTString();
//	alert("4f");
//	alert(this.cookie_name+"="+escape(JSON.stringify(value))+expires+"; path=/");
	document.cookie = this.cookie_name+"="+escape(JSON.stringify(value))+expires+"; path=/";  // value+expires+"; path=/"; 
//  alert("4g");
}



function setup_user_readCookie() 
{  
//  alert("2a");
	var ca = document.cookie.split(';');
//  alert("2b");	
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(this.cookie_name) == 0) 
		{
//		  alert("Cookie-Wert : "+ c.substring(this.cookie_name.length+1,c.length));
		  return JSON.parse(unescape(c.substring(this.cookie_name.length+1,c.length))); //unescape(c.substring(this.cookie_name.length,c.length)).parseJSON();
		}
	}
//  alert("2c");
	return null;
}

