/**
 * Created by ian on 7/13/16.
 */



function putDownAll(event){
    if(typeof board !== 'undefined'){
        console.log(event.target);
        foreach(board.moduleObjects, function (e) {
            console.log(e.baseModuleNode);
            if(e.baseModuleNode == event.target)
                e.putDownNote();
        });
    }
}
var zRatio;
window.addEventListener("load", function () {
    zRatio = document.width/1200;
    if(!(zRatio < 1)) zRatio=1;
    console.log(zRatio);
});



var StickyNoteModule = function(mid, classname){
    var me = this;
    this.mid = mid;
    this.name = null;
    this.namediv = null;
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
    this.noteCache = null;
    this.currentContextMenu = null;
    //register this stickynote module with the SlipStream client
    SlipStream.register({StickyNote:mid}, function (data) {
        var sdata = data;
        if(sdata && sdata.data){
            if(sdata.data.notes)
                me.noteCache = sdata.data.notes;
            me.name = sdata.data.name;
        }
        me.refresh();
    });
    window.addEventListener('resize', function(){me.sizeText()});
    this.loadModule();

};

StickyNoteModule.prototype.createBaseModuleNode = function(classname){
    var me = this;
    this.baseModuleNode = document.createElement('div');
    this.baseModuleNode.addEventListener("mouseup", function(){me.putDownNote()});

    this.baseModuleNode.onclick = function(event){
        me.cancelEdit(event);
    };
    this.baseModuleNode.className = "module sticky-note-module " + classname;
    this.baseModuleNode.setAttribute('guid', this.mid);
    this.baseModuleNode.oncontextmenu = function (event) {
        cMenu(event, function(t){
            var del = document.createElement('a');
            del.onclick = function(){
                alert("Are you sure you want to remove this module?", function () {
                    if(board.deleteModule(me.mid)){
                        $.post("/mod_access.php", {
                            action:"delete",
                            class: "StickyNote",
                            module:me.mid
                        }, function(data){
                            console.log(data);
                        });
                    }else{
                        console.error("Module could not be deleted.");
                    }

                });
            };
            // console.log(t);
            var guid = t.getAttribute('guid');
            del.innerHTML = "Delete Module";
            del.className = "warning";

            var rename = document.createElement('a');
            rename.onclick = function(){
                var newname = prompt("Enter a new name");
                var nummods = board.moduleObjects.length;
                for(var i = 0; i<nummods; i++){
                    if(board.moduleObjects[i].baseModuleNode.getAttribute('guid') == guid){

                        board.moduleObjects[i].name = newname;
                        console.log("Found");
                        board.moduleObjects[i].save();
                    }
                }
            };
            rename.innerHTML = "Rename Module";

            var addnote = document.createElement('a');
            addnote.onclick = function () {
                me.addBlankStickyNote();
            };
            addnote.innerHTML = "Add Note";
            var hr = document.createElement('hr');
            return [addnote, rename, hr, del];
        });
        return false;
    };
    var addNoteButton = document.createElement('a');
    addNoteButton.onclick = function(){me.addBlankStickyNote()};  //bind the addBlankNote function to the addNoteButton
    addNoteButton.innerHTML = '<span class="glyphicon glyphicon-plus-sign"></span>';
    addNoteButton.className = "add-note-button";
    addNoteButton.style.position = 'absolute';
    addNoteButton.style.right = 15;
    addNoteButton.style.bottom = 10;
    addNoteButton.style.zIndex = 2000000;
    this.baseModuleNode.appendChild(addNoteButton);
    this.namediv = document.createElement('div');
    this.namediv.className = "mod-label";
    this.baseModuleNode.appendChild(this.namediv);
};

StickyNoteModule.prototype.refresh = function () {
    if(this.heldNote || this.editedNote) return;        //if a note is held or edited, exit
    // console.log("Refresh");
    this.changeNotes();
    this.namediv.innerHTML = this.name;
    this.sizeText();
};

StickyNoteModule.prototype.createNewStickyNote = function (text, x, y, z, guid) {
    console.log("here");
    if(this.numNotes >= this.maxNotes) return;
    if(guid == null) guid = getGuid();
    this.numNotes++;
    var me = this;
    var note = document.createElement("textarea");      //create a textarea node
    note.className = "sticky-note noselect";
    note.setAttribute("guid", guid);
    note.readOnly = true;
    note.onmousedown = this.pickupNote.bind(this);

    note.addEventListener("dblclick", this.editNote.bind(this));        //add a double click event listener
    // note.addEventListener('mouseup', note.focus);
    note.oncontextmenu = function (event) {
        cMenu(event, function(t){
            var del = document.createElement('a');
            del.onclick = function(){
                me.baseModuleNode.removeChild(t);
                me.save();
            };
            del.innerHTML = "Delete";
            var center = document.createElement('a');
            center.onclick = function(){
                centerText(t);
                me.save();
            };
            center.innerHTML = "Toggle Align";
            return [del, center];
        });
        event.stopPropagation();
        return false;
    };
    note.innerHTML = text;
    this.currentZIndex++;
    note.style.zIndex = this.currentZIndex;
    note.style.position = 'absolute';
    note.style.left = x;
    note.style.top = y;
    note.style.zIndex = z;
    this.baseModuleNode.appendChild(note);      //insert the textarea node into the node that describes the base module
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
    this.delNoteClickable.style.zIndex = 99999999999;

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
    //clear the save timer if it exists
    clearInterval(this.saveInterval);
    var me = this;
    this.saveInterval = window.setTimeout(boundSave, 500);  //set timer to save in 500 milliseconds
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
    var offsetX = noteBoundaries.left - this.mouseTracker.x/zRatio - containerBoundaries.left - mbw;   //calculate an offset so things aren't broke
    var offsetY = noteBoundaries.top - this.mouseTracker.y/zRatio - containerBoundaries.top - mbw;

    // clearInterval(me.mti);
    me.mti = function () {
        me.heldNote.style.left = (me.mouseTracker.x/zRatio + offsetX);
        me.heldNote.style.top = (me.mouseTracker.y/zRatio + offsetY);
    };

    this.baseModuleNode.addEventListener('mousemove', me.mti);
    // me.mti = window.setInterval(function(){     //set an Interval and put the id in this.mti
    //     me.heldNote.style.left = (me.mouseTracker.x/zRatio + offsetX);
    //     me.heldNote.style.top = (me.mouseTracker.y/zRatio + offsetY);
    // }, 15);
};



