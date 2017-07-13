// const base_url = "/AssWeCan"
// const base_url = "http://116.56.129.93:8088/AssWeCan"
const base_url = 'http://116.56.129.93:8088/AssWeCan/'

const
  GET = "get",
  HEAD = "head",
  DELETE = "delete",
  POST = "post",
  PUT = "put",
  PATCH = "patch"

export default {
  __base_url__: base_url,
// 日志文件管理
  // 原始日志
  "searchRawLog": [GET, "/admin/rawLog/search"],
  "getRawLog": [GET, "/admin/rawLog"],
  "deleteRawLog": [DELETE, "/admin/rawLog/delete"],
  'getRawLogPage': [GET, '/admin/rawLog/page'],
  // 规范化日志
  "searchNormalLog": [GET, "/admin/normalLog/search"],
  "getNormalLog": [GET, "/admin/normalLog"],
  "deleteNormalLog": [DELETE, "/admin/normalLog/delete"],
  'getNormalLogPage': [GET, '/admin/normalLog/page'],
  // 事件日志
  "searchEventLog": [GET, "/admin/eventLog/search"],
  "getEventLog": [GET, "/admin/eventLog"],
  "deleteEventLog": [DELETE, "/admin/eventLog/delete"],
  'getEventLogPage': [GET, '/admin/eventLog/page'],

//  用户系统的接口
  "getAdmin": [GET, '/admin/getAdmin'],
  "logout": [POST,'/admin/logout'],
  "forbidUser": [POST,'/admin/user/forbid'],
  "activeUser": [POST,'/admin/user/active'],
  "deleteUser": [DELETE,'/admin/user/delete'],
  "getUsers": [GET,'/admin/user/'],

  //管理员接口
  "miningMethod": [GET, '/admin/mining/method'],
  "addMining": [POST, '/admin/mining/add'],
  "activeMining": [POST, '/admin/mining/active'],
  "freezeMining": [POST, '/admin/mining/freeze'],
  "deleteMining": [DELETE, '/admin/mining/delete'],

  "mergeMethod": [GET, '/admin/merge/method'],
  "addMerge": [POST, '/admin/merge/add'],
  "activeMerge": [POST, '/admin/merge/active'],
  "freezeMerge": [POST, '/admin/merge/freeze'],
  "deleteMerge": [DELETE, '/admin/merge/delete'],
}
