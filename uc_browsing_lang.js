// komplete Menubar as Structure :
var c_LANG_UC_BROWSING_MENUBAR =    //                 # English                                # German
[
    [
        ["elem_menu"                                    ,"Element"                              ,"Element"                              ],      
        [    "input_item"                               ,"New (Alt-N)"                          ,"Neu (Alt-N)"                          ],
        [    "change_item"                              ,"Change (F2)"                          ,"&Auml;ndern (F2)"                     ],
        [    "delete_item"                              ,"Delete (Del)"                         ,"L&ouml;schen (Entf)"                  ],
        [    "copy_item"                                ,"Copy (Ctrl-C)"                        ,"Kopieren (Strg-C)"                    ],
        [    "cut_item"                                 ,"Cut (Ctrl-X)"                         ,"Ausschn. (Strg-X)"                    ],
        [    "paste_item"                               ,"Paste (Ctrl-V)"                       ,"Einf&uumlgen (Strg-V)"                ],
        [    "do_nothing"                               ,"--------------------"                 ,"--------------------"                 ],
        [    "lock_topic"                               ,"Lock (Ctrl-Shift-Alt-L)"              ,"Festhalten (Strg-Shift-Alt-L)"  ],
        [    "as_news"                                  ,"as News Ticker"                       ,"als Nachr.-Ticker"                    ],
        [    "as_date"                                  ,"as Date Ticker"                       ,"als Termine-Ticker"                   ]        
    ],
    
        c_LANG_LIB_TREE_ELEMTYPE
    ,
    [
        ["fav_menu"                                     ,"Favorites"                            ,"Favoriten"                            ],
        [    "save_favorite"                            ,"Save"                                 ,"Speichern"                            ],
        [    "load_favorite"                            ,"Load"                                 ,"Laden"                                ],
        [    "delete_favorite"                          ,"Delete Single"                        ,"Einzeln L&ouml;schen"                 ],
        [    "deleteall_favorites"                      ,"Delete All"                           ,"Alle L&ouml;schen"                    ]    
    ],    
    [
        ["setup_menu"                                   ,"Setup"                                ,"Einstellungen"                        ],
        [      
            ["lang_menu"                                ,"Language"                             ,"Sprache"                              ],
            (   ["#output_list", "language_select"]).concat(c_LANG.slice(1,c_LANG.length))        
        ]  //,    
//        [
//            ["setup_path_menu"                          ,"Setup Path"                           ,"Pfad zu Einstellungen"                ],
//            [
//                ["setup_path_type"                      ,"Type of Source"                       ,"Quellentyp"                           ],
//                ["#output_list"  ,"setup_src_type", "RAM", "Cookie", "DISCO!", "XML"]
//            ],
//            [
//                ["setup_path_url"                       ,"Path/URL"                             ,"Pfad/URL"                             ],
//                ["#input_field"  ,"setup_src_path"]
//            ]
//        ]
    ],                                                  
    [                                                   
          // Menu Title                                 
        ["help_menu"                                    ,"Help"                                 ,"Hilfe"                                ],
//        [    "tutorial"                                   ,"Tutorial"                             ,"Tutorial"                           ],
        [    "display_version"                          ,"Current Version"                      ,"Aktuelle Version"                     ]
    ]

];


var c_LANG_UC_BROWSING_MENU_LANG_TITLE = c_LANG_UC_BROWSING_MENUBAR[3][1][0];

var c_LANG_UC_BROWSING_HELP_CREATED = 
["do_nothing"           ,"created: "                                  ,"erstellt: "                           ];

var c_LANG_UC_BROWSING_HELP_VERSION = 
["do_nothing"           ,"version: "                                  ,"Version: "                           ];

var c_LANG_UC_BROWSING_TOOLBAR_CURR_REGION = 
["do_nothing"           ,"Current Region"                             ,"Aktuelle Region"                      ];


var c_LANG_UC_BROWSING_TOOLBAR_OTHER_FILTERS = 
["do_nothing"           ,"Other Filters"                              ,"Andere Filter"                      ];


var c_LANG_UC_BROWSING_PANEL1_TITLE =
["do_nothing"           ,"Tree"                                       ,"Baum"];


var c_LANG_UC_BROWSING_PANEL2_TITLE =
["do_nothing"           ,"Content"                                    ,"Inhalt"];


var c_LANG_UC_BROWSING_PANEL3_TITLE =
["do_nothing"           ,"Info Box"                                   ,"Info-Box"];


var c_LANG_UC_BROWSING_PANEL3_TICKER1_TITLE =
["do_nothing"           ,"News"                                       ,"Neues"];


var c_LANG_UC_BROWSING_PANEL3_TICKER2_TITLE =
["do_nothing"           ,"Dates"                                      ,"Termine"];


var c_LANG_UC_BROWSING_PANEL4_TITLE =
["do_nothing"           ,"Favorites"                                  ,"Favoriten"];


var c_LANG_UC_BROWSING_MSG_INVALID_KEYB_MODE  =
[ "no_nothing",
  "Invalid keyboard mode !",
  "Ungültiger Keyboard Modus !"
];


var c_LANG_UC_BROWSING_MSG_UNKNOWN_COMMAND = 
[ "do_nothing",
  "Unknown command : ",
  "Unbekanntes Kommando : "
];


var c_LANG_UC_BROWSING_MSG_UNKNOWN_ELEM_TYPE =
[ "do_nothing",
  "Unknown element type !",
  "Unbekannter Element-Typ !"
];


var c_LANG_UC_BROWSING_MSG_UNKNOWN_SUBMODULE =
[ "do_nothing",
  "Unknown submodule : ",
  "Unbekanntes Untermodul : "
];


var c_LANG_UC_BROWSING_MSG_UNKNOWN_SENDER =
[ "do_nothing",
  "Unknown sender : ",
  "Unbekannter Absender : "
];


var c_LANG_UC_BROWSING_MSG_SETUP_LOADING_FAILED =
[
      "do_nothing"          ,
      "User Setup loading failed. Using Default Values.",
      "Laden der User-Einstellungen fehlgeschlagen. Es werden die Standard-Einstellungen verwendet."
];
