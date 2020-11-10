//大小写排序
function caseAscii(obj){
    let arr = new Array()
    let num = 0
    for(let i in obj){
        arr[num] = i
        num++
    }
    let sortArr = arr.sort()
    //拼接qurey 参数
        //自定义排序字符串
        let str = ''
        for(let i in sortArr){
            str += sortArr[i] + '=' + obj[sortArr[i]] + '&'
        }
        //去除两侧字符串
        let char = '&'
        str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$','g'),'')
        
        return str 
}

function parseNumber(num){
    return num < 10 ? '0' + num : num
}

//当前日期2020-10-14 
function handleDate(){
    let dtime = new Date(),
        year = dtime.getFullYear(),
        month = dtime.getMonth()+1,
        months = parseNumber(month),
        day = dtime.getDate();

    return year + '-' + months + '-' + parseNumber(day)
}

//昨天日期格式 2020-10-14
function handleYesterday(){
    let today = new Date(),
        yesterday = new Date((today / 1000 - 86400) * 1000),
        y_year = yesterday.getFullYear(),
        y_month = yesterday.getMonth() +1,
        y_months = parseNumber(y_month),
        y_day = yesterday.getDate();

    return y_year + '-' + y_months + '-' + parseNumber(y_day)
}

//判断连号 ABCDEF || 123456
function paymentPaswd(paswd){
    var serial = 0
    for(var i = 1; i < paswd.length; i++){ 
        let term = paswd[i].charCodeAt() - paswd[i - 1].charCodeAt()
        //1 正序； -1倒序
        if(term===1 || term === -1){
            //连号计数+1
            serial +=1
        }
    }
    if(serial > (paswd.length - 2)){
        //连续
        return false
    }else{
        //非连续
        return true 
    }
}

// 格式化汉字数字1-12
function foramtNumsToHanzi(val) {
    let v = ''
    if(val === '1' || val === '01' || val === 1){
        v = '一'
    }else if(val === '2' || val === '02' || val === 2){
        v = '二'
    }else if(val === '3' || val === '03' || val === 3){
        v = '三'
    }else if(val === '4' || val === '04' || val === 4){
        v = '四'
    }else if(val === '5' || val === '05' || val === 5){
        v = '五'
    }else if(val === '6' || val === '06' || val === 6){
        v = '六'
    }else if(val === '7' || val === '07' || val === 7){
        v = '七'
    }else if(val === '8' || val === '08' || val === 8){
        v = '八'
    }else if(val === '9' || val === '09' || val === 9){
        v = '九'
    }else if(val === '10' || val === '10' || val === 10){
        v = '十'
    }else if(val === '11' || val === '11' || val === 11){
        v = '十一'
    }else if(val === '12' || val === '12' || val === 12){
        v = '十二'
    } 
    return v
}

module.exports = {
    caseAscii:caseAscii,
    parseNumber:parseNumber,
    handleDate:handleDate,
    handleYesterday:handleYesterday,
    paymentPaswd:paymentPaswd,
    foramtNumsToHanzi:foramtNumsToHanzi,
}