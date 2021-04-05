import axios from "axios"; // 引用axios
import config from "@/api/config";
import qs from "qs";

const instance = axios.create({
  baseURL:   process.env.NODE_ENV==='production' ?  config.baseUrl.production: config.baseUrl.dev,
  timeout: 60000,
});
instance.interceptors.request.use(
  function (config) {
   
      config.headers.Authorization = "token "+localStorage.getItem("git_token")
  

    return config;
  },
  function (error) {
    // Do something with request error
    alert("加载超时")
    return Promise.reject(error);
  }

)

instance.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    console.log(error)
    alert("响应错误")
    return Promise.reject(error);
  }
)


//get请求
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    
    instance
      .get(url, {
        params: params,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
//post请求
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
 
    instance.post(url, qs.stringify(data,{arrayFormat:'repeat'})).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
 
    instance.put(url, JSON.stringify(data)).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}