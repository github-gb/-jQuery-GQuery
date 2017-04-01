# -jQuery-GQuery
仿照jQuery封装的GQuery实例
在这个GQuery库里边不全，只是添加了一些常用方法，如click(),show(),hide(),index(),eq(),bind()等等。
扩展：
Gquery.prototype.extend = function(name,fn){
    Gquery.prototype[name] = fn;
}
