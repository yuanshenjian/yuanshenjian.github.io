---
layout: post
title: "手把手搭建CI"
date: 2016-12-29
categories: [CI]
tags: [CI, Jenkins]
author: "袁慎建"

brief: "CI Dojo的第二次课程，本文将基于上次课程 <i>CI基础 & Setup环境</i> 搭建好的环境，通过Step by step的方式来介绍如何快速搭建一个 Jenkins CI pipeline。"

---

* content
{:toc}


---

## 第一个Build
CI Dojo的第二次课程，基于上次课程 [CI基础 & Setup环境]({{'/ci-basics'}}) 搭建好的环境，通过Step by step的方式来搭建一个[Jenkins CI](https://jenkins.io/)。

内容涵盖了两大部分， `配置Jenkins` 和 `Step by step Build`，Jenkins基础配置如下：

```
1. 配置系统环境。
2. 安装系统工具。
3. 安装实用Plugin。
4. 配置用户权限。
```

Step by step Build如下：

```
1. 构建触发策略。
2. 测试Success & Failure。
3. 测试报告。
4. 邮件通知。
```

---

## 配置Jenkins
> 夯实地基，方可建筑高楼

在 [CI基础 & Setup环境]({{'/ci-basics'}}) 那节课程中，我们已经Setup了Jenkins CI，并成功启动了Jenkins服务，此时我们看到的只是一个非常基础的Jenkins，为了满足项目的需求，我们要对其做一些配置。比如邮件通知、用户权限配置，以及执行一些任务所用到的工具([Gradle]()、[Git]()、[JDK]()等）。

---

### 配置系统环境
此时，我们所需要配置的系统环境并不复杂，所有配置都是在`configuration`页面完成，目录导航 `Manage Jenkins -> Configure System`，配置项包括：

```
1. Shell executable
2. E-mail notification
3. System Admin e-mail address
```


#### Shell Shell executable
将此项设置为`bash`，更加符合平时在Terminal上的操作习惯，个人习惯，属于建议项，配置如图：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/shell-executable.png' }})

---

#### E-mail notification
E-mail是一个很好的反馈通知机制，为build配置了Email通知，将会在build失败后第一时间通知相关人员，这也是CI反馈机制中的关键步骤，那么要启用邮件通知，需要我们配置全局的E-mail notification：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/email-notification.png' }})

>这里使用 [网易126邮箱](http://www.126.com/) 的免费 [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) 服务器，需要提供有效的邮箱账户，并且需要开启`IMAP/SMTP服务`，具体怎么开启，[Google](http://www.google.com/) 或者 [百度](https://www.baidu.com/) 中可以找到答案。

配置完成后，可以测试一下是否能够发送邮件，选中`Test configuration by sending test e-mail`，填上有效的邮箱地址，点击`Test configuration`即可，通常情况下，你会看到一些红色的异常信息，不要害怕，继续往 ⬇️ 看。

---

#### System Admin e-mail address
此项配置是为了保证E-mail通知的正常运行，因为Jenkins只允许系统管理员执行Email通知，所以只有系统管理员邮箱地址和发邮件的账户是一个账户是才可以成功发送邮件通知：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/system-admin-email-address.png' }})

---


### 系统工具
全局的系统工具用来执行相关任务，比如Gradle执行编译、测试、打包等任务，Git去pull代码，JDK提供Java执行环境。在Jenkins中，我们可以通过GUI来配置一些基本的工具：`Manage Jenkins->Global Tool Configuration`

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/global-tool-configuration.png' }})

> 实践指导：
> 通常，我们不会在Jenkins Web GUI上配置安装这些工具，需要的工具我们会在Server机器上通过其他方式，比如：我们可以将安装命令放在provision的shell脚本中(可以使用[Ansilbe](https://www.ansible.com/)脚本)，在`Vagrant up`的时候进行自动化安装，此次Dojo我已经在 [Dojo-ci](https://github.com/sjyuan-cc/dojo-ci) 中提供了这个Shell脚本。

---

### 安装插件
>工欲善其事必先利其器

[Jenkins](https://jenkins.io/)之所以强大并不是Jenkins自身有多么的强大，Jenkins提供了一个平台，因为它的易用性和开源，深受社区开发者的青睐，从而营造了一个良好的生态，各种实用插件的应运而生让Jenkins的功能变得越来越强大，几乎无所不能。就连Jenkins久遭诟病的外观，也有一款 [Jenkins主题](http://jenkins-contrib-themes.github.io/jenkins-material-theme/) 插件来拯救它。所以插件是Jenkins中不可忽视的核心部分。

在Jenkins中，安装插件也是一件很容易的事情，导航到Manage Plugins页面(`Manage Jenkins->Manage Plugins`)，在 `Available` Tab中搜索Jenkins，选中后点击安装。

此次Dojo，需要安装以下插件：

* Simple Theme Plugin
	* 支持自定义Jenkins主题，从而美化Jenkins外观。推荐两个好用的主题：
		* [Materia主题](http://jenkins-contrib-themes.github.io/jenkins-material-theme/)
		* [Neo主题](http://aarjithn.github.io/jenkins-neo-theme/)
* Git plugin
	* 使用Git作为版本控制工具
* Environment Injector Plugin
	* 给Build注入环境变量
* Copy Artifact Plugin
	* 在某个project的build步骤中，复制其他project生成的artifact。
* Build Pipeline plugin
	* 通常一个Build flow包含了多个Job，会有多个对应的project，此插件可以定义这些关联的project的执行顺序，并且可以定义触发下游project的条件（自动还是手动）。
* Join plugin
	* 管理并行Job，能够保证当前project在所有直接的下游project完成后运行。
* Build flow test aggregator
	* 将build flow中所有build的测试结果聚合展示出来，它提供的是post-build步骤。
* Dependency Graph Viewer Plugin
	* 可视化project之间的依赖关系
* JaCoCo plugin
	* 可以捕获由JaCoCo生成的代码覆盖率报告，而且会生成覆盖率趋势报告。

---

### 用户权限
Jenkins提供了用户权限控制，这其实是一个基础的配置。通常Jenkins上会包含一些敏感的信息和复杂的配置，以及手动一键部署的步骤，所以我们只允许拥有特定权限的用户才可以对Build执行相关操作，比如说匿名用户只有可读权限，`sjyuan`是管理员权限，`use1`只拥有 `dojo-ci` project的权限。

比较常用的认证方式是`Matrix-based security` 和 `Project-based Matrix Authorization Strategy`，前者配置的权限针对所有Project是一致的，而后者可以将用户权限绑定到某些具体的Project中。相对来说后者更加常用一些，这里以后者为例，`sjyuan`是管理员，在Global配置中分配了所有权限，而`user1`只拥有全局的Read Overall权限（这是前提条件，不然`user1`登陆后什么也看不到）：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/project-based-matrix-authorization.png' }})

此时我们以`sjyuan`登录进去之后在`dojo-ci-web` project中给`user1`授予部分权限：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/enable-project-based-security.png' }})

不管配置哪一种用户权限，我们使用的`Security Realm`都是`Jenkins’ own user database`:

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/access-controll.png' }})

>实践指导：
>第一次配置用户权限时，将当前用户设置为管理员权限，记得赋予admin权限，建议取消`Allow users to sign up`选项，统一由管理员给指定成员分配用户并授权。

---

## Build in Action
基础的Jenkins已经配置就绪，我们来创建一个Build project来感受一下Jenkins的魅力。后面所有工作均可以在Web GUI上完成。

创建一个自由风格的工程，点击Home页面上`New Item`link进入创建页面：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/free-style-project.png' }})

---

### 基础配置

我们创建了一个名为 [dojo-ci-web](https://github.com/sjyuan-cc/dojo-ci-web/) 的project，进入配置界面，来做一些基础的配置：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/basic-config.png' }})

> 1. 上述给user1赋予了该项目上的部分权限。
> 2. 配置历史build的弃留策略。
> 3. 配置了 [Github project的url](https://github.com/sjyuan-cc/dojo-ci-web/)。
> 4. 另外还有一些配置，比如拷贝该项目Artifact的权限、环境准备、参数化项目等等，有兴趣的可以学习一下这些配置的用途，推荐 [Jenkins Tutorial](https://www.tutorialspoint.com/jenkins/index.htm)。

---

### 配置Git Repository
在`Source code management`栏配置Git Repository，需要提供一个[Github](https://github.com/)账号，作为IT从业者，该账号应该不是问题，还没有的话可以到[Github](https://github.com/)上注册一个

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/source-code-management.png' }})

---

### 配置触发构建策略
在`Build Triggers`栏配置触发构建策略：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/build-trigger.png' }})

>Poll SCM，轮询Source Code Management，每个2分钟去检查Repository有没有新的提交，如果有，触发build，否则不做处理。轮询规则设置就是标准的Cron的规则，推荐一个[在线调式的工具](https://crontab.guru/)。

---

### 运行测试
在 `Build` 栏添加build step，`Add build step -> Execute shell`

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/build-step-run-test.png' }})

> `./gradlew clean test` 命令是CI所配置的代码库中运行测试的gradle task，[Gradle](https://gradle.org/)是一个用于Java工程的构建工具，做的事情跟[Maven](https://maven.apache.org/)类似，只是目前更加受到Java Developer的青睐。

到这里我们先做一个保存，点击左下方的`Save`按钮，然后再次进入配置界面。

---

### 发布测试报告
运行测试完毕后，可以直观地看到测试状态 (绿色：成功，红色：失败)，我们还可以在测试报告后发布测试报告，它的配置也很简单，只需要在 `Post-build Actions`栏中添加post-build操作，`Add post-build action->Publish JUnit test result report`：

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/publish-test-report.png' }})

---

### 邮件通知
>CI 不过夜，其实说的是要第一时间修复CI

通常，测试挂了，我们会希望第一时间通知相关人员去修复CI，不要让CI挂了还心安理得地过夜，这就需要一些有效的反馈机制了，此时我们会考虑引入邮件通知，前面我们已经配置好邮件服务器并测试通过了，此时需要添加一个`Post-build Actions`，`Add post-build action->E-mail Notification`:

![]({{ site.url }}{{ site.img_path }}{{ '/dojo/ci/post-action-email-notification.png' }})


到此，一个可以报告测试状态的CI Build搭建起来，过程并不复杂，我们已经能够直观的看到CI的效果了。下一节课我们来讨论构建构建可持续部署Pipeline的策略并加以实践。


上节课内容回顾：[CI基础 & Setup环境]({{'/ci-basics'}})
