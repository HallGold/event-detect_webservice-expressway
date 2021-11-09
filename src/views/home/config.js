// 浏览器宽高
export const WIDTH = document.documentElement.clientWidth || document.body.clientWidth
export const HEIGHT = document.documentElement.clientHeight || document.body.clientHeight
// API头
export const API_BASEURL = '/tiga-service'
export const API_TIMEOUT = 30000
// 静态目录
export const STATIC_PATH = process.env.NODE_ENV === 'production' ? './static/' : '/static/'
// 附件上传URL
export const FILE_UPLOAD_URL = API_BASEURL + '/tiga/attachment/attachment/merchant/upload'
// UEditor路径
export const UEDITOR_SERVER = API_BASEURL + '/common/ueditor/ueditorUpload.do'
// cookie保存时间（天）
export const COOKIE_EXPIRES = 30
// 后台服务域
export const DOMAIN = 'http://113.62.127.199:8080/'
export const FILE_SERVER = 'http://113.62.127.199:8090/'
// GIS地图瓦片服务
export const MAP_GIS_SERVER = 'http://113.62.127.199:8080/gis-service/gis/'
// 地图文件服务
export const MAP_FILE_SERVER = FILE_SERVER + 'fileUpload/map/'
// Tiga后台服务
export const TIGA_SERVER = DOMAIN + 'tiga-service/tiga/'
// 用户上传的照片服务地址
export const IMG_SERVER = TIGA_SERVER + 'attachment/attachment/get/bytes/img/'
// 用户上传的视频服务地址
export const VIDEO_SERVER = TIGA_SERVER + 'attachment/attachment/get/bytes/video/'
// rtmp服务地址
export const RTMP_SERVER_ADDRESS = 'rtmp://113.62.127.199:1935/hls/'

// 地图服务地址
export const MAP_SERVER = MAP_GIS_SERVER + 'baidu/map/query/tile/'
// 地图类型
export const MAP_TYPE = {
  // 普通地图
  NOMAL: '788865972',
  // 卫星地图
  SATELLITE: '1542757547',
  // 道路
  ROAD: '1447870524'
}

export const IMG_RED = MAP_FILE_SERVER + 'red.png'
export const IMG_GREEN = MAP_FILE_SERVER + 'green.png'
export const IMG_DEFAULT = MAP_FILE_SERVER + 'default.png'
export const IMG_FLAG = MAP_FILE_SERVER + 'flag.svg'
export const IMG_FLAG_BLUE = MAP_FILE_SERVER + 'flag-blue.svg'

export default {
  // 根据状态获取标注文件
  getMarkerFileByStatus (status) {
    switch (status) {
      case '0':
        return IMG_DEFAULT
      case '1':
        return IMG_RED
      case '2':
        return IMG_GREEN
      default:
        return IMG_DEFAULT
    }
  },
  getMapSymbolMarker (symbolId) {
    switch (symbolId) {
      case 0:
        return MAP_FILE_SERVER + 'riskArea.svg'
      case 1:
        return MAP_FILE_SERVER + 'gov.svg'
      case 2:
        return MAP_FILE_SERVER + 'hospital.svg'
      case 3:
        return MAP_FILE_SERVER + 'school.svg'
      case 4:
        return MAP_FILE_SERVER + 'gonganju.svg'
      case 5:
        return MAP_FILE_SERVER + 'gonganting.svg'
      case 6:
        return MAP_FILE_SERVER + 'xiaofangzhan.svg'
      case 7:
        return MAP_FILE_SERVER + 'xiaofangche.svg'
      case 8:
        return MAP_FILE_SERVER + 'wujing.svg'
      case 9:
        return MAP_FILE_SERVER + 'hotel.svg'
      case 10:
        return MAP_FILE_SERVER + 'restaurant.svg'
      case 11:
        return MAP_FILE_SERVER + 'cinema.svg'
      case 12:
        return MAP_FILE_SERVER + 'airport.svg'
      case 13:
        return MAP_FILE_SERVER + 'motorStation.svg'
      case 14:
        return MAP_FILE_SERVER + 'building-big.svg'
      case 15:
        return MAP_FILE_SERVER + 'village.svg'
      case 16:
        return MAP_FILE_SERVER + 'travel.svg'
      case 17:
        return MAP_FILE_SERVER + 'freeway.svg'
      case 18:
        return MAP_FILE_SERVER + 'highway.svg'
      default:
        return MAP_FILE_SERVER + 'mark.svg'
    }
  },
  getMapSymbolMarkerName (symbolId) {
    switch (symbolId) {
      case 0:
        return {
          name: '危险区域',
          icon: 'wb_incandescent'
        }
      case 1:
        return {
          name: '市政府',
          icon: 'stars'
        }
      case 2:
        return {
          name: '医院',
          icon: 'local_hospital'
        }
      case 3:
        return {
          name: '学校',
          icon: 'school'
        }
      case 4:
        return {
          name: '公安局',
          icon: 'security'
        }
      case 5:
        return {
          name: '公安亭',
          icon: 'security'
        }
      case 6:
        return {
          name: '消防站',
          icon: 'domain'
        }
      case 7:
        return {
          name: '消防车',
          icon: 'local_shipping'
        }
      case 8:
        return {
          name: '武警',
          icon: 'security'
        }
      case 9:
        return {
          name: '宾馆',
          icon: 'hotel'
        }
      case 10:
        return {
          name: '饭店',
          icon: 'local_dining'
        }
      case 11:
        return {
          name: '电影院',
          icon: 'local_movies'
        }
      case 12:
        return {
          name: '机场',
          icon: 'local_airport'
        }
      case 13:
        return {
          name: '汽车站',
          icon: 'directions_bus'
        }
      case 14:
        return {
          name: '建筑',
          icon: 'location_city'
        }
      case 15:
        return {
          name: '村庄',
          icon: 'store_mall_directory'
        }
      case 16:
        return {
          name: '旅游地',
          icon: 'card_travel'
        }
      case 17:
        return {
          name: '高速公路',
          icon: 'beenhere'
        }
      case 18:
        return {
          name: '国道',
          icon: 'my_location'
        }
      default:
        return {
          name: '其他',
          icon: 'assistant_photo'
        }
    }
  }
}
