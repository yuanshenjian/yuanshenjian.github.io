---
layout: post

title: "Ruby on Rails 路由解析"
date: 2016-04-13
categories: [RAILS]
tag: [Rails]
author: "袁慎建"
published: false
brief: "
Rails中URL的约定严格基于 <i>RESTful</i> 风格的。客户端的请求其实是在操作一些资源，同一资源的不同的请求动作(<i>GET, POST, PUT, PATCH, DELETE</i>)分别对资源进行不同的操作(CRUD)。默认的情况下，我们只需要在routes.rb文件中配置好资源，Rails会为该资源生成7种不同的路由，根据路由就可以将客户端的请求转交给服务端对应的控制器进行处理，然后做出正确的响应。Rails Route能识别这种资源式(<i>RESTful</i>风格)的路由以及非资源式的路由，它是客户端请求和服务端控制器的粘合剂，能将URL分发给控制器进行处理。

本文详细介绍了Rails的路由解析原理和细节。
"
---

* content
{:toc}


---



## Route是什么
Rails中URL的约定严格基于`RESTful`风格的。客户端的请求其实是在操作一些资源，同一资源的不同的请求动作(`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)分别对资源进行不同的操作(CRUD)。默认的情况下，我们只需要在routes.rb文件中配置好资源，Rails会为该资源生成7种不同的路由，根据路由就可以将客户端的请求转交给服务端对应的控制器进行处理，然后做出正确的响应。Rails Route能识别这种资源式(`RESTful`风格)的路由以及非资源式的路由，它是客户端请求和服务端控制器的粘合剂，能将URL分发给控制器进行处理。

---

## Rails路由有啥用
Rails路由主要有两个作用，首先作为客户端请求和服务端控制器的粘合剂，它负责分发请求，链接URL和Controller。另一个主要作用是动态生成路径和URL。

---

### 把URL与代码链接起来
请求`GET /articles/17`对应的路由是

```ruby
get '/articles/:id', to: 'articles#show'，
```
- 这个请求就会被交给`articles`控制器中的`show`动作处理，并把`{ id: '17' }`传入params

	```ruby
	get '/articles/:id', to: 'articles#show'，
	```

---

### 动态生成路径和URL

```ruby
get '/articles/:id', to: 'articles#show', as: 'article'
```

在控制器中有

```ruby
@article = Article.find(17)
```

视图中有

```ruby
<%= link_to 'Article Record', article_path(@patient) %>
```

`article_path(@patient)`会生成路径`/articles/17`。


>**提示**
>路由是按照顺序定匹配的，一旦匹配成功就会寻找对应的控制器动作。


---

## 资源式路由
使用资源路径可以快速声明资源式控制器所有的常规路由，无需分别为 `index`、`show`、`new`、`edit`、`create`、`update` 和 `destroy` 动作分别声明路由，只需一行代码就能搞定

---

### 添加一个资源
我们在routes.rb文件中添加一个资源`photos`

```ruby
Rails.application.routes.draw do
  resources :photos
end
```

运行`$ rake routes`可以查看生成的路由

```
$ rake routes
      Prefix Verb   URI Pattern                  Controller#Action
    photos GET    /photos(.:format)          photos#index
             POST   /photos(.:format)          photos#create
 new_photo GET    /photos/new(.:format)      photos#new
edit_photo GET    /photos/:id/edit(.:format) photos#edit
     photo GET    /photos/:id(.:format)      photos#show
             PATCH  /photos/:id(.:format)      photos#update
             PUT    /photos/:id(.:format)      photos#update
             DELETE /photos/:id(.:format)      photos#destroy
```

可以看到生成如下7种路由

|HTTP 方法|路径|控制器#动作|作用
|:--------|:------------|:------------|:------------:|
|GET	| /photos	    | photos#index  |显示所有文章
|GET	| /photos/new	| photos#new	|显示新建文章的表单
|POST	| /photos	    |photos#create	|新建文章
|GET	|/photos/:id	|photos#show	|显示指定的文章
|GET	|/photos/:id/edit	|photos#edit	|显示编辑文章的表单
|PATCH/PUT	|/photos/:id	|photos#update	|更新指定的文章
|DELETE	|/photos/:id	|photos#destroy	|删除指定的文章


除了生成对应的7种不同的路由，还会生成一些具名辅助方法

- `photos_path`，返回 `/photos`
- `new_photo_path`， 返回 `/photos/new`
- `edit_photo_path(:id)`， 返回 `/photos/:id/edit`，例如 `edit_photo_path(10)` 返回 `/photos/10/edit`
- `photo_path(:id)`， 返回 `/photos/:id`，例如 `photo_path(10)` 返回 `/photos/10`


---

### 又来一个资源
实际项目中，我们会有很多资源，需要为他们声明路由可以将多个资源放在一个`resources`中声明，这样可以节省一定的时间。

```ruby
resources :photos, :books, :videos
```
或者(推荐使用)

```ruby
resources :photos
resources :books
resources :videos
```

---

### 单数资源路径
我们会有不使用 ID就能查看资源的场景。例如，`/profile` 一直显示当前登入用户的个人信息。此时，我们可以把 `/profile`（不是`/profile/:id`）映射到`show`动作

```ruby
get 'profile', to: 'users#show'
```
或者使用Symbol

```ruby
get 'profile', to: :show
```

同样我们可以配置一个单数资源

```ruby
resource :geocoder
```

运行`$ rake routes`，会看到生成六种不同的路由

```
$ rake routes
       Prefix Verb   URI Pattern              Controller#Action
     geocoder POST   /geocoder(.:format)      geocoders#create
 new_geocoder GET    /geocoder/new(.:format)  geocoders#new
edit_geocoder GET    /geocoder/edit(.:format) geocoders#edit
              GET    /geocoder(.:format)      geocoders#show
              PATCH  /geocoder(.:format)      geocoders#update
              PUT    /geocoder(.:format)      geocoders#update
              DELETE /geocoder(.:format)      geocoders#destroy
```

同样单数资源式路由生成以下帮助方法：

- `new_geocoder_path`， 返回 `/geocoder/new`
- `edit_geocoder_path`，返回 `/geocoder/edit`
- `geocoder_path`， 返回 `/geocoder`


>**提示**
>单数资源使用场景不是很多，了解怎么使用即可。


---

### 资源嵌套

实际项目中资源通常不是独立存在的，互相有具有一定业务和逻辑关系，比如`一对多`，`一对一`，`多对多`。在rails中，解决一个资源属于另一个资源的子资源的情况，需要使用到`资源嵌套`来定义它们的路由。

有两个资源

```ruby
class Article < ActiveRecord::Base
  has_many :comments
  validates :title, presence: true, length: {minimum: 5}
end

class Comment < ActiveRecord::Base
  belongs_to :article
end
```

在`routes.rb`中配置嵌套资源

```ruby
resources :articles do
    resources :comments
end
```

此时利用`$ rake routes`查看生成的路由中包含了`ArticlesController`和`CommentsController`的路由，下面是`CommentsController`的路由

|HTTP 方法	| 路径	| 控制器#动作	| 作用
|:------|:-----|:------|:------|
|GET | /articles/:article_id/comments	|comments#index | 显示指定文章的所有评论
|GET |/articles/:article_id/comments/new|comments#new |显示新建评论的表单，该告属于指定的文章
|POST|	/articles/:article_id/comments	| comments#create | 创建属于指定文章的评论
|GET| /articles/:article_id/comments/:id|comments#show | 显示属于指定文章的指定评论
|GET	|/articles/:article_id/comments/:id/edit| comments#edit | 显示编辑评论的表单，该评论属于指定的文章
|PATCH/PUT	|/articles/:article_id/comments/:id|comments#update|更新属于指定文章的指定评论
|DELETE	|/articles/:article_id/comments/:id |comments#destroy| 删除属于指定文章的指定评论


---

#### 资源嵌套的一些限制
资源嵌套中可以将子资源嵌套进来，很方便的生成嵌套的路由，然而当资源嵌套超过一层时，又会怎么样呢？

看看下面资源

```ruby
resources :publishers do
  resources :magazines do
    resources :photos
  end
end
```
- 上面资源嵌套后会生成`/publishers/1/magazines/2/photos/3`这样的路由。这种路由嵌套层次多，可读性不高，而且处理起来也比较复杂。

>**最佳实践**
>嵌套资源不要超过一层，可以使用浅层嵌套来解决这个问题。

---

#### 浅层嵌套提高可读性和可维护性
在操作嵌套的资源中，子资源的成员操作(`:show`, `:edit`, `:update`, `:destroy`)是可以根据自身的唯一标识`id`来进行的，此时就可以将这些操作单独定义出来，然后把需要与父级控制器集合起来的动作放在父级资源中来表名层级关系。

看一个浅层嵌套的例子

```ruby
resources :articles do
  resources :comments, only: [:index, :new, :create]
end
resources :comments, only: [:show, :edit, :update, :destroy]
```

使用`:shallow`来简写上述资源嵌套

```ruby
resources :articles do
  resources :comments, shallow: true
end

# 嵌套在父级资源中的资源都是浅层嵌套
resources :articles, shallow: true do
  resources :comments
  resources :quotes
  resources :drafts
end

# shallow块中的资源都是浅层嵌套
shallow do
  resources :articles do
    resources :comments
    resources :quotes
    resources :drafts
  end
end
```

还可以通过指定`:shallow_path`为浅层嵌套的成员路径上加上指定的前缀

```ruby
scope shallow_path: "sekret" do
  resources :articles do
    resources :comments, shallow: true
  end
end
```

运行`$ rake routes`可以看到

```
Prefix Verb   URI Pattern                                  Controller#Action
   article_comments GET    /articles/:article_id/comments(.:format)     comments#index
                    POST   /articles/:article_id/comments(.:format)     comments#create
new_article_comment GET    /articles/:article_id/comments/new(.:format) comments#new
       edit_comment GET    /sekret/comments/:id/edit(.:format)          comments#edit
            comment GET    /sekret/comments/:id(.:format)               comments#show
                    PATCH  /sekret/comments/:id(.:format)               comments#update
                    PUT    /sekret/comments/:id(.:format)               comments#update
                    DELETE /sekret/comments/:id(.:format)               comments#destroy
           articles GET    /articles(.:format)                          articles#index
                    POST   /articles(.:format)                          articles#create
        new_article GET    /articles/new(.:format)                      articles#new
       edit_article GET    /articles/:id/edit(.:format)                 articles#edit
            article GET    /articles/:id(.:format)                      articles#show
                    PATCH  /articles/:id(.:format)                      articles#update
                    PUT    /articles/:id(.:format)                      articles#update
                    DELETE /articles/:id(.:format)                      articles#destroy

```

---

#### 提高资源的复用
当一个资源需要重复嵌套到另一个资源的时候，我们可以选择重复定义，但这并不是好的实践，DRY也告诉我们要使用某种手段来使得资源定义能被复用。

使用`concern`来抽取资源

```ruby
concern :commentable do
  resources :comments
end

concern :image_attachable do
  resources :images, only: :index
end

# 复用我们写好的concern
resources :messages, concerns: :commentable
resources :articles, concerns: [:commentable, :image_attachable]
```

上面资源定义等价于

```ruby
resources :messages do
  resources :comments
end

resources :articles do
  resources :comments
  resources :images, only: :index
end
```

同时，`concerns`也可以跟命名空间一起使用

```ruby
namespace :articles do
  concerns :commentable
end
```

---

### 当Rails默认的REST动作无法满足需求时
在实际开发中，通常我们还需要更多的REST动作来满足业务需求，此时我们需要添加一些额外的的路由，主要有`成员路由`和`集合路由`两类REST风格的路由，他们主要是针对单个资源和资源集合的操作。

---

#### 成员路由
使用member来定义成员路由

```ruby
resources :photos do
  member do
    get 'preview'
  end
end
```
- 这段路由能识别 `/photos/1/preview` 是个 `GET` 请求，映射到 `PhotosController` 的 `preview` 动作上，资源的 ID 传入 `params[:id]`。同时还生成了 `preview_photo_url` 和 `preview_photo_path` 两个帮助方法.
- member块中，每个路由都需要指定HTTP方法：`get`，`patch`，`put`，`post` 或 `delete`

只有一个成员路由的时候

```ruby
resources :photos do
  get 'preview', on: :member
end
```
- 可以不使用 `:on` 选项，得到的成员路由是相同的，但资源 ID 存储在 `params[:photo_id]` 而不是 `params[:id]` 中。
- 使用`:on`和不使用`:on`的情况的生成的路径分别是`/photos/:id/preview`和`/photos/:photo_id/preview`

---

#### 集合路由
使用collection来定义集合路由

```ruby
resources :photos do
  collection do
    get 'search'
  end
end
```
- 这段路由能识别 `/photos/search` 是个 GET 请求，映射到 `PhotosController` 的 `search` 动作上。同时还会生成 `search_photos_url` 和 `search_photos_path` 两个具名帮助方法

同样，只有一个集合路由的时候

```ruby
resources :photos do
  get 'search', on: :collection
end
```

---

#### 添加额外的新建动作
使用`:on`选项添加额外的新建动作

```ruby
resources :comments do
  get 'preview', on: :new
end
```
- 上述资源定义能识别 `/comments/new/preview` 是个 GET 请求，映射到 `CommentsController` 的 `preview` 动作上。同时还会生成 `preview_new_comment_url` 和 `preview_new_comment_path` 两个路由帮助方法

>**警告**
>如果在资源式路由中添加了过多额外动作，这时就要停下来问自己，是不是要新建一个资源。


---

## 非资源式路由
通常使用资源式路由是一个好的实践，实际开发中有些情况下使用简单的路由来的更便捷。而且简单的路由特别适合把传统的URL映射到Rails动作上。

在Rails中，除了资源路由之外，Rails还可以把任意URL映射到动作上。这样就不会生成一系列资源式路，而是分别声明各个路由。

---

### 绑定参数

```ruby
get ':controller(/:action(/:id))'
```
- `GET /photos/show/1` 请求由这个路由处理（没匹配路由文件中其他路由声明），会映射到 `PhotosController` 的 `show` 动作上，最后一个参数 `"1"` 可通过 `params[:id]` 获取。
- 上述路由还能处理 `/photos` 请求，映射到 `PhotosController#index`，因为 `:action` 和 `:id` 放在括号中，是可选参数。

```ruby
get ':controller/:action/:id/:user_id'
```
- `/photos/show/1/2` 请求会映射到 `PhotosController` 的 `show` 动作。`params[:id]` 的值是 `"1"`，`params[:user_id]` 的值是 `"2"`。

```ruby
get ':controller/:action/:id/with_user/:user_id'
```
- 这个路由能响应 `/photos/show/1/with_user/2` 这种路径。此时，`params` 的值为 `{ controller: 'photos', action: 'show', id: '1', user_id: '2' }`。

>警告
>默认情况下，动态路径片段中不能使用点号，因为点号是格式化路由的分隔符。如果需要在动态路径片段中使用点号，可以添加一个约束条件。例如，`id: /[^\/]+/` 可以接受除斜线之外的所有字符。

---

### 查询字符串

```ruby
get ':controller/:action/:id'
```
- `/photos/show/1?user_id=2` 请求会映射到 `Photos` 控制器的 `show` 动作上。`params` 的值为 `{ controller: 'photos', action: 'show', id: '1', user_id: '2' }`

---

### 通配符匹配
路由中的通配符可以匹配其后的所有路径片段，`*`来表示通配符，可以在路径中插入`*`表示统配片段

```ruby
get 'photos/*other', to: 'photos#unknown'
```
- 这个路由可以匹配 `photos/12` 或 `/photos/long/path/to/12`，`params[:other]` 的值为 `"12"` 或 `"long/path/to/12"`。以星号开头的路径片段叫做“通配片段”。

通配片段还可以放在任意位置

```ruby
get 'books/*section/:title', to: 'books#show'
```
- 这个路由可以匹配 `books/some/section/last-words-a-memoir`，`params[:section]` 的值为 `'some/section'`，`params[:title]` 的值为 `'last-words-a-memoir'`。

---

### 重定向
在路由中可以使用辅助方法`redirect`来讲一个路径重定向到另外一个路径

```ruby
get '/stories', to: redirect('/articles')
```

重定向动态路径

```ruby
get '/stories/:name', to: redirect('/articles/%{name}')
```

还可以使用代码块的形式

```ruby
get '/stories/:name', to: redirect {|path_params, req| "/articles/#{path_params[:name].pluralize}" }
```

---

### 定义默认值
Rails允许我们指定默认值，比如路由中我们无需特别使用 `:controller` 和 `:action`

```ruby
get 'photos/:id', to: 'photos#show'
```
- 此路由这样声明后，Rails 会把 `/photos/12` 映射到 `PhotosController` 的 `show` 动作上

Rails还可以允许我们使用`:default`选项来设置默认值

```ruby
get 'photos/:id', to: 'photos#show', defaults: { format: 'jpg' }

resources :articles, constraints: {format: :json}, :defaults => {:format => :json}
```

---

### 使用root
`root`方法是用来指定`/`的路由的，通常一个网站用它来做主页路由或者登陆入口路由，它只支持`GET`请求。

```ruby
root to: 'welcome#index'

# 简写成
root 'welcome#index'
```

在命名空间中也可以使用root

```ruby
namespace :admin do
    root to: "admin#index"
end
```
- 上述路由会将 `/admin` 定位到 `/admin/index`

---

## 对路由加以管制
通常，我们会给资源加上一些限制，只允许部分请求能够访问该资源，就需要对请求进行过滤，可以通过一些资源路由的配置来管制HTTP方法。

---

###  HTTP 方法约束
使用`match`和`via`限制静态路由

```ruby
match 'photos', to: 'photos#show', via: [:get, :post]

match 'photos', to: 'photos#show', via: :all
```

>**最佳实践**
>同一个路由不要允许所有的HTTP方法。因为同个路由即处理 GET 请求又处理 POST 请求有安全隐患。一般情况下，除非有特殊原因，切记不要允许在一个动作上使用所有 HTTP 方法。

---

### 路径片段约束

使用`:constraints`来限制动态路由

```ruby
get 'photos/:id', to: 'photos#show', constraints: { id: /[A-Z]\d{5}/ }

# 简化形式
get 'photos/:id', to: 'photos#show', id: /[A-Z]\d{5}/
```
- 这个路由能匹配 `/photos/A12345`，但不能匹配 `/photos/893`。


---

### 资源式路由的动作约束
使用`:only`和`:except`约束资源动作

```ruby
# 只生成index, new, create路由
resources :comments, only: [:index, :new, :create]

# 生成除了destroy以外的路由
resources :comments, except: :destroy

```
>**最佳实践**
>如果程序中有很多 REST 路由，使用 :only 和 :except 指定只生成所需的路由，可以节省内存，加速路由处理过程。

---

### 资源式路由的路径片段约束
`:constraints`还可以约束资源路径

```ruby
resources :photos, constraints: {id: /[A-Z][A-Z][0-9]+/}
```
- 这个路由声明限制参数 `:id` 必须匹配指定的正则表达式。因此，这个路由能匹配 `/photos/RR27`，不能匹配 `/photos/1`。

还可以通过`constraint`块来约束路径

```ruby
constraints(id: /[A-Z][A-Z][0-9]+/) do
  resources :photos
  resources :accounts
end
```

---

## 让路由更个性化
像 `resources :articles` 这种路由通常已经能够满足我们的需求，Rails中也推荐使用框架的约定来使用资源式路由。而软件开发人生中也是不如意十有八九，这时候我们需要打破常规，做一些有个性的事情了。


---

### 使用命名空间对控制器进行归类
有些时候，我们需要将同一类控制器放在一个命名空间中，便于管理维护。最常见的是把相关的控制器放在Amin::命名空间内，此时需要将控制器放在app/controllers/admin文件夹中。

通常有三种方式添加命名空间

`namespace`，同时给控制器和URL添加命名空间

```ruby
namespace :admin do
    resources :articles, :comments
end
```

`scope module`，只给控制器添加命名空间

```ruby
scope module: 'admin' do
	resources :articles, :comments
end

# 或者针对单个资源
resources :articles, module: 'admin'
```

`scope ''` 只给URL添加命名空间

```ruby
scope '/admin' do
	resources :articles, :comments
end

# 或者针对单个资源
resources :articles, path: '/admin/articles'
```

这三种方式生成的`GET`请求对应的路径和控制器#动作

| 添加方式方式 | 路径 | 控制器#动作 | 具名辅助方法
|:-----|:-----|:------|:------|
|`namespace` | /admin/articles | admin/articles#index | `admin_articles_path`
|`scope :module` | /articles | admin/articles#index | `articles_path`
|`scope ''`  | /admin/articles | articles#index | `articles_path`

>**提示**
>如果在 namespace 代码块中想使用其他的控制器命名空间，可以指定控制器的绝对路径，例如`get '/foo' => '/foo#index'`。

---

### 指定控制器
在新起的项目中，最好的方式是我们按照命名约定去命名控制器，这样便于合作开发和维护。而在实际中，我们会遇到命名无法匹配的情况，此时就可以通过制定资源的控制器来兼容遗留代码。

```ruby
resources :photos, controller: 'images'
```
运行 `$ rake routes` 可以看到生成的路径和控制器

```
$ rake routes
    Prefix Verb   URI Pattern                Controller#Action
    photos GET    /photos(.:format)          images#index
           POST   /photos(.:format)          images#create
 new_photo GET    /photos/new(.:format)      images#new
edit_photo GET    /photos/:id/edit(.:format) images#edit
     photo GET    /photos/:id(.:format)      images#show
           PATCH  /photos/:id(.:format)      images#update
           PUT    /photos/:id(.:format)      images#update
           DELETE /photos/:id(.:format)      images#destroy
```
- 此时，路由生成的辅助方法还是依据 `photos` 来命名的，所以要使用 `photos_path`、`new_photo_path` 等生成该资源的路径.

还可以指定命名空间下的控制器

```ruby
resources :user_permissions, controller: 'admin/user_permissions'
```

>**提示**
>指定命名空间控制器时只支持目录形式。如果使用Ruby常量形式，例如 controller: 'Admin::UserPermissions'，会导致路由报错。

---

### 定制路由具名辅助方法名称
默认的资源式路由生成的具名辅助方法是依据资源名称来的，在一些特殊情况下，我们可能需要更改具名方法的名称。`:as` 可以让我们在定义资源路由式更改具名方法的名称。


```ruby
resources :photos, as: 'images'
```
- 此时，该路由生成的具名辅助方法还是依据 `images ` 来命名的，所以要使用 `images_path`、`new_image_path` 等生成该资源的路径.

针对非资源式的路由，`:as`也同样使用

```ruby
get ':username', to: 'users#show', as: :user
```
- 这段路由会定义一个名为 `user_path` 的方法，可在控制器、帮助方法和视图中使用。在 `UsersController` 的 `show` 动作中，`params[:username]` 的值即用户的用户名。如果不想使用 `:username` 作为参数名，可在路由声明中修改。


---


### 给具名路由辅助方法加上前缀
使用 `:as` 选项可在 Rails 为资源式路由生成的路由帮助方法前加上前缀。这个选项可以避免作用域内外产生命名冲突

```ruby
scope 'admin' do
  resources :photos, as: 'admin_photos'
end
```
- 这段路由会生成 `admin_photos_path` 和 `new_admin_photo_path` 等帮助方法

要为多个资源添加前缀时

```ruby
scope 'admin', as: 'admin' do
    resources :photos, :accounts
end
```
- 这段路由会生成 `admin_photos_path` 和 `admin_accounts_path` 等帮助方法，分别映射到 `/admin/photos` 和 `/admin/accounts` 上。

>**提示**
>namespace 作用域会自动添加 :as 以及 :module 和 :path 前缀。

---

### 定制路由的路径名称
当默认的路由路径不能满足要求是，Rails还允许通过`:path`来定制路径名称

```ruby
resources :photos, path: 'img'
```

运行`$ rake routes`会看到

```
$ rake routes
    Prefix Verb   URI Pattern             Controller#Action
    photos GET    /img(.:format)          photos#index
           POST   /img(.:format)          photos#create
 new_photo GET    /img/new(.:format)      photos#new
edit_photo GET    /img/:id/edit(.:format) photos#edit
     photo GET    /img/:id(.:format)      photos#show
           PATCH  /img/:id(.:format)      photos#update
           PUT    /img/:id(.:format)      photos#update
           DELETE /img/:id(.:format)      photos#destroy
```

---

### 个性化小结
- `namespace`同时为控制器、路径和具名辅助方法添加命名空间
- `scope :module`只为控制器添加命名空间
- `scope ''`只为路径添加命名空间
- `:controller`定制控制器
- `:as`用来定制路由具名辅助方法名称，为其添加前缀
- `:path`用来定制路径名称

---

### 思考实践

以下三种路由有什么区别？

```ruby
namespace :admin do
	resources :photos, as: :image, path: :image, controller: :image, defaults: {format: 'json'}
end

scope module: 'admin' do
	resources :photos, as: :image, path: :image, controller: :image, defaults: {format: 'json'}
end

scope '/admin' do
	resources :photos, as: :image, path: :image, controller: :image, defaults: {format: 'json'}
end
```
- 看看看，想想想，赶紧动动动手试试吧~ ~

---

## 参考
本文参考了Rails官方的指南，另外结合实际项目中用到的点做了提炼总结，以及对内容顺序进行了归纳整理，更适合循序渐进的阅读和实践。

[Rails 路由全解•中文](http://guides.ruby-china.org/routing.html) \| [Rails 路由全解•英文](http://guides.rubyonrails.org/routing.html)
