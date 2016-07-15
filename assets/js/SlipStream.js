/**
 * Created by ian on 7/14/16.
 */

var SlipStream = function(resource){
    this.resource = resource;
    this.xhr = null;
    this.onserverpush = function(){console.error("Must set SlipStream.onserverpush to a handler function")};
    this.requestdata = null;
};

SlipStream.prototype.open = function (data) {
    var self = this;
    this.requestdata = data;
    this.xhr = new XMLHttpRequest();
    this.xhr.onreadystatechange = function(){
        if(self.xhr.readyState==4&&self.xhr.status==200){
            self.onserverpush(self.xhr.responseText);
            self.open(self.requestdata);
        }
    };
    this.xhr.open("POST", this.resource, true);
    this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    this.xhr.send(data);
    console.log("Send");
};

