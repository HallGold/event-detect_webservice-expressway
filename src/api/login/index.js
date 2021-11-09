import Ajax from '@/api/tools/customajax'
import { API_BASEURL, API_TIMEOUT } from '@/utils/config'

export default {
  /**
   * 参数
   * @param {Object} params
   */
  // userLogin(params) {
  //   // const url = '/api/login'
  //   const result = Ajax.post(url, params)
  //   return result
  // },

  userLogout(params) {
   const url = API_BASEURL + '/auth/login/out'
   const result = Ajax.post(url, params)
   return result
 },
}
