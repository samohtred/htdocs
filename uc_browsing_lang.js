// komplete Menubar as Structure :
var c_LANG_UC_BROWSING_MENUBAR =    //                 # English                                # German
[
    [
        ["elem_menu"                                    ,"Element"                              ,"Element"                              ],      
        [    "input_item"                               ,"New (Alt-N)"                          ,"Neu (Alt-N)"                          ],
        [    "change_item"                              ,"Change (F2)"                          ,"&Auml;ndern (F2)"                     ],
        [    "delete_item"                              ,"Delete (Del)"                         ,"L&ouml;schen (Entf)"                  ],
        [    "copy_item"                                ,"Copy by Ref (Ctrl-L)"                 ,"Link Kopieren (Strg-L)"               ],
        [    "clone_item"                               ,"Clone (Ctrl-C)"                       ,"Vollst. Kopieren (Strg-C)"              ],
        [    "cut_item"                                 ,"Cut (Ctrl-X)"                         ,"Ausschn. (Strg-X)"                    ],
        [    "paste_item"                               ,"Paste (Ctrl-V)"                       ,"Einf&uumlgen (Strg-V)"                ],
        [    "export_item"                              ,"Export (Ctrl-Shift-Alt-E)"            ,"Exportieren (Strg-Shift-Alt-E)"       ],
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
        ]  ,    
        [ 
            ["db_type"                                  ,"Database Type"                        ,"Datenbank-Typ"                        ],
            ["#output_list"  ,"db_type", "XML", "DISCO"]      // "XML Localhost", "XML WWW", "DISCO WWW"]
//                ["xml_local"                            ,"XML Localhost"                        ,"XML Localhost"                        ],
//                ["xml_web"                              ,"XML on WWW"                           ,"XML im WWW"                           ],
//                ["disco_web"                            ,"DISCO on WWW"                         ,"DISCO"                                ]

        ]
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
        [    "erase_cookies"                            ,"Clear Cookies"                        ,"Cookies löschen"                      ],
        [    "send_err_log"                             ,"Send Error Log"                       ,"Fehlerbericht senden"                 ],
        [    "display_hint"                             ,"Hints"                                ,"Tips"                                 ],
        [    "source_code"                              ,"Source Code"                          ,"Quellcode"                            ],
        [    "display_version"                          ,"Current Version"                      ,"Aktuelle Version"                     ]
    ]

];


var c_LANG_UC_BROWSING_MENU_LANG_TITLE = c_LANG_UC_BROWSING_MENUBAR[3][1][0];

var c_LANG_UC_BROWSING_HELP_HINTS =
["do_nothing"           ,
 "Useful hints :\n(1) The X-Tree-M tool can be controlled through Touchscreen and Mouse but is optimized for Keyboard usage. If you want to use X-Tree-M for fast info recording you should learn the 10-Finger-System and know the various Keyboard-Shortcuts which can often be found next to each element in the Menu. \n(2) A mouseover on the graphical Element Type Symbols in the Tree Panel usually opens/closes the next level. Please mind that the displayed level depth is limited and that you sometimes need to select an item to reach the next level. \n(3) If you want to load a Favorite Entry you can press CTRL and click at it. \n(4) If you concentrate on a special topic it is recommended to lock it to save loading time and memory and to reduce the displayed complexity. \n(5) The Tickers are made to inform you about changes. When you have chosen a Topic as Ticker content by clicking 'as ... Ticker' in the Element Menu it is loaded instantly and further updated after some minutes. \n(6) While the DISCO version offers more professional access to the database, the XML-Version is useful to work offline and to save your database content as File. \n(7) Reset corrupt Cookies by using \'Help/Clear Cookies\'",
 "Nützliche Hinweise :\n(1) Das X-Tree-M-Tool can per Touchscreen oder Maus bedient werden, ist aber für Keyboard-Gebrauch optimiert. Wenn Sie X-Tree-M für das schnelle Festhalten von Information benutzen wollen, sollten Sie das 10-Finger-System und diverse Keyboard-Shortcuts kennen, welche oft neben dem Element im Menü stehen. \n(2) Ein Berühren der Element-Typ-Symbole in der Baumdarstellung öffnet/schließt die nächste Ebene. Bitte beachten Sie, daß die dargestellte Level-Tiefe begrenzt ist und Sie manchmal ein Element selektieren müssen, um auf weitere Ebenen zugreifen zu können. \n(3) Wenn die einen Favoriten-Eintrag laden möchten, können Sie einfach CTRL drücken und dabei auf den Eintrag klicken. \n(4) Falls Sie sich auf ein Thema konzentrieren, können Sie es locken, um Ladezeit und Speicher zu sparen und die Darstellung einfacher zu machen. \n(5) Die Ticker wurden erstellt, um Sie über Änderungen zu informieren. Nachdem Sie ein Thema als Ticker-Inhalt ausgewählt und 'als ... Ticker' geklickt haben, wird dieses geladen und alle paar Minuten aktualisiert. \n(6) Während die DISCO-Variante des Tools einen professionellen geshareten Datenbank-Zugriff gewährleistet, kommt die XML-Version dann zum Tragen, wenn Sie Offline arbeiten oder die Daten als File abspeichern wollen. \n(7) Löschen Sie kaputte Cookies durch \'Hilfe/Cookies löschen\'"
];

var c_LANG_UC_BROWSING_HELP_CREATED = 
["do_nothing"           ,"created: "                                  ,"erstellt: "                           ];

var c_LANG_UC_BROWSING_HELP_VERSION = 
["do_nothing"           ,"version: "                                  ,"Version: "                           ];

var c_LANG_UC_BROWSING_TOOLBAR_CURR_REGION = 
["do_nothing"           ,"Current Region"                             ,"Aktuelle Region"                      ];


var c_LANG_UC_BROWSING_TOOLBAR_OTHER_FILTERS = 
["do_nothing"           ,"Other Filters"                              ,"Andere Filter"                      ];


var c_LANG_UC_BROWSING_TOOLBAR_BACK_TO_MSG =
["do_nothing"           ,"Back to"                                    ,"Zurück zu"                          ];


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


var c_LANG_UC_BROWSING_MSG_ITEM_TOO_LONG =
[ "do_nothing",
  "Attention ! Name too long -> will be cut on saving.",
  "Achtung ! Name zu lang -> wird beim Speichern abgeschnitten."
];