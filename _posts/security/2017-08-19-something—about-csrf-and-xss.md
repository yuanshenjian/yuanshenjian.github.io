---
layout: post

title: "CSRF 和 XSS的那些事儿"
date: 2017-08-19
categories: [Security]
tag: [Web, Security]

author: "袁慎建"


brief: "
CSRF 和 XSS的那些事儿
"

---

* content
{:toc}

---

## Web安全的主旋律
作为一枚程序员，你一定经常看到或听到`CSRF`和`XSS`，如果你的主要职责不是网络安全和系统安全，你很可能跟我一样，能顺溜地喊出CSRF(Cross-site request forgery)和"*畸形* "XSS(Cross-site scripting)的全称，但对其背后的原理却模棱两可。

*为什么会经常听到呢？*

因为互联网时代，即Web+时代，它俩一直是安全话题的主旋律，它们是某些黑客对网站所采取的攻击手段，历史上有一些知名大型网站遭受重创。而近几年，XSS演变成为最流行的攻击方式，存在68%的网站可能会遭受XSS攻击。不发生则以，一发生就不得已。它们作为Web时代的主要威胁，犹如一颗定时炸弹定居在我们身边。

*为什么对原理模棱两可？*

目前流行的Web框架越发地具备让开发人员聚焦在业务逻辑上的能力，一些重要的安全方面的控制，web框架已经帮我们做好了。所以业务程序员（主要编写企业内部系统或用户量不太庞大的系统）很少有机会遇到这些安全问题。然而，时势造英雄，框架程序员和产品程序员（比如京东这种产品）可能就有基于去面临和解决这些问题。

---

## CSRF是什么
CSRF(Cross-site request forgery)，跨站请求伪造。又叫`one-click attack`或`session riding`， 一句话概述该攻击手法：*盗用用户的身份认证信息在用户当前已登录的Web应用程序上执行非用户本意的操作*。

本质上，CSRF是在利用服务器对用户浏览器的信任，而相比于另一种Web攻击手法`XSS`，XSS则利用的是用户对指定网站的*信任*。

***那么CSRF如何是利用这种信任呢？***

用户登录之后，服务器会将用户身份认证信息（用户Session）保存在用户浏览器的cookie中。如果当前用户没有*登出*，而恰巧又在Session过期之前受到*诱惑*后访问了一个潜伏着CSRF攻击的网站，该网站便会*盗用*用户当前浏览器的cookie来模拟用户想服务器发送请求，执行预谋的操作。

> CSRF基于曹操 *挟天子以令诸侯* 的手段上做了创新：*挟天子以骗诸侯*。

这种*盗用* 需要具备如下前提条件：

```
1. 用户没有登出当前网站，并且当前用户Session未过期。
2. 用户受到的诱惑，真实打开了攻击网站。
```

看起来好像是用户自己挖的坑，纯属 *"自作孽不可活"* 嘛！

而作为一枚高度专业的优秀程序员，我们首先要*尽可能给用户提供友好（傻瓜式）的用户体验。* 有了优秀的用户体验，我们还要*尽最大努力保护我们"傻瓜"用户的权益*。所以我瑾代表程序员建议新人行的小伙伴*追求成为一枚那样的程序员（高度专业 + 敬业）*。




---

## 场景还原


## 防御措施

### 基于Http请求动作添加CSRF Token


### 举例：Spring Security CSRF防护

```json
{
    "timestamp": 1504429723611,
    "status": 403,
    "error": "Forbidden",
    "message": "Invalid CSRF Token 'null' was found on the request parameter '_csrf' or header 'X-CSRF-TOKEN'.",
    "path": "/users"
}
```


*待续*



## 参考

- [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

- [Cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)






