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

目前流行的Web框架具备让开发人员聚焦在业务逻辑上的能力，一些重要的安全方面的控制，web框架已经帮我们做好了。所以业务程序员（主要编写企业内部系统或用户量不太庞大的系统）很少有机会遇到这些安全问题。然而，时势造英雄，框架程序员和产品程序员（比如京东）可能就有基于去面临和解决这些问题。


## CSRF是什么
CSRF(Cross-site request forgery)，跨站请求伪造。又叫`one-click attack`或`session riding`， 是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法，CSRF 利用的是网站对用户网页浏览器的信任。（相比于另一种Web漏洞`XSS`，XSS 则利用的是用户对指定网站的信任）。




## 如何预防

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






