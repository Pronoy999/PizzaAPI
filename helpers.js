const helpers={};
helpers.parseToJSON=function(data){
    let obj = {};
    try {
        obj = JSON.parse(data);
        return obj;
    } catch (e) {
        return {};
    }
};
module.exports=helpers;