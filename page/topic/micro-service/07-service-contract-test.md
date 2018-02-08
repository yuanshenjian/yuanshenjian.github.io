---
layout: topic
title: 基于Spring Cloud Contract的契约测试
permalink: /topics/micro-service/service-contract-test/
topic: Micro service
date: 2018-02-03
author: 袁慎建
---

* content
{:toc}

---

上节课我们使用了 [基于Spring Cloud Config的服务配置中心]({{ site.url }}{{ '/topics/micro-service/service-config-server/' }}) 将应用服务的配置文件进行了统一管理。课程到目前为止，服务注册、服务发现、服务熔断、服务配置管理都已经就绪。

我们知道微服务的一大特性是能独立部署，那么要做到独立部署，就需要保证服务之间的协作的有效性。如何保证？这节课我们引入一种服务之间的契约测试来帮助我们达成这个目标。

本节课主要内容：

- 回答*为什么我们要采用契约测试？*
- 编写契约并测试契约
- 契约测试与CI

---

## 准备工作
在本地准备`mst-user-service`、`mst-order-service`、`mst-goods-service`代码库，从第一节课的User Journey中找一个存在跨服务间调用的请求，这里以Goods和Order为例，如果你的功能代码还没有实现，我们就索性采用TDD的方式来驱动出来。

---

## 为什么要采用契约测试？
作为程序员，我们接触了大量关于测试的代名词：`单元测试`、`Service测试`、`API测试`、`集成测试`、`UI测试`、`E2E测试`、`性能测试`、`安全性测试`、`冒烟测试`、`验收测试`、`回归测试`等等，咋听起来，已经有这么多测试为我们的系统保驾护航，那我们为什么还要引入契约测试呢？请带着这个问题移步到文章 [微服务架构下的测试应对策略]()，阅读文章后，我们进入下一个动手实践环节。

---

## 编写契约并测试契约
[微服务架构下的测试应对策略]() 一文中介绍了两大主流工具：`PACT`和`Spring Cloud Contract`，我们接下来基于Spring Cloud Contract编写Order和Goods的契约测试。

下图阐述了Spring Cloud Contract的工作原理，后续操作都以它为指导：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/spring-cloud-contract.jpg' }})

整个流程按照以下方式进行：

- 在Provider使用groovy DSL编写Contract
- 通过Contract Verifier验证Contract所生成的测试
- 测试通过后将Artifact(stub.jar)发布到Maven仓库中
- 在Consumer端pull下相应的Artifact(stub.jar)
- 运行测试，同时以Artifact作为基础设施启动Stub server
- 在测试中向Stub server发送请求验证API的正确性

### Provider
Goods服务作为Provider，我们从Goods服务开始，以下使我们要在Provider端完成的Tasks：

-  管理依赖
-  编写Contract
-  配置测试基类
-  通过测试
-  发布Artifact


#### 管理依赖
在Provider端，依赖管理稍微会复杂一些，我们要借助`spring-cloud-contract-gradle-plugin`插件来生成测试，并在测试通过后借助`maven-publish`插件来发布Artifact。需要注意的是，代码库中使用了JUnit 5和JUnit 4（Spring Cloud Contract）两个版本的测试，为了让`junit-plaform-plugin`发现生成的契约测试，需要引入`junit-vintage-engine`（关于在JUnit 5中运行老版本测试，请参阅 [JUnit 5用户指南]({{ site.url }}{{ 'junit5/user-guide-cn' }})）

*build.gradle*

```groovy
buildscript {
    ext {
        verifierVersion = '1.2.1.RELEASE'
    }
    dependencies {
        // ...
        classpath "org.springframework.cloud:spring-cloud-contract-gradle-plugin:${verifierVersion}"
        // ...
    }
}

apply plugin: 'spring-cloud-contract'

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:Edgware.RELEASE"
    }
}

dependencies {
    testCompile('org.springframework.boot:spring-boot-starter-test')
    
    // verifier
    testCompile('org.springframework.cloud:spring-cloud-starter-contract-verifier')
    
    // Make plugin discovery junit 4 based tests
    testRuntime("org.junit.vintage:junit-vintage-engine:4.12.3")
}
```

