/**
 * Created by ian on 7/21/16.
 */

var SlipStream = {
    resource:{},
    xhr:{},
    onserverpush:[],
    requestdata:[],
    numeventhandlers:null,

    setResource:function (resource) {
          this.resource=resource;
    },

    register:function (data, callback) {
        this.onserverpush.push(callback);
        this.requestdata.push(data);
        this.numeventhandlers++;

    },
    open:function () {
        var self = this;
        this.xhr = new XMLHttpRequest();
        var message = "";
        var json = JSON.stringify(this.requestdata);
        this.xhr.onreadystatechange = function(){
            if(self.xhr.readyState==4&&self.xhr.status==200){
                // console.log(self.xhr.responseText);
                var response = JSON.parse(self.xhr.responseText);
                for (var i = self.onserverpush.length -1; i>=0; i--){
                    self.onserverpush[i](response[self.getFirstKey(self.requestdata[i])]);
                }
                self.open();
            }
            if(self.xhr.status==500)
                setTimeout(self.open(), 100000);
        };
        this.xhr.open("POST", this.resource, true);
        this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xhr.send("sp="+json);
    },
    getFirstKey:function (object) {
        for(var first in object) break
        return object[first];
    }
};