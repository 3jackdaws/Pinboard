/**
 * Created by ian on 7/12/16.
 */


window.addEventListener("load", loadModule);
document.addEventListener("mousemove", logmouse);
document.addEventListener("mouseup", putdownNote);
document.addEventListener("click", clearAll);
window.setInterval(function () {
    if(openTextarea == null && heldNote == null){
        foreach(document.getElementsByClassName('sticky-note-container'), loadModule);
    }
}, 5000);

var POS = {
    x:{},
    y:{}
};
var noteObjects = [];
var timer = {};
var heldNote = null;
var openTextarea = null;
var note_z = 0;
var lastUpdate;
function logmouse(event){
    POS.x = event.screenX;
    POS.y = event.screenY;
}

// function profileNotes(){
//     var noteSections = document.getElementsByClassName("sticky-note-container");
//     foreach(noteSections, function(node){
//         var notes = node.getElementsByClassName("sticky-note");
//         foreach(notes, function(note){
//             note.addEventListener("mousedown", pickupNote);
//             note.addEventListener("dblclick", editNote);
//             var boundingRect = note.getBoundingClientRect();
//             note.style.position = "absolute";
//             note.style.left = boundingRect.left + 10;
//             note.style.top = boundingRect.top + 10;
//         });
//     });
// }

function pickupNote(event){
    heldNote = event.currentTarget;
    note_z++;
    heldNote.style.zIndex = note_z;
    var noteBoundaries = heldNote.getBoundingClientRect();
    var containerBoundaries = heldNote.parentNode.getBoundingClientRect();
    var offsetX = noteBoundaries.left - POS.x - containerBoundaries.left - 6;
    var offsetY = noteBoundaries.top - POS.y - containerBoundaries.top - 6;
    timer = window.setInterval(function(){
        heldNote.style.left = POS.x + offsetX;
        heldNote.style.top = POS.y + offsetY;
    }, 15);
}

function editNote(event){
    openTextarea = event.currentTarget;
    console.log(openTextarea);
    openTextarea.readOnly = false;
    openTextarea.style.boxShadow = "5px 10px 20px rgba(0,0,0,.5)";
    openTextarea.focus();
}

function putdownNote(event){
    if(heldNote){
        clearInterval(timer);
        var container = heldNote.parentNode;
        saveModule(container);
        heldNote = null;
    }

}

function foreach(list, mapfunc){
    var len = list.length;
    for(var i = 0; i<len; i++){
        mapfunc(list[i]);
    }
}

function clearAll(event){
    if(openTextarea != null && event.target !== openTextarea){
        openTextarea.readOnly = true;
        openTextarea.style.boxShadow = "1px 1px 5px rgba(0,0,0,.5)";
        saveModule(openTextarea.parentNode);
        openTextarea = null;
    }

}

function spawnCard(button){
    var container = button.parentNode;
    var note = createStickyNote("", guid());
    container.appendChild(note);
    anchorStickyNote(note);
}

function createStickyNote(text, id){
    var node = document.createElement("textarea");
    node.className = "sticky-note";
    node.setAttribute("guid", id);
    node.readOnly = true;
    node.addEventListener("mousedown", pickupNote);
    node.addEventListener("dblclick", editNote);
    node.innerHTML = text;
    note_z++;
    return node;
}

function anchorStickyNote(note_node){
    var boundingRect = note_node.getBoundingClientRect();
    note_node.style.position = "absolute";
    note_node.style.left = boundingRect.left + 10;
    note_node.style.top = boundingRect.top + 10;
    note_node.style.zIndex = note_z;
}

function saveModule(module){
    var cards = module.getElementsByClassName("sticky-note");
    var noteStack = [];
    var guid = module.getAttribute("guid");
    foreach(cards,function (card) {
        var id = card.getAttribute("guid");
        var position = card.getBoundingClientRect();
        var note = {};
        note["guid"] = guid;
        note["top"] = position.top;
        note["left"] = position.left;
        note["text"] = card.value;
        note["z"] = card.style.zIndex;
        noteStack.push(note);
    });
    var json = JSON.stringify(noteStack);
    $.post("/modules.php", {
        action:"update",
        module:guid,
        data:json
    }, function(data){
        var response = JSON.parse(data);
        console.log(response);
    });
}

function loadModule(){
    $.post("/modules.php", {
        action:"get",
        module:'1234'
    }, function(data){
        var noteModule = document.getElementsByClassName("sticky-note-container")[0];
        if(data.hashCode() == lastUpdate) return;
        lastUpdate = data.hashCode();
        console.log("Update");
        var response = JSON.parse(data);
        // console.log(response.payload);
        var module = response.payload;
        var data = JSON.parse(module.data);
        // console.log(data);
        var notes = JSON.parse(data);
        // console.log(notes);
        noteModule.innerHTML = "";
        foreach(notes, function(note){
            var newNote = createStickyNote(note.text, note.guid);
            noteModule.appendChild(newNote);
            newNote.style.position = "absolute";
            newNote.style.left = note.left-6;
            newNote.style.top = note.top - 56;
            newNote.style.zIndex = note.z;
        });

    });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}




