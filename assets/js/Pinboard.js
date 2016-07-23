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
    this.moduleConfiguration = [];
    this.pinboardNode = document.getElementById('board');
    if(muid == "new"){
        this.createNew();
    }else{
        this.getBoardData(muid);
    }
    this.changeContextUI();
};

Pinboard.prototype.changeContextUI = function () {
    var me = this;
    var cbutton = document.getElementById('context-button');
    var cmenu = document.getElementById('context-menu');
    cmenu.innerHTML = "";
    cbutton.innerHTML = "This board <span class='glyphicon glyphicon-triangle-bottom'></span>";
    var addModuleButton = document.createElement('button');
    addModuleButton.className = "btn btn-primary";
    addModuleButton.onclick = function(){me.addModule()};
    addModuleButton.innerHTML = "Add New Module";
    var li = document.createElement('li');
    cmenu.appendChild(li.appendChild(addModuleButton));
}

Pinboard.prototype.getBoardData = function () {
    var me = this;
    $.post("/assets/php/board_access.php", {
        action:"get",
        board:me.muid
    }, function(data){
        // console.log(data);
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
    // console.log("save attempt");
    $.post("/assets/php/board_access.php", {
        action:"update",
        board: me.muid,
        data:board_data
    }, function(data){
        console.log(data);
    });
};

Pinboard.prototype.loadModules = function () {
    // console.log("LoadMods");
    var me = this;
    var type, id;
    var len = this.modules.length;
    for(var i = 0; i<len; i++){
        // console.log(i);
        for(var k in me.modules[i]) break;
        type = k;
        id = me.modules[i][k];
        var classname = me.decodeModuleLayout(me.moduleConfiguration[i]);
        switch(type.toLowerCase()){
            case "stickynote":
            {
                // console.log(classname);
                var modNode = new StickyNoteModule(id, classname);
                me.moduleObjects.push(modNode);
                me.pinboardNode.appendChild(modNode.baseModuleNode);
                break;
            }
        }
    }
};

Pinboard.prototype.getModuleFromDatabase = function (mod) {

}

Pinboard.prototype.populateBoardData = function (data) {
    data = JSON.parse(data);
    if(data.data == null) return;
    this.name = data.name;
    this.owner = data.owner;
    this.participants = data.participants;
    this.modules = data.data.modules;
    if(data.data.config)
        this.moduleConfiguration = data.data.config;
};

Pinboard.prototype.addModule = function () {
    var modal = document.getElementsByClassName('add-mod-modal')[0];
    var dim = document.getElementById('dim');
    // console.log(modal);
    if(modal.style.visibility == 'visible'){
        modal.style.visibility = "hidden"
        dim.style.visibility = "hidden";
    }else{
        modal.style.visibility = 'visible';
        dim.style.visibility = "visible";
    }
};

Pinboard.prototype.checkUIConfig = function () {
    var array = this.createTableArray();
    var numQuads = 0;
    var classname = "";
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
        if((array[0] && array[1]) || (array[2] && array[3])){
            classname += " half-height";
        }
        else
            classname += " half-width";
    }else if(numQuads == 1){
        classname = "half-height half-width"
    }

    alert("Module created");
    this.createModule("StickyNote", classname);
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
            this.moduleConfiguration.push(this.encodeModuleLayout(classes));
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

Pinboard.prototype.encodeModuleLayout = function (klass) {

    var clist = klass.split(" ");
    var config = "";
    for (var c in clist){
        // console.log("C:" + clist[c]);
        if(clist[c] == "half-height") config += " HH";
        else if(clist[c] == "half-width") config += " HW";
    }
    return config;
};

Pinboard.prototype.decodeModuleLayout = function (code) {
    // if(!klass) return "";
    var klass = "";
    var symbols = code.split(" ");
    for(var c in symbols){
        if(symbols[c] == "HW") klass += " half-width";
        else if(symbols[c] == "HH") klass += " half-height";
    }
    return klass;
};