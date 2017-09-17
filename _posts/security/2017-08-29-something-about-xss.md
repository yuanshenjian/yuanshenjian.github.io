---
layout: post

title: "XSS的那些事儿"
date: 2017-08-29
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

忙碌的一天过去了，下班后我打开博客，准备写篇*《XSS那些事儿》*。于是乎我偷偷的在内容处写入了以下代码：

```js
<script>alert('I am a xss hacker.')</script>
```

提交发布博客后，我查看网页的博客内容，页面刷新时，就会弹出一个对话框:

![]({{ site.url }}{{ site.img_path }}{{ '/security/something-about-xss-1-alert.jpg' }})

之所以会弹出这个对话框，是因为我刚写在内容中的那行JavaScript代码被执行了（*注入的代码被执行*）。我尝试把这行代码push到GitHub Page博客的Repository上，我就会遇到这种问题。它只是一句简单的警告弹框，用户登录后的网站中嵌入下面代码又会发生什么呢：

```js
<script>
     var cockie = window.cockie; // localStorage, sessionStorage
     // Send cockie|localStorage|sessionStorage information to hacker
</script>
```
如果我访问的博客网站使用了JWT做用户认证，将Token保存在sessionStorage（cookie或 localStorage）中，而我无意间访问了一个包含上述脚本的网页，我的身份认证信息就会被黑客窃取，后续的事情就不得而知了。

---

## XSS家族体系
根据XSS的表现形式和存储形态，XSS主要分为三类`反射性`、`持久型`和`基于DOM`三种类型。而基于DOM型和反射型本质上又是一种类型。

---

### 反射型
XSS攻击最开始出现是在那种服务器负责处理所有数据的网站中。比如一个`Servlet+JSP`的网站，服务器在处理完用户的输入（包含XSS）之后会将结果作为一个页面（包含XSS）返回给用户，XSS就会立即被执行，该类型就是典型的反射型XSS。

反射性是XSS中最基本的攻击，用户输入（包含XSS）通常附加在HTTP查询参数或者表单上，提交请求后，服务器直接返回结果就立即执行执行XSS。

反射型的攻击主要针对个人用户。黑客通常通过邮件发送包含一些看似没有问题的URL（诱饵）给用户，用户点击这些URL后就会跳转到一个隐藏着XSS攻击的网站。

---

### 持久型
我们知道反射型XSS需要使用诱惑用户针对的是个人用户，它的危害和波及范围是可控的。而XSS被持久化到服务器数据库中后，影响范围就不再可控了。来回顾前文获取cookie的XSS脚本：

```js
<script>
     var cockie = window.cockie; // localStorage, sessionStorage
     // Send cockie|localStorage|sessionStorage information to hacker
</script>
```

如果该脚本被作为一篇博客文章的内容被原样持久化到服务器端的数据库中，之后任何用户在浏览该博客文章的时候都会触发浏览器执行该脚本，用户的身份信息便会被盗走。

这种持久化在服务器端的XSS就是一种持久型的XSS攻击，它的影响范围是很广。因为一旦被持久化到服务器，该博客网站的任何用户都有可能遭遇攻击。


---

### 基于DOM
随着Web的发展，页面承载了越来越多的展现逻辑，那么为了提高用户体验，页面的渲染由同步转向异步，架构师开始采用`JavaScript+AJAX`的方案。之后JavaScript就逐渐掌管页面中数据请求和逻辑渲染。

JavaScript同时会处理用户输入并将其渲染出来。如果用户输入包含了XSS，此时XSS会以DOM的形式被执行。而这种XSS攻击我们称之为`基于DOM型`。

基于DOM型是由反射型衍生出来的一种新的类型，不同于反射型的是，后者需要服务器端的反射，而前者不会涉及跟服务器的交互。但它们本质上是一种类型，只是因为系统架构的演变而不得不进行基因变异。


---

## 防御措施
当我们使用cookie的时候，我们要防范CSRF，当我们使用了Token的时候，我们又得防范XSS，有种`Web世界太危险，我要转后端（服务器端）开发`的姿态。不巧的是，恰恰从服务器端去阻止XSS攻击才是有效的途径。

从XSS的家族体系中可以看出XSS其实就是用户输入寄生虫，所以只要能对症下药，正确处理用户输入，就能防御绝大部分XSS攻击，甚至使其无地容身。

---

### 双重校验
对于用户输入，我们始终要保持*怀疑*的态度。要消除这种怀疑，我们要在浏览器端和服务器端做双重严格校验。

在安全架构方面，我们对JavaScript的定位是 *仅用于提高用户体验*。所以浏览器校验只是用来防君子，根本上需要在服务器端搭设一层可靠的防御网。针对双重校验，我们可以的事情主要有：

```
1. 严格控制输入的格式，比如年龄的input中，只允许用户输入数字。 
2. 对数据进行HTMLEncode处理，对URL进行URLEncode。
2. 过滤或移除特殊的HTML标签。例如: <script>, <iframe>, &lt; for <, &gt; for >, &quot for等
3. 过滤JavaScript事件的标签。例如 "onclick=", "onfocus" 等。
```

Web Framework在这方面一般都集成了XSS防御功能，比如Spring Security就提供了配置`http.headers().xssProtection()`的选项。

---

### 主动出击
当我们处在危险境遇，我们总是不应该坐以待毙。我们要提前走一步，做一些主动的安全防御措施是绝对有必要的。比如说引入一些自动化的XSS监测。

我们可以借鉴著名的Netflix的猴子军的思想：

>混乱猴子（Chaos Monkey）负责在一天随机停掉服务器。混乱大猩猩（Chaos Gorilla）负责随机关闭整个可用区（数据中心）。延迟猴子（Latency Monkey）则负责下系统之间注入网络延迟。

Netflix的猴子军的目标是在生产环境的制造故障，来锻炼团队对故障的应对能力。它核心理念：从错误中学习成长。所以我们既然要防御XSS，不妨引入一直注入猴子（Injectiion Monkey），它主要负责向我们的网站中注入类似于一下的XSS：

```js
"/><script>alert(document.cookie)</script><!--
<script>alert(document.cookie)</script><!--
"onclick="alert(document.cookie)
```

---

### 针对性保护
XSS通常会盗用用户身份信息，如果网站使用了Cookie中保存用户Session的机制，则需要将重要的Cookie设置为`httponly`，即不让JavaScript脚本去读取Cooike信息。使用这种机制需要防范CSRF攻击（具体参阅[CSRF那些事儿]({{ site.base_url }}{{ '/something-about-csrf' }})）。如果你的网站使用了Token机制，则需要重点实施上述两条措施。


---

## 参考

- [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

- [Cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)






