---
layout: post
title: Sonar Get Started
permalink: /get-started/sonar

date: 2018-01-09

---

* content
{:toc}

---

### Prerequisites

- [Sonarqube](https://www.sonarqube.org/downloads/), which is used to setup sonar server.
- [Sonar Scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner), which is used to scan your project and publish the result to the sonar server.
- JDK 8+
- MySQL 5.7+

### Setup sonar server
Firstly, you should download [Sonarqube](https://www.sonarqube.org/downloads/), then unzip them into your user home directory.

- `~/sonarqube-6.7.1`


Now, you can start up sonar server.

```sh
$ cd ~/sonarqube-6.7.1/bin/macosx-universal-64
$ bash sonar.sh start
```

Wait for several seconds, you can visit sonar home page with `http://localhost:9000` in your browser.


***Tips***  
In order to manage sonar server more conveniently, I recommend you to create a soft link to the `~/sonarqube-6.7.1/bin/macosx-universal-64/sonar.sh` file using command: 

```sh
$ ln -s ~/sonarqube-6.7.1/bin/macosx-universal-64/sonar.sh /usr/local/bin/sonar
```

After doing this, you can restart sonar server via command:

```
$ sonar restart
```

---

### Setup sonar scanner
Firstly, you should download [Sonar Scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner), then unzip them into your user home directory.

- `~/sonar-scanner-3.0.3.778-macosx`

To configure scanner, you should edit `~/sonar-scanner-3.0.3.778-macosx/conf/sonar-scanner.properties` file: 

```properties
# sonar server url, you can customize it.
sonar.host.url=http://localhost:9000
sonar.login=admin
sonar.password=admin
```

---

### Scan your project
Once you setup a sonar server on your local machine, and confiure sonar scanner, you can use scanner to scan your project. I will instroduce two approaches to do this stuff.

Firstly, you should create a file named `sonar-project.properties` in your project root.

*sonar-project.properties:*

```properties
# must be unique in a given SonarQube instance
sonar.projectKey=spring-security-jwt
# this is the name displayed in the SonarQube UI
sonar.projectName=spring-security-jwt
sonar.projectVersion=1.0

# Path is relative to the sonar-project.properties file. Replace "\" by "/" on Windows.
# Since SonarQube 4.2, this property is optional if sonar.modules is set.
# If not set, SonarQube starts looking for source code from the directory containing
# the sonar-project.properties file.
sonar.sources=src

# Encoding of the source code. Default is default system encoding
sonar.sourceEncoding=UTF-8

sonar.java.source=1.8

# After sonarqube 4.12, this is required.
sonar.java.binaries=build/classes

```

#### Use sonar scanner(Recommended)
Add the sonar scanner home to system path.

```sh
$ export SONAR_SCANNER_HOME=~/sonar-scanner-3.0.3.778-macosx
$ export PATH=$PATH:$SONAR_SCANNER_HOME/bin
```

Then you can execute command in your project root to scan your project.

```sh
$ sonar-scanner 
```


#### Use gradle plugin
Also, a gradle plugin can be helpful. Just config as follow in `build.gradle` of your project.

```groovy
buildscript {
    repositories {
        mavenCentral()
        
        // Provide maven repository
        maven { url "https://plugins.gradle.org/m2/" }

    }
    dependencies {
    
        // Add dependency
        classpath "org.sonarsource.scanner.gradle:sonarqube-gradle-plugin:2.6.1"
    }
}

apply plugin: 'java'

// Apply sonarqube plugin
apply plugin: 'org.sonarqube'

version = '0.0.1-SNAPSHOT'
sourceCompatibility = 1.8
```

More deatil about sonarqube gradle plugin, please see <https://plugins.gradle.org/plugin/org.sonarqube>

Execute command in your project root to scan your project.

```sh
$ ./gradlew sonarqube
```

Furthermore, you can specify some properties as follow.

```sh
$ ./gradlew sonarqube -Dsonar.host.url=http://localhost:90001
```

---

### Troubleshoots

#### No quality profiles have been found, you probably don't have any language plugin installed

*Solution*

You should put the specific language plugin into `~/sonarqube-6.7.1/extensions/plugins`. Then restart sonar server.

More detail about language plugins, please [Sonar Plugin](https://docs.sonarqube.org/display/PLUG/Plugin+Library).



#### Please provide compiled classes of your project with sonar.java.binaries property

*Solution*

From SonarJava version 4.12 binary files are required for java projects with more than one java file. If not provided properly, analysis will fail with the message

```properties
sonar.java.binaries=build/classes
```

#### Java heap space error or java.lang.OutOfMemoryError

*Solution*

Increase the memory via the `SONAR_SCANNER_OPTS` environment variable.

```sh
$ export SONAR_SCANNER_OPTS="-Xmx512m"
```

---

### Reference

- If you want to specify `sonar-project.properties` file location and use is mutiple module project. Please see [Advanced SonarQube Scanner Usages](https://docs.sonarqube.org/display/SCAN/Advanced+SonarQube+Scanner+Usages).

- Detail about language plugin, please see [Sonar Plugin](https://docs.sonarqube.org/display/PLUG/Plugin+Library).

