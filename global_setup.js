// ####### Tool-Title ########################################
var plugin_name = "X-Tree-M";


// ####### GLOBAL SETUP DEFAULTS #############################
var c_DEFAULT_GLOBAL_SETUP = {};

/*
 * ---------------------------------------------------------------------------------------
 * Version	Datum		Inhalt
 * ---------------------------------------------------------------------------------------
 * V0.0.0.3	2013/09/01	Primitiver Test der DB-Anbindung
 * V0.0.0.4	2013/09/05	Menü klappt (verdrängend), Resize ohne Scrolling wegen
 * 				prozentualen Größen; Datenbank-Anbindung klappt zusammen
 * 				mit Darstellung (Aktualisierung : DB-Anbindung mittler-
 * 				weile veraltet)
 * V0.0.0.5	2013/09/30 	Mouseover, Menü und y-Scrolling klappt; blauer Hintergrund;
 * 				Navigationsleiste
 * V0.0.0.6	2013/10/01	Menü jetzt überlappend statt verdrängend
 * V0.0.0.7	2013/10/07	Resize funktioniert (x-Resize nur prozentual;
 * 				deshalb kein x-Scrolling)
 * V0.0.0.8	2013/10/10	x-Scrolling klappt (x-Resize auch in Pixeln) und
 * 				neue Markierung der Spalten (allerdings noch kein
 * 				eleganter Code)
 * V0.0.0.15    2013/11/11      Version wird unter Hilfe-Menü angezeigt
 * V0.0.0.16    2013/11/13      IE Keyboard access didn't work on server -> fixed
 * V0.0.0.17    2013/12/16      db_intelligence : create and delete works fine
 * V0.0.0.18    2014/02/04      incompatibility to IE but database can be stored on
 *                              Server, cut and paste was added, rename is integrated
 * V0.0.0.19    2014/02/19      load / save to webserver now even working with caching
 *                              switched on; several element types introduced (working)
 * V0.0.0.20    2014/02/21      compatibility to IE reestablished
 * V0.0.0.21    2014/03/11      multiple selection if CTRL is kept down
 * V0.0.0.22    2014/03/16      Item sort by element type and alphabet; 'idea' as new 
 *                              element type
 * V0.0.0.23    2014/04/27      old text can now be recycled at renaming; the mouseover
 *                              is a little slower through timer; selection is much 
 *                              more stable; adjustable number of parent and child levels
 *                              (no setup in GUI so far)
 * V0.0.0.24    2014/05/04      Topic-Lock implemented (unfortunately the main tree is
 *                              not painted properly after erasure -> reload helps)  
 * V0.0.0.25    2014/05/13      Delete-Problem fixed
 * V0.0.0.26    2014/05/20      Headline in Content Pad works and graphical News and Dates 
 *                              info features added without underlying functionality
 * V0.0.0.27    2014/06/03      Tree element description as GUI item (not connected to data
 *                              yet); local Cookie saves the last item so the user can 
 *                              continue where he has finished last
 * V0.0.0.28    2014/06/09      Cookie extended to save structure
 * V0.0.0.29    2014/06/19      Content now coupled to database and News / Dates Ticker 
 *                              working
 * V0.0.0.30    2014/07/02      Favorites can be saved (permanently), loaded and the whole list can be 
 *                              erased -> individual deletions not yet available
 * V0.0.0.31    2014/07/20      Windows Explorer style path links; fixed error regarding the
 *                              creation of new items; corrected scaling error of content
 *                              and bookmark area
 * V0.0.0.32    2014/08/25      Language selectable (English / German) -> LANG.js as central
 *                              storage for text constants for different languages
 * V0.1.0.0     2014/11/25      Redesign-Version 0 (Menubar, Toolbar and Tree displayed,
 *                              tree items selectable -> Tree reloads accordingly (considering
 *                              multiple parent links)
 * V0.1.0.1     2015/01/12      Content of item visible + editable; all Element commands implemented
 *                              Element-Types can be chosen; Tickers implemented; Missing features
 *                              for release : Bookmark-Panel, persistent setups, display silibles
 *                              of currently selected item, hovering menu items on mouseover, 
 *                              multilingual messages and warnings
 * V0.1.0.2     2015/02/24      Almost everything finished for release but still Favorites not working
 *                              at all and 4 bugs found so far
 * V0.1.1.0     2015/03/08      First release after re-design; all features inherited from V0.0.0.32 and
 *                              all items can now have several parent items + tree unfolds by hovering
 *                              over items; setup menu created; content can now also include special 
 *                              characters
 * V0.1.1.1     2015/03/17      - inverted Explorer Path (root on the right hand side)
 *                              - don't show children of sibling by default
 *                              - set number of child levels to 10
 *                              - arrow keys up / down / left /right now supported
 *                              - hovering over images now for unfolding and folding
 * V0.1.1.2     2015/04/07      - text recycling during rename
 *                              - clean behaviour during arrow up / down in tree
 *                              - arrow keys working in text boxes
 * V0.1.2.0     2015/09/01      DISCO-Integration (navigation, delete, Cookies)
 * V0.1.2.1     2015/09/20      DISCO-Integration (deletion completed)
 * V0.1.2.2     2015/09/30      DISCO-Integration (copy completed and content displaying)
 * V0.1.2.3     2015/10/06      DISCO-Integration (types can be changed, renaming possible, improvements from XML version 0.1.1.4 inserted)
 * V0.1.2.4     2015/10/19      DISCO-Integration (faster loading, siblings of selected are displayed again,
 *                              selection of sibling is done without reload from Database) 
 * V0.1.2.5     2015/10/22      DISCO-Integration (wrong tree creation in GUI -> Error when clicking 
 *                              at child items fixed)      
 * V0.1.2.6     2015/10/30      Fixed odd behaviour during Tree Navigation; problems with Default Parent Menu 
 *                              fixed; Cookie problems fixed
 * V0.1.2.7     2015/11/03      X-Tree-M can now be used as plugin -> item Id as input param and Name/URL of Callback-Tool can be handed over
 * V0.1.3.0     2015/12/11      Brought X-Tree-M (D!SCO-Version) on approximately the same level as the last stable XML Version; XML itself is 
 *                              currently not working but might be fixed within one of the next versions.
 * V0.1.3.1     2016/01/23      Several Bugfixes compared to Version 0.1.3.0
 * V0.1.3.2     2016/02/02      Several Bugfixes + Default-Parent-Setups only where necessary + switch off some keys during editmode+
 *                              Ctrl+Click should now load a favorite item
 * V0.1.3.3     2016/02/09      Tickers repaired, Favorites repaired, Database-Type-Selection prepared
 * V0.1.4.0     2016/02/14      First common solution for XML and DISCO -> no more splitted maintenance necessary;
 *                              switchable Database Type
 * V0.1.4.1     2016/03/01      Setup-Cookies can be cleared by using 'Help/Clear Cookies'; Items can be shifted to
 *                              the parental levels by using Shift+Tab
 * V0.1.4.2     2016/04/25      Debugging ("Alle Themen" can now be clicked even in Explorer-Path; recursive deletion is now also 
 *                              available in XML-Lib; when moving up / down using the arrow keys you can now create items at all
 *                              the time since the UL of the parent item is now unhidden every time a new item is created);
 *                              Discussion Tree can now be exported as extra HTML (using "save whole website" you can also import it into
 *                              Microsoft Word)
 * V0.1.4.3     2016/05/04      Export functionality has improved (fulltext now exportable); multi-parent operations in new
 *                              XML libary now seem to work fine
 * ---------------------------------------------------------------------------------------
 */

