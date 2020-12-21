 
 //排序
 function getSortAscii(obj) {
	let arr = new Array();
	let num = 0;
	for (let i in obj) {
		arr[num] = i;
		num++;
	}
	let sortArr = arr.sort();
	// let sortObj = {};    //完成排序值
	let str = ''; //自定义排序字符串
	for (let i in sortArr) {
		str += sortArr[i] + '=' + obj[sortArr[i]] + '&';
		// sortObj[sortArr[i]] = obj[sortArr[i]];
	}
	//去除两侧字符串
	let char = '&'
	str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
 
	return str
	// return sortObj;
 }

//去除空格和换行符
function excludeBlankNewline(param){ 
	let result = param.replace(/\s/g,'')  
	return result  
}

	function parseNumber(num) {
		return num < 10 ? "0" + num : num;
	}				
	function handleDate(){ 
		let dtime = new Date()
		let year = dtime.getFullYear()
		let month = dtime.getMonth()+1
		let months = parseNumber(month)
		let day = dtime.getDate()
		return year+'-'+ months+'-'+ parseNumber(day)
	}  
  
  function handleYesterday(){
  	let today = new Date()
  	let yesterday = new Date((today/1000-86400)*1000)
  	
  	let y_year = yesterday.getFullYear()
  	let y_month = yesterday.getMonth()+1
  	let y_months = parseNumber(y_month)
  	let y_day = yesterday.getDate()
  	return y_year +'-'+ y_months+'-'+ parseNumber(y_day)
  }

 //数组递增去重 arrayExclude
 function arrayExclude(obj){
	 let result = {};
	 let finalResult=[];
	 for(let i in obj){
		result[obj[i].goodsNo] = obj[i]; 
	 } 
	 for(item in result){ 
		if(!result[item].goodsNums == 0){
		 finalResult.push(result[item]);
		} 
	 } 
	 return finalResult;
 }  

//验证支付密码是否连续

function paymentPaswd(paswd){
	var serial = 0; //用于连贯个数的计数
	for(var i = 1; i < paswd.length; i++){
	    let term1 = paswd[i].charCodeAt() - paswd[i-1].charCodeAt() == 1
	    let term2 = paswd[i].charCodeAt() - paswd[i-1].charCodeAt() == -1
	
	    if(term1 ||term2){ //1正序连贯；-1倒序连贯
	        serial += 1; //存在连贯：计数+1
	    }; 
	}
	
	if(serial > (paswd.length - 2)){//连贯总数=字符串长度-2；代表全部连贯
	    // alert("全部连贯"); //结果：ABCDEF全部连贯
		return false 
	}else{
	    //alert("不全部连贯");
		return true
	}
	 
}
 
 
 //格式化周
 function foramtWeek(val){				
 	let v = ''
 	if(val === '1'){
 		v = '一'
 	}else if(val === '2'){
 		v = '二'
 	}else if(val === '3'){
 		v = '三'
 	}else if(val === '4'){
 		v = '四'
 	}else if(val === '5'){
 		v = '五'
 	}else if(val === '6'){
 		v = '六'
 	}else if(val === '7'){
 		v = '日'
 	}
 	return v
 }
 
 
 //格式化数字1-10大写
 function foramtHanzi(val){				
 	let v = ''
 	if(val === '1' || val === '01'){
 		v = '一'
 	}else if(val === '2' || val === '02'){
 		v = '二'
 	}else if(val === '3' || val === '03'){
 		v = '三'
 	}else if(val === '4' || val === '04'){
 		v = '四'
 	}else if(val === '5' || val === '05'){
 		v = '五'
 	}else if(val === '6' || val === '06'){
 		v = '六'
 	}else if(val === '7' || val === '07'){
 		v = '七'
 	}else if(val === '8' || val === '08'){
 		v = '八'
 	}else if(val === '9' || val === '09'){
 		v = '九'
 	}else if(val === '10' || val === '10'){
 		v = '十'
 	}
 	return v
 }
 //格式化月
 function foramtMonth(val){
 	let tv = ''
 	if(val ==='01'){
 		tv = '一月'
 	}else if(val === '02'){
 		tv = '二月'
 	}else if(val === '03'){
 		tv = '三月'
 	}else if(val === '04'){
 		tv = '四月'
 	}else if(val === '05'){
 		tv = '五月'
 	}else if(val === '06'){
 		tv = '六月'
 	}else if(val === '07'){
 		tv = '七月'
 	}else if(val === '08'){
 		tv = '八月'
 	}else if(val === '09'){
 		tv = '九月'
 	}else if(val === '10'){
 		tv = '十月'
 	}else if(val === '11'){
 		tv = '十一月'
 	}else if(val === '12'){
 		tv = '十二月'
 	}
 	return tv
 }
 
 
 //格式化日
 function foramtMonthNums(val){				
	let v = ''
	if(val === '01'){
		v = '一'
	}else if(val === '02'){
		v = '二'
	}else if(val === '03'){
		v = '三'
	}else if(val === '04'){
		v = '四'
	}else if(val === '05'){
		v = '五'
	}else if(val === '06'){
		v = '六'
	}else if(val === '07'){
		v = '七'
	}else if(val === '08'){
		v = '八'
	}else if(val === '09'){
		v = '九'
	}else if(val === '10'){
		v = '十'
	}else if(val === '11'){
		v = '十一'
	}else if(val === '12'){
		v = '十二'
	}
	return v
}
 
 
 module.exports =  {
   getSortAscii: getSortAscii,
   arrayExclude:arrayExclude,  
   handleDate:handleDate,
   handleYesterday:handleYesterday, 
   paymentPaswd:paymentPaswd,
   foramtWeek:foramtWeek, //数字转大写数字
   foramtMonth:foramtMonth,
   foramtMonthNums:foramtMonthNums,
   foramtHanzi:foramtHanzi,
   excludeBlankNewline:excludeBlankNewline,
 }