/**
 * Created by Ian Murphy on 7/21/2016.
 */

/**
    Pinboard.js

 */
var mbw = 2;
SlipStream.setResource("/ss.php");
var Pinboard = function (muid) {
    this.muid = muid;
    this.participants = null;
    this.owner = null;
    this.modules = [];
    this.moduleObjects = [];
    this.numSections = null;
    this.moduleConfiguration = null;
    this.pinboardNode = document.getElementById('board');
    if(muid == "new"){
        this.createNew();
    }else{
        this.getBoardData(muid);
    }

};

Pinboard.prototype.getBoardData = function () {
    var me = this;
    $.post("/assets/php/board_access.php", {
        action:"get",
        board:me.muid
    }, function(data){
        console.log(data);
        if(data == null) me.createNew();
        else{
            me.populateBoardData(data);
            me.loadModules();
            SlipStream.open();
        }

    });
};

Pinboard.prototype.createNodeFromData = function () {

};

Pinboard.prototype.createNew = function () {

};

Pinboard.prototype.refresh = function () {
    var me = this;
    foreach(this.modules, function (mod) {

    });
};

Pinboard.prototype.save = function () {
    var me = this;
    var board_data = {};
    board_data['modules'] = this.modules;
    board_data['config'] = this.moduleConfiguration;
    board_data['name'] = this.name;
    board_data['owner'] = this.owner;
    board_data['participants'] = this.participants;
    console.log("save attempt");
    $.post("/assets/php/board_access.php", {
        action:"update",
        board: me.muid,
        data:board_data
    }, function(data){
        console.log(data);
    });
};

Pinboard.prototype.loadModules = function () {
    console.log("LoadMods");
    var me = this;
    foreach(me.modules, function (mod) {
        me.getModuleFromDatabase(mod);
    })
};

Pinboard.prototype.getModuleFromDatabase = function (mod) {
    var type, id;
    for(var k in mod) break;
    type = k;
    id = mod[k];
    var me = this;
    // console.log(type + " " + id);
    switch(type.toLowerCase()){
        case "stickynote":
        {
            var modNode = new StickyNoteModule(id, "half-height half-width");
            me.moduleObjects.push(modNode);
            // console.log(modNode);
            me.pinboardNode.appendChild(modNode.baseModuleNode);
            break;
        }
    }
}

Pinboard.prototype.populateBoardData = function (data) {
    data = JSON.parse(data);
    if(data.data == null) return;
    this.name = data.name;
    this.owner = data.owner;
    this.participants = data.participants;
    this.modules = data.data.modules;
    this.moduleConfiguration = data.data.layout;
};

Pinboard.prototype.addModule = function () {
    var modal = document.getElementsByClassName('add-mod-modal')[0];
    console.log(modal);
    modal.style.visibility == 'visible' ? modal.style.visibility = "hidden" : modal.style.visibility = 'visible';
};

Pinboard.prototype.checkUIConfig = function () {
    var array = this.createTableArray();
    var numQuads = 0;
    var len = array.length;
    for (var i = 0; i < len; i++) {
        if(array[i]) numQuads++;
    }
    if(numQuads == 0){
        alert("You must select at least one quadrant.");
        return;
    }
    else if(numQuads == 3){
        alert("You cannot select three quadrants.");
        return;
    }else if(numQuads == 2){
        // console.log(2);
        if((array[0] && array[2]) || (array[1] && array[3])){
            alert("Quadrants must be adjacent.");
            return;
        }
    }

    alert("Module created");
    this.createModule("StickyNote", "half-width half-height");
    this.addModule();
};

Pinboard.prototype.selectTD = function (e) {
    var rep = " td-selected";
    if(e.className.search(/td-selected/) != -1) rep = "";
    e.className = e.className.replace(/ td-selected/,"");
    e.className += rep;
};

Pinboard.prototype.createModule = function (type, classes) {
    switch(type.toLowerCase()){
        case "stickynote":
        {
            var newMod = new StickyNoteModule(getGuid(), classes);
            this.moduleObjects.push(newMod);
            document.getElementsByClassName('pinboard')[0].appendChild(newMod.baseModuleNode);
            this.modules.push({StickyNote:newMod.mid});
            this.save();

        }
    }
};

Pinboard.prototype.createTableArray = function () {
    var tds = document.getElementsByClassName('config')[0].getElementsByTagName('td');
    // console.log(tds);
    var config = [];
    var len = tds.length;
    for (var i = 0; i < len; i++){
        if(tds[i].className.search(/td-selected/) != -1){
            config.push(true);
        }else{
            config.push(false);
        }
    }
    var hold = config[2];
    config[2] = config[3];
    config[3] = hold;
    return config;
};

Pinboard.createModuleLayout = function (q) {
    var layout = [];
    if(q[0] == q[1] == q[2] == q[3]) layout.push("FULL");
    else if(q[0] == q[3] || q[1] == q[2]) layout.push("TWOCOL");
    else layout.push("NORMAL");

    if(layout[0] == "TWOCOL"){
        if(q[0] == q[3]) layout.push("STD");
        else {
            layout.push("HH");
            layout.push("HH");
        };
        if(q[1] == q[2]) layout.push("STD");
        else {
            layout.push("HH");
            layout.push("HH");
        };
    }

    if (layout[0] == "NORMAL"){
        if(q[0] == q[1]) layout.push("HH");
        else {
            layout.push("HH HW");
            layout.push("HH HW");
        }
        if(q[2] == q[3]) layout.push("HH");
        else {
            layout.push("HH HW");
            layout.push("HH HW");
        }
    }

    this.moduleConfiguration = layout;

};