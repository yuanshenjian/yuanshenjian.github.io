---
layout: post

title: "Learning JavaScript 翻译笔记（一）"
date: 2016-05-29
categories: [JAVASCRIPT]
tag: [JavaScript,Translation]

author: "袁慎建"



---

* content
{:toc}

## 第0章 关于Learning JavaScript的翻译
转眼加入[ThoughtWorks](https://thoughtworks.com/)已经一年多了，在这片海洋里，自己还只能算一只虾兵蟹将，有很多东西要去学习。不只是简单的学习，还要系统的学习，从碎片化到体系化。对我来说，这是一个较长的持续过程。这个过程有多漫长，从这次翻译中有一些体会。

当时接手这本书的翻译，想法很简单--ES6有点意思。后来想想，自己是不是有点作，明明擅长后端，却要去翻译一本前端技术的书，常言道`No Zuo，No Die`嘛。开始翻译前，看过[《漫谈翻译》](https://read.douban.com/ebook/1195649/)这个书，对翻译有了一些旁观者的理解，心中有了一些初级章法可循。然后试翻译了几页，感觉没有那么糟糕，遂不自量力，跟另一个同事一起接手这个活。

其实，初次翻译对我来说意义最大的是在于如何自我驱动地去坚持完成一项目标，其次，对我英文和中文都有提升，尤其是中文的语言组织和表达，比这更有意思的是，我还能再次巩固JavaScript，而且是比较新的ES6。综合这些事前了解和考虑，以及事中的体会，一开始的不自量力导致现在只能"逼着"自己硬着头皮翻译下去。

那么问题来了，翻译会变味吗？这是一个严肃的话题。本来读英文原著，能读懂7、8分就基本掌握书中内容了，而如果翻译时又打了折扣，读者阅读译本时有种云雾缭绕的感觉。尝试了一段时间，仔细琢磨，确实发现翻译不是把语句用中文翻译过来就OK的事情，但好在，这是一个干货书，自己对JavaScript也有一定的基础，所以难度远不比登天。为了尽可能让读者不要远离原文的意思，有时候一个句子会反复斟酌，寻求帮助指点，终究是可以将意思翻译过来。困难摆在眼前，总会克服，慢一点，但重要的是每天都在前进。

---

## 第1章 关于Learning JavaScript的翻译笔记
本文是一些粗略的笔记，主要记录了翻译过程中学习到的JavaScript技术点和一些好的实践指导。本文为上篇，一共有四篇，当第四篇发布的时候，意味着整本书的初译完成，而自己对后三篇也满怀期待。由于是粗略的笔记，只记录的是一些要点。为什么这么做呢？一来是担心自己翻译完之后，只专注于英文语法和中文表达去了，而ES6讲了个啥，却是两眼一抹黑；二来分享出来，了了渴望分享的欲望。

PS：笔记从原书第二章开始。

---

## 第2章 JavaScript开发工具
>工欲善其事，必先利其器。

好的工具能让事半功倍，使用一些高效的工具也是一个高效程序员的必备技能。

---

### 编辑器
一个好的编辑器也至关重要，语法高亮、括号匹配、代码折叠、自动补全这些都是非常有用的特性，目前比较好的JavaScript编辑器有[SublimeText](https://www.sublimetext.com/)、[TextMate](https://macromates.com/)、[Atom](https://atom.io/)。

---

### 版本控制工具
Git（饭桶），团队协作开发的最佳代码版本控制工具，程序员的不二选择。[安装Git](https://git-scm.com/)

---

### 终端工具
不管是Linux、MacOSX，还是Window，都自带了终端，作为开发人员，在Window上使用终端是是一件很痛苦的事情，如果你非得使用Window，[Git Bash](https://git-for-windows.github.io/)或许能减轻它带来的痛苦。

* Linux/Max OSX系统自带的终端Terminal。
* [iTerm2 for Mac OSX](https://www.iterm2.com/)。
* [Git Bash for Windows](https://git-for-windows.github.io/)。

---

### 包管理工具
包管理，其实就是管理项目的依赖，对于JavaScript开发，[npm](https://www.npmjs.com/)属当下最流行的包管理工具了。

---

### 构建工具
构建工具是项目开发必备的工具，它能自动化一些重复的任务，比如编译，转码，测试，压缩，合并等。有了它，程序员便可以从中解放出来，目前最流行的JavaScript构建工具有[Gulp](http://gulpjs.com/)和[Grunt](http://gruntjs.com/)。

---

### 转换编译工具
将ES6代码转换成ES5的代码需要一些转换编译工具，目前最流行的有两款：

* [Babel](https://babeljs.io/)
* [Traceur](https://github.com/google/traceur-compiler)

---

## 第3章 字面量、变量、常量、数据类型

### 变量和常量
变量命名，关键字`let`

```javascript
let currentTempC = 22; // degrees Celsius
let targetTempC, room1 = "conference_room_a", room2 = "lobby";
```

常量命名，关键字`const`

```javascript
const ROOM_TEMP_C = 21.5;
const ROOM_TEMP_C = 21.5, MAX_TEMP_C = 30;
```
>实践指导：  
1. 通常情况下，我们做的最多的是给某个数据取一个好的名字，而很少去改变它的值，所以尽可能使用常量，当找到合理的理由去改变常量的值的时候，再将它改成变量也不迟。  
2. JavaScript中推荐变量使用驼峰命名法命名变量;推荐使用大写字母命名常量，单词之间使用`_`间隔。

---

### 标识符命名
变量、常量以及函数的名称统称为标识符。JavaScript中标识符的命名有几个规则：

```
1. 必须以字母、$、下划线（_）开头。
2. 必须是由字母、数字、$和下划线（_）组成。
3. 不可以使用保留字。
4. 可以使用Unicode字符（例如，π 或者 ö）。
```

业界推荐了两种命名规范：

```javascript
1. 驼峰命名法：单词的首字母大写，看起来像骆驼背上的驼峰，所以叫驼峰命名法。比如 let personName = "sjyuan"
2. 蛇形命名法：所有单词小写，多个单词之间使用下划线（_）隔开。比如 let person_name = "sjyuan"
```

附加建议的约定：

```
1. 类名除外，标识符不应该以大写字母开头。
2. 大多数情况下， 下划线（一到两个）开始的标识符代表特殊变量或内部变量。
3. 在jQuery中，$开始的标识符默认特指jQuery-wrapped对象。
```

>实践指导：  
选择业界推荐的标识符的命名规范，但要优先遵守团队的内部规范，只要选定一种规范，就要始终保持一致。

---

### 基本类型和对象
JavaScript有六种基本类型：`数字`、`字符串`、`布尔型`、`null`、`undefined`、`符号`，它们都是不可变的数据类型。

#### 数字
数字，都是双精度的，有`二进制`、`八进制`、`十进制`、`十六进制`。

```javascript
let count = 10;            // integer literal; count is still a double
const blue = 0x0000ff;     // hexadecimal (hex ff = decimal 255)
const umask = 0o0022;      // octal (octal 22 = decimal 18)
const roomTemp = 21.5;     // decimal
const c = 3.0e6;           // exponential (3.0 × 10^6 = 3,000,000)
const e = -1.6e-19;        // exponential (-1.6 × 10^-19 = 0.00000000000000000016)
const inf = Infinity;
const ninf = -Infinity;
const nan = NaN;           // "not a number"
```

#### 字符串
字符串，使用`单引号`、`双引号`、`重音符`，一般使用`双引号`，遇到需要转义时，可灵活选择。

```javascript
const dialog1 = "He looked up and said \"don't do that!\" to Max.";
const dialog2 = 'He looked up and said "don\'t do that!" to Max.';
```
常用的特殊字符：`\n`、`\r`、`\t`、`\'`、`\"`、`\$`、`\\`、`\uXXXX`、`\xXX`

#### 模板字符串，字符串链接

数字和字符串混合运算时，结果往往会造成困惑，如下面例子：  

```javascript
const result1 = 3 + '30';  // 3 is converted to a string; result is string '330'
const result2 = 3 * '30';  // '30' is converted to a number; result is numeric 90
```

用来给字符串中插入值，在ES6之前，只能使用`+`来链接字符串，ES6允许使用`${}`来给字符串中插入值。

ES6之前：

```javascript
let currentTemp = 19.5;
// 00b0 is the Unicode code point for the "degree" symbol
const message = "The current temperature is " + currentTemp + "\u00b0C";
```
ES6，使用重音符\`代替`"`:

```javascript
let currentTemp = 19.5;
const message = `The current temperature is ${currentTemp}\u00b0C`;
```

#### 多行字符串

使用重音符还可以写出多行字符串，但是有个缺点，换行后的空格也会被插入到多行字符串中。

```javascript
const multiline = `line1
line2`;

const multiline = `line1
      line2
      line3`; 
```

>实践指导：  
1. 多行字符穿很容易引入困惑的空格，尽量避免使用多行字符串，使用`+`和`\n`配合。  
2. 经验法则提倡，当需要数字时，就使用数字（没有引号），当需要字符串时，就使用字符串。

#### 布尔型
布尔型只有两种值`true`和`false`，在JavaScript中，任何值都可以代表布尔值。

```javascript
let heating = true;
let cooling = false;
```

#### 符号（Symbol）
符号是ES6的一种新型数据类型，它代表唯一的token。符号的创建：

```javascript
const RED = Symbol();
const ORANGE = Symbol("The color of a sunset!");
RED === ORANGE  // false: every symbol is unique
```

#### null和undefined
`null`和`undefined`是JavaScript中两种特殊的数据类型，表示值不存在。

>实践指导：  
null提供给开发者使用，undefined则更多是JavaScript自身使用，`undefined`表示未赋值。尽量不要在代码中使用`undefined`，除非你故意模仿变量未赋值。

#### 对象
对象本质上是容器，它可以代表很复杂的值，它的值在生命周期中是可以改变的。对象的定义：

```javascript
const obj = {
	"color":"yellow",
	"type":"object"
};
```

可以使用`成员访问运算符`访问对象的属性，但要求属性必须是一个合法的标识符，如果标识符不合法时，可以使用`计算机成员访问运算符`访问。

```javascript
obj["not an identifier"] = 3;
obj["not an identifier"];         // 3
obj["color"];                     // "yellow"
```
还可以使用`计算机成员访问运算符`访问`符号`属性：

```javascript
const SIZE = Symbol();
obj[SIZE] = 8;
obj[SIZE];                      // 8
```

#### 数字、字符串、布尔型对应的对象类型
数字、字符串和布尔型对应有`Number`、`String`、`Boolean`对象类型，看一个`String`的例子：

```javascript
const s = "hello";
s.toUpperCase();        // "HELLO"
```

>ES6引入了`Map`和`Set`以及它们对应的"弱类型"`WeakMap`和`WeakSet`


#### 类型转换
关于数据类型，看一些直观的例子，转换成数字（如果内容不符合数字类型，结果为`NaN`）：

```javascript
const numStr = "33.3";
const num = Number(numStr);   // this creates a number value, *not* an instance of the Number object
```
还可以使用内置函数，它们会忽略不相关的内容：

```javascript
const a = parseInt("16 volts", 10);   // the " volts" is ignored, 16 is parsed in base 10
const b = parseInt("3a", 16);         // parse hexadecimal 3a; result is 58
const c = parseFloat("15.5 kph");     // the " kph" is ignored; parseFloat always assumes base 10

```

转换成字符串：

```javascript
const n = 33.5;
n;                                     // 33.5 - a number
const s = n.toString();
s;                                     // "33.5" - a string

const arr = [1, true, "hello"];
arr.toString();                            // "1,true,hello"
```

转换成布尔值：

```javascript
const n = 0;                    // "falsy" value
const b1 = !!n;                 // false
const b2 = Boolean(n);          // false
```

---

## 第4章 控制流
控制流是完成一些开发任务的有效手段，下面我们通过一些例子来学习控制流。

---

### 循环

#### while 循环

```javascript
let funds = 50;     // starting conditions
while(funds > 1 && funds < 100) {
	funds = funds + 2;  // two steps forward
	funds = funds - 1;  // one step back
}
```

>实践指导：  
`while`和`for`循环，当循环体只有一行语句时，也推荐使用`{}`。

#### do...while 循环

```javascript
let remaining = totalBet;
do {
	let bet = rand(1, remaining);
	let face = randFace();
	bets[face] = bets[face] + bet;
	remaining = remaining - bet;
} while(remaining > 0);
```

#### for 循环

```javascript
const hand = [];
for(let roll = 0; roll < 3; roll++) {
	hand.push(randFace());
}

for(let temp, i=0, j=1; j<30; temp = i, i = j, j = i + temp) {
	console.log(j);
}
```

#### for...in 循环

```javascript
const player = { name: 'Thomas', rank: 'Midshipman', age: 25 };
for(let prop in player) {
    if(!player.hasOwnProperty(prop)) continue;  // see explanation below
    console.log(prop + ': ' + player[prop]);
}
```

#### for...of 循环
`for...of`循环是ES6的新特性

```javascript
const hand = [randFace(), randFace(), randFace()];
for(let face of hand) {
	console.log(`You rolled...${face}!`);
}
```

---

### if...else 及 switch 语句

#### 单if 语句

```javascript
let winnings = 0;
for(let die=0; die < hand.length; die++) {
	let face = hand[die];
	if(bets[face] > 0) winnings = winnings + bets[face];
}
funds = funds + winnings;
```

#### if...else 语句

```javascript
const bets = { crown: 0, anchor: 0, heart: 0,
        spade: 0, club: 0, diamond: 0 };
    let totalBet = rand(1, funds);
    if(totalBet === 7) {
        totalBet = funds;
        bets.heart = totalBet;
    } else {
        // distribute total bet
    }
funds = funds - totalBet;
```

#### if...else..else... 语句

```javascript
if(new Date().getDay() === 3) {   // new Date().getDay() returns the current
	totalBet = 1;                 // numeric day of the week, with 0 = Sunday
} else if(funds === 7) {
	totalBet = funds;
} else {
	console.log("No superstition here!");
} 
```

#### switch 语句

```javascript
switch(expression) {
    case value1:
        // executed when the result of expression matches value1
        [break;]
    case value2:
        // executed when the result of expression matches value2
        [break;]
        ...
    case valueN:
        // executed when the result of expression matches valueN
        [break;]
    default:
        // executed when none of the values match the value of expression
        [break;]
} 
```

---

## 第5章 表达式和运算符
初学编程者，对表达式和语句的区别不是很清楚，以一言而蔽之：
>表达式能解析成值，而非表达式，即语句，不能解析成值，只是在执行某项操作。

### 表达式
用一个简单的例子看看表达式是什么：

```javascript
let i = 0;
i++;             //表达式
console.log(i);  //语句
```
因为表达式能够解析成值，表达式可以用来赋值，例如：

```javascript
let x, y;               
y = x = 3 * 5;    // original statement
y = x = 15;       // multiplication expression evaluated
y = 15;           // first assignment evaluated; x now has value 15, y is still undefined
```

---

### 运算符
有过小学数学和编程经验的人，对算术运算符已经不陌生了。从大的方面讲，运算符分主要有`算符运算符`、`比较运算符`、`逻辑运算符`，另外还有`分组运算符`。


#### 算术运算符
算术运算符有`+`、`-`、`*`、`/`、`%`、`++`、`--`，要注意的是`+`和`-`可以用来转换数字的正负值，还可以将字符串转化成数字，看一些例子:

```javascript
const x = 5;
const y = 3 - -x;     // y is 8

const s = "5";
const y = 3 + +s;   // y = 8; 如果没有+，将会执行字符串连接操作

const x1 = 0, x2 = 3, x3 = -1.5, x4 = -6.33;
const p1 = -x1*1;
const p2 = +x2*2;
const p3 = +x3*3;
const p3 = -x4*4;

const p4 = 10 % 3  // 1
const p4 = 10 % 3.6  // 2.8
```

>实践指导：   
运算符优先级是一个比较复杂的东西，不建议强记硬背，用多了就熟悉了，但写代码的时候，遇到复杂的运算时，强烈建议使用`()`来指定运算优先级，让代码可读性更强，而不是选择卖弄自己对优先级顺序的掌握。


#### 比较运算符
比较运算符，莫过于`>`、`<`、`>=`、`<=`、`==`、`===`、`!=`、`!==`，需要强调的是`==`和`===`的区别。

```javascript
1. ==，表示值相等，比如33=="33"返回true。
2. ===，表示值相等，数据类型还要一致，比如33==="33"返回false。
```

再看几个关于`==`和`===`的例子:

```javascript
const n = 5;
const s = "5";
n === s;                          // false -- different types
n !== s;                          // true
n === Number(s);                  // true -- "5" converted to numeric 5
n !== Number(s);                  // false
n == s;                           // true; not recommended
n != s;                           // false; not recommended
const a = { name: "an object" };
const b = { name: "an object" };
a === b;                          // false -- distinct objects
a !== b;                          // true
a == b;                           // false; not recommended
a != b;                           // true; not recommended
```

>实践指导：   
抽象等式的大部分问题行为都发生在null、undefined、空字符串以及数字0这些值上，如果你确定比较的值在这些值之外，使用抽象等式运算符通常也是安全的。为了养成好的习惯，建议使用`===`和`!==`做两个值相等与否的比较。


#### 逻辑运算符
在JavaScript中，逻辑运算符，不仅能够操作布尔值、返回布尔值，还能够操作非布尔值、返回非布尔值，要了解这个神奇的机制，就需要知道JavaScript中布尔值和非布尔值的映射关系了。

代表false的值有：

```javascript
1. undefined
2. null
3. false
4. 0
5. NaN
6. '' 
```

代表true的值有：

```javascript
1. 所有对象，包括空数组。
2. 包含空格的字符串，如 " "
3. 字符串"false"
```

>实践指导：  
如果想让空数组返回false，可以使用`arr.length`作为判断条件。


逻辑运算符有三种，`&&`、`||`、`!`，它们的多种组合用三个表表示：

|  x   |   y  | x && y |
|:-----|:-----|:------:|
|false |false |false   |
|false |true  |false   |
|true  |false |false   |
|true  |true  |true    |


|  x   |   y  | x \\\ y|
|:-----|:-----|:------:|
|false |false |false   |
|false |true  |ture    |
|true  |false |true    |
|true  |true  |true    |

|  x   |   !x  |
|:-----|:-----:|
|false |true   |
|true  |false  |

`&&`和`||`都有短路求值功能，看个例子：

```javascript
const skipIt = true;
let x = 0;
const result = skipIt || x++; 
// result = true; x = 0

const doIt = false;
let x = 0;
const result = doIt && x++;
// result = false; x = 0
```

如果将初始条件置换一下，会发生什么呢？

```javascript
const skipIt = false;
let x = 0;
const result = skipIt || x++; 
// result = 0; x = 1

const doIt = true;
let x = 0;
const result = doIt && x++;
// result = 0; x = 1
```

可以看到，当后者表达式执行后，`result`的值就是表达式的值，这就跳到非布尔值的逻辑运算了，非布尔值的逻辑运算跟布尔值类似，只不过返回值不一定布尔值了。

>运算符还有很多，诸如`三元运算符`、`逗号运算符`、`赋值运算符`、`分组运算符`、`类型判断运算符`、`位运算符`、`void 运算符`，前五者很好理解，后两者不常用，更多内容，欢迎翻阅原著或译本。

ES6引入了一个很受欢迎的新运算符，`解构运算符`，看个直观的例子：

```javascript
const obj = { b: 2, c: 3, d: 4 }; // a normal object
const {a, b, c} = obj;           // object destructuring assignment
a;                              // undefined: there was no property "a" in obj
b;                             // 2 
c;                            // 3 
d;                           // reference error: "d" is not defined

const obj = { b: 2, c: 3, d: 4 };
let a, b, c;
{a, b, c} = obj;        // 错误的写法
({a, b, c} = obj);     // 正确
```


>实践指导：  
1. 简单的赋值条件语句，使用`三元运算符`代替`if...else`。例如：`label = isPrime(n) ? 'prime' : 'non-prime';`代替`if(isPrime(n)) { label = 'prime';} else { label = 'non-prime';}`。  
2. 使用短路求值逻辑运算符`||`代替`if`赋值语句。例如：`options = options || {};`代替`if(!options) { options = {} };`。











