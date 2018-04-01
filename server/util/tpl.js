// 微信消息的回复模板
import template from "art-template";

const tpl = `
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

export default template.compile(tpl);
