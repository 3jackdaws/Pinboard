/**
 * Created by ian on 7/12/16.
 */

window.addEventListener("load", profileNotes);
document.addEventListener("mousemove", logmouse);
document.addEventListener("mouseup", putdownNote);
document.addEventListener("click", clearAll);
var POS = {
    x:{},
    y:{}
};
var noteObjects = [];
var timer = {};
var heldNote = {};
var openTextarea = null;
var note_z = 0;
function logmouse(event){
    POS.x = event.screenX;
    POS.y = event.screenY;
}

function profileNotes(){
    var noteSections = document.getElementsByClassName("sticky-note-container");
    foreach(noteSections, function(node){
        var notes = node.getElementsByClassName("sticky-note");
        foreach(notes, function(note){
            note.addEventListener("mousedown", pickupNote);
            note.addEventListener("dblclick", editNote);
            var boundingRect = note.getBoundingClientRect();
            note.style.position = "absolute";
            note.style.left = boundingRect.left + 10;
            note.style.top = boundingRect.top + 10;
        });
    });
}

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
}

function putdownNote(event){
    clearInterval(timer);
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
        openTextarea = null;
    }

}

function spawnCard(button){
    var container = button.parentNode;
    var note = createStickyNote("", 23);
    container.appendChild(note);
    anchorStickyNote(note);
}

function createStickyNote(text, id){
    var node = document.createElement("textarea");
    node.className = "sticky-note";
    node.setAttribute("id", id);
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

