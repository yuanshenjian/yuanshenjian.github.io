---
layout: post

title: "QA in Production"
date: 2020-09-23
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "

"


---

* content
{:toc}

Gathering operational data about a system is common practice, particularly metrics that indicate system load and performance such as CPU and memory usage. This data has been used for years to help teams who support a system learn when an outage is happening or imminent. When things become slow, a code profiler might be enabled in order to determine which part of the system is causing a bottleneck, for example a slow-running database query.

收集系统相关的生产数据是常见的做法，尤其是那那些指示系统负载和性能（例如CPU和内存使用情况）的指标。多年来，这些数据一直用于帮助系统运维团队了解系统何时发生或即将发生停机。当系统变慢时，可以启用代码分析器来找出系统出现性能瓶颈的地方，例如运行缓慢的数据库查询。

I’ve observed a recent trend that combines the meticulousness of this traditional operational monitoring with a much broader view of the quality of a system. While operational data is an essential part of supporting a system, it is also valuable to gather data that helps provide a picture of whether the system as a whole is behaving as expected. I define “QA in production” as an approach where teams pay closer attention to the behaviour of their production systems in order to improve the overall quality of the function these systems serve.

我观察到了一个近期趋势，该趋势将这种传统的操作监控的细致性与对系统质量的更广泛的视野相结合。尽管生产数据是支持系统的重要部分，但收集那些预测系统整体行为是否如预期的数据也很有价值。我将“生产环境中的QA”定义为一种方法，团队要密切关注生产环境中系统的行为，以便提高系统功能的整体质量。