#### 编写Contract
按照Spring Cloud Contract的约定，在`src/test/resources/contracts/`目录下编写第一个Contract。

*src/test/resources/contracts/query\_goods\_with\_ids.groovy*

```groovy
import org.springframework.cloud.contract.spec.Contract

Contract.make {
    description "should return goods with id[1, 2]"

    request {
        url "/api/goods"
        method GET()
    }

    response {
        status 200
        headers {
            contentType applicationJson()
        }
        body '''
            [{
                "id"   : 1,
                "name" : "iPhone SE2",
                "price": 2095
            },
            {
                "id"   : 2,
                "name" : "iPhone X",
                "price": 5095
            }]
        '''
    }
}
```

#### 创建测试基类
给从Contract生成的测试类指定一个基类，我们可以在基类中做一些测试数据准备。

*com.thoughtworks.mstgoodsservice.contract.ContractVerifierBase.java*

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MstGoodsServiceApplication.class)
public class ContractVerifierBase {
    @Autowired
    private GoodsController goodsController;

    @MockBean
    private GoodsService goodsService;

    public void setup() throws Exception {
        RestAssuredMockMvc.standaloneSetup(goodsController);
        GoodsDTO goodsDTO1 = GoodsDTO.builder().id(1).name("iPhone SE2").price(2095).build();
        GoodsDTO goodsDTO2 = GoodsDTO.builder().id(2).name("iPhone X").price(5095).build();
        Mockito.when(goodsService.getGoods()).thenReturn(Arrays.asList(goodsDTO1,goodsDTO2));
    }
}
```

需要在`build.gradle`中指定gradle plugin所使用的基类：

*build.gradle*

```groovy
contracts {
    packageWithBaseClasses = 'com.thoughtworks.mstorderservice.contract'
}
```

#### 通过测试
我们运行测试之前，可以看看根据Contract自动生成的测试类。

```sh
$ ./gradlew generateContractTests
```

会在`build/generated-test-sources/contracts/`目录下生成测试类：

```java
public class ContractVerifierTest extends ContractVerifierBase {
    @Test
    public void validate_query_goods_with_ids() throws Exception {
        // given:
        MockMvcRequestSpecification request = given();

        // when:
        ResponseOptions response = given().spec(request)
                .get("/api/goods");

        // then:
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.header("Content-Type")).matches("application/json.*");
        // and:
        DocumentContext parsedJson = JsonPath.parse(response.getBody().asString());
        assertThatJson(parsedJson).array().contains("['id']").isEqualTo(2);
        assertThatJson(parsedJson).array().contains("['name']").isEqualTo("iPhone X");
        assertThatJson(parsedJson).array().contains("['price']").isEqualTo(5095);
        assertThatJson(parsedJson).array().contains("['id']").isEqualTo(1);
        assertThatJson(parsedJson).array().contains("['name']").isEqualTo("iPhone SE2");
        assertThatJson(parsedJson).array().contains("['price']").isEqualTo(2095);
    }
}
```

运行测试：

```sh
./gradlew clean test
```

#### 发布Artifact
测试通过后，我们需要将生成的`*-stub.jar`发布到Consumer可以获取到的地方，这里我们发布到本地Maven 仓库中。

借助`maven-publish`插件来发布Artifact：

```groovy
apply plugin: 'maven-publish'

publishing {
    publications {
        stubs(MavenPublication) {
            groupId 'com.thoughtworks'
            artifactId "mst-goods-service"
            version '0.0.1'
            artifact verifierStubsJar
        }
    }
    repositories {
        mavenLocal()
    }
}
```

执行`publish`任务发布：

```sh
./gradlew publish
```

---


### Consumer
通过了Provider端的测试，我们就需要进一步在Consumer端验证契约，回到Order服务，以下是我们要在Provider端完成的Tasks：

-  管理依赖
-  测试Contract
-  配置stub runner
-  通过测试


#### 添加依赖
同样我们需要在`mst-order-service`添加相应的依赖。

*build.gradle*

```groovy
dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:Edgware.RELEASE"
    }
}

