---
layout: post

title: "TDD Kata - 保龄球（Bowling）Coding"
date: 2020-03-25
categories: [eXtreme Programming]
tags: [TDD-KATA]
column: TDD-KATA

author: "袁慎建"

brief: "
TDD KATA，Bowling 保龄球，TDD的练习，有一定的挑战。本文我将带你进行编码实现，感受TDD的魅力。
"

---

* content
{:toc}

---

阅读本文后，希望你能够有如下收获：

1. 能够采用TDD的方式实现保龄球业务需求。
2. 掌握TDD的节奏：红（失败测试）、绿（产品代码）、蓝（重构）
3. 理解测试驱动设计的一种运用场景。

如若与你期望相符，欢迎你继续阅读！文章篇幅较长，代码居多，由于代码多为片段截取，建议阅读时保持注意力集中。

在上一篇文章 [TDD Kata - 保龄球（Bowling）Tasking](https://www.jianshu.com/p/b9581aa8216f)中，我对保龄球业务需求做了分析和拆分，并得到了一个需求的任务列表，本文我将基于此任务列表一步一步地进行TDD。

开始前，先来TDD的三顶帽子：
![](https://upload-images.jianshu.io/upload_images/1445879-ba984614295cdb28.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
我会将每一个测试从失败到通过到重构的过程视为一个循环，在这个循环中，我不断地切换红、Lv、蓝三顶帽子。


## 任务列表

1. 每一轮的两次扔球都没有碰到球，所得分数为0。
2. 每一轮的两次扔球都没有全部击倒球瓶，所得分数为每次扔球的倒瓶数总和。
3. 存在一轮SPARE，所得分数为每次扔球的倒瓶数总和再加SPARE轮后的一球的倒瓶数。
4. 存在一轮STRIKE，所得分数为每次扔球的倒瓶数总和再加STRIKE轮后两球的倒瓶数。
5. 十轮均为STRIKE，所得分数300。


## TDD
### 第一个测试
> 1. 每一轮的两次扔球都没有碰到球，所得分数为0。

从任务里中取出第一个任务，按照任务描述翻译成第一个测试：

```java
class BowlingGameTest {
    @Test
    void should_return_0_when_scoring_given_every_roll_is_0() {
        BowlingGame bowlingGame = new BowlingGame(); // 3. 倒逼出来需要一个BowlingGame
        for (int rollIndex = 0; rollIndex < 20; rollIndex++) {
            bowlingGame.roll(0); // 4. 倒逼出来需要一个roll方法记录每一次的倒瓶数
        }
        int score = bowlingGame.scoring(); // 2. 倒逼驱动出分数是bowlingGame暴露的行为
        assertThat(score).isEqualTo(0); // 1. 从断言开始，定义验收标准
    }
}
```

编写测试的过程中，记住你戴的是红帽子，控制自己注意力，思考如何去验收功能，如何定义接口，这个过程其实是在设计系统的对外的用户接口，此时接口可能还不存在，但是按照你的意图，按照业务含义去定义接口出来，这就是一个反向驱动的过程。但你要控制自己避免受IDE的编译错误的提示干扰，一心一意将测试写完，确认写完之后，然后再切换帽子。


```java
public class BowlingGame {
    public void roll(int pouredNumber) {
    }
    public int scoring() {
        return 0;
    }
}
```

带上另一顶帽子（Lv 帽子），开始编写产品代码，解决编译错误，借助IDE的自动提示功能，上述代码让第一个测试通过了。你可能觉得幸福来得太突然，这感觉有点不合理，没关系，你的目标是让第一个测试通过了。通过后你尽管带上蓝帽子，看看有什么重构工作没有，至少目前为止，不需要重构产品代码。但可以对测试代码做一些重构：

```java
    @Test
    void should_return_0_when_scoring_given_every_roll_is_0() {
        BowlingGame bowlingGame = new BowlingGame();
        for (int rollIndex = 0; rollIndex < 20; rollIndex++) {
            bowlingGame.roll(0);
        }
        assertThat(bowlingGame.scoring()).isEqualTo(0); // 重构：内联变量，初学者也可以不这么做，便于区分when和then
    }
```

做完重构，运行测试通过之后，进入下一个循环。

### 第二个测试
> 2. 每一轮的两次扔球都没有全部击倒球瓶，所得分数为每次扔球的倒瓶数总和。

带上红帽子，按照任务编写第二个测试：

```java
    @Test
    void should_sum_all_rolls_when_scoring_given_every_roll_is_common_as_3() {
        BowlingGame bowlingGame = new BowlingGame();
        for (int rollIndex = 0; rollIndex < 20; rollIndex++) {
            bowlingGame.roll(3);
        }
        assertThat(bowlingGame.scoring()).isEqualTo(60);
    }
```

运行测试之后，如期失败，带上Lv的帽子，编写产品代码：

```java
public class BowlingGame {
    private List<Integer> pouredNumbers = new ArrayList<>();
    public void roll(int pouredNumber) {
        pouredNumbers.add(pouredNumber);
    }
    public int scoring() {
        return pouredNumbers.stream().mapToInt(number -> number).sum();
    }
}
```
此时，因为第二个测试，你不得不存储每一球的倒瓶数，然后进行求和，进行这样的完善，第二个测试也通过了。通过了，就带上蓝帽子，进行重构，可以对测试代码进行进一步的重构，移除重复代码：

```java
class BowlingGameTest {
    private BowlingGame bowlingGame;
    @BeforeEach
    void setup() {
        bowlingGame = new BowlingGame();
    }
    @Test
    void should_return_0_when_scoring_given_every_roll_is_0() {
        rolls(0);
        assertThat(bowlingGame.scoring()).isEqualTo(0);
    }
    @Test
    void should_sum_all_rolls_when_scoring_given_every_roll_is_common_as_3() {
        rolls(3);
        assertThat(bowlingGame.scoring()).isEqualTo(60);
    }
    private void rolls(int score) {
        for (int rollIndex = 0; rollIndex < 20; rollIndex++) {
            bowlingGame.roll(score);
        }
    }
}
```


做完后着进入下一个循环，此时如果想去喝口水，尽管走开，回来可以无缝衔接。

### 第三个测试
> 3. 存在一轮SPARE，所得分数为每次扔球的倒瓶数总和再加SPARE轮后的一球的倒瓶数。

带上红帽子，按照任务编写第三个测试：

```java
    @Test
    void should_involve_SPARE_bonus_when_scoring_given_one_SPARE_occurs() {
        bowlingGame.roll(6);
        bowlingGame.roll(4);
        for (int rollIndex = 0; rollIndex < 18; rollIndex++) {
            bowlingGame.roll(3);
        }
        assertThat(bowlingGame.scoring()).isEqualTo(67);
    }
```
运行测试，发现失败了，戴上Lv帽子，回到代码中，发现此时要引入轮循环遍历了，可能对代码进行大幅度的修改，这个改动对之前的功能影响较大，为了保险期间，我先删掉这个测试，回到上一个循环，进行重构：

```java
    public int scoring() {
        int totalScore = 0;
        int rollIndex = 0;
        for (int round = 0; round < 10; round++) {
            totalScore += pouredNumbers.get(rollIndex);
            totalScore += pouredNumbers.get(rollIndex + 1);
            rollIndex += 2;
        }
        return totalScore;
    }
```

运行测试，并没有破坏之前的测试。然后继续戴上第三个循环的红帽子，此时我通过重构引入了轮循环的设计。到这里，思考一下这个重构是什么触发的？（5秒后......）刚才，我在添加了新测试的时候，发现为了实现这个新功能，我需要引入轮循环，这是新的测试驱动出来的一种思考，我在新增功能的时候发现原有的设计有点困难，我先停下来，回到上一个循环，对代码进行重构，这样的好处是我不用去思考如何让新的测试通过，而是把注意力控制在上一个循环的重构中。

其实，我完全可以不返回上一个循环，直接对代码进行大幅度重构，如果这样做，我带了上一个循环的的蓝帽子和本循环的Lv帽子，注意力会比较多，所以为了控制焦点，我回退了一步。

经过上一步重构，我又回到第三个循环，戴上Lv帽子，此时我就较为容易的在新的设计中增加代码，来让第三个测试通过：

```java
    public int scoring() {
        int totalScore = 0;
        int rollIndex = 0;
        for (int round = 0; round < 10; round++) {
            if (pouredNumbers.get(rollIndex) + pouredNumbers.get(rollIndex + 1) == 10) { // Spare case
                totalScore += 10;
                totalScore += pouredNumbers.get(rollIndex + 2);
                rollIndex += 2;
            } else {
                totalScore += pouredNumbers.get(rollIndex);
                totalScore += pouredNumbers.get(rollIndex + 1);
                rollIndex += 2;
            }
        }
        return totalScore;
    }
```

运行测试，确认所有测试通过后，我戴上蓝帽子，进行了一波重构：

```java
    public int scoring() {
        int totalScore = 0;
        int rollIndex = 0;
        for (int round = 0; round < 10; round++) {
            if (isSpare(rollIndex)) {
                totalScore += 10;
                totalScore += pouredNumbers.get(rollIndex + 2);
            } else {
                totalScore += pouredNumbers.get(rollIndex);
                totalScore += pouredNumbers.get(rollIndex + 1);
            }
            rollIndex += 2;
        }
        return totalScore;
    }

   // 重构: 抽取查询方法
    private boolean isSpare(int rollIndex) {
        return pouredNumbers.get(rollIndex) + pouredNumbers.get(rollIndex + 1) == 10;
    }
```

然后对测试代码进行了一轮重构：

```java
    @Test
    void should_involve_SPARE_bonus_when_scoring_given_one_SPARE_occurs() {
        bowlingGame.roll(6);
        bowlingGame.roll(4);

        rolls(3, 18);
        assertThat(bowlingGame.scoring()).isEqualTo(67);
    }

   // 重构：引入次数的参数
    private void rolls(int score, int times) {
        for (int rollIndex = 0; rollIndex < times; rollIndex++) {
            bowlingGame.roll(score);
        }
    }
```


### 第四个测试
>4. 存在一轮STRIKE，所得分数为每次扔球的倒瓶数总和再加STRIKE轮后两球的倒瓶数。

带上红帽子，按照任务编写第四个测试：

```java
    @Test
    void should_involve_STRIKE_bonus_when_scoring_given_one_STRIKE_occurs() {
        bowlingGame.roll(10);
        rolls(3, 18);
        assertThat(bowlingGame.scoring()).isEqualTo(70);
    }
```

戴上Lv帽子，编写实现，有了上一个案例的经验积累，我很容易想到设计：

```java
    public int scoring() {
        int totalScore = 0;
        int rollIndex = 0;
        for (int round = 0; round < 10; round++) {
            if (pouredNumbers.get(rollIndex) == 10) { // Strike case
                totalScore += 10;
                totalScore += pouredNumbers.get(rollIndex + 1);
                totalScore += pouredNumbers.get(rollIndex + 2);
                rollIndex++;
            } else if (isSpare(rollIndex)) {
                totalScore += 10;
                totalScore += pouredNumbers.get(rollIndex + 2);
                rollIndex += 2;
            } else {
                totalScore += pouredNumbers.get(rollIndex);
                totalScore += pouredNumbers.get(rollIndex + 1);
                rollIndex += 2;
            }
        }
        return totalScore;
    }
```

运行测试，通过了测试，戴上蓝帽子进行重构：

```java
public class BowlingGame {
    private List<Integer> pouredNumbers = new ArrayList<>();

    public void roll(int pouredNumber) {
        pouredNumbers.add(pouredNumber);
    }

    public int scoring() {
        int totalScore = 0;
        int rollIndex = 0;
        for (int round = 0; round < 10; round++) {
            if (isStrike(rollIndex)) { // Refactoring: Extract query method
                totalScore += (10 + getStrikeBonus(rollIndex));
                rollIndex++;
            } else if (isSpare(rollIndex)) {
                totalScore += (10 + getSpareScore(rollIndex));
                rollIndex += 2;
            } else {
                totalScore += (pouredNumbers.get(rollIndex) + pouredNumbers.get(rollIndex + 1));
                rollIndex += 2;
            }
        }
        return totalScore;
    }

    // 抽取方法：Spare Bonus
    private int getSpareBonus(int rollIndex) {
        return pouredNumbers.get(rollIndex + 2);
    }

    // 抽取方法：Strike Bonus
    private int getStrikeBonus(int rollIndex) {
        return pouredNumbers.get(rollIndex + 1) + pouredNumbers.get(rollIndex + 2);
    }
    private boolean isStrike(int rollIndex) {
        return pouredNumbers.get(rollIndex) == 10;
    }
    private boolean isSpare(int rollIndex) {
        return pouredNumbers.get(rollIndex) + pouredNumbers.get(rollIndex + 1) == 10;
    }
}
```

基本上到这里，几种场景都覆盖了，此时我发现我的任务列表还有一个完美场景，我隐约预料到这个场景应该能通过，如果我的代码没有Bug的话。我依照惯例，编写了第五个测试。

### 第五个测试

> 5. 十轮均为STRIKE，所得分数300。

带上红帽子，按照任务编写第五个测试：

```java
    @Test
    void should_sum_all_STRIKE_bonus_when_scoring_given_every_round_is_STRIKE() {
        rolls(10, 12);
        assertThat(bowlingGame.scoring()).isEqualTo(300);
    }
```

运行测试时通过的，其实我在上一个循环中的感觉是对的，但这个测试我已经编写了，它没有失败，我将其保留下来，因为它能够为我的保护网增添一条保护丝线。同样的道理，在上一篇文章中，我提到一个信息：QA如果穷举出10轮中的所有场景，将有59049种，此时你如果对自己的程序不太放心，你可以任意编写的场景来验证你的代码，直到你放心为止。

## 总结
1. TDD的过程始终按照Tasking环节中的任务列表来小步前进。
2. 一个TDD循环中通过三顶帽子能够控制自己的注意力，分离关注点。
3. TDD是一个以终为始的方式，从结果倒逼+意图导向的方式驱动我们去思考系统的接口如何定义。
4. 为了更加容易的增加新功能，我需要对原有代码进行重构，而我采取了回退的方式，一次只关注一件事情。并且，此时的重构想法是由新的测试驱动出来的。