StickyNoteModule.prototype.putDownNote = function () {
    if(this.heldNote){
        var debugrect = this.heldNote.getBoundingClientRect();
        var debugmod = this.heldNote.parentNode.getBoundingClientRect();
        //clear the mouse tracking interval (mti)
        // clearInterval(this.mti);
        this.baseModuleNode.removeEventListener('mousemove', this.mti);
        this.heldNote = null;
        this.save();

    }
};

StickyNoteModule.prototype.save = function () {
    var noteStack = [];
    var me = this;

    me.forEachNote(function (card) {
        var id = card.getAttribute("guid");
        var position = card.getBoundingClientRect();
        var parentPosition = me.baseModuleNode.getBoundingClientRect();     //find the rectangle coordinates of the parent node
        var note = {};      //create an empty object
        note["guid"] = id;  //create a dictionary
        note["top"] = position.top - parentPosition.top - mbw;
        note["left"] = position.left - parentPosition.left - mbw;
        if(position.top + 30 < parentPosition.top) note['top'] = -30;
        if(position.left + 30< parentPosition.left) note['left'] = -30;
        if(position.right - 30 > parentPosition.right) note['left'] = parentPosition.width - 120;
        if(position.bottom - 30> parentPosition.bottom) note['top'] = parentPosition.height - 120;
        note["text"] = card.value;
        note["z"] = card.style.zIndex;
        noteStack.push(note);
    });
    var data = {};
    data.name = this.name;
    data.notes = noteStack;
    this.noteCache = noteStack;
    //update this module's data on the server
    $.post("/mod_access.php", {
        action:"update",
        class: "StickyNote",
        module:me.mid,
        data:data
    }, function(data){
        console.log(data);
    });
    this.refresh();
};

StickyNoteModule.prototype.logMouse = function (event) {
    this.mouseTracker.x = event.screenX;
    this.mouseTracker.y = event.screenY;
}

StickyNoteModule.prototype.loadModule = function(){

    this.baseModuleNode.addEventListener("mousemove", this.logMouse.bind(this));

    var me = this;
    //get the module described by me.mid from the database
    $.post("/mod_access.php", {
        action:"get",
        class:'StickyNote',
        module:me.mid
    }, function(data){
        // console.log(data);
        var sdata = JSON.parse(data);       //parse the raw string into an object
        if(sdata && sdata.data){            //if an object was made AND the object has a member called data
            if(sdata.data.notes)
                me.noteCache = sdata.data.notes;
            me.name = sdata.data.name;
        }

        me.refresh();
    });
};

StickyNoteModule.prototype.sizeText = function () {

    var br = this.baseModuleNode.getBoundingClientRect();
    var slen = this.namediv.innerHTML.length+1;
    var fsize = br.width*1.5/slen;
    if(fsize > br.height) fsize = br.height/1.3;
    this.namediv.style.fontSize = fsize;
    this.namediv.style.lineHeight = br.height + "px";
};

StickyNoteModule.prototype.hideContextMenu = function () {
    var me = this;
    if(me.currentContextMenu){
        me.baseModuleNode.removeChild(me.currentContextMenu);
        me.currentContextMenu = null;
    }
};

StickyNoteModule.prototype.changeNotes = function () {
    // console.log("Change");
    var me = this;
    var notes = this.noteCache;
    var newNotes = [];
    foreach(notes, function(note){  //foreach note in the note cache, apply the changest to the old notes
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
    if(!list) return;
    var len = list.length;
    for(var i = len-1; i>=0; i--){
        mapfunc(list[i]);
    }
}

function centerText(e){
    var c = e.className.search(/center/) == -1;
    e.className = e.className.replace(/ center/,"");
    if(c)
        e.className+=" center";
}


function cMenu(event, fReturnNodeList) {
    var target = event.currentTarget;
    var nodes = fReturnNodeList(target);
    var len = nodes.length;
    var menu = document.createElement('div');
    menu.className = "context-menu";
    menu.style.position = 'absolute';
    menu.style.left = event.pageX;
    menu.style.top = event.pageY;
    // console.log(event);
    for(var i = 0; i< len; i++){
        menu.appendChild(nodes[i]);
    }
    menu.onmousedown = function (event) {
        event.stopPropagation();
    };
    menu.onclick = function () {
        hidecmenu();
    };
    var hidecmenu = function () {
        document.body.removeChild(menu);
        document.removeEventListener('mousedown', hidecmenu);
    };
    document.addEventListener("mousedown", hidecmenu);
    document.body.appendChild(menu);
    return false;
}

