// API头

export const API_BASEURL = window.config.API_HOST;
export const API_HOST_VIDEO = window.config.API_HOST_VIDEO;
export const API_ONVIF = window.config.API_ONVIF;
export const API_SOCKET = process.env.NODE_ENV === 'production' ? window.config.API_SOCKET : window.config.API_SOCKET_DEV;
export const API_TIMEOUT = 30000;
export const DETAIL_SHOW_PIC_FIRST = window.config.DETAIL_SHOW_PIC_FIRST;
