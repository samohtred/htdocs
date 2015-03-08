                                    // mother of all setups
var c_DEFAULT_UC_BROWSING_SETUP_COOKIE = "UC_Browsing_Setup";
             
                                 
var c_DEFAULT_UC_BROWSING_SETUP = {};                                
c_DEFAULT_UC_BROWSING_SETUP.tree_data_src_type = c_DATA_SOURCE_TYPE_ID_XML;
c_DEFAULT_UC_BROWSING_SETUP.tree_data_src_path = "local";       // "local" is always used when Database is located at same location
                                                                // as the rest of the code; otherwise use the following style : 
                                                                // "www.google.de" (no "http://" and no "/" at the end !!!)
c_DEFAULT_UC_BROWSING_SETUP.tree_data_src_params = {};
c_DEFAULT_UC_BROWSING_SETUP.tree_data_src_params.db_name = "uc_browsing_tree_db.xml";
c_DEFAULT_UC_BROWSING_SETUP.tree_data_src_params.php_name = "uc_browsing_upload.php";
c_DEFAULT_UC_BROWSING_SETUP.tree_last_selected ="root";
c_DEFAULT_UC_BROWSING_SETUP.tree_locked_item = "root";
c_DEFAULT_UC_BROWSING_SETUP.info_ticker1_item_id = null;
c_DEFAULT_UC_BROWSING_SETUP.info_ticker2_item_id = null;
c_DEFAULT_UC_BROWSING_SETUP.info_timer = 600000;                // every 10 minutes
c_DEFAULT_UC_BROWSING_SETUP.favorites = [];

var uc_browsing_setup = c_DEFAULT_UC_BROWSING_SETUP;