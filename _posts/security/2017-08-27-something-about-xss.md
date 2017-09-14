---
layout: post

title: "XSS的那些事儿"
date: 2017-09-21
categories: [Security]
tag: [Web, Security, XSS]

author: "袁慎建"


brief: "
XSS的那些事儿
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


*待续*



---

## 防御措施


## 参考

- [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

- [Cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)






