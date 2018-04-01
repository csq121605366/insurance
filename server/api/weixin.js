const baseUrl = "https://api.weixin.qq.com/cgi-bin/";

export default {
  accessToken: baseUrl + "token?grant_type=client_credential",
  temporary: {
    upload: baseUrl + "media/upload?",
    fetch: baseUrl + "media/get?"
  },
  permanent: {
    // 新增其他类型素材
    upload: baseUrl + "material/add_material?",
    // 新增图文素材
    uploadNews: baseUrl + "material/add_news?",
    // 上传图文消息内的图片获取URL
    uploadNewsPic: baseUrl + "media/uploadimg?",
    // 获取素材
    fetch: baseUrl + "material/get_material?",
    // 删除永久素材
    del: baseUrl + "material/del_material?",
    // 修改永久图文素材
    update: baseUrl + "material/update_news?",
    // 获取素材总数
    count: baseUrl + "material/get_materialcount?",
    // 获取素材列表
    batch: baseUrl + "material/batchget_material?"
  },
  tags: {
    // 创建标签
    create: baseUrl + "tags/create?",
    // 获取公众号已创建的标签
    fetch: baseUrl + "tags/get?",
    // 编辑标签
    update: baseUrl + "tags/update?",
    // 删除标签
    del: baseUrl + "tags/delete?",
    // 获取标签下粉丝列表
    fetchUsers: baseUrl + "user/tag/get?",
    // 批量为用户打标签
    batchTag: baseUrl + "tags/members/batchtagging?",
    // 批量为用户取消标签
    batchUnTag: baseUrl + "tags/members/batchuntagging?",
    // 获取用户身上的标签列表
    getTagList: baseUrl + "tags/getidlist?"
  },
  user: {
    // 设置用户备注名
    remark: baseUrl + "user/info/updateremark?",
    // 获取用户基本信息（包括UnionID机制）
    info: baseUrl + "user/info?",
    // 批量获取用户基本信息
    batchInfo: baseUrl + "user/info/batchget?",
    // 获取用户列表
    fetchUserList: baseUrl + "user/get?",
    // 获取公众号的黑名单列表
    getBlackList: baseUrl + "tags/members/getblacklist?",
    // 批量拉黑用户
    batchBlackUsers: baseUrl + "tags/members/batchblacklist?",
    // 批量取消拉黑用户
    batchUnBlackUsers: baseUrl + "tags/members/batchunblacklist?"
  },
  menu: {
    // 自定义菜单创建接口
    create: baseUrl + "menu/create?",
    // 自定义菜单查询接口
    get: baseUrl + "menu/get?",
    // 自定义菜单删除接口
    del: baseUrl + "menu/delete?",
    // 创建个性化菜单
    addCondition: baseUrl + "menu/addconditional?",
    // 删除个性化菜单
    delCondition: baseUrl + "menu/delconditional?",
    // 测试个性化菜单匹配结果
    tryCatch: baseUrl + "menu/trymatch?",
    // 获取自定义菜单配置接口
    getCurrentMenuInfo: baseUrl + "get_current_selfmenu_info?"
  },
  ticket: {
    get: baseUrl + "ticket/getticket?"
  }
};
