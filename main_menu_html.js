document.write('  <ul id="Main_Menu">');
document.write('    <li class="topmenu"><a>Element</a>	');
document.write('      <ul>		');
document.write('        <li class="submenu"><a onclick=\"return window.main_input_dispatcher.clicked_at(\'main_menu\', \'input_item\')\">Neu (Alt-N)</a></li>');
document.write('        <li class="submenu"><a onclick=\"return window.main_input_dispatcher.clicked_at(\'main_menu\', \'change_item\')\">&Auml;ndern (F2)</a></li>');
document.write('        <li class="submenu"><a onclick=\"return window.main_input_dispatcher.clicked_at(\'main_menu\', \'delete_item\')\">L&ouml;schen (Del)</a></li>');          
document.write('        <li class="submenu"><a onclick=\"return window.main_input_dispatcher.clicked_at(\'main_menu\', \'copy_item\')\">Kopieren (tbd)</a></li>');
document.write('        <li class="submenu"><a onclick=\"return window.main_input_dispatcher.clicked_at(\'main_menu\', \'cut_item\')\">Ausschneiden (Strg-X)</a></li>');
document.write('        <li class="submenu"><a onclick=\"return window.main_input_dispatcher.clicked_at(\'main_menu\', \'paste_item\')\">Einf&uumlgen (Strg-V)</a></li>');
document.write('      </ul>		');
document.write('    </li>		');
document.write('    <li class="topmenu"><a>ElemTyp</a>');
document.write('      <ul id="ul_elem_type">');
for (var i=0; i<elemTypeList.length; i++)
{
  document.write('      <li class="submenu"><a onclick=\"return window.main_input_dispatcher.clicked_at(\'main_menu_elem_type\', \'' + i + '\')\">' + elemTypeList[i] + ' (Ctrl-' + i + ')</a></li>');
}
document.write('      </ul>		');
document.write('    </li>		');
document.write('    <li class="topmenu"><a>Hilfe</a>');
document.write('      <ul>		');
document.write('        <li class="submenu"><a>Tutorial (tbd)</a></li>	');
document.write('        <li class="submenu"><a onclick=alert(plugin_name+\'\\n\'+\'\\n\'+plugin_version+\'\\n\'+plugin_date)>aktuelle Version</a></li> ');
document.write('      </ul>		');
document.write('    </li>		');
document.write('  </ul>			');

