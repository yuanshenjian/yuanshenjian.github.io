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

“Mock对象”已成为一个流行的术语，指的是在测试中模拟真实对象的一类特殊对象。现在，大多数编程语言都有可以轻松创建模拟对象的框架。但是，人们通常没有意识到的是，模拟对象只是特殊场景下测试对象的一种形式，它支持不同风格的测试。本文将会介绍Mock对象是如何工作的，它们如何推进基于行为验证的测试，以及社区是如何使用它们来开发不同的风格的测试。

我是几年前在极限编程（[ Extreme Programming ](https://martinfowler.com/bliki/ExtremeProgramming.html)）社区中第一次接触“mock对象”。从那以后，我就越来越多的看到模拟对象（mock object）。这在一定程度上是因为很多mock对象方面的顶尖开发人员在不时地成为我在ThoughtWorks的同事。另外，还因为我在那些受XP影响的测试文献中越来越频繁地看到它的身影。

但是，我经常看到mock对象被描述地很糟糕。特别是看到它们经常跟stub（测试环境的常见帮手）一起被搞混淆。我能理解这一点 -- 我自己有一段时间也认为它们是类似的东西，但是与mock开发人员的交流中逐渐让我对mock对象的更深刻的理解。

它们存在两大区别。首先是测试结果验证的方式不同：一个是状态验证和，一个是行为验证。其次是在测试和设计相结合的理念上两者大相径庭。我在文中将它们称为测试驱动开发（[TestDrivenDevelopment](https://martinfowler.com/bliki/TestDrivenDevelopment.html)）的古典派（classical）风格和模拟派（mockist）风格。

## 常规的测试
我将通过一个简单的示例来说明这两种风格。（该示例使用Java，但是这些原则对于任何面向对象的语言都适用）我们想获取一个订单（order）对象并依赖仓库中的产品来填充。订单（Order）类非常简单，只有产品和数量两个属性。Warehouse存放着不同产品的库存。当我们使用仓库中产品来填充的订单时，有两种可能的响应。如果仓库（warehouse）中有足够的产品来执行订单，则填充将被执行，并且仓库（warehouse）中的产品数量将减少相应的数量。如果仓库（warehouse）中没有足够的产品，那么订单（order）就不会被填充，仓库（warehouse）状态保持不变。


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

xUnit测试遵循典型的四个测试阶段：安装（setup）、执行（exercise）、验证（verify）、拆卸（teardown）。在上述测试用例中，安装是通过`setUp`方法（初始化仓库）完成，部分则通过测试方法（初始化订单）完成。对`order.fill`的调用是执行阶段，它是我们要测试的目标行为。断言语句表示进入到验证阶段，它会检查执行的方法是否正确执行。本例子中，没有显式的拆卸阶段，因为Java垃圾回收器会隐式地完成清理。

在安装过程中，我们要把两类对象放在一起。 Order是我们正在测试的类，但是要使Order.fill正常工作，还需要一个Warehouse实例。在我们例子中，订单是重点测试的对象。面向测试的人喜欢使用被测对象（object-under-test）或被测系统（system-under-test）之类的术语来命名它。这两个词都很拗口，但由于被广为接受，所以我勉为其难地使用它。我将参照Meszaros，使用“被测系统”或简称SUT。

因此，在这个测试中，我需要SUT（Order）和一个协作者（Warehouse）。需要Warehouse的原因有两个：一是要让测试正常执行（因为Order.fill调用仓库的方法），其二我要用它来做验证（因为Order.fill的会改变warehouse的状态）。随着对该话题的深入讨论，你会看到我们会对SUT和协作者做很多区分。（在本文的早期版本中，我将SUT称为“主要对象”（primary object），将协作者称为“辅助对象”（secondary object））

这种测试风格使用了**状态验证**：这意味着我们可以通过在执行方法后检查SUT及其合作者的状态来确定被执行的方法是否正确工作。除了这种方式，我们接下来讨论的mock对象可以采用另一种验证方式。


## 使用Mock对象进行测试
现在，我们使用mock对象来完成相同的事情。下面代码我会使用jMock库定义的mocks。 jMock是一个Java编写mock对象库。当然，还有一些其他的模拟对象库，只是该库是mock技术的发明者编写的最新库，从它开始上手比较合适。


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

先重点看`testFillingRemovesInventoryIfInStock`测试方法，因为我在另一个测试中采取了一些捷径。

首先，设置阶段非常不同。 一开始，它由两部分组成：数据和期望。数据部分安装了关注的对象，从某种意义上说，它类似于传统安装阶段。区别在于所创建的对象。SUT是相同的 -- Order。 但是，协作者不是仓库对象，而是一个mock warehouse -- 从技术上讲是Mock类的实例。

安装的第二部分在mock对象上设置期望，该期望表示当执行SUT时应在mock对象上调用哪些方法。

一旦所有期望设置都就绪，我就执行SUT，而后进行验证。验证包含两部分，一部分是对SUT的断言，这和之前一样。另一部分对mock对象的验证 -- 检查它们是否如期被调用。

这里的关键区别在于我们如何验证order在与warehouse的交互时做了正确的事情。在之前状态验证的例子，我们是通过断言warehouse的状态来做到这一点。Mock则使用了**行为验证**，检查order是否正确调用了warehouse。在安装阶段，我们给mock对象设置好期望并要求它在验证期间进行自我校验。如果只检查订单的，我们就无法确认它是否成功更改了订单状态，断言便形同虚设。

在第二个测试中，我做了一些不同的事情。首先，我没有使用`Mock`类的构造函数，而是使用`MockObjectTestCase`类中的`mock`方法来创建mock对象。这是jMock库提供的一种便捷方式，用了它之后不用再显式调用`verify`方法，采用了该方法创建的mock对象都会在测试结束时自动进行验证。我也可以在第一个测试中这么做，我之所以用显示验证的方式是为了更好地展示mock的工作方式。

第二个测试的另一个不同点是，我通过使用`withAnyArguments `放宽了对期望的约束。我之所以能这么做，是因为前一个测试已经检查产品编号是否会传递到warehouse，因此第二个测试没必要重复了。如果以后更改了order的逻辑，就只会破坏一个测试，从而简化了测试维护的工作。实际上，我可以完全不用显式调用`withAnyArguments`方法，因为它是默认的。

### 使用 EasyMock
还有很多其他的mock对象库。我遇到的一个全面点的框架是EasyMock，它既有Java版本，也有.NET版本。EasyMock也支持行为验证，但是与jMock在写法上有一些差异，这点很值得深入探讨。同样还是我们熟悉的测试：


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

EasyMock使用记录/回放的方式来设置期望。它会为每个要mock的对象创建一个控件对象和mock对象。mock对象跟协作对象的接口一致，控件对象为你提供其他功能。 我们通过调用mock对象的方法，并将期望的参数传给该方法，以此来描述一个期望。如果需要返回值，可以调用控件对象。一旦完成所有期望的设置，你可以在控件对象上调用`replay`方法 -- 此时，mock对象将完成记录并随时可以响应主要对象的调用。上述步骤完成后，我们就可以调用控件的`verify`方法来验证。

第一眼看到记录/回放这个比喻时，貌似大家都会感到很困扰，但很快就习惯了。它比 jMock 的约束更有优势，因为你可以直接调用mock对象的方法，而不是用字符串来指定方法。这意味着你可以使用IDE的代码补全功能。同时，任何方法名称的重构都会自动更新测试。劣势是它对你的限制更多。

jMock的开发人员正在开发新版本，新版本将用其他技术来实现mock方法的调用。


## Mock和Stub的差异
第一次引入mock对象时，很多人很容易将它与常见的stub搞混淆。渐渐地，人们似乎更了解这些差异（希望本文的早期版本起到了作用）。然而，要透彻理解mock的使用，理解mock和其他类型的测试替身（Test Double）就尤为重要。（"替身"？别担心，如果它对你来说很新，等再多读几段，你们就会成为朋友了。）

按照上述代码示例的方式写测试，你一次只专注于软件的一个元素，这是“单元测试”的基本概念。 但问题是，要让一个单元正常工作，你通常需要其他单元 -- 也就是例子中的warehouse对象。

上述例子中存在两种测试风格，第一种使用真实的warehouse对象，第二种使用mock warehouse，它不是真实的warehouse对象。使用mock对象是在测试中不用使用真实仓库的一种方法，还有其他方式能做到这一点。


探讨这个话题时会涉及各种各样的单词：stub、mock、fake、dummy，你可能很快迷失掉。本文中，我将沿用杰拉德·梅萨罗斯（Gerard Meszaros）书中的词汇。虽然不是每个人都这么用，但我认为他们是不错的词汇。由于我自己的文章，我能决定选择使用哪些些词。

Meszaros使用的术语是测试替身（Test Double），任何出于测试目的而替换掉真实对象的场景都是对它的运用。该名称源于电影中的特技替身（Stunt Double）（使用这个名字的一个目的是为了避免与已存在的一些词产生歧义）。Meszaros定义了五种特殊的测试替身：

- **Dummy**对象会被构建和传递，但实际上不会被使用。 通常它们仅用于填充参数列表。
- **Fake**对象实际上一个等效的实现，只是实现方式更简单，它们往往不适合用于生产环境。（[InMemoryTestDatabase](https://martinfowler.com/bliki/InMemoryTestDatabase.html)是一个很好的例子）
- **Stubs**对测试指定的调用提供固定的返回值，它们不会响应测试没有涉及的任何其他调用。
- **Spy**也是stubs，只是它们还会根据调用方式记录一些额外信息。比如，电子邮件服务，它会记录发送了多少消息。
- **Mocks** 会预先设定好期望，这些期望代表它们希望接收到特定规范的调用。它们会在验证过程中进行校验，从而确保接收到所有如期的调用，否则会抛出异常。

在这些类型的替身中，只有mock做的是行为验证。其他替身也可以这么做，但它通常使用的是状态验证。在执行阶段，mock的行为实际上跟其他替身一样，都是让SUT相信它正在与其真正的协作者交互 -- 只是mock对象在安装和验证阶段有所不同。

为了进一步探索测试替身，我们需要对上述例子做一些扩展。很多人只在真实对象难以使用的时候才使用测试替身。一种更常见的场景是：如果需求发生了改变，比如Order没有被成功填充时要发送一封电子邮件。而我们又不想在测试时给客户发送电子邮件。因此，我们创建一个可以操控的电子邮件系统的测试替身。

这里我们可以看到Mock和Stub的区别。如果我们要测试邮件行为，可以编写一个简单的stub，例如：

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

这两种情况我使用的都是测试替身而不是真实邮件服务。区别在于stub做的是状态验证，而mock做的是行为验证。

为了在stub上使用状态验证，我需要在stub上增加一些额外的辅助方法。结果是，stub实现MailService接口，同时添加一些额外的测试方法。

Mock对象只能做行为验证，stub则可以采用任何一种方式。Meszaros将使用了行为验证的stub定义为测试间谍（Spy）。它们的区别在于测试替身运行和验证的具体方式，这个就留给读者去探索了。


## 古典派（Classical）和模拟派（Mockist）测试
现在我们来探讨第二个差异点：古典派TDD和模拟派TDD的差异。这两者之间最大的差别是何时使用mock对象（或其他测试替身）。

**古典派TDD**风格是在尽可能使用真实的对象，只有在真实对象很难使用时才使用测试替身。因此，古典的TDDer将使用真实的warehouse和邮件服务的替身。至于测试替身的类型就没那么重要了。

但是，**模拟派TDD**实践者始终会对任何协作对象都使用mock对象。所以，他们会使用mock对象来代替真实的warehouse和邮件服务。

尽管各种模拟框架在设计时都考虑了模拟测试，但很多古典派发现它们对于创建测试替身很有用。

模拟派风格的一个重要分支是行为驱动开发（BDD）。BDD最初是由我的同事Daniel Terhorst-North发明的，目的是帮助人们理解TDD是如何帮助开发人员提升代码设计的，BDD通过把测试名称改为具体行为的名字，驱使你去思考一个对象到底需要做什么事情。从而理解TDD在提升设计方面的作用。BDD采取了模拟派的方式，但它在此基础上进行了扩展，包括命名方面和集成分析方面，我在这里不再赘述。BDD 与本文唯一相关的点在于，BDD是TDD使用模拟派测试方式的一个变体。我会在文末留下它的参考链接，你可以通过链接获得更多信息。

有时你也会看到用“底特律”风格来表示“古典派”风格，“伦敦”风格表示“模拟派”风格。这暗示了这样一个事实，即XP最初是由底特律的C3项目开发的，而模拟派的风格是由伦敦的早期XP的采用者开发的。我还应该提到过，很多模拟派TDDer不喜欢该术语，甚至不喜欢任何暗示了古典派测试和模拟派测试之间有不同风格的术语。他们认为这两种风格之间没有什么实质性的区别。


## 不同方案之间的选择
在本文中，我提到两个不同点：状态验证和行为验证以及古典派TDD和模拟派TDD。那在它们之间做选择时要牢记哪些点呢？我将从状态验证和行为验证开始谈。

首先要考虑的是上下文。我们是在考虑简单的协作（例如订单和仓库），还是复杂的协作（例如订单和邮件服务）？

如果是一个简单的协作，选择就很简单了。如果我是古典派TDDer，就不会使用mock、stub或任何测试替身。而是使用一个真实的对象并且做状态验证。如果我是模拟派TDDer，则会使用mock对象和行为验证。这个没什么好犹豫的。

如果这是一个复杂的协作，如果我是模拟派，也不用犹豫 -- 使用mock和行为验证。如果我是古典派，那么我的确需要做个选择，但是使用哪个并不重要。通常，古典派会根据实际情况选择最简单的方式。

因此，正如我们所看到的，状态验证与行为验证的选择在大部分情况下都不难决定。真正的问题在于古典派TDDer与模拟派TDDer之间的区别。事实证明，状态验证和行为验证的特点确实会影响到最后的决策，这也是我投入对多精力去研究的地方。

但在此之前，我先讲一个边界情况。你有时会碰到一些很难验证状态的情况，即使它们并不是复杂的协作，比如说缓存。缓存难点是，你无法从其状态中判断出缓存是命中还是未命中 -- 在这种情况下，忠实的古典派TDDer也会明智地选择行为验证。我相信两中方式都会存在例外的情况。

当研究古典派/模拟派的这两种选择后，我们需要考虑很多因素，我将它们粗略地分成了几组。

### 驱动TDD（Driving TDD）
Mock对象出自XP社区，XP最重要的特性之一是它对测试驱动开发的强调 -- 系统的设计的演进是通过编写测试来驱动的迭代完成。

因此，模拟派特别强调模拟测试对设计的影响也就不足为奇了。他们特别提倡一种称为需求驱动开发的风格。使用这种风格，你在开始着手开发用户故事（[user story](https://martinfowler.com/bliki/UserStory.html)）前，你会首先从外围系统的测试开始写，把接口对象当做SUT。通过思考对协作者的期望来探索SUT和它依赖对象之间的交互，这样能有效地设计SUT的外围系统的接口。


一旦第一个测试跑起来，对mock对象的期望就为下一步提供了指导规范，这为测试提供了起点。你将每个期望转换为对协作者的测试，一次只选取一个 SUT，并不断的重复这个过程。这种风格也称为“由外而内”，这是一个非常形象的名称。它在分层系统中可以良好运用。首先，你通过mock掉UI的下层模块来开发UI。然后，你为较低的层编写测试，并逐步遍历每一层。这种做法很结构化且可控，很多人还觉得它能够帮助新手更好的理解和实践OO和TDD。


古典派TDD提供的方式有点不一样。他们也可以像那样一步一步前进，但使用stub而不是mock。为了完成同样的事情，可以对协作者的响应进行硬编码，来让SUT正常工作。然后，你可以使用正确的代码替换硬编码的响应。

但是古典派TDD也可以做其他事情。常见的风格是由中间向两边。使用这种风格，你要开发一个业务功能，首先要明确哪些领域模型能让这个功能生效。然后，编写领域模型，并把需要的行为添加进去，一旦它们起作用，你就可以将UI层放上去了。这样做你可能永远不需要伪造任何东西。很多人喜欢这种方式，因为它首要关注领域模型，可以防止领域逻辑泄漏到UI中。

我还要强调的是，无论是模拟派和还是古典派，一次都只做一个故事。有一种学院派思想提倡逐层构建应用程序，而不是在完成另一层之前就开始下一层。古典派和模拟派都具有敏捷的背景，并且更喜欢细粒度的迭代。因此，他们是一个特性一项个特性地完成工作，而不是一层接一层。


### Fixture安装（Fixture Setup）
使用古典派TDD方式，你不仅需要创建SUT，还需要创建SUT的所有协作者。虽然示例中只有2个对象，但实际测试通常涉及大量的辅助对象。通常，每次测试运行时都会创建并清理这些对象。

然而，模拟派测试只需要创建SUT，然后mock掉它的直接协作者。这样可以省掉一些在构建Fixture的过程中涉及的其他工作（至少在理论上是这样。我已经遇到过非常复杂的Fixture过程，但这可能是工具使用有误。）

实际上，古典派测试人员倾向于尽可能多地重用复杂的Fixture。最简单的方法是将Fixture安装代码放到xUnit的`setup`方法中。如果多个测试类需要使用更复杂的Fixture，你可以单独创建特殊的Fixture生成类。我通常根据早期ThoughtWorks XP项目中使用的命名约定将这些命名为“对象母亲（[Object Mother](https://martinfowler.com/bliki/ObjectMother.html)）”。在大型古典派测试中使用mothers是必不可少的，但是mothers是需要维护的额外代码，对mothers的任何更改都可能在测试中产生明显的连锁反应。安装fixture也可能会降低性能，尽管我没有听说在正确使用的情况下会遇到严重问题。大多数Fixture对象的创建成本低廉，通常不会成倍增加。

基于上述原因，我听说两种派别都在指责彼此要做太多工作。模拟派说创建fixture很费力。但古典派说这可以重用，而每次测试时都创建mock就很烦人。

### 测试隔离
当使用模拟测试时，如果一个错误被引入系统，通常只会导致包含了该错误的SUT的测试失败。但是，使用古典派的方法时，依赖了这个错误对象的测试都有可能失败。因此，一个被高度依赖的对象如果出问题了，整个体统大量的测试都会失败。

模拟派认为这是一个很大问题； 要找到错误的根源并修复它，需要大量的调试。 但是，古典派并不认为这是问题的源头。通常，查看哪些测试失败通常很容易找出问题的根源，并且开发人员可以判断出其他故障是由根故障引起的。此外，如果你定期进行测试（如你应做的那样），那么你就会知道破坏是由你上次编辑的内容引起的，因此查找故障并不难。

这里一个重要的因素是测试粒度。由于古典派测试会行执行多个真实对象，因此你经常会发现一个测试是一组对象的主要测试，而不仅仅是一个。如果对象组跨越许多对象，就很难找到错误的真正源头。这是测试的粒度太粗导致的。

模拟派测试可能不会有这个困扰，因为他们会模拟掉SUT之外的所有对象，这清楚地表明协作者需要更细粒度的测试。也就是说，使用过于粗糙的测试不一定是古典派测试作为一种技术的失败，而是未能正确使用古典派测试的失败。一个好的经验法则是确保你为每个类分离细粒度的测试。虽然对象组有时是合理的，但应将对象组限制为只有很少的对象 -- 最多不超过六个。另外，如果由于过于粗粒度的测试而引发调试问题，则应该以测试驱动的方式进行调试，并在进行过程中创建更细粒度的测试。

从本质上讲，经典的xunit测试不仅仅是单元测试，而且是小型集成测试。因此，很多人认同这一点：如果对一个对象的的测试漏掉了，客户端可能会捕获到一些错误，特别是类与一些比较深的区域交互时。模拟派测试就不具备这个能力了。此外，模拟派测试还可能模拟了错误的预期，虽然单元测试通过了，但却掩盖了错误，这也会带来风险。

最后，我还要强调一点，无论你使用哪种测试方式，都必须结合可以贯穿真个系统功能的粗粒度验收测试。我经常遇到一些项目因为迟迟没有使用验收测试而感到后悔。


### 将测试与实现耦合
当你编写模拟派风格的测试时，你正在测试SUT的对外调用，以确保它与供应商的交互是正确的。古典派测试仅关心最终状态 -- 而不是状态的变迁过程。因此，模拟派测试与方法的实现耦合度更高。改变对协作者的调用会破坏测试。

这种耦会引发了两个问题。最重要一个是对测试驱动开发的影响。使用模拟派风格，编写测试可以使你考虑行为的实现 -- 实际上，模拟测试者将其视为一种优势。但是，古典派认为很重要的一点是：应该指考虑外部接口，具体实现可以留到你写完测试之后再考虑。

与实现的耦合也干扰了重构，因为实现的更改比古典派测试更有可能破坏测试。

同时，模拟工具的特性会使情况变得更糟。模拟工具通常会指定非常具体的方法调用和参数匹配，即便它们与这些特定的测试无关。jMock工具箱的目标之一是在期望的规范方面更加灵活，从而在一些无关紧要的地方变得宽松，代价是使用了字符串，让重构更麻烦。


### 设计风格

这些测试风格对我而言最有意思的地方之一是它们如何影响设计决策。当我跟两种类型的开发人员交谈时，我已经意识到这两种风格的侧重点不同，但我觉得我只是略懂一二。

我已经提过他们在处理分层上的区别。模拟派支持“由外而内”的方法，而古典派更喜欢领域模型的由内而外方式。

在更小的层面上，我注意到模拟派测试者不喜欢有返回值的方法，更喜欢作用在收集对象上的方法。
举个例子，比如你想要从一组对象中收集信息来创建一个字符串报告。一种常见的方法是让`reporting`方法调用各种对象上的字符串返回方法，并将结果字符串组装到一个临时变量中。模拟派测试者会更想要传一个string buffer到各种对象中，然后让它们把不同的字符串加到这个buffer中 -- 用string buffer来收集参数。

模拟派测试人员会更多谈论到避免“火车残骸”的问题 -- getThis().getThat().getTheOther()风格的调用方法链。避免方法链可以说是遵循迪米特法则。虽然过长方法链是一种坏味道，但充斥着代理转发方法的中间对象也是一种坏味道。（我一直觉得将迪米特法则叫做迪米特建议更合适）

在面向对象（OO）设计中，人们最难理解的事情之一是“告诉而不问”（[TellDon't Ask](https://martinfowler.com/bliki/TellDontAsk.html)）原则，它鼓励你告诉对象做一些事情，而不是从对象中提取数据来在客户端代码中做这些事情。模拟派测试者认为使用模拟测试有助于达到这一点，还能防止getter方法乱飞。古典派则认为有很多其他方法可以做到这一点。


基于状态的验证的一个已知的问题是，它可能导致创建一些只为了支持验证的查询方法。单纯为测试增加额外的方法通常都不是一个好的做法，使用行为验证可以避免该问题。


模拟派偏爱角色接口（[role interfaces](https://martinfowler.com/bliki/RoleInterface.html)），并断言使用这种测试风格会鼓励使用更多的角色接口，因为每个协作都是单独模拟的，因此更有可能转变为角色接口。因此，在上面的示例中，使用string buffer生成报告，模拟者将更有可能发明一个在该领域有意义的特定角色，不过还是用string buffer来实现。

重要的是要记住，这种设计风格上的差异是大多数模拟派的主要动机。TDD的初衷是获取能够大量支持设计的演进的自动化回归测试。实践证明，编写测试首先可以大大改善设计过程。模拟派对哪种设计是好的设计有非常强烈的见解，并且已经开发了mock库，来帮助人们发展这种设计风格。

## 我应该成为一个古典派还是模拟派呢？

我觉得这是一个很难自信回答的问题。就我个人而言，我一直是一个传统的的古典派TDDer，到目前为止，我看不出任何改变的理由。我看不出模拟派TDD有什么很吸引人的优势，反而我比较担心将测试与实现耦合所带来的不良后果。

当我观察一个模拟派程序员时，这一点尤其让我震惊。我非常喜欢当我在编写测试时，我关注的是行为的结果，而不是如何实现的。模拟派经常考虑SUT的实现，以便能够编写期望。这让我觉得很不舒服。

我还没有在真实的项目上实践过模拟派TDD，这种不利条件也让我有点痛苦。正如我从测试驱动开发本身学到的那样，如果不认真尝试，通常很难判断一种技术。我确实认识很多优秀的开发人员，他们是快乐忠实的模拟派。虽然我是一位坚定的古典派，我还是会尽可能公正地提出这两种观点，以便你自己做决定。

如果模拟派风格测试对你很有吸引力，我建议你尝试一下。如果你在模拟派TDD试图改善的领域遇到了问题，就更值得一试了。我知道两个主要的领域。一个是，当测试失败时，你花费了大量时间进行调试，因为它们没有很干脆直接地告诉你问题在哪里。(你还可以通过在更细粒度的对象组上使用古典派的TDD来改善此问题。)另一方面是，如果你的对象没有包含足够的行为，模拟派测试可能会鼓励开发团队创建更多行为丰富的对象。


## 总结

单元测试的一个有趣之处在于，随着xunit框架和测试驱动开发的成熟，越来越多的人拥抱了mock对象的方式。很多时候，人们对模拟对象框架有一些了解，但却没有完全理解模拟派/古典派之间的的本质区别。无论你倾向哪一种方式，我认为理解彼此观点的差异性很有帮助。然而，你并不一定非要成为一个模拟派而精通mock框架，但理解指导软件设计决策的思想大有裨益。

本文的目的是指出这些差异，并说明它们之间的取舍。对于模拟派的思考，相比我研究的这些，还有更多的内容，特别是它对设计风格的影响。我希望在未来几年，我们可以看到更多使用这种方式写的测试代码，那会加深我们对写代码前先写测试（TDD）这种迷人的方式的理解。


#### 声明
本文翻译自Martin Fowler的文章*Mocks Aren't Stubs*：

- 原文链接： [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2007年1月2日
