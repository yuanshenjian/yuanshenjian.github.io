---
layout: post

title: "CSRF的那些事儿"
date: 2017-08-19
categories: [Security]
tag: [Web, Security, CSRF]

author: "袁慎建"


brief: "
作为一枚程序员，你一定经常看到或听到'CSRF'和'XSS'，如果你的主要职责不是网络安全和系统安全，有可能你能够顺溜地喊出CSRF(Cross-site request forgery)和“畸形” XSS(Cross-site scripting)的全称，但对其背后的原理却模棱两可。
<br/><br/>
本文一起来聊聊CSRF的那些事儿，旨在提高程序员对CSRF的认识，在必要的时候知道如何防御CSRF。
"

---

* content
{:toc}

---

## Web安全的主旋律
作为一枚程序员，你一定经常看到或听到`CSRF`和`XSS`，如果你的主要职责不是网络安全和系统安全，有可能你能够顺溜地喊出CSRF(Cross-site request forgery)和“*畸形* ” XSS(Cross-site scripting)的全称，但对其背后的原理却模棱两可。

![]({{ site.url }}{{ site.img_path }}{{ '/security/something-about-csrf-1-web-security.jpg' }})

*为什么会经常听到呢？*

因为互联网时代，即Web+时代，它俩一直是安全话题的主旋律，它们是某些黑客对网站所采取的攻击手段，历史上有一些知名大型网站遭受重创。而近几年，XSS演变成为最流行的攻击方式，存在68%的网站可能会遭受XSS攻击。不发生则以，一发生就不得已。它们作为Web时代的主要威胁，犹如一颗定时炸弹定居在我们身边。

*为什么对原理模棱两可？*

目前流行的Web框架越发地具备让开发人员聚焦在业务逻辑上的能力，一些重要的安全方面的控制，web框架已经帮我们做好了。所以业务程序员（主要编写企业内部系统或用户量不太庞大的系统）很少有机会遇到这些安全问题。然而，时势造英雄，框架程序员和产品程序员（比如京东这种产品）可能就有基于去面临和解决这些问题。

---

## CSRF是什么
CSRF(Cross-site request forgery)，跨站请求伪造。又叫`one-click attack`或`session riding`， 一句话概述该攻击手法：*盗用用户的身份认证信息在用户当前已登录的Web应用程序上执行非用户本意的操作*。

本质上，CSRF是在利用服务器对用户浏览器的信任。它不同于另一种Web攻击手法`XSS`，XSS则利用的是用户对指定网站的*信任*（下一篇文章会介绍）。

![]({{ site.url }}{{ site.img_path }}{{ '/security/something-about-csrf-2-csrf.jpg' }})

*那么CSRF如何是利用这种信任呢？*

用户登录之后，服务器会将用户身份认证信息（用户Session）保存在用户浏览器的cookie中。如果当前用户没有*登出*，而恰巧又在Session过期之前受到*诱惑*后访问了一个潜伏着CSRF攻击的网站，该网站便会*盗用*用户当前浏览器的cookie来模拟用户想服务器发送请求，执行预谋的操作。

> CSRF基于曹操 `挟天子以令诸侯` 的手段上做了创新：`挟天子以骗诸侯`。

这种*盗用* 能够得逞，需要具备如下前提条件：

```
1. 用户没有登出当前网站，并且当前用户Session未过期。
2. 用户受到的诱惑，真实打开了攻击网站。
```

看起来好像是用户自己挖的坑，纯属 *"自作孽不可活"* 嘛！

而作为一枚高度专业的优秀程序员，我们首先要*尽可能给用户提供友好（傻瓜式）的用户体验。* 具备了优秀的用户体验，我们还要*尽最大努力保护我们"傻瓜"用户的权益*。否则，我们面临用户的流失意味着钱包被人伸手来掏，甚至可能会摊上官司。

