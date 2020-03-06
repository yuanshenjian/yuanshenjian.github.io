---
bg: "kits"
layout: post
title: "开发者工具箱"
permalink: /dev-kits
summary: "高效 • 实用"

---

* content
{:toc}

---

## Git

### Git玩穿越，篡改历史

#### 问题域1
已经提交了N个Commit，突然要回到10个之前的Commit去修改一个文件readme.md文件，该文件在之后的Commit没有任何修改

解决方案：

##### 穿越回去

使用rebase命令进行穿越

```sh
$ git rebase -i HEAD~11
```

Cosole会显示

```
pick 9a17adb I.01 - Extract getScoreName to replace conditional logic
pick e2978e0 I.02 - Replace condition with query methods
pick 966ae08 I.03 - Consolidate expression to make more readable
pick 1cbb138 I.04 - Encapsulate fields to Player class
pick d542f56 I.05 - Simplify conditional logic useing Player comparing methods
pick 39f41e2 I.06 - Create different Score class to encapsulate score rules
pick 2436a80 I.07 - Move Condition statement to Scores classes to remove duplicated checking
pick a80d045 I.08 - Extract abstract super score class
pick 2c65917 I.09 - Introduce Empty Score
pick 63cb108 I.10 - Extract to remove repeated conditional statement
pick e3925c6 I.11 - Move socres classes to package

# Rebase 756aeb4..e3925c6 onto 756aeb4 (11 commands)
#
# Commands:
```
##### 锁定目标
使用vim命令锁定目标行：第一行，按`i`进入插入模式，将首个单词`pick`更改为`edit`，保存推出

```sh
edit 9a17adb I.01 - Extract getScoreName to replace conditional logic
pick e2978e0 I.02 - Replace condition with query methods
pick 966ae08 I.03 - Consolidate expression to make more readable
pick 1cbb138 I.04 - Encapsulate fields to Player class
pick d542f56 I.05 - Simplify conditional logic useing Player comparing methods
pick 39f41e2 I.06 - Create different Score class to encapsulate score rules
pick 2436a80 I.07 - Move Condition statement to Scores classes to remove duplicated checking
pick a80d045 I.08 - Extract abstract super score class
pick 2c65917 I.09 - Introduce Empty Score
pick 63cb108 I.10 - Extract to remove repeated conditional statement
pick e3925c6 I.11 - Move socres classes to package

# Rebase 756aeb4..e3925c6 onto 756aeb4 (11 commands)
#
# Commands:
```

##### 串改历史
文件更改，该怎么改就怎么改，改完之后，添加更改

```sh
$ git add .
```
提交Commit，以下是不需要更改Commit信息的做法

```sh
$ git commit --amend --no-edit
```

如果需要更改Commit信息，可以这么做

```sh
$ git commit --amend -m 'New message here...'
```

##### 穿越回来
提交了Commit之后，就可以穿越回来

```sh
$ git rebase --continue
```


{% include comments.html %}
