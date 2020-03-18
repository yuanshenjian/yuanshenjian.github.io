---
layout: post

title: "使用Raml构建Restful API"
date: 2017-04-02
time: "12:22"
categories: [Web]
tags: [Web Development]

author: "袁慎建"

brief: "
当下微服务架构的流行趋势下，一个项目或多或少被拆成多个小的服务，服务于服务之间主要采取RESTFul API进行通信。而新衍生的问题是：一个开发团队按照服务被分成多个小的Team，如何有效管理服务之间的API契约？</br></br>

Raml为我们提供了解决方案。本文以一个共享图书馆的例子，针对Raml的几大特性，从API的设计、API的构建、API的测试、API的文档化到API的分享来讲解API的使用，并结合容器技术来构建一个API的基础镜像。
"

---

* content
{:toc}

---


>最近加入了一个颇具挑战性的项目（微服务架构+前后端分离部署+容器化部署+单点登录+多系统集成等）。从`微服务`、`容器化`这两个词就能看出，我们Team是比较赶时髦的（PS:当然赶时髦的核心还是业务驱动）。既然是微服务，就避免不了存在众多服务之间的交互，除此之外，前后端分离的架构也促使了我们Team毫不犹豫地选择了`RESTFul`风格的API。

本文重点介绍如何使用Raml来构建RESTful API，从而来提高微服务团队开发人员的合作，涵盖了以下内容：

```
1. 恰到好处的Raml。
2. 十分钟快速上手。
3. 搭建Mock Server。
4. 使用Docker分离数据和构建过程。
```

