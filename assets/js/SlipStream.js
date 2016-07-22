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
        if(this.numEventHandlers == 0){
            this.onserverpush[0] = callback;
            this.requestdata[0] = data;
            this.numEventHandlers++;
        }else{
            this.onserverpush.push(callback);
            this.requestdata.push(data);
            this.numEventHandlers++;
        }
    },
    open:function () {
        var self = this;
        this.xhr = new XMLHttpRequest();
        var message = "";
        for(var i = self.requestdata.length -1; i>=0; i--){
            // console.log(self.requestdata[i]);
            for(var key in self.requestdata[i])
                message+=(key+"="+self.requestdata[i][key]);
            message+="&";
        }
        message=message.replace(/&$/, "");
        // console.log(message);
        this.xhr.onreadystatechange = function(){
            if(self.xhr.readyState==4&&self.xhr.status==200){
                // console.log(self.xhr.responseText);
                var response = JSON.parse(self.xhr.responseText);
                for (var i = self.onserverpush.length -1; i>=0; i--){
                    console.log(self.getFirstKey(self.requestdata[i]));
                    self.onserverpush[i](response[self.getFirstKey(self.requestdata[i])]);
                }
                self.open();
            }
            if(self.xhr.status==500)
                self.open();
        };
        this.xhr.open("POST", this.resource, true);
        this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xhr.send(message);
    },
    getFirstKey:function (object) {
        for(var first in object) break
        return object[first];
    }
};