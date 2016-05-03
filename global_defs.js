// Keyboard Mode types
var c_KEYB_MODE_BLOCKED     = -1;
var c_KEYB_MODE_NONE        = 0;  // 0000
var c_KEYB_MODE_CTRL_ONLY   = 1;  // 0001
var c_KEYB_MODE_SHIFT_ONLY  = 2;  // 0010
var c_KEYB_MODE_CTRL_SHIFT  = 3;  // 0011
var c_KEYB_MODE_ALT_ONLY    = 4;  // 0100
var c_KEYB_MODE_ALT_CTRL    = 5;  // 0101
var c_KEYB_MODE_ALT_SHIFT   = 6;  // 0101
var c_KEYB_MODE_ALT_SHIFT_CTRL=7; // 0111


// Data source types
var c_DATA_SOURCE_TYPE_ID_NONE = 0;
var c_DATA_SOURCE_TYPE_ID_COOKIE = 1;
var c_DATA_SOURCE_TYPE_ID_DISCO = 2;
var c_DATA_SOURCE_TYPE_ID_XML = 3;
var c_DATA_SOURCE_TYPE_ID_HTML = 4;
var c_DATA_SOURCE_TYPE_ID_LENGTH = 5; // length of array after valid entries

var c_DATA_TYPE_SETUP = 0;
var c_DATA_TYPE_CONTENT = 1;



var xmlDataUrl = "db_init.xml";
var uploadPhpUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "upload.php";
var downloadPhpUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "download.php";

var treeMaxParentDepth = 1; // -1 = unendlich
var treeMaxChildDepth = -1;  // -1 = unendlich



//// Cookie-Defs
//var c_USER_SETUP_COOKIE_NAME = 'x-tree-m_user_setup_multi';
//var c_FAV_LIST_COOKIE_NAME = 'x-tree-m_fav_list';
//var c_FAV_ENTRY_COOKIE_NAME_SUFFIX = 'x-tree-m_fav_entry_';
//var c_PARENT_DEFAULT_COOKIE_NAME_SUFFIX = 'x-tree-m_parent_default_';
//
//// Tree Defs
//var c_PATH_TYPE_LINK = 1;
//var c_PATH_TYPE_ARRAY = 2;
//var c_PATH_TYPE_TEXT = 3;
//
//var c_PRINT_MODE_SINGLE = 1;
//var c_PRINT_MODE_MULTI = 2;
