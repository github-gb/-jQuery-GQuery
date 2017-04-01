/**
 * Created by goobo on 2017/3/31.
 */
//选择器 封装
function myAddEvent(obj,sEv,fn){
    if(obj.attachEvent){
        obj.attachEvent("on"+sEv,function(){
            if(false == fn.call(obj)){
                return false;
            };
        });
    }else {
        obj.addEventListener(sEv,function(ev){
            if(false == fn.call(obj)){
                return ev.preventDefault();
            }
        },false);
    }
}

function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj,false)[attr];
    }
}

function getByClass(oParent,sClass){
    var aEle = oParent.getElementsByTagName("*");
    var aResult = [];
    var i = 0;
    for(i=0;i<aEle.length;i++){
        if(aEle[i].className==sClass){
            aResult.push(aEle[i])
        }
    }
    return aResult;
}

function Gquery(gArg){
    //用来存放选中的元素
    this.elements = [];
    switch (typeof gArg){
        case 'function':
            myAddEvent(window,'load',gArg);
            break;
        case 'string':
            switch (gArg.charAt(0)){
                case '#': //ID
                    var obj = document.getElementById(gArg.substring(1));
                    this.elements.push(obj);
                    break;
                case '.': //class
                    this.elements = getByClass(document,gArg.substring(1));
                    break;
                default : //tagName
                    this.elements = document.getElementsByTagName(gArg);
            }
            break;
        case 'object':
            this.elements.push(gArg);
            break;
    }
}

Gquery.prototype.click = function(fn){
    var i = 0;
    for(i=0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],'click',fn);
    }
    return this;
}

Gquery.prototype.show = function(){
    var i = 0;
    for(i=0;i<this.elements.length;i++){
        this.elements[i].style.display = "block";
    }
    return this;
}

Gquery.prototype.hide = function(){
    var i = 0;
    for(i=0;i<this.elements.length;i++){
        this.elements[i].style.display = "none";
    }
    return this;
}

Gquery.prototype.hover = function(fnOver,fnOut){
    var i = 0;
    for(i=0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],'mouseover',fnOver);
        myAddEvent(this.elements[i],'mouseout',fnOut);
    }
    return this;
}

Gquery.prototype.toggle = function(){
    var i = 0;
    var _arguments = arguments;
    for(i=0;i<this.elements.length;i++){
        addToggle(this.elements[i]);
    }

    function addToggle(obj){
        var count = 0;
        myAddEvent(obj,"click",function(){
            _arguments[count++%_arguments.length].call(obj);
        })
    }
    return this;
}

Gquery.prototype.css = function(attr,value){
    if(arguments.length == 2){   //设置样式
        var i = 0;
        for(i=0;i<this.elements.length;i++){
            this.elements[i].style[attr] = value;
        }
    } else {
        if(typeof attr == 'string'){
            //获得值
            return getStyle(this.elements[0],attr);
        }else{
            for(var i =0; i<this.elements.length; i++){
                var k = '';
                for(k in attr){
                    this.elements[i].style[k] = attr[k];
                }
            }
        }
    }
    return this;
}

Gquery.prototype.attr = function(attr,value){
    if(arguments.length == 2){
        var i = 0;
        for(i=0;i<this.elements.length;i++){
            this.elements[i][attr] = value;
        }
    }else{
        return this.elements[0][attr];
    }
    return this;
}

Gquery.prototype.eq = function(n){
    return G(this.elements[n]);
}

Gquery.prototype.find = function(str){

    function appendArr(arr1,arr2){
        var i = 0;
        for(i=0;i<arr2.length;i++){
            arr1.push(arr2[i]);
        }
    }

    var i = 0;
    var aResult = [];
    for(i=0;i<this.elements.length;i++){
        switch (str.charAt(0)){
            case ".":  //class
                var aEle = getByClass(this.elements[i],str.substring(1))
                aResult = aResult.concat(aEle);
                break;
            default :  //tagName
                var aEle  = this.elements[i].getElementsByTagName(str);
                //aResult = aResult.concat(aEle);  //bug版
                appendArr(aResult,aEle);  //改进版
        }
    }
    var newGquery = G();
    newGquery.elements = aResult;
    return newGquery;
}

Gquery.prototype.index = function(){

    function getIndex(obj){
        var aBrother = obj.parentNode.children;
        var i = 0;

        for(i= 0; i<aBrother.length; i++){
            if(aBrother[i]==obj){
                return i;
            }
        }
    }

    return getIndex(this.elements[0]);
}

Gquery.prototype.bind = function(){
    var i = 0;
    for(i =0; i<this.elements.length; i++){
        myAddEvent(this.elements[i],sEv,fn)
    }
}

Gquery.prototype.extend = function(name,fn){
    Gquery.prototype[name] = fn;
}

function G(gArg){
    return new Gquery(gArg);
}
