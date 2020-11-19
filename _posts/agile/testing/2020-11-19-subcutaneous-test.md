---
layout: post

title: "皮下测试"
date: 2020-11-19
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "
我使用皮下测试（subcutaneous test）来表示那些只在应用程序UI之下运行的测试。在对应用程序进行功能测试时，这个特别有用：你要测试系统端到端的行为，但又很难通过UI来测试。
</br></br>
皮下测试可以规避掉那些难以测试的呈现技术所带来的麻烦，通常比通过UI来测试要快得多。它最大的危险是，除非你确定所有有用的逻辑都没有写在UI上，否则皮下测试将会遗漏一些重要的行为。

"

---

* content
{:toc}

我使用皮下测试（subcutaneous test）来表示那些只在应用程序UI之下运行的测试。在对应用程序进行功能测试时，这个特别有用：你要测试系统端到端的行为，但又很难通过UI来测试。

皮下测试可以规避掉那些难以测试的呈现技术所带来的麻烦，通常比通过UI来测试要快得多。它最大的危险是，除非你确定所有有用的逻辑都没有写在UI上，否则皮下测试将会遗漏一些重要的行为。


#### 声明
本文翻译自Martin Fowler的文章*SubcutaneousTest*：

- 原文链接： [SubcutaneousTest](https://martinfowler.com/bliki/SubcutaneousTest.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2011年2月14日
