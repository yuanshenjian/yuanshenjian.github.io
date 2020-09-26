---
layout: post

title: "Mocks 不是 Stubs"
date: 2020-08-13
categories: [Agile]
tags: [AGILE-TEST]
column: AGILE-TEST
sub-tag: "common"

author: "袁慎建"

brief: "
Mock对象 已成为一个流行的术语，指的是模仿真实对象进行测试的特殊对象。现在，大多数编程语言环境都有可以轻松创建模拟对象的框架。但是，人们通常没有意识到的是，模拟对象只是特殊场景下测试对象的一种形式，它支持不同风格的测试。在本文中，我将解释Mock对象如何工作，它们如何鼓励基于行为验证的测试，以及围绕它们的社区如何使用它们来开发不同的测试风格。

"

---

* content
{:toc}

“Mock对象”已成为一个流行的术语，指的是模仿真实对象进行测试的特殊对象。现在，大多数编程语言环境都有可以轻松创建模拟对象的框架。但是，人们通常没有意识到的是，模拟对象只是特殊场景下测试对象的一种形式，它支持不同风格的测试。在本文中，我将解释Mock对象如何工作，它们如何鼓励基于行为验证的测试，以及围绕它们的社区如何使用它们来开发不同的测试风格。


我第一次看到“mock对象”一词是几年前在极限编程（[ Extreme Programming ](https://martinfowler.com/bliki/ExtremeProgramming.html)）社区中。从那以后，我遇到越来越多的模拟对象（mock object）。这在一定程度上是因为很多mock对象的主导开发人员在不同时期都是我在ThoughtWorks的同事。另外，还因为我在那些受XP影响的测试文献中越来越频繁地看到它们。

但是，我经常看到mock对象被描述地很糟糕。特别是看到它们经常跟stub（测试环境的常见帮手）混淆在一起。我能理解这一点 -- 我自己也有一段时间认为它们是类似的，但是与mock开发人员的交流逐渐让我对mock对象的理解变得深刻。

这种差异实际上存在于两方面。一方面是测试结果验证的方式不同：状态验证和行为验证之间的区别。另一方面是一种完全不同的测试和设计共存的哲学，我在这里将其称为测试驱动开发（[TestDrivenDevelopment](https://martinfowler.com/bliki/TestDrivenDevelopment.html)）的古典派（classical）风格和模拟派（mockist）风格。

## 常规的测试
我将通过一个简单的示例来说明这两种风格。（该示例使用Java，但是这些原则对于任何面向对象的语言都适用）我们想获取一个订单（order）对象并依赖仓库中的产品来填充。订单（Order）类非常简单，只有产品和数量两个属性。Warehouse存放着不同产品的库存。当我们使用仓库中产品来填充的订单时，有两种可能的响应。如果仓库（warehouse）中有足够的产品来执行订单，则填充将被执行，并且仓库（warehouse）中的产品数量将减少相应的数量。如果仓库（warehouse）中没有足够的产品，那么订单（order）就不会被填充，仓库（warehouse）也不会有任何变化。


这两种行为意味着要写两个测试，它们看起来很像常规的JUnit测试。


```java
public class OrderStateTester extends TestCase {
  private static String TALISKER = "Talisker";
  private static String HIGHLAND_PARK = "Highland Park";
  private Warehouse warehouse = new WarehouseImpl();

  protected void setUp() throws Exception {
    warehouse.add(TALISKER, 50);
    warehouse.add(HIGHLAND_PARK, 25);
  }
  public void testOrderIsFilledIfEnoughInWarehouse() {
    Order order = new Order(TALISKER, 50);
    order.fill(warehouse);
    assertTrue(order.isFilled());
    assertEquals(0, warehouse.getInventory(TALISKER));
  }
  public void testOrderDoesNotRemoveIfNotEnough() {
    Order order = new Order(TALISKER, 51);
    order.fill(warehouse);
    assertFalse(order.isFilled());
    assertEquals(50, warehouse.getInventory(TALISKER));
  }
}
```

xUnit测试遵循典型的四个测试阶段：设置（setup）、执行（exercise）、验证（verify）、拆卸（teardown）。在上述测试用例中，设置阶段部分通过`setUp`方法（设置仓库）完成，部分则通过测试方法（设置订单）完成。对`order.fill`的调用是执行阶段，它是我们要测试的目标行为。断言语句表示进入到验证阶段，它会检查执行的方法是否正确执行。本例子中，没有显式的拆卸阶段，因为Java垃圾回收器会隐式地为我们做这件事情。

在设置过程中，我们要把两种对象放在一起。 Order是我们正在测试的类，但是要使Order.fill正常工作，还需要一个Warehouse实例。在我们例子中，订单是重点测试的对象。面向测试的人喜欢使用被测对象（object-under-test）或被测系统（system-under-test）之类的术语来命名它。这两个词都很拗口，但由于它是一个被广为接受的词，所以我就沿用它。我将跟随Meszaros，使用“被测系统”或简称SUT。

因此，在这个测试中，我需要SUT（Order）和一个协作者（Warehouse）。我需要Warehouse的原因有两个：一是要让被测试的行为完全工作（因为Order.fill调用仓库的方法），其二我需要它进行验证（因为Order.fill的结果之一是对变更了仓库的状态）。当我们要进一步深入探讨这个主题时，你会看到我们将在SUT和协作者之间做很多区分。（在本文的早期版本中，我将SUT称为“主要对象”（primary object），将协作者称为“辅助对象”（secondary object））

这种测试风格使用**状态验证**：这意味着我们可以通过在执行方法后检查SUT及其合作者的状态来确定被执行的方法是否正确工作。除了这种方式，我们接下来讨论的mock对象可以采用另一种验证方式。


## 使用Mock对象进行测试
现在，我将采取相同的行为并使用mock对象。对于此代码，我使用jMock库定义的mocks。 jMock是一个Java mock对象库。当然，还有一些其他的模拟对象库，只是该库是这项技术的发明者编写的最新库，从它开始上手比较合适。


```java
public class OrderInteractionTester extends MockObjectTestCase {
  private static String TALISKER = "Talisker";

  public void testFillingRemovesInventoryIfInStock() {
    //setup - data
    Order order = new Order(TALISKER, 50);
    Mock warehouseMock = new Mock(Warehouse.class);

    //setup - expectations
    warehouseMock.expects(once()).method("hasInventory")
      .with(eq(TALISKER),eq(50))
      .will(returnValue(true));
    warehouseMock.expects(once()).method("remove")
      .with(eq(TALISKER), eq(50))
      .after("hasInventory");

    //exercise
    order.fill((Warehouse) warehouseMock.proxy());

    //verify
    warehouseMock.verify();
    assertTrue(order.isFilled());
  }

  public void testFillingDoesNotRemoveIfNotEnoughInStock() {
    Order order = new Order(TALISKER, 51);
    Mock warehouse = mock(Warehouse.class);

    warehouse.expects(once()).method("hasInventory")
      .withAnyArguments()
      .will(returnValue(false));

    order.fill((Warehouse) warehouse.proxy());

    assertFalse(order.isFilled());
  }
}
```

我们先聚焦正在`testFillingRemovesInventoryIfInStock`这个测试上，因为我在另一个测试中采取了一些捷径。

首先，设置阶段非常不同。 一开始，它由两部分组成：数据和期望。数据部分设置了我们感兴趣的对象，从某种意义上说，它类似于传统设置。区别在于我们创建的对象。SUT是相同的 -- Order。 但是，协作者不是仓库对象，而是一个mock warehouse -- 从技术上讲是Mock类的实例。

设置的第二部分在模拟对象上创建期望，该期望表示当执行SUT时应在mock对象上调用哪些方法。

一旦所有期望设置都就绪，我就执行SUT，而后进行验证。验证包含两部分，一方面是对SUT的断言，这和之前一样。另一方面，我还验证了mock对象 -- 检查它们是否如期被调用。

这里的关键区别在于我们如何验证order在与warehouse的交互中做了正确的事情。在之前的例子中，我们使用了状态验证，通过断言warehouse的状态来做到这一点。Mock则使用了**行为验证**，检查order是否对warehouse进行了正确的调用。在设置过程中我们给mock对象设置期望并要求它在验证期间进行自我校验。只使用断言来检查订单的话，我们无法确认它是否成功更改了订单状态，此时断言犹如虚设。

在第二个测试中，我做了一些不同的事情。首先，我没有使用`Mock`类的构造函数，而是使用`MockObjectTestCase`类中的`mock`方法来创建mock对象。这是jMock库提供的一种便捷方式，用了它之后不用再显式调用`verify`方法，任何使用便捷方式创建的mock对象都会在测试结束时自动进行验证。我也可以在第一个测试中这么做，之所以用显示验证的方式是为了更好地阐明mock的工作方式。

第二个测试的第二个不同之处是，我通过使用`withAnyArguments `放宽了对期望的约束。我能这么做的原因是，前一个测试已经检查产品编号是否会传递到warehouse，因此第二个测试不用重复测试这一点。如果以后更改了order的逻辑，则只会破坏一个测试，从而简化了测试迁移的工作。实际上，我可以完全不用显式调用`withAnyArguments`方法，因为它是默认的设置。

### 使用 EasyMock
还有很多其他的mock对象库。我用过一个全面点的框架是EasyMock，它既有Java版本，也有.NET版本。EasyMock也支持行为验证，但是与jMock在写法上有一些差异，这一点值得我们仔细看看。同样还是我们熟悉的测试用例：


```java
public class OrderEasyTester extends TestCase {
  private static String TALISKER = "Talisker";

  private MockControl warehouseControl;
  private Warehouse warehouseMock;

  public void setUp() {
    warehouseControl = MockControl.createControl(Warehouse.class);
    warehouseMock = (Warehouse) warehouseControl.getMock();
  }

  public void testFillingRemovesInventoryIfInStock() {
    //setup - data
    Order order = new Order(TALISKER, 50);

    //setup - expectations
    warehouseMock.hasInventory(TALISKER, 50);
    warehouseControl.setReturnValue(true);
    warehouseMock.remove(TALISKER, 50);
    warehouseControl.replay();

    //exercise
    order.fill(warehouseMock);

    //verify
    warehouseControl.verify();
    assertTrue(order.isFilled());
  }

  public void testFillingDoesNotRemoveIfNotEnoughInStock() {
    Order order = new Order(TALISKER, 51);

    warehouseMock.hasInventory(TALISKER, 51);
    warehouseControl.setReturnValue(false);
    warehouseControl.replay();

    order.fill((Warehouse) warehouseMock);

    assertFalse(order.isFilled());
    warehouseControl.verify();
  }
}
```

EasyMock使用记录/回放的隐喻来设置期望。它会为每个你希望模拟的对象创建一个控件和mock对象。mock对象跟协作对象的接口一致，控件为你提供了其他功能。为了表示调用方法的期望，并在mock对象中包含期望的参数。如果要返回值，可以在此之后调用控件。完成期望的设置后，你可以在控件上调用`replay`方法 -- 此时，mock对象将完成录制并准备响应主对象。完成后，调用控件的`verify`方法来验证。

似乎当人们初次看到记录/回放隐喻时往往会感到困惑，但他们很快就习惯了。它比 jMock 的约束更有优势，因为你可以对mock对象进行实际的方法调用，而不是用字符串中指定方法名称。这意味着你可以在IDE中使用代码完成这项功能，任何方法名称的重构都会自动更新测试。劣势是它对你的限制更多。

jMock的开发人员正在开发一个新版本，该版本将使用其他技术来实现实际的方法调用。


## Mock和Stub的差异
第一次引入mock对象时，很多人很容易将mock对象与使用stub这些常见测试概念混淆。从那时起，人们似乎更了解这些差异（我希望本文的早期版本有所帮助）。然而，要充分了解人们使用mock的方式，理解mock和其他类型的测试替身（Test Double）是很重要的。（"替身"？别担心，如果它对你来说很新，等再多读几段，你们就会成为朋友了。

当你做这种测试时，你一次只专注于软件的一个元素，因此称为通用术语“单元测试”。 问题在于，要让一个单元正常工作，你通常需要与其他单元协作 -- 因此在我们的例子中需要某种类型的warehouse。

上述例子中存在两种测试风格，第一种情况使用真实的warehouse对象，第二种情况使用mock warehouse，它不是真实的warehouse对象。使用mock对象是在测试中不用使用真实仓库的一种方法，还有其他方式能做到这一点。


谈论这个话题相关的词汇你可能很快会陷入混乱 -- 各种各样的单词：stub、mock、fake、dummy。本文中，我将沿用杰拉德·梅萨罗斯（Gerard Meszaros）书中的词汇。虽然不是每个人都在用，但我认为这是一个很好的词汇。由于本文由我所写，因此我可以决定使用哪些词。

Meszaros使用的术语是测试替身（Test Double），任何出于测试目的而替换掉真实对象的场景都是对它的运用。该名称源于电影中的特技替身（Stunt Double）。Meszaros定义了五种特殊的测试替身：

- **Dummy**对象会被构建和传递，但实际上不会被使用。 通常它们仅用于填充参数列表。
- **Fake**对象实际上一个等效的实现，只是实现方式更简单，它们往往不适合用于生产环境。（[InMemoryTestDatabase](https://martinfowler.com/bliki/InMemoryTestDatabase.html)是一个很好的例子）
- **Stubs**对测试指定的调用提供固定的返回值，它们不会响应测试没有涉及的任何其他调用。
- **Spy**也是stubs，只是它们还会根据调用方式记录一些额外信息。比如，电子邮件服务，它会记录发送了多少消息。
- **Mocks** 会预先设定好期望，这些期望代表它们希望接收到特定规范的调用。它们会在验证过程中进行校验，从而确保接收到所有如期的调用，否则会抛出异常。

在这些类型的替身中，只有mock做的是行为验证。其他替身也可以这么做，但它通常使用的是状态验证。在执行阶段，mock的行为实际上跟其他替身一样，因为他们需要让SUT相信它正在与其真正的协作者交互 -- 只是mock对象在设置和验证阶段有所不同。

为了进一步探索测试替身，我们需要对上述例子做一些扩展。很多人只在真实对象难以使用的时候才使用测试替身。一种更常见的场景是：如果需求发生了改变，比如Order没有被成功填充时要发送一封电子邮件。而我们又不想在测试期间将实际的电子邮件发送给客户。因此，我们创建了电子邮件系统的测试替身，这样就可以操控它了。


这里我们可以看到Mock和Stub的区别。如果我们要测试邮件行为，我们可能会编写一个简单的stub，例如：

```java
public interface MailService {
  public void send (Message msg);
}
public class MailServiceStub implements MailService {
  private List<Message> messages = new ArrayList<Message>();
  public void send (Message msg) {
    messages.add(msg);
  }
  public int numberSent() {
    return messages.size();
  }
}
```

我们可以在stub上这样做状态验证：

```java
class OrderStateTester...

  public void testOrderSendsMailIfUnfilled() {
    Order order = new Order(TALISKER, 51);
    MailServiceStub mailer = new MailServiceStub();
    order.setMailer(mailer);
    order.fill(warehouse);
    assertEquals(1, mailer.numberSent());
  }
```

当然这个测试很简单 -- 只发送了一条消息。虽然我们没有测试它是否会发送正确的内容，或发送给正确的人，但是它确实可以说明发邮件这件事情发生了。


如果使用mock对象，方式就完全不同了。

```java
class OrderInteractionTester...

  public void testOrderSendsMailIfUnfilled() {
    Order order = new Order(TALISKER, 51);
    Mock warehouse = mock(Warehouse.class);
    Mock mailer = mock(MailService.class);
    order.setMailer((MailService) mailer.proxy());

    mailer.expects(once()).method("send");
    warehouse.expects(once()).method("hasInventory")
      .withAnyArguments()
      .will(returnValue(false));

    order.fill((Warehouse) warehouse.proxy());
  }
}
```

这两种情况我使用的都是测试替身而不是真实邮件服务。区别在于stub使用状态验证，而mock使用的是行为验证。

为了在stub上使用状态验证，我需要在stub上增加一些额外的辅助方法。结果是，我会让stub实现MailService接口，同时添加一些额外的测试方法。

Mock对象始终采用行为验证，stub则可以采用任何一种方式。Meszaros将使用了行为验证的stub定义为测试间谍（Spy）。它们的区别在于测试替身运行和验证的具体方式，这个就留给读者去探索了。


## 古典派（Classical）和模拟派（Mockist）测试
现在我们可以探索第二个差异点：古典派TDD和模拟派TDD的差异。这两者之间最大的差别是何时使用mock对象（或其他测试替身）。

**古典派TDD**风格是在尽可能使用真实的对象，只有在真实对象很难使用时才使用测试替身。因此，古典的TDDer将使用真实的warehouse和邮件服务的替身。至于测试替身的类型就没那么重要了。

但是，**模拟派TDD**实践者始终会对任何协作对象都使用mock对象。所以，他们会使用mock对象来代替真实的warehouse和邮件服务。

尽管各种模拟框架在设计时都考虑了模拟测试，但很多古典派发现它们对于创建测试替身很有用。



An important offshoot of the mockist style is that of Behavior Driven Development (BDD). BDD was originally developed by my colleague Daniel Terhorst-North as a technique to better help people learn Test Driven Development by focusing on how TDD operates as a design technique. This led to renaming tests as behaviors to better explore where TDD helps with thinking about what an object needs to do. BDD takes a mockist approach, but it expands on this, both with its naming styles, and with its desire to integrate analysis within its technique. I won't go into this more here, as the only relevance to this article is that BDD is another variation on TDD that tends to use mockist testing. I'll leave it to you to follow the link for more information.

模拟派风格的一个重要分支是行为驱动开发（BDD）。BDD最初是由我的同事Daniel Terhorst-North提出来的，旨在通过把TDD作为一种设计技术来帮助人们更好地学习测试驱动开发。这引发了对测试重命名为行为，从而更好地探索TDD在何处考虑对象需要做什么。BDD采取了一种模拟派的方法，但它在此基础上进行了扩展，包括它的命名风格，以及它将分析集成到其技术中的愿望。我在这里不再赘述，因为BDD是TDD的另一个变体，它倾向于使用模拟测试。我把它留给你，你可以通过链接获得更多信息。

有时你也会看到用“底特律”风格来表示“古典派”风格，“伦敦”风格表示“模拟派”风格。这暗示了这样一个事实，即XP最初是由底特律的C3项目开发的，而模拟派的风格是由伦敦的早期XP的采用者开发的。我还应该提到过，很多模拟派TDDer不喜欢该术语，甚至不喜欢任何暗示了古典派测试和模拟派测试之间有不同风格的术语。他们认为这两种风格之间没有什么实质性的区别。


## 在差异之间进行选择
在本文中，我解释了两方面的差异：状态验证和行为验证以及古典派TDD和模拟派TDD。那在它们之间做选择时要牢记哪些点呢？我将从状态验证和行为验证开始谈。

首先要考虑的是上下文。我们是在考虑简单便捷的协作（例如订单和仓库），还是复杂困难的协作（例如订单和邮件服务）？

如果是一个简单的协作，选择就很简单了。如果我是古典派TDDer，就不会使用mock、stub或任何测试替身。而是使用一个真实的对象并且做状态验证。如果我是模拟派TDDer，则会使用mock对象和行为验证。这个没什么好犹豫的。

如果这是一个复杂的协作，如果我是模拟派，也不用犹豫 -- 使用mock和行为验证。如果我是古典派，那么我的确需要做个选择，但是使用哪个并不重要。通常，古典派会根据实际情况选择最简单的方式。

因此，正如我们所看到的，状态验证与行为验证的选择在很大程度上并不是一个重大决定。真正的问题在于古典派TDDer与模拟派TDDer之间的区别。事实证明，状态验证和行为验证的特点确实会影响我们讨论，这也是我花了大部分精力的地方。

但在此之前，我先讲一个边界情况。你有时会碰到一些很难验证状态的情况，即使它们并不是复杂的协作，比如说缓存。缓存难点是，你无法从其状态中判断出缓存是命中还是未命中 -- 在这种情况下，忠实的古典派TDDer也会明智地选择行为验证。我相信两个派别都会存在例外的情况。

当研究古典派/模拟派的选择时，我们需要考虑很多因素，我将它们粗略地分成了几类。


### Driving TDD
### 驶入TDD
Mock对象来自XP社区，XP的主要特性之一是它对测试驱动开发的强调 -- 系统的设计是通过编写测试驱动的迭代来演进的。

因此，模拟派特别强调模拟测试对设计的影响也就不足为奇了。他们特别提倡一种称为需求驱动开发的风格。使用这种风格，你在开始着手开发用户故事（[user story](https://martinfowler.com/bliki/UserStory.html)）前，可以通过为系统外部编写第一个测试，并让某些接口对象变为SUT。通过思考对协作者的期望来探索SUT及其邻居之间的交互，这样能有效地设计SUT的对外的接口。


一旦运行了第一个测试，对mock对象的期望就为下一步提供了规范，这为测试提供了起点。你将每个期望转换为对协作者的测试，并反复将你的方法运用于系统中的SUT。这种风格也称为“由外而内”，这是一个非常形象的名称。它能与分层系统一起很好地工作。首先，你需要使用低层的模拟层对UI进行开发。然后，你为较低的层编写测试，并逐步遍历系统每一层。这种做法很有结构化且可控，很多人还觉得它能够帮助新手更好的实践OO和TDD。


古典派TDD提供的方式有点不一样。他们也可以像那样一步一步前进，但使用stub而不是mock。为了完成同样的事情，可以对协作者的响应进行硬编码，来让SUT正常工作。然后，你可以使用正确的代码替换硬编码的响应。

但是古典派TDD也可以做其他事情。常见的风格是由中间向外。使用这种风格，你挑选了一个业务功能特性，然后确定在这个领域中要使该特性正常工作所需的东西。你可以让领域对象执行所需的操作，一旦它们起作用，你就可以将UI放在最上面。这样做你可能永远不需要伪造任何东西。很多人喜欢这种方式，因为它首先将注意力集中在领域模型上，可以防止领域逻辑泄漏到UI中。

我要强调的是，无论是模拟派和还是古典派，一次都只做一个故事。有一种学院派思想提倡逐层构建应用程序，而不是在完成另一层之前就开始下一层。古典派和模拟派都具有敏捷的背景，并且更喜欢细粒度的迭代。因此，他们是一项特性接着一项特性地推进工作，而不是一层接一层。


### 夹具安装（Fixture Setup）
对于古典派TDD，你不仅需要创建SUT，还需要创建SUT的所有协作者。虽然示例中只有几个对象，但实际测试通常涉及大量的辅助对象。通常，每次测试运行时都会创建并清理这些对象。

但是，模拟测试仅需要创建SUT，然后mock掉它的直接协作者。这样可以省掉一些在构建复杂夹具的过程中涉及的其他工作（至少在理论上是这样。我曾遇到过关于非常复杂的模拟设置的传说，但这可能是由于未正确使用工具。）

实际上，古典派测试人员倾向于尽可能多地重用复杂的夹具。最简单的方法是将夹具设置代码放入xUnit的`setup`方法中。如果多个测试类需要使用更复杂的夹具，你可以单独创建特殊的夹具生成类。我通常根据早期ThoughtWorks XP项目中使用的命名约定将这些命名为“对象母亲（[Object Mother](https://martinfowler.com/bliki/ObjectMother.html)）”。在大型古典派测试中使用Mother是必不可少的，但是Mother是需要维护的额外代码，对Mother的任何更改都可能在测试中产生明显的连锁反应。设置固定夹具也可能会降低性能，尽管我没有听说在正确使用的情况下会遇到严重问题。大多数夹具对象的创建成本低廉，通常不会成倍增加。

结果，我听说两种风格都在指责彼此要做太多工作。模拟派说创建固定装置很费力。但古典派说这可以重用，而你必须在每次测试时都创建模拟。

### 测试隔离
当使用模拟测试时，如果一个错误被引入系统，通常只会导致包含了该错误的SUT的测试失败。但是，使用古典派的方法时，客户端对象的任何测试也可能会挂掉，从而导致测试失败，因为有故障的对象被用作另一个对象在测试中的协作者。结果，频繁使用有故障的对象会破坏整个系统中的大量测试。

模拟派认为这是一个主要问题； 要找到错误的根源并修复它，需要大量的调试。 但是，古典派并不将此视为问题的根源。通常，查看哪些测试失败可以很容易地找出问题的根源，并且开发人员可以判断出其他故障是由根故障引起的。此外，如果你定期进行测试（如你应做的那样），那么你就会知道破坏是由你上次编辑的内容引起的，因此查找故障并不难。

这里一个重要的因素是测试粒度。由于古典派测试会行执行多个真实对象，因此你经常会发现一个测试是一组对象的主要测试，而不仅仅是一个。如果集群跨越许多对象，就很难找到错误的真正源头。原因是测试的粒度太粗。

模拟派测试可能不会有这个困扰，因为他们会模拟掉SUT之外的所有对象，这清楚地表明协作者需要更细粒度的测试。也就是说，使用过于粗糙的测试不一定是古典派测试作为一种技术的失败，而是未能正确使用古典派测试的失败。一个好的经验法则是确保你为每个类分离细粒度的测试。虽然集群有时是合理的，但应将集群限制为只有很少的对象 -- 最多不超过六个。另外，如果由于过于粗粒度的测试而引发调试问题，则应该以测试驱动的方式进行调试，并在进行过程中创建更细粒度的测试。

从本质上讲，经典的xunit测试不仅仅是单元测试，而且是小型集成测试。因此，很多人喜欢这样的事实:客户端测试可以捕获单个对象测试可能遗漏的错误，特别是探测类交互的区域。模拟派测试就不具备这个额能力。此外，你还可能面临模拟派测试预期不正确的风险，从而导致单元测试运行结果是绿色的，但却隐藏了错误。

在这一点上，我要强调的是，无论你使用哪种测试方式，都必须将其与在整个系统中运行的更粗糙的验收测试相结合。我经常遇到一些项目，他们迟迟没有使用验收测试，并为此感到后悔。

### 将测试与实现耦合
当你编写模拟派风格的测试时，你正在测试SUT的对外调用，以确保它与供应商的交互是正确的。古典派测试仅关心最终状态 -- 而不是最终状态的如何来的。因此，模拟派测试与方法的实现耦合度更高。一旦更改了对协作者的调用方式，通常会导致测试失败。

这种耦会引发了两个问题。最重要的是对测试驱动开发的影响。使用模拟派风格，编写测试可以使你考虑行为的实现 -- 实际上，模拟测试人员将其视为一种优势。但是，古典派认为，应该仅考虑外部接口会发生什么，并把所有实现的考虑都留给编写测试之后，这一点很重要。

与实现的耦合也干扰了重构，因为实现的更改比古典派测试更有可能破坏测试。

同时，模拟工具的特性会使情况变得更糟。模拟工具通常会指定非常具体的方法调用和参数匹配，即便它们与该测试无关。jMock工具箱的目标之一是在期望的规范方面更加灵活，从而在一些无关紧要的地方变得宽松，代价是使用了字符串，让重构更加困难。


### 设计风格

这些测试风格对我而言最有趣的地方之一是它们如何影响设计决策。当我与两种类型的开发人员交谈时，我已经意识到这两种风格所鼓励的设计之间的一些差异，但我觉得我只是触及了表面。

我已经提到过在处理分层上的区别。模拟派支持“由外而内”的方法，而古典派更喜欢领域模型风格。

在更小的层面上，我注意到模拟派测试者倾向于放宽返回值的方法，而倾向于使用对收集对象起作用的方法。拿从一组对象收集信息来创建报告字符串的行为为例。一种常见的方法是让报告方法调用各种对象上的字符串返回方法，并将结果字符串组装到一个临时变量中。模拟派测试人员更有可能将字符串缓冲区传递到各种对象中，并让它们将各种字符串添加到缓冲区中 -- 将字符串缓冲区视为收集参数。


模拟派测试人员确实谈论了更多关于避免“火车残骸”的问题 -- getThis().getThat().getTheOther()风格的方法链。避免方法链可以说是遵循迪米特法则。虽然过长方法链是一种坏味道，但充斥着代理转发方法的中介对象也是一种坏味道。（我一直觉得将迪米特法则叫做迪米特建议更合适）

在OO设计中，人们最难理解的事情之一是“告诉而不问”（[TellDon't Ask](https://martinfowler.com/bliki/TellDontAsk.html)）原则，它鼓励你告诉对象做一些事情，而不是从对象中提取数据来在客户端代码中做这些事情。模拟派测试者说，使用模拟测试有助于达到这一点，并避免过多的getter方法。古典派则认为，还有很多其他方法可以做到这一点。


基于状态的验证的一个公认的问题是，它可能导致创建一些只为了支持验证的查询方法。单纯为测试增加额外的方法通常都不是一个好的做法，使用行为验证可以避免该问题，在实践中这种交互行为修改概率通常是很小的。

模拟派偏爱角色接口（[role interfaces](https://martinfowler.com/bliki/RoleInterface.html)），并断言使用这种测试风格会鼓励使用更多的角色接口，因为每个协作都是单独模拟的，因此更有可能转变为角色接口。因此，在上面的示例中，使用字符串缓冲区生成报告，模拟者将更有可能发明一个在该领域有意义的特定角色，它可能会由字符串缓冲区实现。

重要的是要记住，这种设计风格上的差异是大多数模仿派的主要动机。TDD的起源是希望获得支持设计优化的强大的自动化回归测试。实践证明，编写测试首先可以大大改善设计过程。模拟派对哪种设计是一种好的设计有很强的观念，并且已经开发了模拟库，来帮助人们开发这种设计风格。

## 我应该成为一个古典派还是模拟派呢？

我觉得这是一个很难自信回答的问题。就我个人而言，我一直是一个传统的的古典派TDDer，到目前为止，我看不出任何改变的理由。我看不出模拟派TDD有什么很吸引人的优势，并且我比较担心将测试与实现耦合的后果。

当我观察一个模拟派程序员时，这一点尤其让我震惊。我非常喜欢这样一个事实：在编写测试时，你关注的是行为的结果，而不是如何完成的。模拟派经常考虑如何实现SUT，以便便编写期望。这让我觉得很不自然。

我还碰到了一个弊端，就是不能在玩具以外的任何东西上尝试模拟派风格的TDD。正如我从测试驱动开发本身中学到的那样，如果不认真尝试，通常很难判断一种技术。我确实认识许多优秀的开发人员，他们是非常开心和信服模拟派。所以尽管我仍然是一位坚定的古典派，我还是会尽可能公正地提出这两种论点，以便你自己做决定。

所以，如果模拟派风格测试对你很有吸引力，我建议你尝试一下。如果你在模拟派TDD试图改进的某些领域遇到了问题，就特别值得一试。我在这里有看到了两个主要的方面。一方面，当测试失败时，你花费了大量时间进行调试，因为它们没有很干脆直接地告诉你问题在哪里。(你还可以通过在更细粒度的集群上使用古典派的TDD来改善此问题。)另一方面是，如果你的对象没有包含足够的行为，模拟派风格的测试可能会鼓励开发团队创建更多行为丰富的对象。


## 总结

随着人们对单元测试、xunit框架和“测试驱动开发”的兴趣增长，越来越多的人接触到mock对象。很多时候，人们对模拟对象框架有一些了解，但却没有完全理解支撑它们的模拟派/古典派之间的差异。无论你站在哪一边，我认为了解彼此观点的差异性都是很帮助的。虽然你不用非得成为模拟派才能发现模拟框架的便利，但了解指导软件的诸多设计决策的思路是很有用的。

本文的目的是指出这些差异，并提出它们之间的折衷方案。未来我会花更多的时间来思考模拟派，尤其是它对设计风格的影响。我希望在接下来的几年中，我们会看到更多关于这方面的文章，从而加深我们理解在编写代码之前所编写的测试产生的奇妙结果。


#### 声明
本文翻译自Martin Fowler的文章*Mocks Aren't Stubs*：

- 原文链接： [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2007年1月2日
