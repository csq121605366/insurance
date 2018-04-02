// 微信消息的回复模板
import template from "art-template";

const wx = `
<xml>
    <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[<%= msgType %>]]></MsgType>
    <% if(msgType==='text') {%>
        <Content><![CDATA[<%- content %>]]></Content>
    <% } else if (msgType==='image') { %>
        <Image>
            <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
        </Image>
    <% } else if (msgType==='voice') { %>
        <Voice>
            <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
        </Voice>
    <% } else if (msgType==='video'||msgType==='shortvideo') { %>
        <Video>
            <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
            <Title><![CDATA[<%= content.title %>]]></Title>
            <Description><![CDATA[<%= content.description %>]]></Description>
        </Video>
    <% } else if (msgType==='music') { %>
        <Music>
            <Title><![CDATA[<%= content.title %>]]></Title>
            <Description><![CDATA[<%= content.description %>]]></Description>
            <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
            <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
            <ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
        </Music>
    <% } else if (msgType==='news') { %>
        <ArticleCount><%= content.length %></ArticleCount>
        <Articles>
        <% content.forEach(item=>{%>
            <item>
                <Title><![CDATA[<%= item.title %>]]></Title> 
                <Description><![CDATA[<%= item.description %>]]></Description>
                <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
                <Url><![CDATA[<%= item.url %>]]></Url>
            </item>
        <% }) %>
        </Articles>
    <% } %>     
</xml>
`;

const email = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{type}}</title>
    <meta charset="utf-8" />
</head>
<body>
    <div class="qmbox qm_con_body_content qqmail_webmail_only" id="mailContentContainer" style="">
        <style type="text/css">.qmbox body{margin:0;padding:0;background:#fff;font-family:"Verdana,Arial,Helvetica,sans-serif";font-size:14px;line-height:24px;}.qmbox div,.qmbox p,.qmbox span,.qmbox img{margin:0;padding:0;}.qmbox img{border:none;}.qmbox .contaner{margin:0 auto;}.qmbox .title{margin:0 auto;background:url() #CCC repeat-x;height:30px;text-align:center;font-weight:bold;padding-top:12px;font-size:16px;}.qmbox .content{margin:4px;}.qmbox .biaoti{padding:6px;color:#000;}.qmbox .xtop,.qmbox .xbottom{display:block;font-size:1px;}.qmbox .xb1,.qmbox .xb2,.qmbox .xb3,.qmbox .xb4{display:block;overflow:hidden;}.qmbox .xb1,.qmbox .xb2,.qmbox .xb3{height:1px;}.qmbox .xb2,.qmbox .xb3,.qmbox .xb4{border-left:1px solid #BCBCBC;border-right:1px solid #BCBCBC;}.qmbox .xb1{margin:0 5px;background:#BCBCBC;}.qmbox .xb2{margin:0 3px;border-width:0 2px;}.qmbox .xb3{margin:0 2px;}.qmbox .xb4{height:2px;margin:0 1px;}.qmbox .xboxcontent{display:block;border:0 solid #BCBCBC;border-width:0 1px;}.qmbox .line{margin-top:6px;border-top:1px dashed #B9B9B9;padding:4px;}.qmbox .neirong{padding:6px;color:#666666;}.qmbox .foot{padding:6px;color:#777;}.qmbox .font_darkblue{color:#006699;font-weight:bold;}.qmbox .font_lightblue{color:#008BD1;font-weight:bold;}.qmbox .font_gray{color:#888;font-size:12px;}</style>
        <div class="contaner">
    <div class="title">{{title}}</div>
    <div class="content">
    <p class="biaoti"><b>亲爱的用户，你好！</b></p>
    <b class="xtop"><b class="xb1"></b><b class="xb2"></b><b class="xb3"></b><b class="xb4"></b></b>
    <div class="xboxcontent">
        <div class="neirong">
    <p><b>请核对你的用户名：</b><span id="userName" class="font_darkblue">{{username}}</span></p>
    <p><b>{{type}}的验证码：</b><span class="font_lightblue"><span id="yzm" data="{{code}}" onclick="return false;" t="7" style="border-bottom: 1px dashed rgb(204, 204, 204); z-index: 1; position: static;">{{code}}</span></span><br><span class="font_gray">(请输入该验证码完成{{type}}，验证码{{time}}分钟内有效！)</span></p>
<div class="line">如果你未申请{{type}}服务，请忽略该邮件。</div></div>
    </div>
    <b class="xbottom"><b class="xb4"></b><b class="xb3"></b><b class="xb2"></b><b class="xb1"></b></b>
</div>
        </div>
        <style type="text/css">.qmbox style, .qmbox script, .qmbox head, .qmbox link, .qmbox meta {display: none !important;}</style>
    </div>
</body>
</html>`



export const eamiltpl = template.compile(email);

export const wxtpl = template.compile(wx);