dependencies {
    // stub runner 
    testCompile('org.springframework.cloud:spring-cloud-starter-contract-stub-runner')

    // Make plugin discovery junit 4 based tests
    testRuntime("org.junit.vintage:junit-vintage-engine:4.12.3")
}
```

#### 测试Contract
这里我们使用`RestTemplate`来发送请求来验证stub runner的返回值，首先需要配置stub runner：

```yaml
stubrunner:
  ids:
    - com.thoughtworks:mst-goods-service:0.0.1:8888
  work-offline: true
```

以上配置`com.thoughtworks:mst-goods-service:0.0.1:8888`代表拉去的是本地Maven仓库中的`com.thoughtworks:mst-goods-service:0.0.1`jar包作为stub runner，runner将运行在`8888`端口。端口号可以不用指定，在测试代码中通过`StubFinder`来获取。

```java
@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureStubRunner
public class GoodsClientTest {
    @Autowired
    private StubFinder stubFinder;
    
    @Test
    public void find_goods() throws IOException {
        int port = stubFinder.findStubUrl("com.thoughtworks", "mst-goods-service").getPort();
        // given:
        RestTemplate restTemplate = new RestTemplate();

        // when:
        ResponseEntity<List> personResponseEntity = restTemplate.getForEntity("http://localhost:" + port + "/api/goods", List.class);
        List<HashMap<String, Object>> responseBody = personResponseEntity.getBody();

        // then:
        BDDAssertions.then(personResponseEntity.getStatusCodeValue()).isEqualTo(200);
        BDDAssertions.then(responseBody.get(0).get("id")).isEqualTo(1);
        BDDAssertions.then(responseBody.get(0).get("name")).isEqualTo("iPhone SE2");
        BDDAssertions.then(responseBody.get(0).get("price")).isEqualTo(2095);

        BDDAssertions.then(responseBody.get(1).get("id")).isEqualTo(2);
        BDDAssertions.then(responseBody.get(1).get("name")).isEqualTo("iPhone X");
        BDDAssertions.then(responseBody.get(1).get("price")).isEqualTo(5095);
    }
}
```


运行测试：

```sh
./gradlew clean test
```

---

## 集成到Pipeline
集成到Pipeline中需要解决下面两个首要问题：

1. 如何在Consumer和Provider共享stub.jar？
2. 如何对stub.jar进行版本管理？


### 共享stub.jar
前文在Consumer和Provider之间共享stub.jar是通过将Artifact发布到本地的Maven仓库中，因为是在本地做测试，这样的方式可以work，但如果Consumer和Provider的测试分别运行在不同的机器上，这是我们就需要一个公共的地方来存储我们的Artiract。

首先在Provider端，需要将Artifact发布到一个公共仓库中：

*build.gradle*

```groovy
publishing {
    repositories {
        maven {
            credentials {
                username "admin"
                password "******"
            }
            url = "http://10.202.129.3:8081/repository/mst-maven/"
        }
    }
}
```

在Consumer端，需要配置stub runner：

*application-test.yml*

```yaml
stubrunner:
  ids:
    - com.thoughtworks:mst-goods-service:0.0.1
  repository-root: http://10.202.129.3:8081/repository/mst-maven-public/
```

### 版本管理
要做到版本管理，这里可以提供一个思路：*将Build号作为Artifact的一部分*。我们可以通过在Provider发布Artifact的时候加上Pipeline的Build号作为标记，在Consumer端根据Build号去拉取对应的stub.jar。

Provider端：

*build.gradle*

```groovy
publishing {
    publications {
        stubs(MavenPublication) {
            groupId 'com.thoughtworks'
            artifactId "mst-goods-service"
            version '0.0.1-' + System.getProperty('BUILD_NUMBER')
            artifact verifierStubsJar
        }
    }
}
```

Consumer端：

*application-test.yml*

```yml
stubrunner:
  ids:
    - com.thoughtworks:mst-goods-service:0.0.1-${BUILD_NUMBER}
  repository-root: http://10.202.129.3:8081/repository/mst-maven-public/
```

进一步思考你会发现一个新的问题：*在Consumer如何知道stub.jar正确的版本？* 如果你的CI工具能够在两个独立的Pipeline中共享环境变量就可以轻易做到，如果不能，我们就需要借助一些手段，比如shell去获取Provider端最新的Build号，然后传递给Consumer。