// ###### ===========> VERSION-SETUPS BEGIN <=============== ######
main_version_hi = 0;
main_version_lo = 1;
sub_version_hi = 4;
sub_version_lo = 3;
var plugin_date = "2016/05/04";
                                    // Version Text for printing
var plugin_version = main_version_hi + "." + main_version_lo + "." + sub_version_hi + "." + sub_version_lo;
// ###### ===========> VERSION-SETUPS END <================= ######

                                    // version as comparable Integer
c_DEFAULT_GLOBAL_SETUP.version = main_version_hi;
c_DEFAULT_GLOBAL_SETUP.version = c_DEFAULT_GLOBAL_SETUP.version*256 + main_version_lo;
c_DEFAULT_GLOBAL_SETUP.version = c_DEFAULT_GLOBAL_SETUP.version*256 + sub_version_hi;
c_DEFAULT_GLOBAL_SETUP.version = c_DEFAULT_GLOBAL_SETUP.version*256 + sub_version_lo;
                                    // Constant Characteristic Testpattern
c_DEFAULT_GLOBAL_SETUP.testpattern = "4711";

c_DEFAULT_GLOBAL_SETUP.curr_lang = 1;
c_DEFAULT_GLOBAL_SETUP.default_usecase = "uc_browsing";

c_DEFAULT_GLOBAL_SETUP.tree_max_parent_depth = 1;                       
c_DEFAULT_GLOBAL_SETUP.tree_max_child_depth = 20;

c_DEFAULT_GLOBAL_SETUP.debugMode = false;

var global_setup = jQuery.extend(true, {}, c_DEFAULT_GLOBAL_SETUP);


// ####### DEFAULT PATH TO GLOBAL SETUP #######################

var c_DEFAULT_SETUP_SOURCE_COOKIE_NAME = "setup_src";

var c_DEFAULT_SETUP_SOURCE_COOKIE = {};
                                    // version as comparable Integer
c_DEFAULT_SETUP_SOURCE_COOKIE.version = c_DEFAULT_GLOBAL_SETUP.version;
                                    // Constant Characteristic Testpattern
c_DEFAULT_SETUP_SOURCE_COOKIE.testpattern = c_DEFAULT_GLOBAL_SETUP.testpattern;
                                    // data pointing to proper setup location
c_DEFAULT_SETUP_SOURCE_COOKIE.setup_src_type = c_DATA_SOURCE_TYPE_ID_COOKIE;
c_DEFAULT_SETUP_SOURCE_COOKIE.setup_src_path = "global_setup";


// ####### GLOBAL STATUS #####################################
var global_status = {};
global_status.setup_src_rd_okay = false;
global_status.cookies_enabled = false;
global_status.global_setup_loaded = false;
global_status.actual_setup_src_type = null;
global_status.actual_setup_src_path = null;