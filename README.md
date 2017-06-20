# GitHub Page Theme

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badge/)

<http://sjyuan.cc>

这是一个GitHub Page的主题模板，完全开源免费，欢迎下载使用！

![Blog](https://github.com/sjyuan-cc/sjyuan-cc.github.io/raw/master/assets/images/readme/home.jpg)


## 主要特性
本主题主要涵盖一下特性：

- 主页
	- 个人简介
	- 工作经历
	- 技能图表
	- 我的博客
	- 相关链接
- 博客
	- 文章列表
	- 文章分类
	- Insight文章
- 功能
	- 分页
	- 文章搜索
	- 置顶
	- 浏览统计
	- 评论系统
	- 分享

## 快速搭建
Clone代码到你的机器

```
$ git clone https://github.com/sjyuan-cc/sjyuan-cc.github.io.git github-blog
```

安装Jekyll

```
$ sudo apt-get install -y ruby ruby-dev make gcc nodejs
$ sudo gem install jekyll --no-rdoc --no-ri
$ jekyll -v
```

启动服务

```
$ cd github-blog
$ jekyll server -P 3000
```
访问服务

在浏览器中输入 <http://127.0.0.1:3000>

## 功能介绍

### 分类
文件`github-blog/_includes/sections/category.html`:

```html
<div class="categories">
	{% assign title = page.title | downcase %}
	{% for category in site.categories %}
	{% assign categoryName = category | first | downcase %}
	{% if title == categoryName %}
		<a class="category btn btn-white btn-xs selected" href="{{site.baseurl}}/{{ category | first | downcase }}">{{ category | first }}</a>
	{% else %}
		<a class="category btn btn-white btn-xs" href="{{site.baseurl}}/{{ category | first | downcase }}">{{ category | first }}		</a>
	{% endif %}
	{% endfor %}
</div>
```

### 分享
![Share](https://github.com/sjyuan-cc/sjyuan-cc.github.io/raw/master/assets/images/readme/share.jpg)

文件`github-blog/_includes/sections/share.html`:

```html
<div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    <a class="a2a_button_wechat"></a>
    <a class="a2a_button_facebook"></a>
    <a class="a2a_button_twitter"></a>
    <a class="a2a_button_google_plus"></a>
    <a class="a2a_button_linkedin"></a>
    <a class="a2a_button_sina_weibo"></a>
</div>
<script>
    var a2a_config = a2a_config || {};
    a2a_config.color_main = "D7E5ED";
    a2a_config.color_border = "AECADB";
    a2a_config.color_link_text = "333333";
    a2a_config.color_link_text_hover = "333333";
</script>
<script async src="https://static.addtoany.com/menu/page.js"></script>

```

### 评论
博客在 [disqus]() 和 [畅言]() 社会化系统做了选择，鉴于 [disqus]() 只能在翻墙的网络访问，所以采用了后者。

![Comment](https://github.com/sjyuan-cc/sjyuan-cc.github.io/raw/master/assets/images/readme/comment.jpg)

文件`github-blog/_includes/sections/comments.html`:

```html
<div id="SOHUCS" sid="{{ page.id | replace: '/', '' }}"></div>
<script charset="utf-8" type="text/javascript" src="https://changyan.sohu.com/upload/changyan.js"></script>
<script type="text/javascript">
    window.changyan.api.config({
        appid: '{{ site.changyan.app_id}}',
        conf: '{{ site.changyan.conf}}'
    });
</script>
```

### 统计
博客采用了[不蒜子](http://busuanzi.ibruce.info/)给主页以及文章做统计。

```js
<script async src="//dn-lbstatics.qbox.me/busuanzi/2.3/busuanzi.pure.mini.js"></script>
<p id="sjyuan_site_pv">
	<span id="busuanzi_container_site_pv"><span id="busuanzi_value_site_pv"></span> Views</span>
	<strong>&copy; {{ 'now' | date: "%Y" }} {{site.title }}</strong>
</p>
```

### 分页
文件`github-blog/_includes/sections/pagination.html`:

```html
{% if counter > 5 %}
    <div class="col-lg-6 col-lg-offset-6">
		<div class="pag-holder"></div>
	</div>
{% endif %}
{% if counter == 0 %}
    <div class="col-lg-8 col-lg-offset-2">
		<p>Sorry,no blog！</p>
    </div>
{% endif %}
```

### 搜索
进入[博客主页](http://sjyuan.cc)后，右下方会浮现出一个搜索Icon，可以点击该Icon或者双击`Ctrl`键进行搜索:

![Search](https://github.com/sjyuan-cc/sjyuan-cc.github.io/raw/master/assets/images/readme/search.jpg)

文件`github-blog/static/js/search.js`:

```js
$.getJSON("/static/search.json")
	.done(function (data) {
		if (data.code == 0) {
        $("#search-content").typeahead({
          source: data.data,
          displayText: function (item) {
            return item.title;
          },
          afterSelect: function (item) {
            window.location.href = item.url;
          }
        });
      }
    });
```

### 置顶
进入[博客主页](http://sjyuan.cc)后，滚动页面时，右下方会浮现出一个向上箭头的Icon，点击可以回到顶部。

文件`github-blog/static/js/back-to-top.js`:

```js
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 200) {
            $("#back-to-top").fadeIn(500);
            $("#search").css("bottom", "60px")

        } else {
            $("#back-to-top").fadeOut(500);
            $("#search").css("bottom", "10px")
        }
    });

    $("#back-to-top").click(function () {
        $("body,html").animate({
            scrollTop: "0"
        }, 500);
    });
});
```

## 私人订制




