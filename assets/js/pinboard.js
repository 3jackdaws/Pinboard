/**
 * Created by ian on 7/12/16.
 */



window.addEventListener("load", function(){
    delx = document.createElement('a');
    delx.className = 'del-note';
    delx.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
    delx.style.position = 'absolute';
    delx.href = "javascript:;";
    delx.onclick = function(){
        console.log("click");
    };
});
// document.addEventListener("mousemove", logmouse);
document.addEventListener("mouseup", putdownNote);
document.addEventListener("click", clearAll);
window.setInterval(function () {
    if(openTextarea == null && heldNote == null){
        foreach(document.getElementsByClassName('sticky-note-module'), loadModule);
    }
}, 5000);

var noteObjects = [];
var timer = {};
var saveTimer = {};
var heldNote = null;
var openTextarea = null;
var note_z = 0;
var lastUpdate = {};
var modMouseTracker = {};
var delx;
//module border width
var mbw = 2;
function logmouse(event){
    var mod = event.currentTarget.getAttribute('guid');
    modMouseTracker[mod].x = event.screenX;
    modMouseTracker[mod].y = event.screenY;

}

function pickupNote(event){
    heldNote = event.currentTarget;
    console.log(heldNote);
    var cont = heldNote.parentNode.getAttribute('guid');
    if(heldNote == null) return;
    note_z++;
    heldNote.style.zIndex = note_z;
    var noteBoundaries = heldNote.getBoundingClientRect();
    var containerBoundaries = heldNote.parentNode.getBoundingClientRect();
    var track = modMouseTracker[cont];
    var offsetX = noteBoundaries.left - track.x - containerBoundaries.left - 6;
    var offsetY = noteBoundaries.top - track.y - containerBoundaries.top - 6;

    clearInterval(timer);
    timer = window.setInterval(function(){
        heldNote.style.left = (track.x + offsetX);
        heldNote.style.top = (track.y + offsetY);
    }, 15);
}

function editNote(event){
    openTextarea = event.currentTarget;
    openTextarea.readOnly = false;
    openTextarea.style.boxShadow = "5px 10px 20px rgba(0,0,0,.5)";
    openTextarea.className = openTextarea.className.replace(/ noselect/, "");
    openTextarea.onmousedown = null;

    var br = openTextarea.getBoundingClientRect();
    delx.style.left = br.left;
    delx.style.top = br.top;
    delx.style.zIndex = note_z + 10;

    delx.onclick = function(){
        openTextarea.parentNode.removeChild(openTextarea);
        openTextarea = null;
        delx.parentNode.removeChild(delx);
    };
    openTextarea.parentNode.appendChild(delx);
    openTextarea.focus();
}

function putdownNote(event){
    if(heldNote){
        var debugrect = heldNote.getBoundingClientRect();
        var debugmod = heldNote.parentNode.getBoundingClientRect();

        clearInterval(timer);
        var container = heldNote.parentNode;
        heldNote = null;
        if(!openTextarea) triggerSave(container);
    }

}

function triggerSave(module){
    var muid = module.getAttribute('guid');
    clearInterval(saveTimer[muid]);
    saveTimer[muid] = window.setInterval(function(){
        if(!openTextarea && !heldNote)
            saveModule(module);
        clearInterval(saveTimer[muid]);
    }, 1000);
}

function foreach(list, mapfunc){
    var len = list.length;
    for(var i = len-1; i>=0; i--){
        mapfunc(list[i]);
    }
}

function clearAll(event){
    if(openTextarea != null && event.target !== openTextarea){
        openTextarea.readOnly = true;
        openTextarea.className = openTextarea.className.replace(/ noselect/, "");
        openTextarea.className += " noselect";
        openTextarea.style.boxShadow = "1px 1px 5px rgba(0,0,0,.5)";
        openTextarea.onmousedown = pickupNote;
        triggerSave(openTextarea.parentNode);
        openTextarea = null;
        delx.parentNode.removeChild(delx);
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
    node.className = "sticky-note noselect";
    node.setAttribute("guid", id);
    node.readOnly = true;
    node.onmousedown = pickupNote;
    node.addEventListener("dblclick", editNote);
    node.innerHTML = text;
    note_z++;
    return node;
}

function anchorStickyNote(note_node){
    var boundingRect = note_node.getBoundingClientRect();
    note_node.style.position = "absolute";
    note_node.style.left = 20;
    note_node.style.top = 20;
    note_node.style.zIndex = note_z;
    console.log("Anchor note at: " + boundingRect.left);
}

function saveModule(module){
    var cards = module.getElementsByClassName("sticky-note");
    var noteStack = [];
    var guid = module.getAttribute("guid");
    foreach(cards,function (card) {
        var id = card.getAttribute("guid");
        var position = card.getBoundingClientRect();
        var parentPosition = module.getBoundingClientRect();
        var note = {};
        note["guid"] = guid;
        note["top"] = position.top - parentPosition.top - mbw;
        note["left"] = position.left - parentPosition.left - mbw;
        console.log(note['top'] + " " + note['left']);
        note["text"] = card.value;
        note["z"] = card.style.zIndex;
        noteStack.push(note);
    });

    var json = JSON.stringify(noteStack);
    $.post("/mod_access.php", {
        action:"update",
        module:guid,
        data:json,
        hash:lastUpdate[guid]
    }, function(data){
        var response = JSON.parse(data);
        console.log(response);
    });
}

function loadModule(mod){
    var muid = mod.getAttribute('guid');
    mod.addEventListener("mousemove", logmouse);
    modMouseTracker[muid] = {};
    $.post("/mod_access.php", {
        action:"get",
        module:muid,
        hash:lastUpdate[muid]
    }, function(data){
        if(data.hashCode() == lastUpdate[muid]) return;
        lastUpdate[muid] = data.hashCode();
        console.log("Update: " + muid);
        var response = JSON.parse(data);
        // console.log(response.payload);
        var module = response.payload;
        if(!module){
            console.log(response);
            return;
        }
        var data = JSON.parse(module.data);
        var notes = JSON.parse(data);
        var modBounding = mod.getBoundingClientRect();
        foreach(mod.getElementsByClassName('sticky-note'), function(e){e.parentNode.removeChild(e)});
        foreach(notes, function(note){
            var newNote = createStickyNote(note.text, note.guid);
            mod.appendChild(newNote);
            newNote.style.position = "absolute";
            newNote.style.left = note.left;
            newNote.style.top = note.top;
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








