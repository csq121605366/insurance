
import axios from 'axios'

// 创建axios实例

const service = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  withCredentials: true,
  // 发送请求前处理request的数据
  transformRequest: [function (data) {
    var str = [];
    for (var p in data) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
    }
    return str.join("&");
    return data;
  }
  ]
})

// request拦截器
service
  .interceptors
  .request
  .use(config => {
    // Do something before request is sent if (store.getters['user/token']) {
    // config.headers['X-Token'] = store.getters['user/token'] //
    // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改 }
    return config
  }, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  })

// respone拦截器
service
  .interceptors
  .response
  .use(response => {
    return response.data
  },
    /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
    error => {
      return Promise.reject(error);
    })

export default service