![](https://martinfowler.com/articles/qa-in-production/qa-in-prod.png)

Things always go wrong in production, but this doesn’t have to be a bad thing. It’s an opportunity to learn about your system and the real world with which it interacts. With the right production monitoring tools and a good Continuous Delivery pipeline, you can build a set of feedback mechanisms that help you find out about issues as they happen and ship fixes quickly. Adopting production QA (Quality Assurance) practices can help you gain a richer understanding of the real issues your system faces and learn new ways to improve its quality.

**生产环境总会出错，但这不一定是坏事**。这让你有机会了解系统以及与之交互的现实世界。借助正确的生产监控工具和良好的[持续交付]({{site.url | append: '/continuous-delivery'}})（[Continuous Delivery](https://martinfowler.com/bliki/ContinuousDelivery.html)）流水线，你可以构建一套反馈机制来帮助你及时发现问题并迅速修复。采用生产环境下的QA（质量保证）实践可以帮助你更深入地了解系统面临的实际问题，并学到提高质量的新方法。

## Gathering production data
## 收集生产数据
There’s a lot of data you could be gathering about your system. I’ve found it very helpful to think about what is critical to the success of a system and to let this guide my efforts. When I talk about success in this context, I’m referring to the kind of things that pay the bills. It doesn’t matter if your system serves thousands of requests per second if it fails to provide a service that your customers pay for or rely on.

你可能需要收集大量系统生产数据。 我觉得要想清楚哪些是对系统的成功起着至关重要影响的因素，并以此指导工作非常有帮助。当我在这种情况下谈到成功时，我指的是那些能够支付账单的事情。如果系统无法提供客户为之付费或依赖的服务，即使系统每秒可以处理数千个请求都没有什么意义。


### Critical success indicators
### 关键成功指标
At Tes, I’ve spent some time working on a system teachers use to apply for jobs. One metric that our team identified as critical is whether a teacher’s job application actually reaches the school for which they apply to work. Email is the primary method via which the system notifies schools of new job applications. We use a third-party service to send emails, which means that this sits outside the boundaries of the system we’re working on. As we’ve come to learn, many things can go wrong when trying to send an email. Email addresses can be invalid even when they seem valid, mailboxes get full and people have out-of-office messages which can make it seem like they didn’t receive an email even when they did. These kinds of real-world complications are almost impossible to predict and hard to test. What we did instead was to learn from what happened in production. Here’s a summary of how our understanding of, and reaction to, the quality of the system evolved:

在 Tes，我花了一些时间研究一个教师用于申请工作的系统。我们小组将教师的工作申请是否真实传达到了他们想去的学校作为一个更关键指标。电子邮件是系统通知学校的主要方法。我们使用第三方服务发送电子邮件，这意味着它在我们的系统边界之外。我们了解到，发送电子邮件可能会出错。当邮箱已满以及人们收到办公室外（out-of-office）的消息时，邮件地址也可能是无效的，即便看起来是正确的。这些现实世界中的问题几乎无法预测，也很难测试。 相反，我们要做的是从产中学习。 以下是我们对系统质量进化的理解和反应的总结：

- We started counting the number of job applications submitted and the number of emails we sent (by sending simple metrics to a metrics server). We set up an alert so that we got notified whenever these numbers were out of sync.
- 我们开始统计提交的求职申请的数量和发送的电子邮件数量（通过将简单的指标发送到指标服务器）。并设置了警报，以便在这些数字不同步时得到通知。
- We set up another alert that let us know if our email-sending microservice was unable to process a request to send an email.
- 我们设置了另一个警报，让我们知道我们发送电子邮件的微服务是否无法处理发送电子邮件的请求。
- It turned out that this happened frequently. Our alerts were firing, but it wasn’t clear why. We took a look at the logs, but couldn’t find any useful information, so we set about improving our logging. In particular, we logged more detail about the errors we were receiving from our third-party email provider.
- 事实证明这经常发生。警报被触发了，但不清楚原因。我们查看了日志，但找不到任何有用的信息，因此我们着手改进日志记录。特别是，我们记录了有关从第三方电子邮件服务提供商处收到的错误的更多详细信息。
- From the logs, we learned about different kinds of responses - some meant the person probably got the email despite the error (e.g. an out-of-office reply), some (like a DNS issue) could be temporary and some errors meant the email would never be delivered. Some of the documentation and error messages were confusing, so we used examples of unsent emails to speak to the schools to find out which emails did actually get received and which did not.
- 从日志中，我们了解了不同类型的响应 -- 有些意味着尽管出错但仍收到了电子邮件（例如，外出答复），有些可能是临时的，而某些错误则意味着电子邮件将永远不会发送。一些文档和错误消息令人困惑，因此我们使用未发送电子邮件的示例与学校交谈，以了解哪些电子邮件实际上是收到的，哪些没有。
- We noticed that our email-sending code was too strict regarding the errors it got back, so we relaxed it a bit. (We stopped logging errors when we knew the error response meant the school is likely to have received the mail.)
- 我们注意到我们的电子邮件发送代码对于收到的错误过于严格，因此我们放宽了一点。 （当我们知道错误响应意味着学校很可能已经收到邮件时，我们停止记录错误。）
- We noticed that quite a few problems were due to incorrectly captured email addresses. In these cases, we looked at the logs and talked to our customer services team. “Hi. We tried to send an email to example@example.com, but it couldn’t go through. Can you please check with the school whether the email address is correct?”
- 我们注意到，很多问题是由于电子邮件地址不正确造成的。在这种情况下，我们查看了日志并与我们的客户服务团队进行了交谈。 “嗨。我们尝试将电子邮件发送到example@example.com，但无法通过。你可以向学校查询电子邮件地址是否正确吗？”
- For a while, the customer services team would let us know when an email address had been fixed, and we’d manually trigger an email resend using an endpoint we’d built on our web service. After a while, we started automatically resending emails when email addresses were updated. (We listen for updates to job information on a message queue.)
- 有一阵子，客户服务团队会在修复电子邮件地址时通知我们，然后我们将使用我们基于网络服务构建的端点手动触发电子邮件重新发送。一段时间后，我们开始在更新电子邮件地址时自动重新发送电子邮件。 （我们在消息队列上侦听作业信息的更新。）
- We still had to do a lot of work to email the customer services team about email addresses that didn’t work, so we started sending these emails automatically.
- 我们仍然需要做大量工作向客户服务团队发送邮件来告知无效电子邮件地址，因此我们开始自动发送这些电子邮件。
- With this automatic healing system in place, we stopped alerting on every failed email, because most of them were being fixed. Now we only get alerted if a bad email address falls through the cracks and hasn’t been fixed in a certain amount of time.
- 有了自动修复系统，我们不用对每一封失败的电子邮件都发出警报，因为大多数电子邮件都已修复。现在，只有当错误的电子邮件地址漏了进来并且在一定时间内没有得到修复时，我们才会收到警报。

Another critical usage metric for our job application system at Tes is whether teachers are actually applying for jobs. Did they hit the "submit" button at the end of the job application form or did something stop them from doing so? It might be that a small CSS or JavaScript library change has caused the "submit" button to display or behave incorrectly in a certain browser. A dip in how frequently teachers are submitting their applications may be an indication of an issue, so we are notified if something like that happens. We also keep a look out for HTTP 500 response codes returned by our service. We really want teachers to be able to apply for jobs, so if anything stops them we want to know. We’re so pedantic about this that we do whatever we can to always show them a job application form. If something goes wrong in getting the data required to show the form, we make sure we log the error and then still do our best to let the teacher apply despite the issue. We look at these logs (our alerting system reminds us to) and we deal with whatever has gone wrong. We’re of the opinion that we’d rather fix bad data or system state than disappoint a potential candidate.

I’ve mentioned a few different techniques for gathering production data in these examples. Let’s look at them in more detail.

### Logging
Logging is a very powerful way of gathering data about your system, provided that you take some care in how you log data. Logs are no longer just long text files for system admins to trawl through to figure out what went wrong. If your logging stack is build with searchability in mind, it can offer you valuable real-time data about your system.

Remember that logs are not restricted to recording technical information. You can also log valuable usage data. I spent some time working on an online banking site with an excellent logging stack, where we were able to use logs to determine the popularity of new features we released. We released the ability for people to adjust their online payment limits and could quickly see that this feature was widely adopted. We could also gather some interesting data on how frequently people adjust their limits, and by how much. If you do this kind of logging, remember to keep your user’s privacy in mind and only log the data you really need.

One technique for achieving more searchable logs is to use log forwarding. This is done by having some software running on your server that will periodically send your log data to another service, usually a database that is optimised for full-text search, such as ElasticSearch or Apache Solr. By building queries on this database, it is possible to put together visualisations that show you aggregated information and trends over time. For the banking site I mentioned, it was possible to draw graphs showing interesting business metrics like how much money was being transferred, alongside more technical information like which browsers and devices users were banking on. It is also possible to search for issues and drill down into individual log entries, which is a very effective way of looking into problems.

Another approach is to employ what’s called structured logging, which we used at an insurance company I spent some time with. Instead of logging something like:

There was an invalidInputFormat error capturing data for user 54321
You could log:

There was an error capturing data for userId={54321},
errorType={invalidInputFormat}
By adding a little extra structure into your individual log entries, you make it possible to search for information more easily. There are some powerful tools available (e.g. Splunk) that can build indexes based on these kinds of logs and offer optimised search, aggregation and visualisations. If you’re using a tool like ElasticSearch, you can also log structured data in JSON format.

Logs may be used in more sophisticated ways now, but don’t forget to leverage the well-proven practice of specifying log levels, such as ERROR, WARN and INFO. Marking the severity of each log entry in this way is extremely helpful when supporting a system, because it improves the signal-to-noise ratio of your logs. Someone supporting a system should be able to look at a day’s worth of logs and be able to filter to only see errors (and ideally there shouldn't be too many of these). This way, they can ensure that nothing has gone wrong and unnoticed.

### Metrics
In addition to logging information in log files, there are tools like statsd available that allow you to count system events and aggregate system data. Where logs are useful for gathering very specific information, this approach can complement logging by offering a way to gather aggregated information. At Tes, we’ve been using statsd to send data to DataDog. For example, we periodically send the current CPU load and memory usage of each of our Docker containers, so we can notice performance issues. Again, I’d like to stress that you consider capturing business metrics as well as technical ones.

For the job application system I mentioned earlier, we send metrics for common errors. In order to send emails, we send a message via a message queue to a shared microservice. If that service is unable to process the message, it ends up in a Dead Letter Queue and we send off a metric to indicate that one of our messages has entered that queue. If we receive any instances of this metric, the team is alerted that something is wrong and should be investigated. We can then search the logs for errors that occurred during the same time window in the email service to find out which job application did not get emailed to a school and what the error message was.

We also gather common usage metrics, such when an application is started, updated or submitted. We can use this to see what percentage of applications are submitted and lets us compare our different types of application forms. These statistics help us identify trends, learn about the system and respond to potential issues. It’s worth pointing out that tools like these are aimed at gathering enough data to provide useful statistics, so usually can’t be relied on for precision.

### APIs
Don’t be put off if the above techniques seem onerous to start with. The simplest place to look for data about your systems is the APIs of tools you already use. Many performance monitoring, web analytics, uptime monitoring and IaaS tools provide APIs that can be queried to get data about how your system is performing and being used.


#### 注释
1. 注1：尽管我更喜欢将定义聚焦在单独构建的模块的交互上，但我确实偶尔会看到“集成测试”用来表示比单元测试更大的内容。 对于一些孤立型（solitary）单元测试的实践者，我已经发现他们会把社交型（sociable）单元测试描述为“集成测试”。

#### 延伸阅读（译者附）
- [一页纸测试策略](https://insights.thoughtworks.cn/test-strategy-one-page/)
- [产品环境下的QA](https://insights.thoughtworks.cn/qa-in-production-practice/)

#### 声明
本文翻译自Rouan Wilsenach的文章*QA in Production*：

- 原文链接： [QA in Production](https://martinfowler.com/articles/qa-in-production.html)
- 原文作者： [Rouan Wilsenach](http://rouanw.github.io/)
- 发表时间： 2017年4月4日
