/*	
	echart 中的基础配置项 option
*/
const config = { 
	grid: {
		left: '5%',
		right: '8%',
		bottom: '5%',
		containLabel: true
	},	
	yAxis: [
		{
			type: 'value',  
			axisLine:{
				lineStyle:{
					color:'#d4d4d4'
				}
			}, 
		}
	],
	mTooltip:{
			trigger: 'axis',
			positionStatus: true,
			formatterStatus: true, 
			formatterUnit: '元',
			formatFloat2: true,
			formatThousands: true
		}, 
	pTooltip: {
			trigger: 'axis',
			positionStatus: true,
			formatterStatus: true, 
			formatterUnit: '人',
			formatFloat2: false,
			formatThousands: true
		},
	
} 

export const INCOMENUMS = {
					notMerge: true, 
					tooltip: config.mTooltip,   
					grid:config.grid, 
					xAxis:[
						{
							type: 'category',
							// data: [0,0,0],
							axisLabel:{
								color:'#999'
							},
							axisLine:{
								show:true,
								lineStyle:{
									color:'#d4d4d4'
								},
							},
							axisTick:{
								show:false									
							}
						}
					],
					yAxis: config.yAxis,
					series: [
						{
							name: '收入',
							type: 'bar',
							label:{
								show:true,
								position:'top',
								color:'#777'
							},
							barMaxWidth:'18%',
							data: [0,0,0], 
							color:'#46B85C' 
						}, 
					]
				}

export const INCOMETREND = {
					notMerge: true, 
					tooltip: config.mTooltip,   
					grid: config.grid, 
					xAxis:[
						{
							type: 'category',
							data: [0,0,0],
							axisLabel:{
								color:'#999'
							},
							axisLine:{
								show:true,
								lineStyle:{
									color:'#d4d4d4'
								},
							},
							//**********
							axisTick:{
								length:2									
							},
						}
					], 
					yAxis: [
						{
							type: 'value', 
							axisLabel:{
								show:true,
								color:'#999'
							},  
							axisLine:{
								lineStyle:{
									color:'#d4d4d4'
								}
							},
							// //**********
							axisTick:{
								show:false									
							},
						}
					],
					series: [
						{
							name: '趋势',
							type: 'bar',
							label:{
								show:true,
								position:'top',
								color:'#777'
							},
							barMaxWidth:'18%',
							data: [0,0,0], 
							color:'#46B85C' 
						}, 
					]
				}
				
export const ACCESSNUMS = {
					notMerge: true, 
					tooltip: config.pTooltip,   
					grid:config.grid, 
					xAxis:[
						{
							type: 'category',
							data: [0,0,0],
							axisLabel:{
								color:'#999'
							},
							axisLine:{
								show:true,
								lineStyle:{
									color:'#d4d4d4'
								},
							},
							//**********
							axisTick:{
								show:false									
							},
						}
					],
					yAxis:config.yAxis,
					series: [
						{
							name: '顾客',
							type: 'bar',
							label:{
								show:true,
								position:'top',
								color:'#777'
							},
							barMaxWidth:'18%',
							data: [0,0,0], 
							color:'#46B85C' 
						}, 
					]
				}				
				
export const ACCESSTREND ={
					notMerge: true, 
					tooltip: config.pTooltip,   
					grid: config.grid, 
					xAxis:[
						{
							type: 'category',
							data: [0,0,0],
							axisLabel:{
								color:'#999'
							},
							axisLine:{
								show:true,
								lineStyle:{
									color:'#d4d4d4'
								},
							},
							// //**********
							axisTick:{
								length:2
							},
						}
					],
					yAxis: [
						{
							type: 'value', 
							axisLabel:{
								show:true,
								color:'#999'
							}, 
							axisLine:{
								lineStyle:{
									color:'#d4d4d4'
								}
							},
							// //**********
							axisTick:{
								show:false									
							},
						}
					],
					series: [
						{
							name: '到店',
							type: 'bar',
							label:{
								show:true,
								position:'top',
								color:'#777'
							},
							barMaxWidth:'18%',
							data: [0,0,0], 
							color:'#46B85C' 
						}, 
					]
				}				
				
				
				
				
				
				