本文假设读者对RESTful API有一定的基础了解，关于RESTful API，推荐阅读 [阮一峰](http://www.ruanyifeng.com/) 的 [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

---

## 恰到好处的Raml
在前后端分离的架构中，一个经典的优秀实践是`CDCD`（Consumer Driven Contract Development），即消费者驱动合同开发。该实践的两个核心点是：`消费者驱动` + `合同`：

```
1. 消费者驱动。Service所提供的API是给不同的消费者去使用的，所以消费端需要消费什么数据，API就应该返回什么数据。剩下就是合同了，通俗的将就是API契约，
2. 合同。通俗的讲是一个API契约，Service和Consumer（Consumer可以是前端或另一个Service）的API结构需要一个契约来统一管理，这样一来，负责Service和Consumer的开发人员都能参照同一套API契约独立并行开发，双方完成后进行集成联调。
```

优秀的实践（CDCD）总是离不开优秀工具来做支撑，[Raml](http://raml.org) 以及其生态群恰到好处地提供了我们想要的合同功能。[Raml](http://raml.org) 是什么，先看一张官网：

![]({{ site.url }}{{ site.img_path }}{{ '/api/raml.png' }})

`Design`、`Build`、`Test`、`Document`、`Share`，我们选择 [Raml](http://raml.org) ，究根结底也是因为它这几大优秀的特性：

```
1. 设计API。你可以快速的构造你的API，并以人类友好的格式将它呈现出来。它涵盖了一些重要设计的最佳实践，如建模、模式、模板以及代码重用。
2. 构建API。一旦设计好你的API，你就可以借助一些开发工具，将设计好的静态API文档，变成一个服务器端来提供服务。
3. 测试API。引入单元测试可以有效地保证API实现的正确性，你可以通过运行一些脚本来测试你服务端是否涵盖了你设计好的API。
4. 文档化API。Raml可以帮助你脱离同步维护一份额外文档的痛苦。RAML是一门API描述语言，所以你的API一旦被描述，它就是一份现成的API文档。你可以借助一些工具将它生成可视化的文档。
5. 分享以及维护你的API。你可以借助一个基本的JavaScript来生成一些交互式工具（API Consoles或API Nodebooks），这样其他开发者可以使用标准格式与你的维护团队进行交流。
```

接下来，我们主要针对 [Raml](http://raml.org) 的前四个特性进行一个实践尝试。

---

## 窥探Raml

>`共享`俨然成为了一个非常时髦的词汇。共享单车、共享汽车这些产品雨后春笋般的兴起。它们有一个共性：`商家集中提供大规模的服务，用户可以付出极低的价格就可以享用这种服务。`不可否认，这些产品正在促进社会进步（绿色出行），而真的共享了吗？我是持有怀疑态度的...

我们要开发一款产品`共享图书馆`，一句话描述该产品的理念：

```
任何注册用户都可以将自己拥有的图书共享到一个集中的虚拟图书馆，同时可以从这个图书馆中借阅任何图书。
```

产品立项进入了开发期，第一个迭代（敏捷开发的术语，关于敏捷开发推荐阅读 [我在ThoughtWorks的敏捷实践](http://www.infoq.com/cn/articles/my-agile-practice-in-thoughtworks)），团队目标是用户管理的功能。我们将以用户故事的形式展开展开：

**作为管理员，ta可以查阅用户列表:**

```js
/users:
  get:
  description: 查看用户列表
  queryParameters:
    gender:
      description: "性别"
      required: false
      type: string
      pattern: "MALE|FEMALE"
  responses:
    200:
      body:
        application/json:
          example: |
            [
              {
                "id": "2nldksfr4f2ifoa4g43rvfsdfdsfdaf2",
                "account": "sjyuan",
                "phoneNumber": "18192235667",
                "gender": "MALE",
                "name": "袁慎建"
              }
            ]
```
该API表示：操作资源`/users`，`get`表示使用的是HTTP GET方法。`queryParameters`定义了查询参数，`responses`定义了返回值，`example`描述了response body，它是一个JSON数组。

**作为普通用户，ta首先要注册一个账号：**

```js
/users:
  post:
  description: 注册一个新用户
  body:
    application/json:
      schema: |
        {
          "type": "object",
          "$schema": "http://json-schema.org/draft-03/schema",
          "required": true,
          "properties": {
            "account": {
              "type": "string",
              "required": true,
              "minLength": 2,
              "maxLength": 20
            },
            "password": {
              "type": "string",
              "required": true,
              "minLength": 6,
              "maxLength": 32
            },
            "phoneNumber": {
              "type": "string",
              "required": true
            },
            "name": {
              "type": "string",
              "required": false
            }
          }
        }
  responses:
    201:
      body:
        application/json:
          example: |
            {
              "id": "2nldksfr4f2ifoa4g43rvfsdfdsfdaf2",
              "account": "sjyuan",
              "phoneNumber": "18192235667",
              "name": "袁慎建"
            }

```
该API使用了HTTP POST请求，`schema`定义了request body的校验格式。

**作为普通用户，ta可以查看自己的详情：**

```js
/users:
  /{account}:
    get:
    description: 查看给定账户名的用户信息
    responses:
      200:
        body:
          application/json:
            example: |
              [
                {
                  "id": "2nldksfr4f2ifoa4g43rvfsdfdsfdaf2",
                  "account": "sjyuan",
                  "phoneNumber": "18192235667",
                  "gender": "MALE",
                  "name": "袁慎建"
                }
              ]
```
`/{account}`是一个URI参数，传入的是用户的账号。

**作为普通用户，ta可以编辑自己的信息：**

```js
/users:
  /{account}:
    put:
    description: 更新给定账户名的用户信息
    body:
      application/json:
        schema: |
          {
            "type": "object",
            "$schema": "http://json-schema.org/draft-03/schema",
            "required": true,
            "properties": {
              "password": {
                "type": "string",
                "required": true,
                "minLength": 6,
                "maxLength": 32
              },
              "name": {
                "type": "string",
                "required": false
              }
            }
          }
    responses:
      301:
```
更新一个用户信息，我们使用了HTTP POST 请求。

**作为一个管理员，ta可以禁用或删除某些违规操作的用户：**

```js
/users:
  /{account}:
    delete:
      description: 删除给定账户名的用户
      responses:
        204:
```
删除一个用户，我们使用了HTTP DELETE请求。

到此为止，我们完成了简单的User增删改查的API设计。我们只是做一个快速的窥探，真实业务场景中的API远比这要复杂得多，我们会利用`include`来提高代码的复用，而一些Raml的高级特性，诸如：`data type`、`seurity`、`Resource Types`、`Traits`等，也将成为强有力的工具。关于Raml更多详细指南，可参阅： [Raml-spec](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md/)。

完整源代码保存在我的GitHub的 [restful-api-raml](https://github.com/sjyuan-cc/restful-api-raml/tree/for-blog)。


---
## 构建你的API
我们已经完成了API的设计（用户的增删改查），API契约（合同）定好了。前、后端开发人员开始进入开发阶段。

接下来有新的需求：

```
1. API设计好了，如何将其文档化，提供用户有好的阅读格式呢？
2. API设计好，如何搭建基于设计API的Web Server，给前端的集成测试提供支持呢？
```

问题一是前文提到的Raml的一大特性：`文档化API`，问题二就需要我们将设计好API文档转变成一个Web Server，它也是Raml一大特性的体现：`构建API`。我们需要借助一些工具来完成这两件事情。

---

### 文档化API
在Raml官方文档中提及了三种工具，[API Console](https://github.com/mulesoft/api-console)、[RAML to HTML](https://github.com/raml2html/raml2html)、[RAML2HTML for PHP](https://github.com/mikestowe/php-raml2html)，我们将使用 [RAML to HTML](https://github.com/raml2html/raml2html)去做Raml到html的转换，再利用 [Live Server](https://github.com/tapio/live-server) run起一个静态文件服务，提供在浏览器查阅API文档的功能。

在开始之前，我们需要安装 [npm](https://www.npmjs.com/)。使用npm下载依赖，并定义一个任务：

```json
{
  ...
  "dependencies": {
    "raml2html": "^6.1.0",
  }
  "scripts": {
    "docs-generator": "raml2html data/api.raml > api.html"
    "docs-server": "live-server --port=8081 --watch=api.html --entry-file=api.html"
  }
  ...
}
```

docs-generator 任务是用来将raml文档转换成html文档，docs-server 启动了一个轻量的静态文件服务，它可以监听api.html文件的变化（只需要刷新浏览器），运行下面命令：

```sh
$ npm run docs-generator
$ npm run docs-server
```

访问`http://127.0.0.1:8081`之后，可以看到：

![]({{ site.url }}{{ site.img_path }}{{ '/api/raml-api-page.png' }})


---

### 构建API
设计好了User模块的API，也完成了其文档化、可视化的工作，接下来我们要把API`塞入`到一个Web Server中，供前端开发人员在代码中调用（User的增删改查）了。

在 [Raml官方文档中 Build Your API](http://raml.org/developers/build-your-api) 推荐了`NodeJS`、`Java`、`Python`等家族的工具。为了保持一致性，我们会采用`NodeJS`族的 [Osprey](https://github.com/mulesoft/osprey)。这里我们使用了 [osprey-mock-service](https://github.com/mulesoft-labs/osprey-mock-service)，它只是对 `Osprey`进行了一层包装。

同样，我们需要安装osprey-mock-service依赖，并定一个任务：

```json
{
  ...
  "dependencies": {
    "osprey-mock-service": "^0.2.0"
  }

  "scripts": {
    "mock-server": "osprey-mock-service -f data/api.raml -p 8080 --cors"
  }
  ...
}
```

运行mock server，测试添加用户的API:

```sh
$ npm run mock-server
> share-library@1.0.0 mock-server /Users/sjyuan/Personal-sjyuan/ysj_hub/dojo/dojo-springboot/springboot-mongo/dojo-restful-api-raml
> osprey-mock-service -f data/api.raml -p 8080 --cors

Mock service running at http://localhost:8080


$ curl -H "Content-Type: application/json" -X POST -d '{"name":"袁慎建","password":"sjyuan@2017", "phoneNumber":"18192235667", "account":"sjyuan"}' http://localhost:8080/v1/users

{"id":"2nldksfr4f2ifoa4g43rvfsdfdsfdaf2","account":"sjyuan","phoneNumber":"18192235667","gender":"MALE","name":"袁慎建"}
```
---

## 构建与数据分离
目前为止，我们已经完成了API的文档化与构建，构建行为借助了raml生态群中的几款NodeJS插件以及npm工具，这意味着我们如果在自己的机器中构建API必须安装npm以及相关依赖（可能还会牵扯版本的问题）。而对于一个纯粹的Java、Python或C#开发者来说，他们来说是不友好的。为了解决这个问题，我们利用当下流行的容器技术来实现构建行为和数据进行分离，将依赖和构建都封装起来，将使用人员从繁琐的依赖中解脱出来。

[Docker](https://www.docker.com/)可以为我们提供良好的容器封装隔离，让我们来看看封装了构建行为的docker file：

```sh
FROM node:7-alpine
MAINTAINER "Live platform Team" <hw-live@thoughtworks.com>

RUN apk --update add git supervisor && rm -rf /var/cached/apk/*

# Prepare work directory and copy all files
RUN mkdir /app
WORKDIR /app

# install dependencies
COPY package.json /app
RUN cd /app && npm i --silent

COPY supervisord.conf /app
COPY watcher-tasks.js /app
COPY supervisord.conf supervisord.conf

EXPOSE 8080 8081
CMD ["/usr/bin/supervisord"]

```
supervisord.conf是 [supervisord](http://supervisord.org/) 的配置文件，用于管理进程。watcher-tasks.js是自定义的一个JS文件，用于执行npm任务。

---

为了简单起见，我们使用 [docker-compose](https://docs.docker.com/compose/) 来启动容器：

```sh
version: '3'
services:
  raml:
    build: .
    ports:
      - "8088:8080"
      - "8082:8081"
    volumes:
      - ./data:/app/data
```
docker-compose.ymal文件定义了从当前目录中的Dockerfile去构建镜像，通过映射将我们业务api目录挂载到容器内部。

---

做了这些工作，我们可以使用docker-compose来启动容器：

```sh
$ docker-compose up
```
之前我们通过8081和8080来访问API文档和Mock server，使用容器之后，端口分别映射成了8082、8088。

>实践指导：
>可以将构建的镜像上传到一个私有的镜像仓库或者 [Dockerhub](https://hub.docker.com/) 中，在使用的地方将镜像源指向你的镜像所在的仓库即可。

---

## 总结
如今微服务架构模式越发流行，REStful API也充斥在各个开发团队中。Raml的为我们提供了一个很好的API契约管理工具，借助一些插件以及流行的容器化技术（Docker），我们就能够让它发挥更大的价值。

本文所涉及的源代码被host在 [restful-api-raml](https://github.com/sjyuan-cc/restful-api-raml/tree/for-blog)。中，欢迎Clone或Fork。



