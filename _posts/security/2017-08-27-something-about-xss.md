---
layout: post

title: "XSS的那些事儿"
date: 2017-09-21
categories: [Security]
tag: [Web, Security, XSS]

author: "袁慎建"


brief: "
作为一枚程序员，你一定经常看到或听到'CSRF'和'XSS'，如果你的主要职责不是网络安全和系统安全，有可能你能够顺溜地喊出CSRF(Cross-site request forgery)和“畸形” XSS(Cross-site scripting)的全称，但对其背后的原理却模棱两可。
<br/><br/>
上一篇文章我们聊过CSRF那些事儿，本文一起再来聊聊XSS的那些事儿。
"

---

* content
{:toc}

---

## XSS是什么
通过上一篇 [*《CSRF那些事儿》*]({{ site.base_url }}{{ '/something-about-csrf' }}) 我们了解了CSRF，为了阻止CSRF攻击，有些团队可能会引入Token机制（比如JWT），而这又带来了另一个安全隐患`XSS`，本文我们来一起聊聊*XSS那些事儿*。


XSS，Cross-site scripting，跨站脚本攻击，为了区分与`CSS`，起名为`XSS`。黑客利用网站的漏洞，通过`代码注入`的方式将一些包含了恶意攻击脚本程序注入到网页中，企图在用户加载网页时执行脚本来实施攻击。脚本程序通常是JavaScript编写，当然还包括Java，VBScript，ActiveX等。常见的攻击手段是获取用户身份认证信息（Cookie，Session）、获取私密网页内容、植入病毒等。


XSS漏洞可以追溯到1990年代。`Twitter`，`Facebook`，`MySpace`，`Orkut` ,`新浪微博`和`百度贴吧`这些网站曾遭受XSS漏洞攻击或被发现此类漏洞。而最近几年XSS升级为最流行的攻击方式，有68%的网站可能遭受此类攻击。根据开放网页应用安全计划（Open Web Application Security Project）公布的2010年统计数据，在Web安全威胁前10位中，XSS排在第2位，仅次于代码注入。

---

## 场景还原

XSS是之所以能成功在于黑客注入的脚本程序在网页上得到执行，那么它是怎么被注入？又是如何被执行的？我们来躺枪一次XSS攻击就知道怎么回事了。

忙碌的一天过去了，下班后我打开博客，准备写篇*《XSS那些事儿》*。于是乎我偷偷的在内容处写入了一下代码：

```js
<script>alert('I am a xss hacker.')</script>
```

提交发布博客后，我查看网页的博客内容，页面刷新时，就会弹出一个对话框:

![]({{ site.url }}{{ site.img_path }}{{ '/security/something-about-xss-1-alert.jpg' }})

之所以会弹出这个对话框，是因为我刚写在内容中的那行JavaScript代码被执行了（*注入的代码被执行*）。我尝试把这行代码push到GitHub Page博客的Repository上，我就会遇到这种问题。它只是一句简单的警告弹框，是想在一个用户登录后的网站中嵌入下面代码呢：

```js
<script>
     var cockie = window.cockie; // localStorage, sessionStorage
     // Send cockie|localStorage|sessionStorage information to hacker
</script>
```
如果我访问的博客网站使用了JWT做用户认证，将Token保存在sessionStorage（cookie或 localStorage）中，而我无意间访问了一个包含上述脚本的网页，我的身份认证信息就会被黑客窃取，后续的事情就不得而知了。

---

## XSS家族体系

### 反射型（非持久型）

---

### 持久型

---

### 基于DOM


*待续*



---

## 防御措施
当我们使用Session的时候，我们要防范CSRF，当我们使用了Token的时候，我们又得防范XSS，Web世界太危险。

---

## 参考

- [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

- [Cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)