>我斗胆代表 [ThoughtWorks](https://www.thoughtworks.com/) 中的程序员劝告新入行的小伙伴在程序员的职业生涯道路上勿忘*追求成为一枚高度专业的优秀程序员*。

了解了CSRF原理之后，或许你还心存疑惑，尤其是程序员新人。接下来我们来模拟出这种遭受CSRF攻击的场景。

---

## 场景还原
下班后，手机没电关机之前的最后一个电话是我一朋友打来借钱的。无奈我只能打开Chrome，访问了某银行网站，好在我成功登录（手机接到验证码后便关机了）。

导航到转账页面，我输入好金额和对方账号，点击提交后，浏览器发起一个请求：

```js
GET https://bank.cn/withdraw?account=sjyuan&amount=5000&for=FriendAccount
```
转账成功后，我开始浏览某论坛。某帖子有一个评论附了一张照片，我好奇地点击了照片，不料中招，链接地址是：

```html
<img src="https://bank.cn/withdraw?account=sjyuan&amount=50000&for=HackerAccount">
```
由于黑客足够黑加上我足够穷，此次转账5W失败（余额不足）。

*你可能会纳闷，为什么这个转账操作会被服务器接受呢？*

首先，黑客没有强制我去做什么，他也没法获取我从服务器上所获取的信息，他做的事情是向我访问的网站域名发出一个`GET`请求，而该请求会自动附上浏览器中该域（bank.cn）对应Cookie中的用户身份认证信息（Session未过期），所以服务器认为这是一个认证过的用户请求。更糟糕的是，服务器上没有留下黑客的任何非法攻击痕迹（当然收款方账号可能留下了技术之外的脚印），因为服务器认为该请求是我发起的。

---

## 防御措施
> 一起作案未遂的转账案件暴露了一个核心的技术问题：**服务器缺乏除了cookie之外的认证机制。**

从用户视角防御CSRF攻击，用户可以做的是提高意识和养成良好的使用习惯：

```
1. 完成操作后，点击网站的登出按钮注销用户Session`
2. 谨慎好奇点击一些来路不明的链接。
```

根本上，我们要从技术上防御CSRF攻击，主要有两个出发点：

```
1. 增加额外的校验机制来加强cookie认证。
2. 控制好技术规范，正确使用HTTP动作。
3. 摒弃检验Cookie中的用户身份信息的机制，采用token，比如JWT。
```

在展开讨论方案之前，我们先来剖析CSRF核心攻击点。用户对系统的使用，无非就是对服务器资源的`CRUD`（Create, Retrive, Update, Delete），由于`R`操作不会涉及到数据的更改，所以服务器要做的是防御客户端的`CUD`请求。而CSRF攻击正是黑客利用用户的Cookie信息伪造用户的`CUD`请求。所以我们要增加黑客无法盗用的东西，比如保存在Cookie之外的Token。

---

### 增加额外的校验机制

关于增加额外的校验机制，经典的做法是基于HTTP请求动作添加CSRF Token，即在`请求参数`或者`Header`中添加额外的Token

服务器首先会生成一个Token保存在Session中，然后返回客户端。客户端在提交`CUD`请求的时候附带Token，服务会从Session中取出Token与请求中的Token进行比对校验。

Spring security默认就启用了CSRF防御机制。如果我们发起的请求(`POST`, `PUT`, `PATCH`, `DELETE`)中没有携带任何CSRF的Token，服务器便会阻止请求：

```json
{
    "timestamp": 1504429723611,
    "status": 403,
    "error": "Forbidden",
    "message": "Invalid CSRF Token 'null' was found on the request parameter '_csrf' or header 'X-CSRF-TOKEN'.",
    "path": "/users"
}
```
从返回的信息中可以得知，Spring security会提取出`请求参数`中的`_csrf`或`Header`中的`X-CSRF-TOKEN`的值作为校验Token。

*怎么附加上这个Token呢？*

Spring thymeleaf Template渲染页面时会自动将`_csrf`放在Form的隐藏域中。如果开发人员自己实现的Token验证机制，需要编写代码来附加上Token，懒一点的程序员会写一个`JavaScript`脚本来添加Token，但要当心非同源（请求地址与服务器不一致）的请求链接。

另一种做法是校验HTTP Header 中的Referer。

根据HTTP协议，在 HTTP Header中有一个字段叫`Referer`，它记录了该HTTP请求的来源地址。那么在转账案件中，黑客模拟我发起转账的请求Header的`Referer`值就不是我所访问的银行网站的域名。服务器便可以拒绝该请求。

然而，这种方案是否可靠取决于浏览器厂商的实现是否安全漏洞，比如IE6(虽然可能已经淘汰)中的`Referer`是可以被篡改的。另外，用户也很可能因为该机制会记录下访问来源而设置浏览器不再提供`Referer`值，这将导致正常的用户请求也会被服务器拒绝。

---

### 正确使用HTTP动作

回到场景还原中的那个转账案件，黑客实际上通过了模拟了一个`GET`请求来请求服务器转账。而在 [RFC 2616](https://tools.ietf.org/html/rfc2616) 中明确指出这是一种非常规的做法：

>In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe". This allows user agents to represent other methods, such as POST, PUT and DELETE, in a special way, so that the user is made aware of the fact that a possibly unsafe action is being requested.

[RFC 2616](https://tools.ietf.org/html/rfc2616) 强调：一个`GET`或`HEAD`请求应该只是在查询服务器资源，它应该是安全的。如果你确实要以特殊的方式实现类似POST, PUT和DELETE的功能，此时你要清楚到这种不安全的操作会带来什么副作用。

所以，我们应该去遵守常规的HTTP规范，尤其当你的团队采用了`RESTful`风格的API，正确地使用HTTP动作，可以减少很多不必要的麻烦。


---

### 采取Token验证机制

既然Cookie会被黑客盗用模拟用户请求，那么我们不在Cookie存储用户身份信息呢？比如说比较流行的JWT（Java Web Token）。用户认证成功后生成一个经过密钥签名的Token，浏览器会将Token保存在Cookie或LocalStorage中，用户之后的请求都会在将Token取出来放在请求`Header`中，服务器校验`Header`中的Token即可完成身份认证。

Token验证能够有效防御CSRF，那么它会面临另一种Web攻击`XSS`。下一篇文章我们一起来聊聊 *XSS的那些事儿*。

---

## 参考

- [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

- [Cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)






