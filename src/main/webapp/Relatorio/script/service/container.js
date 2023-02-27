/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

var ServiceContainer = {
    
    xhrSuccess : function() { this.callback.apply(this, this.arguments); },
    xhrError : function() { this.callback.apply(this, this.arguments); },

    GetRelByCat : function(Callback, params){
        var headers = [{label : "token", value : window.localStorage.getItem("token")}];
        this.ServiceRequest(null, headers, 'POST', 'ws/container/public/getRelByCat', Callback, params);
    },

    ServiceRequest : function(data, headers, verb, url, Callback, params){

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.callback = Callback;
        xmlhttp.params = params;
        xmlhttp.onload = this.xhrSuccess;
        xmlhttp.onerror = this.xhrError;

        xmlhttp.open(verb, getFullServiceContext() + url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        
        for(i = 0; i < headers.length; i++){ xmlhttp.setRequestHeader(headers[i].label, headers[i].value); }
        
        xmlhttp.send(data);
    }
};