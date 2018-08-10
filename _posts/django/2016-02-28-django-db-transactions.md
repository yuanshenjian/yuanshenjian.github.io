---
layout: post

title: "Django 数据库事务"
date: 2016-02-28
categories: [DJANGO]
tag: [Django]
author: "袁慎建"

brief: "本文是对Django 数据库事务部分的翻译。"

---


* content
{:toc}

---

## 管理数据库事务
Django框架提供了好几种方式来控制和管理数据库事务。（以下`Django框架`会简化为`Django`，读者可自行脑补`框架`两字）

---

### Django框架默认的事务行为
自动提交作为Django默认的事务行为，它表现形式为：每次数据库操作会立即被提交到数据库中，除非这个事务仍然处于激活状态。 那么，更多详细内容见下文。

Django使用事务或者保存点来保证多个ORM操作的完整性，尤其是针对delete()和update()操作。    

另外因为某些性能原因，Django提供的[TestCase](https://docs.djangoproject.com/en/1.9/topics/testing/tools/#django.test.TestCase)类就将每个测试用例包裹在一个事务中。

---

### 给Http请求绑定事务

在Web应用中，常用的事务处理方式是将每个请求都包裹在一个事务中。这个功能使用起来非常简单，你只需要将它的配置项**ATOMIC_REQUESTS**设置为True。

它是这样工作的：当有请求过来时，Django会在调用视图方法前开启一个事务。如果请求却正确处理并正确返回了结果，Django就会提交该事务。否则，Django会回滚该事务。

同样，你可以在视图代码中使用保存点来担任子事务的角色，典型的例子是`atomic()`上下文管理器。那么，最后所有更改要么被提交，要么被回滚。

```
警告!!!
虽然这种事务模式的优势在于它的简单性，但在访问量增长到一定的时候会造成很大的性能损耗。这是因为为每一个视图开启一个事物会有一些额外的开销。
另外，这种性能影响还取决于你的应用程序的查询模式以及你的数据库对锁的处理是否高效。
```

```
基于请求的事务和流式响应
当一个视图返回一个StreamingHttpResponse时，读取响应的内容通常会执行一段代码去生成内容。但由于视图已经返回了结果，这些代码将运行在事务之外。
一般而言，不建议在生成流式响应的时候写入数据库，因为目前还没有一个很好的方法来处理响应已经被发送之后的错误。
```

在实践中，可以简单使用`atomic()`装饰器来装饰每一个视图方法来实现该功能。

需要注意的是，它有个前提：你的视图代码运行在封闭的事务中。例如，中间件就只能运行在事务之外，这么说来，就不难理解为什么响应模板的渲染是不受事务控制了。

即便**ATOMIC_REQUESTS**被开启了，你仍然能有办法让视图方法运行在事务之外。

**non\_atomic\_requests(using=None)[source]**  

比如，你就可以上面这个该装饰来让视图方法不受事务控制。

```python
from django.db import transaction

@transaction.non_atomic_requests
def my_view(request):
	do_stuff()

@transaction.non_atomic_requests(using='other')
def my_other_view(request):
	do_stuff_on_the_other_database()

```
不幸的是，它只能给那些披上了这件外套的魔法士带来法力。

---

### 显式地控制事务
Django同时还提供了单独API来控制事务。

**atomic(_using=None, savepoint=True_)[source]**  
 

原子性是数据库事务的一个属性。使用**atomic**，我们就可以创建一个具备原子性的代码块。一旦代码块正常运行完毕，所有的修改会被提交到数据库。反之，如果有异常，更改会被回滚。 

被**atomic**管理起来的代码块还可以内嵌到方法中。这样的话，即便内部代码块正常运行，如果外部代码块抛出异常的话，它也没有办法把它的修改提交到数据库中。

**atomic**还可以被当做[`装饰器`](https://docs.python.org/3/glossary.html#term-decorator)来使用，例如：

```python
from django.db import transaction

@transaction.atomic
def viewfunc(request):
    # This code executes inside a transaction.
    do_stuff()
```
下面是被当做[上下文管理器](https://docs.python.org/3/glossary.html#term-context-manager)来使用：

```python
from django.db import transaction

def viewfunc(request):
    # This code executes in autocommit mode (Django's default).
    do_stuff()

    with transaction.atomic():
        # This code executes inside a transaction.
        do_more_stuff()
```

一旦把**atomic**代码块放到try/except中，完整性错误就会被自然的处理掉了，比如下面这个例子：

```python
from django.db import IntegrityError, transaction

@transaction.atomic
def viewfunc(request):
    create_parent()

    try:
        with transaction.atomic():
            generate_relationships()
    except IntegrityError:
        handle_exception()

    add_children()
```
这个例子中，即使**generate_relationships()**中的代码打破了数据完整性约束，你仍然可以在**add_children()**中执行数据库操作，并且**create_parent()**产生的更改也有效。需要注意的是，在调用**handle_exception()**之前，**generate_relationships()**中的修改就已经被安全的回滚了。因此，如果有需要，你照样可以在异常处理函数中操作数据库。

```
尽量不要在atomic代码块中捕获异常

因为当atomic块中的代码执行完的时候，Django会根据代码正常运行来执行相应的提交或者回滚操作。如果在atomic代码块里面捕捉并处理了异常，就有可能隐盖代码本身的错误，从而可能会有一些意料之外的不愉快事情发生。

担心主要集中在DatabaseError和它的子类（如IntegrityError）。如果这种异常真的发生了，事务就会被破坏掉，而Django会在代码运行完后执行回滚操作。如果你试图在回滚前执行一些数据库操作，Django会抛出TransactionManagementError。通常你会在一个ORM相关的信号处理器抛出异常时遇到这个行为。

捕获异常的正确方式正如上面atomic代码块所示。如果有必要，添加额外的atomic代码块来做这件事情。这么做的好处是：当异常发生时，它能明确地告诉你那些操作需要回滚，而那些是不需要的。
```

为了保证原子性，**atomic**还禁止了一些API。像试图提交、回滚事务，以及改变数据库连接的自动提交状态这些操作，在atomic代码块中都是不予许的，否则就会抛出异常。

**atomic**使用一个参数来指定数据库的名字。如果该参数没有设置值，Django就会使用系统默认的数据库。

下面是Django的事务管理代码：  
 
 * 进入最外层atomic代码块时开启一个事务；
 * 进入内部atomic代码块时创建保存点；
 * 退出内部atomic时释放或回滚事务；
 * 退出最外层atomic代码块时提交或者回滚事务；

你可以将**保存点**参数设置成**False**来禁止内部代码块创建保存点。如果发生了异常，Django在退出第一个父块的时候执行回滚，如果存在保存点，将回滚到这个保存点的位置，否则就是回滚到最外层的代码块。外层事务仍然能够保证原子性。然而，这个选项应该仅仅用于保存点开销较大的时候。毕竟它有个缺点：会破坏上文描述的错误处理机制。

你也可以在autocommit被关闭的时候使用**atomic**。此时，即使是最外层的代码块，它也只使用保存点。

```
性能考虑
开启事务会消耗数据库服务器的性能。为了最大化减小这种开销，应该让事务尽可能的短。特别是当你把atomic()用在
Django的请求/响应周期之外的一个耗时的操作中时，这点就显得尤为重要了。
```

---

## 自动提交

### 为什么Django默认使用自动提交?

SQL的标准中指出，除非已经存在一个开启的事务，否则每个SQL查询都会开启一个新事务。这些事务后续必须被明确的提交或者回滚。

这对应用开发者来说并不是很方便。为了降低这种不便性，大部分数据库提供了自动提交模式。当自动提交开启并且没有开启的事务时，每个SQL查询会被自己的事务包裹起来。换言之，不仅仅是每个查询开启一个事务，而且该事务还会根据查询是否成功采取自动提交或者回滚操作。

PEP(Python Enhancement Proposals)249，Python数据库规范v2.0，要求在初始化的时候关闭自动提交。Django复写了它，并打开了自动提交。

为了避免这点，你可以关闭事务管理，但并不推荐你这么干。

---

### 关闭事务管理

你完全可以在配置文件中将**AUTOCOMMIT**设置为False来关闭指定数据库的事务管理。如果你关闭了，Django将不会执行自动提交，并且不会执行任何提交。如此一来，你就能获得底层数据库的常规行为。

这需要你显式的提交每一个事务，不论是Django还是第三方库开启的事务。因此，最常用的场景是你想使用你自己的事务控制中间件或者干一些奇怪的事情

---

## 提交后执行操作
Django1.9的新特性

有时候你想在事务成功提交后执行一些与当前数据库事务相关的操作。比如说Celery任务，邮件通知，或者缓存失效。

Django提供了**on_commit()**方法来注册一些只有在事务成功提交后才执行的回调函数。

>**on_commit(func, using=None)[source]**

给**on_commit()**传入任何没有参数的函数。

```python
from django.db import transaction

def do_something():
    pass  # send a mail, invalidate a cache, fire off a Celery task, etc.

transaction.on_commit(do_something)

```
你也可以传入匿名函数。

```python
transaction.on_commit(lambda: some_celery_task.delay('arg1'))
```

???当假定的数据库写操作被成功提交后，你传入的这个函数将会被立即执行。
>The function you pass in will be called immediately after a hypothetical database write made where **on_commit()** is called would be successfully committed.

当你在不存在开启的事务的时候使用了**on_commit()**，回调函数将会立即被执行。

如果假定的数据库写操作变成了回滚（典型的是一个未处理的异常在**atomic()**中发生），你传入的函数将会被废弃掉，将永远不会被执行。

---

### 保存点

保存点（即内嵌的**atomic()**块）总是会被正确的处理。也就是说，在一个保存点之后注册的**on_commit()**回调函数将会在外部事务被提交后执行，但是如果在当前事务中，该保持点或者之前任意保存点之间发生了回滚，就例外了。

```python
with transaction.atomic():  # Outer atomic, start a new transaction
    transaction.on_commit(foo)

    with transaction.atomic():  # Inner atomic block, create a savepoint
        transaction.on_commit(bar)
        
# foo() and then bar() will be called when leaving the outermost block
```

另一方面，当一个保存点被回滚之后（如发生了异常），内部的回调函数将不会被调用：

```python
with transaction.atomic():  # Outer atomic, start a new transaction
    transaction.on_commit(foo)

    try:
        with transaction.atomic():  # Inner atomic block, create a savepoint
            transaction.on_commit(bar)
            raise SomeError()  # Raising an exception - abort the savepoint
    except SomeError:
        pass

# foo() will be called, but not bar()
```

---

### 执行顺序

对于特定的事务，On-commit函数会按照它们被注册的顺序被执行。

---

### 异常处理

如果一个on-commit函数在一个给定的事务中抛出了未被捕获的异常，此后该事务中所有注册的函数都不会运行。当然，这和你按照顺序手动执行一些方法的行为结果是一样的。

---

### 执行时间

你的回调函数在一个提交成功完成后执行， 所以回调函数执行失败不会导致事务的回滚。 它们会被条件的执行，但是它们不是事务的一部分。对于一些目的性很强的用例（邮件通知，Celery任务，等）都是很好的。 如果事实并非如此（如果你的后续执行和关键，它的失败意味着事务的失败），那么你也不会使用**on_commit()**回调钩子。相反的，你会愿意使用两步提交例如psycopg两步提交协议支持，以及Python DB-API设计文档中提到的可选的两步提交扩展。

直到自动提交在提交后的链接中恢复，回调函数才会被执行（因为如果任何在回调函数中完成的查询将开启一个隐式的事务，阻止了链接回到自动提交模式）

当使用自动提交模式，并且在一个**atomic()**块之外时，函数将会立即运行，而不是在提交后。

on-commit函数仅仅在自动提交模式开启时或者在**atomic()**（或**ATOMIC_REQUESTS**）事务API中有效。如果你试图在自动提交模式关闭时或者在atomic块之外去调用**on_commit()**，将会发生错误。

---

### 在测试中使用

Django中的**TestCase**类将每个测试包裹在一个事务中，并且在测试完成后执行回滚，目的是在提供测试的隔离性。这意味着，任何事物并不会真实提交，所以你的**on_commit()**回调函数将永远不会被执行。所以，如果你实在想使用**on_commit()**回调函数，使用TransactionTestCase这个类代替TestCase。

---

### 没什么没有回滚钩子函数？

由于存在很多的因素导致隐式的回滚，实现一个简单粗暴的回滚钩子要比提交钩子难得多。

举个例子，如果你的数据库连接因为你的进程被粗鲁的干掉了而断开了，你的回滚hook将永远不会执行。

解决方案很简单：相比于在atomic块中执行一些操作，而后在操作执行失败后撤销这些操作，使用**on_commit()**延迟在一开始要执行的操作到事务成功之后去执行，比撤销一些你在一开始就从未执行的操作容易得多。
	
---

## 底层API
```
警告：
尽可能的选择使用atomic()。它更契合每个数据的特性，并且阻止了非法操作。
底层APIs仅仅在你实现了自己的事务管理时有用。
```

[原文链接1](https://docs.djangoproject.com/en/dev/topics/db/transactions/)  \|
[原文链接2](https://docs.djangoproject.com/en/1.9/topics/db/transactions/)
