
import axios from './service'

export default {
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.admin) {
      const admin = { username, nickname, avatarUrl } = req.session.admin;
      commit('SET_ADMIN', admin)
    }
  },



  async login ({ commit }, { username, password }) {
    return new Promise((resolve,reject)=>{
      let res = axios.post('/api/admin/login', {
        username,
        password
      }).then(res=>{
        let { data } = res
        console.log(res)
        if (!data.ret) commit('SET_ADMIN', data.admin);
      })
    })
  },
}
