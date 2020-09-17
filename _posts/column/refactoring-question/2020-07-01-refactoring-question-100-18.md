---
layout: post

title: "你以为只有长得一样的代码才叫重复代码吗？"
date: 2020-07-01
categories: [eXtreme Programming]
tags: [REFACTORING-QUESTION-100]
column: REFACTORING-QUESTION-100
sub-tag: "Code Smell"

author: "袁慎建"

brief: "
百问重构系列问答。
"

---

* content
{:toc}

---

**重复代码是一个代码坏味道**，大部分人对这个结论没有什么争议。如何闻出这个味道？这个还不简单，两段代码长得一样就是重复代码嘛！那除了长得一样的重复，其实还有一些不那么直观的重复。

我罗列出几类主要常见的重复：

1. 实现逻辑的重复
2. 语法语义的重复
3. 功能语义的重复
4. 执行逻辑的重复
5. 配置的重复
6. 邪恶的重复


#### 实现逻辑的重复
```java
    public String to() {
        return "Customer: " +
                toCustomerName.getTitle() + toCustomerName.getFirstName() + " " + toCustomerName.getLastName() +
                System.lineSeparator() +
                "Address: " +
                toAddress.getHouseNumber() + " " +
                toAddress.getStreetAddress() + ", " +
                toAddress.getCity() + ", " +
                toAddress.getProvince() + ", " +
                toAddress.getZipCode() +
                System.lineSeparator() +
                "Tel: " + toTel;
    }

    public String from() {
        return "Customer: " +
                fromCustomerName.getTitle() + fromCustomerName.getFirstName() + " " + fromCustomerName.getLastName() +
                System.lineSeparator() +
                "Address: " +
                fromAddress.getHouseNumber() + " " +
                fromAddress.getStreetAddress() + ", " +
                fromAddress.getCity() + ", " +
                fromAddress.getProvince() + ", " +
                fromAddress.getZipCode() +
                System.lineSeparator() +
                "Tel: " + fromTel;
    }
```
两段代码的实现逻辑看起来一模一样，并且很容易识别，而且现在一些IDE都会自动提示。说到IDE的提示，在编写代码的过程中，**不要放过IDE的任何提示**。当你看到IDE的提示，去看一眼提示信息，很多时候是我们犯了一些小的错误，被侦查出来了，比如拼写错误。确认有些提示你不用理会时，可以针对性的ignore掉（有些洁癖的程序员，能做到零提示）。



#### 语法语义的重复

```java
public  boolean checkIn(String fingerprint){
        Employee employee = EmployeeRepository.query(fingerprint);
        int type = employee.getType();
        String record;
        switch (type) {
            case Employee.ENGINEER:
                record = "I am an Engineer, My Name is" + employee.getName();
                break;
            case Employee.SALESMAN:
                record = "I am a Salesman, My Name is" + employee.getName();
                break;
            case Employee.MANAGER:
                record = "I am a Manager, My Name is" + employee.getName();
                break;
            default:
                record = "";
        }
        if (checkInRecords.isEmpty()) {
            return false;
        }
        checkInRecords.put(fingerprint, record);

        return true;
    }

    public int payAmount() {
        switch (type) {
            case ENGINEER:
                return monthlySalary;
            case SALESMAN:
                return monthlySalary + commission;
            case MANAGER:
                return monthlySalary + bonus;
            default:
                throw new RuntimeException("Invalid employee");
        }
    }
```

两种代码看起来没什么相似度，但实际上是使用了编程语言的不同语法，比如if-else和switch case，这种需要对编程语言机制有一定的了解。**重复的Switch**有时候也是通过switch case和if-else体现出来，要多加留心。

#### 功能语义的重复

```java
    public boolean isValidIp(String ipAddress) {
        if (ipAddress.isEmpty()) {
            return false;
        }
        String regex = "^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
                + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
                + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
                + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$";
        return ipAddress.matches(regex);
    }

    public boolean checkIP(String ipAddress) {
        if (ipAddress.isEmpty()) {
            return false;
        }
        List<String> ipUnits = Arrays.asList(ipAddress.split("."));
        if (ipUnits.size() != 4) {
            return false;
        }
        for (int i = 0; i < 4; ++i) {
            int ipUnitIntValue;
            try {
                ipUnitIntValue = Integer.parseInt(ipUnits.get(i));
            } catch (NumberFormatException e) {
                return false;
            }
            if (ipUnitIntValue < 0 || ipUnitIntValue > 255) {
                return false;
            }
            if (i == 0 && ipUnitIntValue == 0) {
                return false;
            }
        }
        return true;
    }
```

