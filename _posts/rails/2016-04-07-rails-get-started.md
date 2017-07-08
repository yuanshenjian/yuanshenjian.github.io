---
layout: post

title: "Ruby on Rails 初次冲浪体验"
date: 2016-04-07
categories: [RAILS]
tag: [Ruby,Rails]

author: "袁慎建"
brief: "
Rails是一个用Ruby编写的Web应用开发框架。它的设计目标是通过预先提供开发人员最开始需要的基础设施，从而让Web应用开发更加容易。它可以让你写更少的代码来完成其他语言和框架所不能完成的工作。有过Rail开发经验的人都说它能让web应用开发变得更有趣。</br></br>

本文介绍初次使用Rails的过程，涵盖了从0到1的过程，建议一步一步跟着文章进行操练。
"

---

* content
{:toc}


>Rails is a web application development framework written in the Ruby language. It is designed to make programming web applications easier by making assumptions about what every developer needs to get started. It allows you to write less code while accomplishing more than many other languages and frameworks. Experienced Rails developers also report that it makes web application development more fun.

Rails是一个用Ruby编写的Web应用开发框架。它的设计目标是通过预先提供开发人员最开始需要的基础设施，从而让Web应用开发更加容易。它可以让你写更少的代码来完成其他语言和框架所不能完成的工作。有过Rail开发经验的人都说它能让web应用开发变得更有趣。

---

## 环境准备

