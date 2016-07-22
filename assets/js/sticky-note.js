/**
 * Created by ian on 7/13/16.
 */

var stickymodules = [];
SlipStream.setResource("/ss.php");
var mbw = 2;
document.addEventListener("mouseup", putDownAll);
window.addEventListener("load", function(){
    stickymodules[0] = new StickyNoteModule('left', "");
    // stickymodules[1] = new StickyNoteModule('right', "half-width");
    foreach(stickymodules, function (mod) {
        mod.loadModule();
        document.body.appendChild(mod.baseModuleNode);
    });
    SlipStream.open();
});

function putDownAll(event){
    foreach(stickymodules, function (e) {
        e.putDownNote();
    });
}



var StickyNoteModule = function(mid, classname){
    var me = this;
    this.mid = mid;
    this.version = "Version 0.3.5";
    this.createBaseModuleNode(classname);
    this.currentZIndex = null;
    this.editedNote = null;
    this.heldNote = null;
    this.delNoteClickable = document.createElement('a');
    this.delNoteClickable.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
    this.delNoteClickable.style.position = 'absolute';
    this.mouseTracker = {};
    this.mti = null;
    this.numNotes = 0;
    this.maxNotes = 16;
    this.notes = {};
    this.saveInterval = null;
    this.lastAccess = null;
    this.noteCache = null;
    SlipStream.register({StickyNote:mid}, function (data) {
        console.log(data);
        me.noteCache = data.data;
        // console.log(me.noteCache);
        me.refresh();
    });

};

StickyNoteModule.prototype.createBaseModuleNode = function(classname){
    this.baseModuleNode = document.createElement('div');
    this.baseModuleNode.onclick = this.cancelEdit.bind(this);
    this.baseModuleNode.className = "module sticky-note-module " + classname;
    this.baseModuleNode.setAttribute('guid', this.mid);
    var addNoteButton = document.createElement('a');
    addNoteButton.onclick = this.addBlankStickyNote.bind(this);
    addNoteButton.innerHTML = '<span class="glyphicon glyphicon-plus-sign"></span>';
    addNoteButton.style.position = 'absolute';
    addNoteButton.style.right = 15;
    addNoteButton.style.bottom = 10;
    this.baseModuleNode.appendChild(addNoteButton);
    // this.baseModuleNode.innerHTML += this.version;
};

StickyNoteModule.prototype.refresh = function () {
    if(this.heldNote || this.editedNote) return;
        this.changeNotes();
};

StickyNoteModule.prototype.createNewStickyNote = function (text, x, y, z, guid) {
    if(this.numNotes >= this.maxNotes) return;
    if(guid == null) guid = getGuid();
    this.numNotes++;
    var note = document.createElement("textarea");
    note.className = "sticky-note noselect";
    note.setAttribute("guid", guid);
    note.readOnly = true;
    note.onmousedown = this.pickupNote.bind(this);
    note.addEventListener("dblclick", this.editNote.bind(this));
    note.addEventListener('mouseup', note.focus);
    note.innerHTML = text;
    this.currentZIndex++;
    note.style.zIndex = this.currentZIndex;
    note.style.position = 'absolute';
    note.style.left = x;
    note.style.top = y;
    note.style.zIndex = z;
    this.baseModuleNode.appendChild(note);
    this.notes[guid] = note;
    return note;
};

StickyNoteModule.prototype.addBlankStickyNote = function () {
    this.createNewStickyNote("", 10, 10, this.currentZIndex, null);
    this.save();
};

StickyNoteModule.prototype.editNote = function (event) {
    var me = this;
    this.editedNote = event.currentTarget;


    this.editedNote.style.boxShadow = "5px 10px 20px rgba(0,0,0,.5)";
    this.editedNote.className = this.editedNote.className.replace(/ noselect/, "");
    this.editedNote.onmousedown = null;
    this.editedNote.readOnly = false;


    var noteDim = this.editedNote.getBoundingClientRect();
    var parentRect = this.baseModuleNode.getBoundingClientRect();
    this.delNoteClickable.style.left = noteDim.left - parentRect.left;
    this.delNoteClickable.style.top = noteDim.top - parentRect.top;
    this.delNoteClickable.style.zIndex = this.currentZIndex + 10;

    this.delNoteClickable.onclick = function(){
        me.editedNote.parentNode.removeChild(me.delNoteClickable);
        me.editedNote.parentNode.removeChild(me.editedNote);
        me.editedNote = null;
        me.delegateSave();
    };
    this.editedNote.parentNode.appendChild(this.delNoteClickable);
    this.cancelSave();
    this.editedNote.focus();
    this.editedNote.select();

};

