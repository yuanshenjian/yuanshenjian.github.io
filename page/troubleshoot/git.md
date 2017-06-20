---
layout: post
title: Git 锦囊
permalink: /troubleshoots/git

date: 2016-12-12
---

* content
{:toc}

---

## 如何不删除修改的前提下删除一次Commit

##### 更新时间：2017-06-20

#### 问题描述
做了一次Commit，但是发现因为失误导致了一些不必要的修改，要删掉这次commit，但又想保留大部分修改。

---

#### 解决方案
使用`reset`命令即可完成，因为当使用`reset`命令时没有使用`--hard`或者`--soft`，只会将`HEAD`指针移动到指定的commit，而不会修改任何文件。

```sh
$ git reset HEAD^
```

---


## 如何将某个文件从Repository的所有历史记录中删除

##### 更新时间：2017-02-20

#### 问题描述
代码库已经存在1000个commit，此时发现Repository的根路径中`credential.xml`文件存放了敏感信息，需要将这个信息删除掉，而这个信息可能很早之前就添加到Git中，此时需要将`credential.xml`文件的所有历史记录删除

---

#### 解决方案

##### 备份原始Repository

```sh
$ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
```

##### 删除`credential.xml`

```sh
$ git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch credential.xml' \
  --prune-empty --tag-name-filter cat -- --all
```

##### 如果需要ignore `credential.xml`文件，添加到`.gitignore`文件中

```sh
$ echo "YOUR-FILE-WITH-SENSITIVE-DATA" >> .gitignore
$ git add .gitignore
$ git commit -m "Add YOUR-FILE-WITH-SENSITIVE-DATA to .gitignore"
```

##### 覆盖所有分支或所有标记的Release

```sh
$ git push origin --force --all

$ git push origin --force --tags
```

##### 通知其他成员进行`rebase`操作，切记不要使用`merge`操作

```sh
$ git pull -r
```

##### 确定`git filter-branch`没有副作用之后，强制本地Repository所有对象被引用并回收垃圾

```sh
$ git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
$ git reflog expire --expire=now --all
$ git gc --prune=now
```

---


## 如何删除一次Commit中所包含的意外或错误的修改

##### 更新时间：2017-01-16

#### 问题描述
刚做了一次commit，里面包含了5处更改。跑测试却挂了，检查发现因为疏忽提交了一个错误的修改，此修改会导致CI挂掉，但其他4处更改是有用的。

---

#### 解决方案 一
把错误的修改更正回来再做一次commit，此时会多一次commit记录，而上一次commit包含了错误更改【不推荐使用】。

---

#### 解决方案 二
将上一次commit打成patch备份出来，然后将HEAD reset到上一次commit。

```sh
# 备份commit，-1表示备份最近一次commit，会生成一个.patch文件
# eg. -3会生成三个.patch文件，patch文件名字有commit信息组成
$ git format-patch -1

# 将HEAD重置到上一次commit
$ git reset --hard HEAD~1

# 应用备份
$ git apply 0001-finished-user-login.patch

# 重新做提交，add之前更正错误的更改
$ git add all

# Commit
$ git commit -m "finished-user-login"
```

---

#### 方案延伸
存在一种特殊内网的开发场景，Git服务器是搭建在内网中，而自己的开发机器无法被授权连接内网，所以在自己机器开发完后需要制作成patch文件，通过授权的移动设备（U盘）将patch拷贝到被授权的机器，然后在被 授权的机器上做提交。

>eg. 之前我在新加坡某银行客户现场就是此类开发场景，客户提供的电脑的性能满足不了开发要求，自己的Mac电脑又不被授权联网，所以采用patch这种增量的方式解决了此问题，最大化节省了拷贝时间。


---

## 如何将一个分支替换掉另一个分支

##### 更新时间：2016-12-12

#### 问题描述
存在两个分支，一个名为`development`，另一个为`release`，使用`release`替换掉`development`分支。

---

#### 解决方案

```sh
$ git checkout release
$ git merge -s ours development
$ git checkout development
$ git merge release
```



