---
layout: topic
title: 基于Spring Cloud Contract的契约测试
permalink: /topics/micro-service/service-contract-test/
topic: Micro service
date: 2018-01-25
author: 袁慎建
---

* content
{:toc}

---


Step By Step:

Provider

-  依赖管理
-  编写contract
-  编写和配置测试基类
-  运行通过测试
-  使用Maven publish发布Stub


Consumer

-  依赖管理
-  使用RestTemplate编写测试
-  配置Stub runner
-  运行通过测试


### Provider

添加依赖：

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

ext {
    springCloudVersion = 'Edgware.RELEASE'
    junit5Version = "5.0.2"
    junitVintageVersion = "4.12.3"
    junitPlatformVersion = "1.0.2"
}


dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

dependencies {
    testCompile('com.h2database:h2:1.4.192')
    
    // verifier
    testCompile('org.springframework.cloud:spring-cloud-starter-contract-verifier')

    testCompile("org.junit.jupiter:junit-jupiter-api:${junit5Version}")
    testCompile("org.junit.jupiter:junit-jupiter-params:${junit5Version}")
    testCompile("org.junit.platform:junit-platform-runner:${junitPlatformVersion}")
    testCompile("com.github.sbrannen:spring-test-junit5:${junitPlatformVersion}")

    testRuntime("org.junit.platform:junit-platform-launcher:${junitPlatformVersion}")
    testRuntime("org.junit.jupiter:junit-jupiter-engine:${junit5Version}")
    
    // Make plugin discovery junit 4 based tests
    testRuntime("org.junit.vintage:junit-vintage-engine:${junitVintageVersion}")
}
```

编写测试Contract：

*/src/test/resources/contracts/query_goods_with_ids.groovy*

```
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
        body(
                id   : 1,
                name : "iPhone SE2",
                price: 20.95
        )

    }
}
```

创建测试基类：

*com.thoughtworks.mstorderservice.contract.ContractVerifierBase.java*

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MstGoodsServiceApplication.class)
public class ContractVerifierBase {
    @Autowired
    private GoodsController goodsController;

    @MockBean
    private GoodsService goodsService;

    @Before
    public void setup() throws Exception {
        RestAssuredMockMvc.standaloneSetup(goodsController);
        GoodsDTO goodsDTO = GoodsDTO.builder().id(1).name("iPhone SE2").price(20.95).build();
        Mockito.when(goodsService.getGoods()).thenReturn(Collections.singletonList(goodsDTO));
    }
}
```

指定gradle plugin基类：

*build.gradle*

```groovy
contracts {
    packageWithBaseClasses = 'com.thoughtworks.mstorderservice.contract'
}
```

运行测试

```sh
./gradlew clean test
```

测试通过后，发布stub runner

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

```sh
./gradlew clean publish
```


### Consumer

添加依赖：

*build.gradle*

```groovy
ext {
    springCloudVersion = 'Edgware.RELEASE'
    junit5Version = "5.0.2"
    junitVintageVersion = "4.12.3"
    junitPlatformVersion = "1.0.2"
}


dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

dependencies {
    testCompile("org.junit.jupiter:junit-jupiter-api:${junit5Version}")
    testCompile("org.junit.jupiter:junit-jupiter-params:${junit5Version}")
    testCompile("org.junit.platform:junit-platform-runner:${junitPlatformVersion}")
    testCompile("com.github.sbrannen:spring-test-junit5:${junitPlatformVersion}")
    
    // stub runner 
    testCompile('org.springframework.cloud:spring-cloud-starter-contract-stub-runner')

    testRuntime("org.junit.platform:junit-platform-launcher:${junitPlatformVersion}")
    testRuntime("org.junit.jupiter:junit-jupiter-engine:${junit5Version}")
    
    // Make plugin discovery junit 4 based tests
    testRuntime("org.junit.vintage:junit-vintage-engine:${junitVintageVersion}")
}
```

编写测试：

```java
@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureStubRunner
public class GoodsClientTest {

    @Autowired
    private StubFinder stubFinder;

    @Test
    public void get_person_from_service_contract() {
        int port = stubFinder.findStubUrl("com.thoughtworks", "mst-goods-service").getPort();
        // given:
        RestTemplate restTemplate = new RestTemplate();

        // when:
        ResponseEntity<GoodsDTO> personResponseEntity = restTemplate.getForEntity("http://localhost:"+port+"/api/goods", GoodsDTO.class);

        // then:
        BDDAssertions.then(personResponseEntity.getStatusCodeValue()).isEqualTo(200);
        BDDAssertions.then(personResponseEntity.getBody().getId()).isEqualTo(1l);
        BDDAssertions.then(personResponseEntity.getBody().getName()).isEqualTo("iPhone SE2");
        BDDAssertions.then(personResponseEntity.getBody().getPrice()).isEqualTo(20.95);
    }
}
```

配置stub runner：

```yaml
stubrunner:
  ids:
    - com.thoughtworks:mst-goods-service:0.0.1:8888
  work-offline: true
```

运行测试：

```sh
./gradlew clean test
```


### Extension

#### 集成到Pipeline

1. 如何在Consumer和Provider共享Stub.jar？
2. 如何对stub.jar进行版本管理？


*application-test.yml*

共享stub.jar

```groovy
publishing {
    repositories {
        maven {
            Credentials {
                username "admin"
                password "admin123"
            }
            url = "http://iotrnexus.chinanorth.cloudapp.chinacloudapi.cn:8081/repository/mvnlocal/"
        }
    }
}
```

版本管理：

*build.gradle*

```groovy
publishing {
    publications {
        stubs(MavenPublication) {
            groupId 'com.thoughtworks'
            artifactId "mst-goods-service"
            version '0.0.1-' + System.getProperty('COUNTER')
            artifact verifierStubsJar
        }
    }
}
```