StickyNoteModule.prototype.cancelEdit = function (event) {
    if(this.editedNote != null && event.target !== this.editedNote){
        this.editedNote.readOnly = true;
        this.editedNote.className = this.editedNote.className.replace(/ noselect/, "");
        this.editedNote.className += " noselect";
        this.editedNote.style.boxShadow = "1px 1px 5px rgba(0,0,0,.5)";
        this.editedNote.onmousedown = this.pickupNote.bind(this);
        this.editedNote = null;
        this.baseModuleNode.removeChild(this.delNoteClickable);
        this.save();
    }
};

StickyNoteModule.prototype.delegateSave = function () {
    var boundSave = this.save.bind(this);
    clearInterval(this.saveInterval);
    var me = this;
    this.saveInterval = window.setTimeout(boundSave, 500);
};

StickyNoteModule.prototype.cancelSave = function () {
    clearInterval(this.saveInterval);
};

StickyNoteModule.prototype.pickupNote = function (event) {
    var me = this;
    this.heldNote = event.currentTarget;
    if(this.heldNote == null) return;
    this.currentZIndex++;
    this.heldNote.style.zIndex = this.currentZIndex;
    var noteBoundaries = this.heldNote.getBoundingClientRect();
    var containerBoundaries = this.baseModuleNode.getBoundingClientRect();
    var offsetX = noteBoundaries.left - this.mouseTracker.x - containerBoundaries.left - mbw;
    var offsetY = noteBoundaries.top - this.mouseTracker.y - containerBoundaries.top - mbw;

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

StickyNoteModule.prototype.normalize = function () {
    var lowest = 9999999;
    this.forEachNote(function (note) {
        if(note.style.zIndex < lowest) lowest = note.style.zIndex;
    });
    lowest-=2;
    console.log(lowest);
    this.forEachNote(function (note) {
        note.style.zIndex -= lowest;
    });
}

StickyNoteModule.prototype.save = function () {
    var noteStack = [];
    var me = this;

    me.forEachNote(function (card) {
        var id = card.getAttribute("guid");
        var position = card.getBoundingClientRect();
        var parentPosition = me.baseModuleNode.getBoundingClientRect();
        var note = {};
        note["guid"] = id;
        note["top"] = position.top - parentPosition.top - mbw;
        note["left"] = position.left - parentPosition.left - mbw;
        if(note['top'] < 0) note['top'] = 10;
        if(note['left'] < 0) note['left'] = 10;
        note["text"] = card.value;
        note["z"] = card.style.zIndex;
        noteStack.push(note);
    });
    // var json = JSON.stringify(noteStack);

    $.post("/mod_access.php", {
        action:"update",
        class: "StickyNote",
        module:me.mid,
        data:noteStack
    }, function(data){
        console.log(data);
    });
};

StickyNoteModule.prototype.logMouse = function (event) {
    this.mouseTracker.x = event.screenX;
    this.mouseTracker.y = event.screenY;
}

StickyNoteModule.prototype.loadModule = function(){

    this.baseModuleNode.addEventListener("mousemove", this.logMouse.bind(this));
    var me = this;
    $.post("/mod_access.php", {
        action:"get",
        class:'StickyNote',
        module:me.mid
    }, function(data){
        // console.log(JSON.parse(data));
        me.noteCache = JSON.parse(data).data;
        me.refresh();
    });
};


StickyNoteModule.prototype.changeNotes = function () {
    // console.log("Change");
    var me = this;
    var notes = this.noteCache;
    var newNotes = [];
    foreach(notes, function(note){
        me.currentZIndex < note.z ? me.currentZIndex=note.z : null;
        var id = note.guid;
        newNotes[id] = true;
        if(id in me.notes){
            me.notes[id].style.zIndex = note.z;
            if(note != me.heldNote && note != me.editedNote){
                var mx =  note.left - parseInt(me.notes[id].style.left);
                var my =  note.top - parseInt(me.notes[id].style.top);
                me.notes[id].value = note.text;
                if(Math.abs(mx) > 1 || Math.abs(my) > 1){
                    me.notes[id].style.transition = 'all 0.5s';
                    me.notes[id].style.transform = 'translate('+mx+'px, '+my+'px)';
                    var x = note.left;
                    var y = note.top;

                    window.setTimeout(function () {
                        me.notes[id].style.transition = 'none';
                        me.notes[id].style.transform = 'none';
                        me.notes[id].style.left = x;
                        me.notes[id].style.top = y;


                    }, 500);
                }
            }

        }else{
            me.createNewStickyNote(note.text, note.left, note.top, note.z, note.guid);

        }
    });

    for(var note in me.notes){

        if(note in newNotes){

        }else{
            me.baseModuleNode.removeChild(me.notes[note]);
        }
    }
};

StickyNoteModule.prototype.forEachNote = function (func) {
    var notes = this.baseModuleNode.getElementsByClassName('sticky-note');
    var len = notes.length;
    for(var i = len -1; i>=0; i--){
        func(notes[i]);
    }
}

function getGuid() {
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
