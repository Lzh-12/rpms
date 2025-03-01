// src/utils/request.js
import axios from 'axios';
import { reactive } from 'vue';

// 创建 axios 实例
export const instance = axios.create({
  baseURL: "https://srpms.forye.top",
  // timeout: 5000,
});
export {instance as request}  


axios.defaults.withCredentials = true // 允许跨域携带cookie

// 请求拦截器
instance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  const res = response.data
  console.log(res)
  return response;
}, error => {
  // 对响应错误做点什么
  return Promise.reject(error);
});

//  token信息
export const tokenObj = reactive({
  tokenName:  'satoken',
  tokenValue: '123456'
})

export const sendRequest = async(method, path, data = null, headers = {}) => {
  let rheaders = {...headers}
  rheaders[tokenObj.tokenName] = tokenObj.tokenValue
  console.log("token",tokenObj.tokenName, tokenObj.tokenValue )
  const config = {
      method: method,
      url: path,
      headers: rheaders,
      data: data
  };
  return instance(config).then(response=>{
    return response
  }).catch(error=>{
    return error
  })
}