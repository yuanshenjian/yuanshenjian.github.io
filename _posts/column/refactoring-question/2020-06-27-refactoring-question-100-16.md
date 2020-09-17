---
layout: post

title: "Switch语句这个坏味道，到底坏在哪里？"
date: 2020-06-27
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

在老马的《重构》第1版中，将Switch Statement定义成一个代码坏味道。而且里面提到一句：

> 大多数时候，一看到Switch语句，你就应该考虑以多态替换它。

我最初看到这个描述的时候，我持有一点疑虑的。你仔细想，如果Switch Statement是一个坏味道的话，那程序中的条件分支（if-else）也是一种坏味道，因为if-else和switch从本质上都是条件分支。然而，if-else没有被公认为一种代码坏味道，而且在程序中不可避免会用到这个。

在《重构》第2版中，老马直接将这个坏味道改成 Repeated Switches，并做了澄清：

> 因为在20世纪90年代末，程序员太过于忽视多态的价值，我们希望矫枉过正。如今的程序员已经更多地使用多态，switch语句也不像15年前那样有害无益，很多语言支持更复杂的switch语句，而不只是根据基本类型值来做判断条件。因此。我们现在更关注重复的Switch

实际上***重复*才是罪魁祸首，重复会让代码修改起来更加困难。在第一版中，他其实也提到这点：

> 从本质上讲，switch语句的问题在于重复，你会经常发现同样的switch语句散布在不同的地方。如果为它添加一个新的case字句，就必须找到所有switch语句并修改它们。

作为重构的初学者，当你看到wwitch坏味道的时候，要抓住**重复**这个关键点，而且重复的switch有可能以if-else体现出来。只要有相同的条件判断值在多处出现，就散发出Repeated Switch的味道。没必要的重复的代码，是你应该要提高警惕的地方，接下来可能要想点办法消除它，比如使用多态来取代。

这里附上一个重复Switch的案例：

**案例一：**

```java
public class Item {

    private String name;

    private int sellIn;

    private int quality;

    public Item(String name, int sellIn, int quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }

    @Override
    public String toString() {
        return this.name + ", " + this.sellIn + ", " + this.quality;
    }

    void update() {
        updateQuality();

        updateSellIn();

        if (isExpired()) {
            updateQualityAfterExpired();
        }
    }

    private boolean isExpired() {
        return sellIn < 0;
    }

    private void updateQuality() {
        if (isAgedBrie()) {
            if (quality < 50) {
                quality = quality + 1;
            }
            return;
        }
        if (isBackstagePass()) {
            increaseQuality();
            if (sellIn < 11) {
                increaseQuality();
            }
            if (sellIn < 6) {
                increaseQuality();
            }
            return;
        }
        if (isSulfuras()) {
            return;
        }
        if (quality > 0) {
            quality = quality - 1;
        }
    }

    private void updateSellIn() {
        if (isSulfuras()) {
            return;
        }
        sellIn = sellIn - 1;
    }

    private void updateQualityAfterExpired() {
        if (isAgedBrie()) {
            increaseQuality();
            return;
        }
        if (isBackstagePass()) {
            quality = 0;
            return;
        }
        if (isSulfuras()) {
            return;
        }
        if (quality > 0) {
            quality = quality - 1;
        }
    }

    private void increaseQuality() {
        if (quality < 50) {
            quality = quality + 1;
        }
    }

    private boolean isSulfuras() {
        return name.equals("Sulfuras, Hand of Ragnaros");
    }

    private boolean isBackstagePass() {
        return name.equals("Backstage passes to a TAFKAL80ETC concert");
    }

    private boolean isAgedBrie() {
        return name.equals("Aged Brie");
    }
}
```

案例二：

```java
public class CheckInSystem {
    private Map<String, String> checkInRecords = new HashMap<>();

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
}

public class Employee {
    static final int ENGINEER = 0;
    static final int SALESMAN = 1;
    static final int MANAGER = 2;

    private int type;
    private String name;
    private int monthlySalary;
    private int commission;
    private int bonus;

    public Employee(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public String getName() {
        return name;
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
}
```

以上代码，你找到了重复的Switch了吗？
