# 平台SDK

PPMESSAGE提供了丰富的SDK供开发者选择和使用，平台SDK主要针对PPMESSAGE注册用户的应用系统与PPMESSAGE系统之间的信息传递。

## PPMESSAGE简介

PPMESSAGE是一个即插即用的云客户服务系统。依托其在线云系统，为网站和移动应用提供统一的在线客服系统。PPMESSAGE提供户端嵌入代码、客服座席端应用以及PPMESSAGE平台服务接口。用户端嵌入代码支持 Web，Android，iOS，可以快速集成到网站和手机应用之中；平台服务接口是PPMESSAGE开放的服务的访问最底层协议，使用这些接口可以用来与PPMESSAGE进行深度集成，例如同步用户数据，创建和管理客服分组、获取历史消息等；客服座席端应用由PPMESSAGE单独提供，支持各种PC平台（Windows，Mac OS X，Linux），主流浏览器（IE、Safari、Chrome、Firefox），主流移动操作系统（Android、iOS、Windows Phone）；座席人员通过使用座席客户端进行在线服务。另外通过PPMESSAGE的后台服务管理配置可以管理服务团队的欢迎信息，离线信息，用户端界面风格，消息分流策略等。

## 名词解释
在PPMESSAGE系统及其文档描述中出现以下名词，其所指的含义，这些含义可能与常识不同。为了避免混淆，在这里进行列举并解释。

### 注册用户

在PPMESSAGE官网完成注册流程，即成为PPMESSAGE的注册用户。

### 客服团队

客服团队是由注册用户在注册过程中创建的，其目的是为网站或APP提供在线客服功能。客服团队由管理员和客服共同组成。

### 管理员

管理员是客服团队的管理者。在这里，我们默认PPMESSAGE的注册用户就是客服团队的管理员。

### 客服

客服是由管理员在客服团队中创建的，是客服团队客服工作的主要承担者，其职责是根据管理员的要求做好网站或app的客服工作。

### 用户

即网站或APP的用户，也是客服团队的服务对象（如，某电子商务商城的买家）。用户可以在网站或APP向客服团队咨询问题，然后由客服团队来解答其提出的问题。

### 平台SDK简介

平台SDK是PPMESSAGE开放服务对应的开发接口组成，用来使用PPMESSAGE系统级别开放的功能，例如创建第三方用户，批量导入客服用户，获取历史消息等。一般而言平台SDK应该由PPMESSAGE的注册用户的应用后台使用，在本文档中提供了一些使用方法的模式及其样例。

SDK中所有的接口都是通过HTTPS请求完成。域名是：

```
https://api.ppmessage.com
```

收发的数据都是以JSON格式存储。

### 用户认证

用户认证是验证HTTP请求的合法性，通过设置HTTP HEADER中的`APP-KEY`，`REQUEST-UUID`，`REQUEST-SIGNATURE`来实现。`APP-KEY`, `APP-SECRET`是PPMESSAGE系统赋予每个客服团队的，只有拥有`APP-KEY`和`APP-SECRET`才可以访问PPMESSAGE平台开放的接口。`REQUEST-UUID`是用户端随机生成的一个字符串，生成算法可以参考样例代码，`REQUEST-SIGNATURE`是对`REQUEST-UUID`和`APP-SECRET`连接在一起的哈希。

```
REQUEST-SIGNATURE = hashlib.sha1(APP-SECRET + REQUEST-UUID).hexdigest()
```

## 平台SDK接口

### 创建第三方用户

第三方用户是指PPMESSAGE注册用户的应用中的用户，这些用户信息在用户的应用中创建的同时也可以创建到PPMESSAGE系统之中，这样PPMESSAGE系统的用户端界面和客服界面能够恰当的显示这些用户的信息。

#### 资源地址

```
POST https://api.ppmessage.com/PP_CREATE_USER
```

#### 请求头

字段 | 必选 | 类型 | 说明
---- | --- | --- | ---
Content-Type | 是 | String | 应该填写`application/json;charset=utf-8`
X-App-Key | 是 | String | 你的`appKey`
X-Request-UUID | 是 | String | 随机生成的请求UUID
X-Request-Signature | 是 | String | 根据`X-Request-UUID`生成的值

#### 参数

参数 | 必须 | 类型 | 说明
--- | --- | --- | ---
user_email | 是 | String | 用户的email地址
user_firstname | 是 | String | 用户的名
user_lastname | 是 | String | 用户的姓
user_language | 否 | String | 语言
user_company | 否 | String | 公司
is_service_user | 否 | String | 是否是客服人员

#### 返回值

请求的返回值以JSON字符串形式返回。至少包含error_code和error_string两个域；如果error_code的值不为0，则出错。

```javascript
{
	error_code: 0,
	error_string: "成功执行"
}
```

#### 示例

```bash
curl  -X POST \
        -H 'Content-Type: application/json' \
        -H 'X-App-Key: your-app-key' \
        -H 'X-Request-UUID: your-request-uuid' \
        -H 'X-Request-Signature: your-request-signature' \
        -d '{"user_email": "your_user@some.domain", "user_firstname": "Hello", "user_lastname": "World"}' \
        https://api.ppmessage.com/PP_CREATE_USER
```
