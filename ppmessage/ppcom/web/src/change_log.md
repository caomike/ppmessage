# PPCom-Web Change Logs

> version: major.minor.status.revision.

status:

- 0 for alpha
- 1 for beta
- 2 for release candiate
- 3 for (final) release

## `0.1.0.20`:

support `audio`

## `0.1.0.11`:

support `group members`

## `0.1.0.10`:

don't add welcome info on chat box in pc browser

## `0.1.0.9`:

support send message by `WebSocket` directly

## `0.1.0.8`:

begin support `group members` mode

## `0.1.0.4`:

support `LOGOUT` message

## `0.1.0.0`:

- set `to_type` to `AP` when send message

## `0.0.0.30`:

- replace `PP.$` with `$`
- refactor the basic structures of the project

## `0.0.0.29`:

- fix-bug: When try to send a text like `??`, `???`, `???...`, jQuery will throw a parsererror exception
- fix-bug: When click emoji icon if jQuery('textarea').val() is not empty, the rows of textarea calculate error
- fix-bug: Treat http link which contains `|` as a legal url
- change: Preserved whitespace inside text `<div>`
- support: Callback when server internal error happend

## `0.0.0.28`:

- close automatically show hovercard
- fix-bug: message history timestamp show error

## `0.0.0.27`:

- automatically show hoverCard when page load end

## `0.0.0.26`:

- hide emoji icon on Linux platform
- fix-bug: 当网页背景有scrollBar的时候，imageViewer的原图片的偏移位置计算有误
- 调整时间戳的显示策略

## `0.0.0.25`:

- hide `PPMessage` on IE9 (IE9 not support `WebSocket`, `FormData`, `File` API)

## `0.0.0.24`:

- disable body scroll when show ppcom in ios browser
- hide keyboard when click `conversation-content` panel
- CANCEL auto trigger focus event on mobile browser

## `0.0.0.23`:

- support imageViewer

## `0.0.0.22`:

- 调整`发送`按钮的上边距`7.5`->`7.5px`[忘带px了]
- 调整不显示emoji按钮的时候，默认输入框的可输入部分的宽度

## `0.0.0.21`:

- 当用户头像和姓名改变的时候，所有显示该用户头像或者姓名的地方及时得到更新
- 修复bug：`PP.boot()` -> `PP.shutdown()` -> `PP.boot()`，出现两个welcome msg

## `0.0.0.20`:

- 延迟`PP.boot()`成功事件的`callback`调用

## `0.0.0.19`:

- 翻译消息发送失败之后的提示信息
- 发送大文本遇到服务器错误之后的失败回调
- 调整`用户文件消息`在IE上显示错位的状况
- 验证`window.ppSettings`邮箱的格式是否正确

## `0.0.0.18`:

- fix-bug: When send message finished, should add the message-id to the `chatMessageIdsArray` again to prevent generate duplicate message historys;

## `0.0.0.17`:

- getUserUUID add `user_fullname` param
- reWrite `notification.js`
- update local user info when user info has changed

## `0.0.0.16`:

- Refactor and delete some un use code
- Fix bug: `PP.update()` forget pass `ppSettings` params to `PP.Servcice.$publicApi.update(ppSettings)`

## `0.0.0.15`:

- 拆分`pp-service-messagesender.js`

## `0.0.0.14`:

- IE8或以下版本不加载

## `0.0.0.13`:

- 修复bug：在手机端发送消息按回车键和发送按钮之后，发送按钮没有变成disable状态的问题
- 修改：在手机端聊天框的提示语：空
- 修复bug：下载文件以`fileName`命名文件名称，而不是`fileId`
- 修改：调整在手机端 conversation-content 的 bottom: 86px --> 56px (因为隐藏了poweredby:30px)
- 修改：调整在手机端 pull2refresh 的默认触发 refresh 事件的拉动高度：70像素
- 修复bug: 在手机端点击`发送`按钮的时候，保持`聊天框`不失去焦点

## `0.0.0.12`:

- 在手机端隐藏`poweredBy`
- 在手机端调整聊天框的宽度为100%
- 改变下拉加载历史消息的触发时间

## `0.0.0.11`:

- 手机上支持下拉加载历史消息

## `0.0.0.10`:

- 点击加载历史消息

## `0.0.0.9`:

- `getUnAckedMessage`的时候检查response.message为空，然而response.list却不为空的情况
- 拆分`pp-message.js`

## `0.0.0.8`:

- 修复bug: 历史记录顺序相反的问题
- 修复bug: 发送消息，在构建消息体的时候，`device_uuid` 依旧使用的是 `user_uuid` 的问题

## `0.0.0.7`:

- support
```
window.ppSettings = {
    user_icon: 'http://xxx.com/image.png'
}
```
- support boot PPCom with callback

## `0.0.0.6`:

- support
```
window.ppSettings = {
    user_name: xxx
}
```
- change default language to zh-CN

## `0.0.0.5`:

- 支持
```
window.ppSettings = {
    view: {
        launcher_bottom_margin: "20px",
        launcher_right_margin: "60px",
        launcher_is_show: true
    }
};
```

## `0.0.0.4`:

- 增加 HoverCard
- 更换欢迎信息为 HoverCard 的信息
- 初始化的时候不再拿历史消息，当 scroll 到顶部的时候，还是会尝试去拿的

## `0.0.0.3`: issue528:25740442

- 修复Bug：emoji和fileSelector图片css在某些网站上排版有误的问题

## `0.0.0.2`: issue528:df3bc89d

- 手机上显示发送按钮

## `0.0.0.1`: issue528:41672f9a3

- 聊天消息客服带有姓名
- 聊天窗口标题栏显示公司名
