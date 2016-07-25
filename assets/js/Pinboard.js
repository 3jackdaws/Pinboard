/**
 * Created by Ian Murphy on 7/21/2016.
 */

/**
    Pinboard.js

 */
Window.prototype.alert = function(message){
    console.log("Alert");
    var alert = document.createElement('div');
    var shade = document.createElement('div');
    var ok = document.createElement('div');
    alert.style.position = 'fixed';
    alert.style.margin = "auto";
    alert.style.background = "#f5f5f5";
    alert.style.width = '500px';
    alert.style.border = '1px solid lightgrey';
    alert.style.borderRadius = "6px";
    alert.style.top = '40%';
    alert.style.left = 0;
    alert.style.right = 0;
    alert.style.padding = '30px';
    alert.style.paddingBottom = '0';
    alert.innerHTML = message;
    alert.zIndex = 214748366;
    shade.style.position = 'fixed';
    shade.style.height = '100%';
    shade.style.width = '100%';
    shade.style.background = 'rgba(0,0,0,.7)';
    shade.zIndex = 214748350;
    shade.onclick = function(){
        document.body.removeChild(shade);
        document.body.removeChild(alert);
    };

    ok.style.width = '100%';
    ok.style.padding = '10px 0 10px 0px ';
    ok.style.marginTop = '15px';
    ok.style.borderTop = '1px solid #ddd';
    ok.innerHTML = "OK";
    ok.onclick = function(){
        document.body.removeChild(shade);
        document.body.removeChild(alert);
    };
    ok.style.cursor = "pointer";
    ok.style.textAlign = 'center';
    alert.appendChild(ok);
    document.body.appendChild(shade);
    document.body.appendChild(alert);
};

var mbw = 0;
SlipStream.setResource("/ss.php");
var Pinboard = function (muid) {
    var me = this;
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
    setTimeout(function(){if(me.modules.length == 0)
        alert("Right now there aren't any modules here.  Try adding one by clicking the \"This Board\" button in the top left");
    },2000);

};

Pinboard.prototype.changeContextUI = function () {
    var me = this;
    var cbutton = document.getElementById('context-button');
    var cmenu = document.getElementById('context-menu');
    cmenu.innerHTML = "";
    cbutton.innerHTML = "This board <span class='glyphicon glyphicon-triangle-bottom'></span>";
    var addModuleButton = document.createElement('button');
    addModuleButton.className = "btn btn-primary c-button";
    addModuleButton.onclick = function(){me.addModule()};
    addModuleButton.innerHTML = "Add New Module";
    var li = document.createElement('li');
    cmenu.appendChild(li.appendChild(addModuleButton));
    var delBoardButton = document.createElement('button');
    li = document.createElement('li');
    delBoardButton.className = "btn btn-danger c-button";
    delBoardButton.onclick = function(){me.delBoard()};
    delBoardButton.innerHTML = "Delete this Board";
    cmenu.appendChild(li.appendChild(delBoardButton));
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
    if(data.data.config)
        this.moduleConfiguration = data.data.config;
    if(data.data.modules)
        this.modules = data.data.modules;

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
    var name = document.getElementById('mod-name').value;
    if(name.length == 0){
        alert("You must name the new module");
        return;
    }
    this.createModule("StickyNote", classname, name);
    this.addModule();
};

Pinboard.prototype.selectTD = function (e) {
    var rep = " td-selected";
    if(e.className.search(/td-selected/) != -1) rep = "";
    e.className = e.className.replace(/ td-selected/,"");
    e.className += rep;
};

Pinboard.prototype.createModule = function (type, classes, name) {
    if(this.modules.length >= 8){
        alert("Boards are only allowed eight modules.  Try deleting a module before adding another one.");
        return;
    }
    switch(type.toLowerCase()){
        case "stickynote":
        {
            var newMod = new StickyNoteModule(getGuid(), classes);
            newMod.name = name;
            newMod.save();
            this.moduleObjects.push(newMod);
            this.pinboardNode.appendChild(newMod.baseModuleNode);
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

Pinboard.prototype.delBoard = function () {
    if(!confirm("Deleting a board is permanent.  Click OK to continue.")) return;
    var me = this;
    $.post("/assets/php/board_access.php", {
        action:"delete",
        board: me.muid
    }, function(data){
        window.location = "/";
    });
};

