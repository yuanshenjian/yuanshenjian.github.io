---
layout: post

title: "我在E项目上的技术实践"
date: 2016-10-12
categories: [AGILE]
tags: [Agile,ThoughtWorks]

author: "袁慎建"

brief: "我们是一个全功能团队，人人身怀敏捷开发领域的知识和技能，且有一定的经验积累，所以可以说我们天生敏捷，在开发过程中大家都能高效地分工合作。</br></br>

技术栈方面，项目使用的主要技术栈是Python, Django, AngularJs, PostgresSQL, Docker。而我们DEV在进入这个项目之前，擅长的技术栈是Java, Springboot, C#, Android, jQuery。</br></br>

在E项目上，我们把敏捷开发实践落实的非常到位，而本文是E项目使用的技术栈，单独抽取出来做一个简单的总结分享。
"


---

* content
{:toc}

---

>本文以我在[ThoughtWorks](https://thoughtworks.com/)中的E项目经历为依据，介绍项目上的技术实践。
>
>想要学习了解[ThoughtWorks](https://thoughtworks.com/)中的敏捷实践，不要错过 [我在ThoughtWorks中的敏捷实践]({{'/first-impressive-agile-experience-in-thoughtworks/'}}) 这篇文章。



## 项目回顾
如果你已经阅读过 [我在ThoughtWorks中的敏捷实践]({{'/first-impressive-agile-experience-in-thoughtworks/'}})，可以跳过`项目回顾`，直接进入 [技术实践](#section-3)。

---

### 项目背景
E是一个在线的物资跟踪监控系统。由[ThoughtWorks](https://thoughtworks.com/)团队为客户提供的一套完善的软件交付服务。  

该系统为资助物资的跟踪与监控提供了完整的网络解决方案。整个流程涵盖了客户对物资来源的管控、库存管理、物资下发与跟踪、客户u与IP(Implementing Partner，合作伙伴)的协作沟通、IP对运输结果的反馈(生成报告，警告通知，短信互动，邮件通知)，以及IP对物资的二次分发后的记录跟踪与监控。

该项目属于海外独立交付项目，整个开发过程由[ThoughtWorks](https://thoughtworks.com/)团队负责管理。好了，项目信息只能透漏这么多了，不然客户要找我打官司了。

---

### 技术背景
我们是一个全功能团队，人人身怀敏捷开发领域的知识和技能，且有一定的经验积累，所以可以说我们天生敏捷，在开发过程中大家都能高效地分工合作。

再说技术栈，项目使用的主要技术栈是`Python`, `Django`, `AngularJs`, `PostgresSQL`, `Docker`。而我们DEV在进入这个项目之前，擅长的技术栈是`Java`, `Springboot`, `C#`, `Android`, `jQuery`。

---

## 技术实践
由于项目的特殊性，我们接手项目的时候，技术选型都已经定了，好在项目在技术上不算落后，还采取了一些较新的技术。但也有一些坑，比如说使用的[RapidPro](https://community.rapidpro.io/)。

E项目是一个前后端分离的Web项目，相关的技术实践主要涉及到Web Client、Web Server、第三方服务、依赖管理与构建、测试、部署等。

---

### Web Client
Web 客户端采用了Single-page模式，所有的数据都是通过请求后端[RESTful API](http://www.restapitutorial.com/)来获取数据进行渲染。运用了目前较为广泛使用[AngularJS](https://angularjs.org/)框架。同时引入了[BootStrap](http://getbootstrap.com/)，使用[HTML5](http://www.w3schools.com/html/html5_intro.asp)和[CSS3](http://www.w3schools.com/css/css3_intro.asp)（[SASS](http://sass-lang.com/)）。这些都是比较常用的前端技术。

---

### Web Server
服务器端使用[Python](https://www.python.org/)语言开发，应用了[Django](https://www.djangoproject.com/)框架以及[Django REST framework](http://www.django-rest-framework.org/)，搭载了[PostgreSQL](http://www.postgresql.org/)数据库。

另外附加了一个团队开发的内部微服务Contact，该服务不对外暴露端口，只为E系统提供服务。采用了[NodeJS](https://nodejs.org/en/) + [MongoDB](https://www.mongodb.org/)。

>之前一直做Java开发，使用了Python以及Django之后，动态语言在做Web项目的时候效率是非常高的，而Python优美简洁的语法也深得我的喜欢。Django是一个比较流行的全栈Web开发框架（集 持久化，事务，权限，AOP，MVC，模板引擎等 于一身），与Django同类型的有全栈的[Web2py](http://www.web2py.com/)，轻量级的[Flask](http://flask.pocoo.org/)，[等等](https://wiki.python.org/moin/WebFrameworks)。


---

### 第三方服务
在服务器端，为了做一些任务调度的工作以及查询性能优化，使用了一个使用python编写的分布式任务队列工具[Celery](http://www.celeryproject.org/)做任务调度。利用Java编写的实时搜索和分析工具[Elasticsearch](https://www.elastic.co/)来优化数据查询。

系统还集成了客户提供的一个名为VISION的服务，我个人很少涉及VISION，它只是客户那边用来提供生产数据的服务。值得一提的是[RapidPro](http://rapidpro.github.io/rapidpro/)这个系统，它的官方介绍如下：

>RapidPro is an Open Source platform that allows anyone to build interactive messaging systems using an easy visual interface

简单地说就是一个短信信息交互系统，只想用一句话描述：`API真的不好用，不建议使用`。国内很少用这玩意，这里推荐一个产品，我司之前金数据团队开发的[金数据](https://jinshuju.net/)（现在该团队已经被其他公司收购）。

---

### 依赖管理与构建
项目中存在很多依赖的管理，如果人为手工去管理，这几乎是一项浪费时间而又没有任何好处的事情，好在有很多好的包管理工具可用使用。

后端Python使用了[pip](https://pypi.python.org/pypi/pip)。前端则[bower](http://bower.io/)和[npm](https://www.npmjs.com/)管理依赖，使用[grunt](http://gruntjs.com/)作为前端构建工具（现在我司前端工程师更愿意使用[gulp](http://gulpjs.com/)）。

好的工具能让开发事半功倍，所以花些时间去了解这些工具的用法也是有较大价值的。

---

### 测试
前文[TDD](#tdd)以及[CI](#ci)已经强调了测试的重要性。我们同样需要一些测试工具来让我们的测试更加容易的编写和维护。
服务端则使用了Django提供的[TestCase](https://docs.djangoproject.com/ja/1.9/topics/testing/tools/#django.test.TestCase)，用于后端的单元测试和API测试(集成测试)。前端使用[jasmine](http://jasmine.github.io/)配合我司开发的[selenium](http://www.seleniumhq.org/)进行单元测试及E2E测试。


---

### 部署
>好的实践中，部署应该是由[CI](#ci)服务器自动化或一键式进行的。在所有测试通过之后，将要部署的包部署到指定的环境，正常启动所有的服务，并自动化所有过程（一键式需要人为点击后自动化部署）。

我们已经做到了自动化部署，这里有一个加分项，就是我们还是用了容器部署方式，使用了较为流行的[docker](https://www.docker.com/)，这为我们的部署减少了很多工作，以至于我们后期Release期间大家的节奏跟前期没有太大的区别，往不同的国家部署的时候，只用部署构建好的Image，隔离了生产环境的差异性。达到了`Build once, Deploy anywhere`的水平。

---

## 总结
完成一项工作可以有多种不同的技术来实现，技术选型在项目开始阶段非常重要，并不是越流行的技术栈就越好。在选择技术栈的时候，要考虑到的一些因素：

```
1. 核心是能否解决我们的问题，以及解决效率高不高。
2. 该技术是否还在维护中，是否稳定可靠。
3. 团队成员对该技术的熟悉程度，学习成本是不是很高。
```



