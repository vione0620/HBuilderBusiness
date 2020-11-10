import ajax from './ajax' 
const BASE_URL = '/anno'
// http://www.yiyichina.cn/

export const getPromote = (key)=> ajax(BASE_URL+`/getPromote?s=${key}`)