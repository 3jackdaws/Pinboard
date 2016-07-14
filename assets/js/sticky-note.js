/**
 * Created by ian on 7/13/16.
 */

var stickymodules = [];
var mbw = 2;
document.addEventListener("mouseup", cancelAll);
window.addEventListener("load", function(){
    stickymodules[0] = new StickyNoteModule('left', "half-width");
    stickymodules[1] = new StickyNoteModule('right', "half-width");
    foreach(stickymodules, function (mod) {
        mod.loadModule();
        document.body.appendChild(mod.baseModuleNode);
    })
});

function cancelAll(event){
    foreach(stickymodules, function (e) {
        e.putDownNote();
        e.cancelEdit(event);
    });
}


var StickyNoteModule = function(mid, classname){
    this.mid = mid;
    this.createBaseModuleNode(classname);
    this.currentZIndex = null;
    this.editedNote = null;
    this.heldNote = null;
    this.delNoteClickable = document.createElement('a');
    this.delNoteClickable.cl
    this.mouseTracker = {};
    this.mti = null;
    this.numNotes = 0;
    this.maxNotes = 128;
};

StickyNoteModule.prototype.createBaseModuleNode = function(classname){
    this.baseModuleNode = document.createElement('div');
    this.baseModuleNode.className = "module sticky-note-module " + classname;
    this.baseModuleNode.setAttribute('guid', this.mid);
    var addNoteButton = document.createElement('a');
    addNoteButton.onclick = this.createNewStickyNote.bind(this, null, 10, 10, 9999);
    addNoteButton.innerHTML = '<span class="glyphicon glyphicon-plus-sign"></span>';
    addNoteButton.style.position = 'absolute';
    addNoteButton.style.right = 15;
    addNoteButton.style.bottom = 10;
    this.baseModuleNode.appendChild(addNoteButton);
};

StickyNoteModule.prototype.createNewStickyNote = function (text, x, y, z) {
    var note = document.createElement("textarea");
    note.className = "sticky-note noselect";
    note.setAttribute("guid", guid());
    note.readOnly = true;
    note.onmousedown = this.pickupNote.bind(this);
    note.addEventListener("dblclick", this.editNote);
    note.innerHTML = text;
    this.currentZIndex++;
    note.style.zIndex = this.currentZIndex;
    note.style.position = 'absolute';
    note.style.left = x;
    note.style.top = y;
    note.style.zIndex = z;

    this.baseModuleNode.appendChild(note);
};

StickyNoteModule.prototype.editNote = function (event) {
    var me = this;
    this.editedNote = event.currentTarget;
    this.editedNote.readOnly = false;
    this.editedNote.style.boxShadow = "5px 10px 20px rgba(0,0,0,.5)";
    this.editedNote.className = this.editedNote.className.replace(/ noselect/, "");
    this.editedNote.onmousedown = null;

    var noteDim = this.editedNote.getBoundingClientRect();
    this.delNoteClickable.style.left = noteDim.left;
    this.delNoteClickable.style.top = noteDim.top;
    this.delNoteClickable.style.zIndex = this.currentZIndex + 10;

    this.delNoteClickable.onclick = function(){
        me.editedNote.parentNode.removeChild(this.editedNote);
        me.editedNote = null;
        this.editedNote.parentNode.removeChild(this.delNoteClickable);
    };
    this.editedNote.parentNode.appendChild(delx);
    this.editedNote.focus();
};

StickyNoteModule.prototype.cancelEdit = function (event) {
    if(this.editedNote != null && event.target !== this.editedNote){
        this.editedNote.readOnly = true;
        this.editedNote.className = this.editedNote.className.replace(/ noselect/, "");
        this.editedNote.className += " noselect";
        this.editedNote.style.boxShadow = "1px 1px 5px rgba(0,0,0,.5)";
        this.editedNote.onmousedown = pickupNote;
        triggerSave(this.editedNote.parentNode);
        this.editedNote = null;
        this.baseModuleNode.removeChild(this.delNoteClickable);
    }
}

StickyNoteModule.prototype.pickupNote = function (event) {
    var me = this;
    this.heldNote = event.currentTarget;
    if(this.heldNote == null) return;
    this.currentZIndex++;
    this.heldNote.style.zIndex = this.currentZIndex;
    var noteBoundaries = this.heldNote.getBoundingClientRect();
    var containerBoundaries = this.baseModuleNode.getBoundingClientRect();
    var offsetX = noteBoundaries.left - this.mouseTracker.x - containerBoundaries.left - 6;
    var offsetY = noteBoundaries.top - this.mouseTracker.y - containerBoundaries.top - 6;

    clearInterval(me.mti);
    me.mti = window.setInterval(function(){
        me.heldNote.style.left = (me.mouseTracker.x + offsetX);
        me.heldNote.style.top = (me.mouseTracker.y + offsetY);
    }, 15);
};

StickyNoteModule.prototype.putDownNote = function () {
    if(this.heldNote){
        var debugrect = this.heldNote.getBoundingClientRect();
        var debugmod = this.heldNote.parentNode.getBoundingClientRect();
        clearInterval(this.mti);
        this.heldNote = null;
        this.save();
    }
};

StickyNoteModule.prototype.save = function () {
    var noteStack = [];
    var me = this;
    this.forEachNote(function (card) {

        var id = card.getAttribute("guid");
        var position = card.getBoundingClientRect();
        var parentPosition = me.baseModuleNode.getBoundingClientRect();
        var note = {};
        note["guid"] = id;
        note["top"] = position.top - parentPosition.top - mbw;
        note["left"] = position.left - parentPosition.left - mbw;

        note["text"] = card.value;
        note["z"] = card.style.zIndex;
        noteStack.push(note);
    });
    var json = JSON.stringify(noteStack);
    console.log(me.guid);
    console.log(json);
    $.post("/modules.php", {
        action:"update",
        module:me.mid,
        data:json
    }, function(data){
        var response = JSON.parse(data);
        console.log(response);
    });
};

StickyNoteModule.prototype.logMouse = function (event) {
    this.mouseTracker.x = event.screenX;
    this.mouseTracker.y = event.screenY;
}

StickyNoteModule.prototype.loadModule = function(){
    this.baseModuleNode.addEventListener("mousemove", this.logMouse.bind(this));
    var boundFE = this.forEachNote.bind(this);
    var me = this;
    $.post("/modules.php", {
        action:"get",
        module:me.mid
    }, function(data){
        var response = JSON.parse(data);
        var module = response.payload;
        if(!module){
            console.log(response);
            return;
        }
        var data = JSON.parse(module.data);
        var notes = JSON.parse(data);
        boundFE(function(e){e.parentNode.removeChild(e)});
        foreach(notes, function(note){

            me.createNewStickyNote(note.text, note.left, note.top, note.z);
        });
    });
};

StickyNoteModule.prototype.forEachNote = function (func) {
    var notes = this.baseModuleNode.getElementsByClassName('sticky-note');
    var len = notes.length;
    console.log(len);
    for(var i = len -1; i>=0; i--){
        func(notes[i]);
    }
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

function foreach(list, mapfunc){
    var len = list.length;
    for(var i = len-1; i>=0; i--){
        mapfunc(list[i]);
    }
}