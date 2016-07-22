/**
 * Created by Ian Murphy on 7/21/2016.
 */

/**
    Board.js

 */


var Pinboard = function (muid) {
    this.muid = muid;
    this.participants = null;
    this.owner = null;
    this.modules = null;
    this.numSections = null;
    this.moduleConfiguration = null;
    this.pinboardNode = null;
    if(muid == "new"){
        this.createNew();
    }else{
        this.getBoardData(muid);
    }
};

Pinboard.prototype.getBoardData = function () {
    var me = this;
    $.post("/board_access.php", {
        action:"get",
        board:me.muid
    }, function(data){
        me.populateBoardData(data);
        me.refresh();
    });
};

Pinboard.prototype.createNodeFromData = function () {

};

Pinboard.prototype.refresh = function () {
    
};

Pinboard.prototype.save = function () {
    var me = this;
    $.post("/board_access.php", {
        action:"update",
        board: me.muid,
        data:noteStack
    }, function(data){
        console.log(data);
    });
};

Pinboard.prototype.populateBoardData = function (data) {
    data = JSON.parse(data);
    this.name = data.name;
    this.owner = data.owner;
    this.participants = data.participants;
    this.modules = data.data;
};

Pinboard.prototype.createNew = function () {

};