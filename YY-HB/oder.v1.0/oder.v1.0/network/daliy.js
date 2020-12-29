/* date-fns */
import Vue from 'vue'  
import moment from 'moment'
import {weekGetDate,rkhandleYearWeek} from '../common/util/weekRange.js' 
//-------------------------*****************************

let year = moment().get('year')
let isoWeek = moment().isoWeek();
let isoWeeksInYear = moment().isoWeeksInYear() 
let month = moment().month() + 1 

function handleYear(){	 	
	return year
}

function handleWeek(){ 
	return `${year}${isoWeek}`
} 

function handleWeekofMonth(){
	let mmm = moment().weeks()
	
	return mmm
}

function handleWeeksInYear(){
	return isoWeeksInYear
}

function handleDays(){ 
	let dtime = new Date()
	let year = dtime.getFullYear()
	let month = dtime.getMonth()+1
	let months = parseNumber(month)
	let day = dtime.getDate() 
	if(day > 1){  
		day = day - 1
	}
	return year+'-'+ months+'-'+ parseNumber(day)
} 

function handleWeekDays(){ 
	let dtime = new Date()
	let year = dtime.getFullYear()
	let month = dtime.getMonth()+1
	let months = parseNumber(month)
	let day = dtime.getDate() 
	// console.log(dtime,year,month,months,day)
	// console.log(year+'-'+ months+'-'+ parseNumber(day))
	return year+'-'+ months+'-'+ parseNumber(day)
}

function parseNumber(num) {
	return num < 10 ? "0" + num : num;
}

function handleMonth(){
	return month
}

//********************日期的关键
function m_year_week(rkYear){ 
	let chooesYear = rkYear 
	let week = handleWeeksInYear(); 
	let allweek = []
	//组件本年度的所有周
	for(let i = 1; i <= week; i++){
		let getweek = weekGetDate(chooesYear,i)
		allweek.push(getweek)
	}				
	//过滤日期格式
	let interval = rkhandleYearWeek(allweek)  	
	return interval
}


function m_month_week(rkYear){ 
	let weeks = m_year_week(rkYear)
	let wwweeks = weeks.week
	let nums_month = [] //当前月有几周
	let items = {}	//同一个月份为一组 
	let config = {}  
	
	for(let i in wwweeks){ 
		let iii = wwweeks[i] //一组
		let kkk = iii.slice(0,2) //一组的前两个字符
		
		if(items[kkk]){  //判断这个键值对中有没有这个键
			items[kkk]++;
		}else{
			items[kkk]= 1; 
		} 
		
	} 
	
	//过滤每个月的周数	
	const arr_keys = Object.keys(items).sort();		   	
	for(let i in arr_keys){		 
		let nums_key = arr_keys[i]
		let	nums_val = items[arr_keys[i]]  
		let nums_unit = []
		
		config = {
			nums_key,
			nums_val, 
			nums_unit,
		}
		nums_month.push(config) 
	}  	
	
	  
	var za = 0,zb = 0,zc = 0,zd = 0,ze = 0,zf = 0,zg = 0,zh = 0,zr = 0,zj = 0,zk = 0,zl = 0; 		  
	let a = [],b = [],c = [],d = [],e = [],f = [],g = [],h = [],r = [],j = [],k = [],l = []; 
	
	let result = wwweeks.filter((item)=>{
		let wk_slice = item.slice(0,2)  
		if(wk_slice === "01"){
			a[za++] = item
			nums_month[0].nums_unit = a
		}else if (wk_slice === "02"){ 
			b[zb++] = item
			nums_month[1].nums_unit = b
		}else if (wk_slice === "03"){ 
			c[zc++] = item
			nums_month[2].nums_unit = c			
		}else if (wk_slice === "04"){ 
			d[zd++] = item
			nums_month[3].nums_unit = d			
		}else if (wk_slice === "05"){ 
			e[ze++] = item	
			nums_month[4].nums_unit = e			
		}else if (wk_slice === "06"){ 
			f[zf++] = item
			nums_month[5].nums_unit = f			
		}else if (wk_slice === "07"){ 
			g[zg++] = item
			nums_month[6].nums_unit = g			
		}else if (wk_slice === "08"){ 
			h[zh++] = item
			nums_month[7].nums_unit = h			
		}else if (wk_slice === "09"){ 
			r[zr++] = item
			nums_month[8].nums_unit = r 	 
		}else if (wk_slice === "10"){ 
			j[zj++] = item
			nums_month[9].nums_unit = j 	
		}else if (wk_slice === "11"){ 
			k[zk++] = item
			nums_month[10].nums_unit = k			
		}else if (wk_slice === "12"){ 
			l[zl++] = item
			nums_month[11].nums_unit = l			
		} 
	})  
	
	//赋值输出  	
	return nums_month
	
}

//以年为单位的周区间
function handleWeeksInterval(years){	
	let weeksInterval = ''
	let week = handleWeeksInYear(); 
	let allweek = []
	for(let i = 1; i <= week; i++){
		let getweek = weekGetDate(years,i) 
		allweek.push(getweek)
	} 
	weeksInterval = rkhandleYearWeek(allweek).week 
	return weeksInterval
} 
 

 //-------------------------*****************************
 module.exports =  {
	handleDays:handleDays,
	handleWeekDays:handleWeekDays,
	handleYear:handleYear,
	handleWeek: handleWeek, 
	handleWeekofMonth:handleWeekofMonth,
	handleMonth:handleMonth,
	handleWeeksInYear: handleWeeksInYear, 
	m_month_week:m_month_week,
	handleWeeksInterval,handleWeeksInterval,
 }