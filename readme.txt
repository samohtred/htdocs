README - X-TREE-M
=================


1. What is X-Tree-M ?
---------------------

X-Tree-M ('eXtended Tree Method') is aimed to be a discussion tool that's using the DISCO ontology to enable 
data exchange to and from other discussion tools. It is supposed to store arguments, facts and other relevant 
items in a tree structure, such as problems and questions.
This tree structure is not intended to be an ordinary one since it should be possible in the future that two 
completely different main topics can share the same subtopic. Additionally it should be possible (in case of 
open questions and problems) to provide a sophisticated workflow to solve open issues like projects. The 
following list provides an overview of other future key features :

- statement extraction from fulltext sources such as chats, emails, forums, etc.
- fulltext creator -> select items from the argument / fact tree, bring them into the proper order and
  re-formulate them to make them fit in a fulltext
- merge of databases
- local copy of database for offline usage
- user login
- multiple language support
- multiple Browser support (currently : IE, Firefox)
- bookmarks ('Favoriten')
- back / forward functionality
- comprehensive help system
- fulltext explanation, chat, voting, change history, post type change, etc. for every item of the tree
...


2. Currently implemented features :
-----------------------------------

- GUI is pretty close to the desired look-and-feel
- items of the topic tree can be created, erased, cut&paste and renamed through keyboard or by using the menu
- several element types can be applied
- in the help folder of the menu the current version can be displayed


3. File overview :
------------------

index.html
  -> global main file of the whole website
setup_main_menu.css
  -> stylesheet for main menu
setup_main_tree.css
  -> style sheet for topic tree
global_setups.js
  -> globally used setups such as version, debug mode and database URL can be put in there
     to make them accessible to all other modules; currently also important global functions
     are hosted there
input_dispatcher.js
  -> central input processing unit (all <A> tags and all keyboard inputs are 
     handed over to the proper modules and functions)
main_table.js
  -> auxiliary table functions such as init, resize and add keyboard listener
main_tree.js
  -> elementary topic tree GUI functions
main_menu_html.js
  -> HTML text of main menu is output through Javascript
symbol_xxxxxxxxxxxx.gif
  -> symbols for different element types
