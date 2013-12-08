/******************************************************************
 * Name         :   Database.JS
 * Purpose      :   This module is a library of intelligent Database
 *                  Functions. The knowledge of the database, its 
 *                  structures and ontology is put into this module.
 *                  It also takes care of local storage if the tool
 *                  is in "Offline Mode".
 * History      :
 *      2013/09/15  wi      Created
 ******************************************************************/


function databaseCreateTopic(name)
{
    if (debugMode) { alert("Entering databaseCreateTopic"); }
    var jsonContent = { Id:-1, Name:name };
    ajaxPostEntity("Topics", jsonContent);
    if (debugMode) { alert("Exiting databaseCreateTopic"); }      
    return ajaxGetNewId();
}


function databaseDeleteTopic(id)
{
    alert("Entering databaseDeleteTopic");
    ajaxDeleteEntity("Topics", id);
    alert("Exiting databaseDeleteTopic");
}


function databaseGetEntity(entityType, id)
{
    alert("Entering databaseGetEntity");
    ajaxGetEntity(entityType, id);
    var myStr = ajaxGetReturnedEntity();
    alert("String Fetched : " + myStr);
    var myJsonObject = JSON.parse(myStr);
    alert("JSON Conversion");
    alert(myJsonObject.Email);    
}



function databaseChangeEntity(entityType, id)
{
    alert("Entering databaseDeleteEntity");
    var jsonContent = { Name:"PatchedEntity" };    
    ajaxPatchEntity(entityType, id, jsonContent);
    alert("Exiting databaseDeleteEntity");      
}

    
// noch keine Relations verfügbar
// PUT ersetzt komplette Entität
// Patch - einzelne Attribute updaten