两种代码看起来没什么相似度，但实际上完成的功能是一样的，但实现逻辑看不出明显的联系，而且方法名有一定相似度。这个需要你对代码有一定的敏感度，比如看到类似的方法名或类名的时候，通常通过单元测试来鉴定这种坏味道通常比较靠谱。**异曲同工的类**就属于这种坏味道。

#### 执行逻辑的重复

```java
public class AccountService {
    private AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account login(String email, String password) {
        if (!AccountValidation.isValidEmail(email)) {
            // Throw EmailInvalidException
        }
        Account account = accountRepository.getByEmail(email);
        if (account == null) {
            // Throw AccountNotExistedException
        }
        if (!account.verifyPassword(password)) {
            // Throw PasswordInvalidException
        }
        return account;
    }
}

public class AccountRepository {
    public Account getByEmail(String email) {
        if (!AccountValidation.isValidEmail(email)) {
            // Throw EmailInvalidException
        }
        // Query db to get user by email
        return null;
    }
}
```

重复执行一些判断逻辑，这种在实际项目中很常见，尤其是有些很喜欢防御式编程的程序员，觉得哪一行代码都是不安全的，即便是自己写，在哪里都要做个校验。


#### 配置的重复
```yml
application.yml:

server:
  port: 8000

spring:
  datasource:
    url: jdbc:h2:file:./db/exam_quiz;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS exam_quiz
    platform: h2
    usermane: sa
    password:
    driver-class-name: org.h2.Driver
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    properties:
      hibernate:
        show_sql: true
        use_sql_comments: true
        format_sql: true
    hibernate:
      ddl-auto: validate
  h2:
    console:
      enabled: true
      path: /console
      settings:
        trace: false
        web-allow-others: true

application-dev.yml

spring:
  datasource:
    url: jdbc:h2:file:./db/exam_quiz;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS exam_quiz
    platform: h2
    usermane: sa
    password:
    driver-class-name: org.h2.Driver
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    properties:
      hibernate:
        show_sql: true
        use_sql_comments: true
        format_sql: true
    hibernate:
      ddl-auto: validate

```
如果说Everything as Code，配置代码也算是我们接触较多的代码了。

在开发过程中，你可能需要根据不同环境进行配置管理。上述是一个SpringBoot的代码库配置示例。你需要配置几个application.yml文件区分不同的环境，从而做到很灵活的切换环境。但里面有一些固定的配置信息其实是不因为你在不同环境做改变的，这些信息是否只在基础的配置文件中定义就好？在其他的环境配置文件中，只写你需要定制的配置信息。

要消除这种坏味道，可以借助一些代码校对的工具，同时你要对代码库定期进行修剪，因为在多人协作的代码库，大家都会不断往上加配置，而配置是我们在Code Review容易忽略的一点。

```java
@Data
@Getter
@Setter
@NoArgsConstructor
public class CreateQuizCommand {
    private String teacherId;
    private String question;
    private Integer score;
    private String referenceAnswer;
}
```
还有一种配置的重复发生在一些第三方类库工具中，比如Lombok。你在使用类库中的注解的时候，如果对注解细节不是很了解而的话，很可能就是重复添加注解。比如@Data包含了@Getter和@Setter，@NoArgsContructor是多余的，它跟默认的构造器是重复的。

消除这种坏味道，需要对你使用的类库有清楚的了解，既然用了，你应该有义务去明白它的一些细节，不然稀里糊涂很可能是在挖坑。

#### 邪恶的重复
我把这个定义为邪恶的重复（跟前五种不在一个维度），我要说的是当你为代码写注释的时候。除了必要的注释，大部分无用的注释其实就是糟糕代码的遮羞布，而且它本质上跟代码就是一种重复，并且还有很多人总拿出站不住脚的理由来为这块布涂鸦 -- **代码写得很复杂，写个注释也是为了让别人容易看懂嘛！**

在绝大多数场景下是它很邪恶。为什么说它邪恶？因为当你的代码出现Bug的时候，你改了代码，修复了Bug，然而你可以不用改它，当你把它忽略后，从此它就变得无比邪恶，就像一个小魔鬼一直对路过的人龇牙咧嘴的自我介绍，然而早已**释是码非**了。


[注释]({{ site.url |  append: '/refactoring-question-100-14/' }}) 就是一种这样的坏味道。


你还见过哪些重复呢？所有的重复都是不好的吗？欢迎留言~