1. Ruby，版本 >= 1.9.3。[Ruby安装](https://www.ruby-lang.org/en/documentation/installation/)
2. RubyGems包管理系统, 跟Ruby@1.9以上版本一起安装。
3. SQLite3数据库.[SQLite3安装](https://www.sqlite.org/download.html)

```
 $ ruby -v
 ruby 2.2.3p173

 $ gem -v
 2.4.8

 $ sqlite3 --version
 3.8.10.2
```

---

## 心里准备
此文档篇幅着实太长，单从目录来看就可能被吓退三尺。`实践是最好的学习方式`，你不必太担心，此文章乃纯干货，通篇在编码实践，让你在实践中感受Rails的魅力。它比一个简单的`Hello World`更加有趣以及充满了挑战性。它是一个循序渐进的过程，能让你在每一小步都能获得信心和成就感。同时，请相信我，在你到达终点前，你都不必纠结于其中的实现细节。而当你敲下最后一个`回车`的时候，你对Rail的感觉也许会从陌生人到恋人。开启愉快的Rails之旅吧，美好的风景在后面。

---

## 创建Rails项目

### 安装Rails
>`$ gem install rails`

```
$ rails -v
Rails 4.2.5
```

---

### 创建一个blog应用
>`$ rails new blog`
>`$ cd blog`

生成工程的目录结构，此处英文较为通俗，建议读一读，心里稍微有个数。

|File/Folder |	Purpose|
|:---------- |:-----------|
|app/        | Contains the controllers, models, views, helpers, mailers and assets for your application. You'll focus on this folder for the remainder of this guide.
|bin/        | Contains the rails script that starts your app and can contain other scripts you use to setup, deploy or run your application.
|config/     | Configure your application's routes, database, and more. This is covered in more detail in Configuring Rails Applications.
|config.ru	  | Rack configuration for Rack based servers used to start the application.
|db/         |	Contains your current database schema, as well as the database migrations.
|Gemfile Gemfile.lock | These files allow you to specify what gem dependencies are needed for your Rails application. These files are used by the Bundler gem. For more information about Bundler, see the Bundler website.
|lib/        | Extended modules for your application.
|log/        | Application log files.
|public/ 	  | The only folder seen by the world as-is. Contains static files and compiled assets.
|Rakefile	  | This file locates and loads tasks that can be run from the command line. The task definitions are defined throughout the components of Rails. Rather than changing Rakefile, you should add your own tasks by adding files to the lib/tasks directory of your application.
|README.rdoc | This is a brief instruction manual for your application. You should edit this file to tell others what your application does, how to set it up, and so on.
|test/	     | Unit tests, fixtures, and other test apparatus. These are covered in Testing Rails Applications.
|tmp/	     | Temporary files (like cache, pid, and session files).
|vendor/	  | A place for all third-party code. In a typical Rails application this includes vendored gems.


---

## Hello, Rails！

### 启动Rails服务
>`$ rails server`

```
$ rails server
	=> Booting WEBrick
	=> Rails 4.2.5 application starting in development on http://localhost:3000
	=> Run `rails server -h` for more startup options
	=> Ctrl-C to shutdown server
	[2016-04-06 11:32:26] INFO  WEBrick 1.3.1
	[2016-04-06 11:32:26] INFO  ruby 2.2.3 (2015-08-18) [x86_64-darwin14]
	[2016-04-06 11:32:26] INFO  WEBrick::HTTPServer#start: pid=18756 port=3000
```

---


### 访问Rails服务
>打开你的浏览器，输入[http://localhost:3000](http://localhost:3000)，会看到下面页面

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-1.png' }})

---


### 添加一个控制器
>`$ rails generate controller welcome index`

```
$ rails generate controller welcome index
	create  app/controllers/welcome_controller.rb
	route  get 'welcome/index'
	invoke  erb
	create    app/views/welcome
	create    app/views/welcome/index.html.erb
	invoke  test_unit
	create    test/controllers/welcome_controller_test.rb
	invoke  helper
	create    app/helpers/welcome_helper.rb
	invoke    test_unit
	invoke  assets
	invoke    coffee
	create      app/assets/javascripts/welcome.coffee
	invoke    scss
	create      app/assets/stylesheets/welcome.scss
```

下面是generator为你生成的两个重要的控制器和视图文件

- app/controllers/welcome_controller.rb
- app/views/welcome/index.html.erb.

将`index.html.erb`文件内容替换成:`<h1>Hello, Rails!</h1>`

- 再次访问[http://localhost:3000](http://localhost:3000)，你会有新的发现。

---


### 设置应用主页
打开路由配置文件`config/routes.rb`，添加内容`root 'welcome#index'`：

```
Rails.application.routes.draw do
  root 'welcome#index'

  get 'welcome/index'

  # The priority is based upon order of creation:
  # first created -> highest priority.
  #
  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  #
  # ...
```

---

## 让程序跑起来

### 添加**Article**资源
继续编辑路由配置文件`config/routes.rb`，添加内容`resources :articles`：

```
Rails.application.routes.draw do

  resources :articles

  root 'welcome#index'
end
```

---


### 查看资源的RESTful API
>`$ rake routes`

```
$ rake routes
       Prefix Verb   URI Pattern                  Controller#Action
         root GET    /                            welcome#index
     articles GET    /articles(.:format)          articles#index
              POST   /articles(.:format)          articles#create
  new_article GET    /articles/new(.:format)      articles#new
 edit_article GET    /articles/:id/edit(.:format) articles#edit
      article GET    /articles/:id(.:format)      articles#show
              PATCH  /articles/:id(.:format)      articles#update
              PUT    /articles/:id(.:format)      articles#update
              DELETE /articles/:id(.:format)      articles#destroy
welcome_index GET    /welcome/index(.:format)     welcome#index
```

---


### 为**Article**资源添加控制器
>`$ rails generate controller articles`

```
$ rails generate controller articles
      create  app/controllers/articles_controller.rb
      invoke  erb
      create    app/views/articles
      invoke  test_unit
      create    test/controllers/articles_controller_test.rb
      invoke  helper
      create    app/helpers/articles_helper.rb
      invoke    test_unit
      invoke  assets
      invoke    coffee
      create      app/assets/javascripts/articles.coffee
      invoke    scss
      create      app/assets/stylesheets/articles.scss
```

会生成`articles_controller.rb`控制器文件

```ruby
class ArticlesController < ApplicationController
end
```

---


### 创建添加**Article**的表单视图
创建文件`app/views/articles/new.html.erb`，添加表单内容：

```html
<h1>New Article</h1>
<%= form_for :article, url: articles_path do |f| %>
  <p>
    <%= f.label :title %><br>
    <%= f.text_field :title %>
  </p>

  <p>
    <%= f.label :text %><br>
    <%= f.text_area :text %>
  </p>

  <p>
    <%= f.submit %>
  </p>
<% end %>
```
访问链接[http://127.0.0.1:3000/articles/new](http://127.0.0.1:3000/articles/new)

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-2.png' }})

---


### 为**Article**添加create控制器方法
打开文件`articles_controller.rb`，添加`create`方法：

```ruby
class ArticlesController < ApplicationController
  def new
  end

  def create
  	render plain: params[:article].inspect
  end
end
```
此时提交表单之后，页面会显示:

```
{"title"=>"First article!", "text"=>"This is my first article."}`
```


---


### 创建一个**Article**数据库模型
>`$ rails generate model Article title:string text:text`

```
$ rails generate model Article title:string text:text
      invoke  active_record
      create    db/migrate/20160406072726_create_articles.rb
      create    app/models/article.rb
      invoke    test_unit
      create      test/models/article_test.rb
      create      test/fixtures/articles.yml
```

生成了一个重要文件`db/migrate/20160406072726_create_articles.rb`

```ruby
class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :title
      t.text :text

      t.timestamps null: false
    end
  end
end
```

---

### 同步数据库表
>`$ rake db:migrate`

```
$ rake db:migrate
== 20160406072726 CreateArticles: migrating ===================================
-- create_table(:articles)
   -> 0.0010s
== 20160406072726 CreateArticles: migrated (0.0010s) ==========================
```

---

### 在Controller中保存**Article**
更改`articles_controller.rb`中的`create`方法

```ruby
  def create
    @article = Article.new(params[:article])

    @article.save

    redirect_to @article
  end
```

此时提交之后会发生异常

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-3.png' }})

添加一个提取request form data参数的方法来解决这个问题

```ruby
def create
	@article = Article.new(article_params)

	@article.save
	redirect_to @article
end

private
def article_params
	params.require(:article).permit(:title, :text)
end
```

---

### 别急着提交表单，添加一个展示文章的视图页面
在`articles_controller.rb`中添加`show`方法

```ruby
def show
    @article = Article.find(params[:id])
end
```
添加视图页面`app/views/articles/show.html.erb`

```html
<p>
  <strong>Title:</strong>
  <%= @article.title %>
</p>

<p>
  <strong>Text:</strong>
  <%= @article.text %>
</p>
```
提交表单后，会将刚才添加的内容展示出来

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-4.png' }})

---

### 列出所有的文章
在`articles_controller.rb`中添加`index`方法

```ruby
def index
    @articles = Article.all
end
```

添加视图页面`app/views/articles/index.html.erb`

```html
<h1>Listing articles</h1>

<table>
  <tr>
    <th>Title</th>
    <th>Text</th>
  </tr>

  <% @articles.each do |article| %>
    <tr>
      <td><%= article.title %></td>
      <td><%= article.text %></td>
    </tr>
  <% end %>
</table>
```

访问[http://localhost:3000/articles ](http://localhost:3000/articles)，可以看到文章列表

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-5.png' }})

---

### 添加导航链接
给主页`app/views/welcome/index.html.erb`添加跳转`Article`列表链接

```html
<%= link_to 'My Blog', controller: 'articles' %>
```

从`app/views/articles/index.html.erb`跳转到添加`Article`页面

```html
<%= link_to 'New article', new_article_path %>
```

给`app/views/articles/new.html.erb`添加返回`Article`列表的链接

```html
<%= link_to 'Back', articles_path %>
```

---

### 添加数据校验，让我们的数据更好看
该在`app/models/article.rb`model文件中做文章了

```ruby
class Article < ActiveRecord::Base
  validates :title, presence: true, length: { minimum: 5 }
end
```

添加了校验之后，Controller保存`Article`时做一些兼容，更改`articles_controller.rb`中的`create`和`new`方法。**注意：**不要忘了`new`方法的更改

```ruby
def new
  @article = Article.new
end

def create
  @article = Article.new(article_params)

  if @article.save
    redirect_to @article
  else
    render 'new'
  end
end

```

将校验信息展示在`app/views/articles/new.html.erb`页面上

```html
<%= form_for :article, url: articles_path do |f| %>
  <% if @article.errors.any? %>
    <div id="error_explanation">
      <h2>
        <%= pluralize(@article.errors.count, "error") %> prohibited
        this article from being saved:
      </h2>
      <ul>
        <% @article.errors.full_messages.each do |msg| %>
          <li><%= msg %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <p>
    <%= f.label :title %><br>
    <%= f.text_field :title %>
  </p>

  <p>
    <%= f.label :text %><br>
    <%= f.text_area :text %>
  </p>

  <p>
    <%= f.submit %>
  </p>

<% end %>

<%= link_to 'Back', articles_path %>

```
故意不填title提交表单，可以看到如下提示

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-6.png' }})

---

### 休息片刻
>到这里，喝口水休息一下，我们已经找到了给一个资源添加一种操作的感觉了，那么更新操作也就那么回事了。简单总结一下：

- 创建资源对应的数据库model(M)。
- 在routes.rb中为资源添加路由。
- 创建Controller，在Controller中添加控制器对应的方法，来接收处理客户端的请求(C)。
- 在Controller对应方法中操作处理model，并返回处理结果。
- 创建视图文件，展示Controller响应结果(V)。

具体添加什么方法，可以运行`$ rake routes`来查看

```
$ rake routes
       Prefix Verb   URI Pattern                  Controller#Action
     articles GET    /articles(.:format)          articles#index
              POST   /articles(.:format)          articles#create
  new_article GET    /articles/new(.:format)      articles#new
 edit_article GET    /articles/:id/edit(.:format) articles#edit
      article GET    /articles/:id(.:format)      articles#show
              PATCH  /articles/:id(.:format)      articles#update
              PUT    /articles/:id(.:format)      articles#update
              DELETE /articles/:id(.:format)      articles#destroy
         root GET    /                            welcome#index
welcome_index GET    /welcome/index(.:format)     welcome#index
```

---

### 更新**Article**
在`app/controllers/articles_controller.rb`中添加`edit`方法，返回`Article`对象到编辑页面

```ruby
def edit
  @article = Article.find(params[:id])
end
```
创建`Article`编辑页面`app/views/articles/edit.html.erb`

```html
<h1>Editing article</h1>

<%= form_for :article, url: article_path(@article), method: :patch do |f| %>

    <% if @article.errors.any? %>
        <div id="error_explanation">
          <h2>
            <%= pluralize(@article.errors.count, "error") %> prohibited
            this article from being saved:
          </h2>
          <ul>
            <% @article.errors.full_messages.each do |msg| %>
                <li><%= msg %></li>
            <% end %>
          </ul>
        </div>
    <% end %>

    <p>
      <%= f.label :title %><br>
      <%= f.text_field :title %>
    </p>

    <p>
      <%= f.label :text %><br>
      <%= f.text_area :text %>
    </p>

    <p>
      <%= f.submit %>
    </p>

<% end %>

<%= link_to 'Back', articles_path %>
```
添加更新`Article`的控制器中`update`方法

```ruby
def update
  @article = Article.find(params[:id])

  if @article.update(article_params)
    redirect_to @article
  else
    render 'edit'
  end
end
```
给`Article`列表页面添加编辑`Article`的链接

```html
<table>
  <tr>
    <th>Title</th>
    <th>Text</th>
    <th colspan="2"></th>
  </tr>

  <% @articles.each do |article| %>
    <tr>
      <td><%= article.title %></td>
      <td><%= article.text %></td>
      <td><%= link_to 'Show', article_path(article) %></td>
      <td><%= link_to 'Edit', edit_article_path(article) %></td>
    </tr>
  <% end %>
</table>
```
访问[http://127.0.0.1:3000/articles/](http://127.0.0.1:3000/articles/)

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-7.png' }})

---

### 再来看看怎么删除**Article**
>运行`$ rake routes`后，可以看到`DELETE /articles/:id(.:format)      articles#destroy`，所以删除`Article`对应的控制器方法是`destroy`

我们只需要在`app/views/articles/index.html.erb`中添加一个删除的链接

```html
<a href='http://example.com/articles/1/destroy'>look at this cat!</a>
```

添加控制器方法

```ruby
def destroy
    @article = Article.find(params[:id])
    @article.destroy

    redirect_to articles_path
end
```

添加删除超链接之后的页面

```html
<h1>Listing Articles</h1>
<%= link_to 'New article', new_article_path %>
<table>
  <tr>
    <th>Title</th>
    <th>Text</th>
    <th colspan="3"></th>
  </tr>

  <% @articles.each do |article| %>
    <tr>
      <td><%= article.title %></td>
      <td><%= article.text %></td>
      <td><%= link_to 'Show', article_path(article) %></td>
      <td><%= link_to 'Edit', edit_article_path(article) %></td>
      <td><%= link_to 'Destroy', article_path(article),
              method: :delete,
              data: { confirm: 'Are you sure?' } %></td>
    </tr>
  <% end %>
</table>
```

---

### 再来一个Model，给你的文章添加评论
>`$ rails generate model Comment commenter:string body:text article:references`

```
$ rails generate model Comment commenter:string body:text article:references
      invoke  active_record
      create    db/migrate/20160406120306_create_comments.rb
      create    app/models/comment.rb
      invoke    test_unit
      create      test/models/comment_test.rb
      create      test/fixtures/comments.yml
```

运行之后生成了如下文件：

|文件       |     用途
|:--------|:---------|
|db/migrate/20160406120306_create_comments.rb | Migration to create the comments table in your |database (your name will include a different timestamp)
|app/models/comment.rb                        | The Comment model
|test/models/comment_test.rb                  | Testing harness for the comments model
|test/fixtures/comments.yml	                  | Sample comments for use in testing

打开`app/models/comment.rb`，可以看到多了一个`belongs_to`

```ruby
class Comment < ActiveRecord::Base
  belongs_to :article
end
```

再看看生成的Migration文件`app/db/migrate/20160406120306_create_comments.rb`，`t.references`创建了一个外键`article_id`，引用了`Article`表

```ruby
class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :commenter
      t.text :body
      t.references :article, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
```

同样运行`$ rake db:migrate`

```
$ rake db:migrate
== 20160406120306 CreateComments: migrating ===================================
-- create_table(:comments)
   -> 0.0014s
== 20160406120306 CreateComments: migrated (0.0014s) ==========================
```

---

### 手动关联两个模型
`Article`与`Comment`存在一对多的，反过来就是多对一

- 每条评论属于一篇文章
- 一篇文章有多条评论

```ruby
class Comment < ActiveRecord::Base
  belongs_to :article
end

class Article < ActiveRecord::Base
  has_many :comments
  validates :title, presence: true, length: { minimum: 5 }
end
```

---

### 让客户端能访问资源**Comments**
配置`config/routes.rb`

```ruby
resources :articles do
  resources :comments
end
```

### 给**Comment**添加控制器
>`$ rails generate controller Comments`

```
$ rails generate controller Comments
      create  app/controllers/comments_controller.rb
      invoke  erb
      create    app/views/comments
      invoke  test_unit
      create    test/controllers/comments_controller_test.rb
      invoke  helper
      create    app/helpers/comments_helper.rb
      invoke    test_unit
      invoke  assets
      invoke    coffee
      create      app/assets/javascripts/comments.coffee
      invoke    scss
      create      app/assets/stylesheets/comments.scss
```

运行之后生成了如下文件：

|文件       |     用途
|:--------|:---------|
|app/controllers/comments_controller.rb	     | The Comments controller app/views/comments/ Views of the controller are stored here
|test/controllers/comments_controller_test.rb | The test for the controller
|app/helpers/comments_helper.rb	            | A view helper file
|app/assets/javascripts/comment.js.coffee     | CoffeeScript for the controller
|app/assets/stylesheets/comment.css.scss | Cascading style sheet for the controller



编辑`app/views/articles/show.html.erb`文件，在页面上给资源添加评论

```html
<p>
  <strong>Title:</strong>
  <%= @article.title %>
</p>

<p>
  <strong>Text:</strong>
  <%= @article.text %>
</p>

<h2>Add a comment:</h2>
<%= form_for([@article, @article.comments.build]) do |f| %>
  <p>
    <%= f.label :commenter %><br>
    <%= f.text_field :commenter %>
  </p>
  <p>
    <%= f.label :body %><br>
    <%= f.text_area :body %>
  </p>
  <p>
    <%= f.submit %>
  </p>
<% end %>

<%= link_to 'Edit', edit_article_path(@article) %> |
<%= link_to 'Back', articles_path %>
```


给`CommentsController`添加`create`方法

```ruby
class CommentsController < ApplicationController
  def create
    @article = Article.find(params[:article_id])
    @comment = @article.comments.create(comment_params)
    redirect_to article_path(@article)
  end

  private
    def comment_params
      params.require(:comment).permit(:commenter, :body)
    end
end
```

再次编辑`app/views/articles/show.html.erb`文件，在页面上将已经添加的评论展示出来

```html
...
<h2>Comments</h2>
<% @article.comments.each do |comment| %>
  <p>
    <strong>Commenter:</strong>
    <%= comment.commenter %>
  </p>

  <p>
    <strong>Comment:</strong>
    <%= comment.body %>
  </p>
<% end %>
...
```
访问[http://127.0.0.1:3000/articles/1](http://127.0.0.1:3000/articles/1)，当然你要先确保有id=1的数据

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-8.png' }})

---

### 删除Comments
添加删除链接，编辑`app/views/articles/show.html.erb`文件

```html
...
<h2>Comments</h2>
<% @article.comments.each do |comment| %>
    <p>
      <strong>Commenter:</strong>
      <%= comment.commenter %>
    </p>

    <p>
      <strong>Comment:</strong>
      <%= comment.body %>
    </p>
    <p>
      <%= link_to 'Destroy Comment', [comment.article, comment],
                  method: :delete,
                  data: { confirm: 'Are you sure?' } %>
    </p>
<% end %>
...

```
在`CommentsController`中添加`destroy`方法

```ruby
def destroy
    @article = Article.find(params[:article_id])
    @comment = @article.comments.find(params[:id])
    @comment.destroy
    redirect_to article_path(@article)
end
```

---

### 删除关联的对象
当删除一个`Article`的时候，确保数据的完整性，需要将`Article`关联的`Comments`删除掉，只需给`Article`model配置`has_many :comments, dependent: :destroy`

```ruby
class Article < ActiveRecord::Base
  has_many :comments, dependent: :destroy
  validates :title, presence: true, length: { minimum: 5 }
end
```

---

## 安全
到这里，冲浪基本上已经结束了，有没有很累了，相信收获也不小了吧，sense十足的你，最后引出一个关于安全的主题，不要担心，这里要说的安全非常轻量。

---

### 基本的登录认证
只需要在Controller中配置登录验证拦截器

```ruby
class ArticlesController < ApplicationController
  http_basic_authenticate_with name: "dingo", password: "dingo", except: [:index, :show]

  def show
    @article = Article.find(params[:id])
  end
  ...
end

class CommentsController < ApplicationController
  http_basic_authenticate_with name: "dingo", password: "dingo", only: :destroy

  def create
    @article = Article.find(params[:article_id])
    @comment = @article.comments.create(comment_params)
    redirect_to article_path(@article)
  end
  ...
end
```
浏览器地址栏输入[http://127.0.0.1:3000/articles/](http://127.0.0.1:3000/articles/)，敲下最后一个`enter`键，点击添加`Article`链接，会弹出登录框

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/rails/rails-get-started-9.png' }})

更多Rails安全主题，请访问[Rails Security](http://guides.rubyonrails.org/security.html)

---

## 剩下的事情
在实际项目中 ，我们通常开发RESTful Web API，对Rails自带的模板很少使用，所以本文没有去做`抽取视图中组件到单独的文件中，提高代码整洁度和重用性`这件事情。欲了解全貌，请访问[Rails Get Started](http://guides.rubyonrails.org/getting_started.html)

---

## 总结
Rail是一个遵循`约定优于配置`的开发框架，所以一定要当心一些基本命名约定，经过了这次冲浪，如果严格按照文章中的规范走下来，应该是很顺利的。可以来回顾一下一些最基本的命名约定

- Article -> ArticlesController
- Comment -> CommentsController

Rails提供的是RESTful API，比较显著的特点是在`routes.rb`中添加一个资源后，使用`$ rake routes`就可以看到生成了很多对这个资源的不同操作对应的请求动作和路由信息。

Rails是一个MVC的开发框架，默认的约定如下：

|M       |      V    |     C
|:-----------|:----------------|:----------|
|app/models   | app/views | app/controllers
|article.rb   | articles/index.html.rb | articles_controller.rb
|Article      | index  | ArticlesController

通常在实际项目中，我们会面临很多较复杂业务处理，要在同一个请求中操作多个model，有人说将这些处理逻辑放在model层或者controller层，理论上这是可以的，带来的不好的结果有：

- controller层或者model层代码过于复杂，不利于扩展和维护，更有甚者，会陷入`同级调用`误区。
- 不利于事务控制和维护。（在Spring框架中通常会有一个service层，并利用`AOP`统一给service中的方法加上事务管理）
- 一些本可以共用的服务需要在不同的controller中重复实现，不利于服务重用，也违反了DRY原则。

>三层架构是Web应用开发中的经典实践，在复杂度不是足够高的系统中，这三层架构基本上能够满足要求。所以通常的实践是，在controller层与model层之间加一个service层，用来给controller层提供服务，controller负责从请求中提取数据，然后调用service，并返回处理结果，model层则负责数据库的CRUD相关操作，事务管理则可以在service层进行。





