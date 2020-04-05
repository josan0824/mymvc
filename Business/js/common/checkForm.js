//判断数组input不为空
function checksArr(arr) {
    let flag = true;
    if(arr.length==0){
        return false;
    }else{
        arr.forEach((item) => {
            if(item.name=='')
                flag = false;
        });
    }
    return flag;
}