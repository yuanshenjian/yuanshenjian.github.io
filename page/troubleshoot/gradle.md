---
layout: post
title: Gradle 锦囊
permalink: /troubleshoots/gradle

date: 2017-07-31

---

* content
{:toc}

---

## 如何将集成测试和单元测试定义为不同的Gradle task

##### 更新时间：2017-07-31

#### 问题描述
当集成测试比较耗时的时候，而有时候开发人员只需要单独运行单元测试。

#### 解决方案
```groovy
group 'java8-lambda'
version '1.0-SNAPSHOT'

apply plugin: 'java'

sourceCompatibility = 1.8

repositories {
    mavenCentral()
}

configurations { // 1
    integrationTestCompile.extendsFrom testCompile
    integrationTestRuntime.extendsFrom testRuntime
}

dependencies {
	...
    integrationTestCompile sourceSets.main.output  // 2
    integrationTestCompile sourceSets.test.output  // 3
}


sourceSets {
    integrationTest {  // 4
        java.srcDir file('src/test-integration/java')  // 5
        resources.srcDir file('src/test-integration/resources')  // 6
    }
}

task integrationTest(type: Test) {  // 7
    testClassesDir = sourceSets.integrationTest.output.classesDir
    classpath = sourceSets.integrationTest.runtimeClasspath
}

```

总共有7个地方需要配置：

- 继承`testCompile`和`testCompile`，`integrationTestCompile`中的`integrationTest`是自定义的名称。
- 让`integrationTest`的`Compile`的scope能够访问源码。
- 让`integrationTest`的`Compile`的scope能够访问默认测试目录下的源码。
- 定义一个新的源码集`integrationTest`
- `integrationTest`的源码目录指定为`src/test-integration/java`，需要在src下创建`test-integration/java`目录
- `integrationTest`的资源目录指定为`src/test-integration/resource`，需要在src下创建`test-integration/resource`目录
- 定义一个类型为`Test`的任务。

执行`$ ./gradlew integrationTest`运行integrationTest。

PS：目前不支持JUnit5。


