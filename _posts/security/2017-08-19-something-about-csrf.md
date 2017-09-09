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

*为什么会经常听到呢？*

因为互联网时代，即Web+时代，它俩一直是安全话题的主旋律，它们是某些黑客对网站所采取的攻击手段，历史上有一些知名大型网站遭受重创。而近几年，XSS演变成为最流行的攻击方式，存在68%的网站可能会遭受XSS攻击。不发生则以，一发生就不得已。它们作为Web时代的主要威胁，犹如一颗定时炸弹定居在我们身边。

*为什么对原理模棱两可？*

目前流行的Web框架越发地具备让开发人员聚焦在业务逻辑上的能力，一些重要的安全方面的控制，web框架已经帮我们做好了。所以业务程序员（主要编写企业内部系统或用户量不太庞大的系统）很少有机会遇到这些安全问题。然而，时势造英雄，框架程序员和产品程序员（比如京东这种产品）可能就有基于去面临和解决这些问题。

---

## CSRF是什么
CSRF(Cross-site request forgery)，跨站请求伪造。又叫`one-click attack`或`session riding`， 一句话概述该攻击手法：*盗用用户的身份认证信息在用户当前已登录的Web应用程序上执行非用户本意的操作*。

本质上，CSRF是在利用服务器对用户浏览器的信任。它不同于另一种Web攻击手法`XSS`，XSS则利用的是用户对指定网站的*信任*（下一篇文章会介绍）。

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

首先，黑客的请求没有强制用户去做什么，他也没法获取用户从服务器上所获取的信息，他做的事情是向用户所访问的网站域名发出一个`GET`请求，而该请求会自动附上浏览器cookie中的用户身份认证信息（Session未过期），所以服务器认为这是一个认证过的用户请求。更糟糕的是，服务器上没有留下黑客的任何非法攻击痕迹（当然收款方账号可能提供技术之外的脚印），因为服务器认为该请求是我发的。

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
1. 增加额外的用户身份认证机制来加强cookie认证。
2. 控制好技术规范，正确使用Http动作。
3. 摒弃在cookie中保存Session的机制方案，采用token机制，比如JWT。
```

在展开讨论方案之前，我们先来剖析CSRF核心攻击点，找到核心攻击点，方可对症下药，既不会过度防御，也不会存在明显的防御不到位。

用户对系统的使用，无非就是对服务器上的资源的`CRUD`（Create, Retrive, Update, Delete），`R`操作不会涉及到数据的更改，所以服务器要做的是防御好客户端的`CUD`请求。

清楚了CSRF攻击点，我们就可以放行`R`操作，重点防御`CUD`操作。如果你的服务器从伴随请求自动发送的Cookie中提取用户身份信息进行验证（传统的Cookie中保存Session机制），就需要增加除此之外的额外认证。

---

### 基于Http请求动作添加CSRF Token
比较经典的做法是添加一个额外的Token，Token由服务器生成存储起来并返回客户端，客户端在提交`CUD`请求的时候附带Token，服务以后会校验Token是否匹配来达到防御目的。

Spring security默认就启用了CSRF防御机制，如果我们发起的请求(POST, PUT, PATCH, DELETE)中没有携带任何csrf的Token，就会看到如下返回信息：

```json
{
    "timestamp": 1504429723611,
    "status": 403,
    "error": "Forbidden",
    "message": "Invalid CSRF Token 'null' was found on the request parameter '_csrf' or header 'X-CSRF-TOKEN'.",
    "path": "/users"
}
```
从返回的信息中可以看出，Spring security会提取出请求参数中的`_csrf`或Header中的`X-CSRF-TOKEN`的值作为校验Token。


*待续*



## 参考

- [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

- [Cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)





