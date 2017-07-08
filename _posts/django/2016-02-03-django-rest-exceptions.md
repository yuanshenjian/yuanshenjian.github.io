---
layout: post

title: "Django REST 异常处理"
date: 2016-02-03
categories: [DJANGO]
tag: [Python,Django,Django-rest,Exception]
author: "袁慎建"

brief: "本文是对Django REST框架中的异常框架中的异常处理部分的翻译。"

---


* content
{:toc}


---

## 异常
异常处理...允许错误处理在程序结构的中心或者高层级的地方被清晰有条理的组织起来。 

>Exceptions… allow error handling to be organized cleanly in a central or high-level place within the program structure.
— Doug Hellmann, Python Exception Handling Techniques

### Rest框架视图中的异常处理
Exception handling in REST framework views
REST框架的视图处理了各种异常，并正确地返回了错误响应。

>REST framework's views handle various exceptions, and deal with returning appropriate error responses.

被处理的异常有： 

 * Rest框架内部抛出的`APIException`的子类。
 * Django的`Http404`异常。
 * Django的`PermissionDenied`异常

针对每种情况，REST框架将返回一个包含了正确的状态码和content-type的响应。响应体包含了任何关于错误本身的额外细节。

大部分的错误响应将在响应体中包含了一个`detail`的键。

例如下面请求：

```python
DELETE http://api.example.com/foo/bar HTTP/1.1
Accept: application/json
```

你还可能接收到一个错误响应，表明对该资源`DELETE`方法不允许的。

```python
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json
Content-Length: 42

{"detail": "Method 'DELETE' not allowed."}
```

校验错误的处理有些轻微的不同，它会把字段的名字作为键包含进来。如果校验错误没有被指定到一个特定的字段，那么它会使用`non_field_errors`作为键，或者是你在setting文件中设定的`NON_FIELD_ERRORS_KEY`任意字符串的值。

任何校验错误将类似下面的形式：

```python
HTTP/1.1 400 Bad Request
Content-Type: application/json
Content-Length: 94

{"amount": ["A valid integer is required."], "description": ["This field may not be blank."]}
```

---

### 自定义异常处理
你可以实现你的自定义异常处理。可以通过创建一个异常处理函数将API视图中抛出的异常转换成响应对象。这样一来，你就可以控制你的API使用的错误响应格式。

这个异常处理函数必须传入两个参数，第一个是要处理的异常，第二个是一个包含了任何额外上下文信息（例如当前被处理的视图）的字典。该异常处理函数要么返回一个`Response`对象，要么在异常无法处理的时候返回`None`。如果返回了`None`，异常将会被重新抛出，最后Django会返回一个标准的HTTP 500 ‘服务器错误’的响应。

例如，你可能希望保证所有的错误响应体中都包含了HTTP状态码，像这样：

```python
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json
Content-Length: 62

{"status_code": 405, "detail": "Method 'DELETE' not allowed."}
```

为了更改响应的格式，你可以编写如下的自定义异常处理函数：

```python
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    
    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code

    return response

```
参数context没有被默认的异常处理器使用，但是如果你需要更多的信息，例如你想获得当前被处理的视图，它就能给你援助之手了。通过`context['view']`就可以获取当前视图。

同时你必须在你的settings中配置异常处理器，显式地给`EXCEPTION_HANDLER `设置你期望的值，例如：

```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'my_project.my_app.utils.custom_exception_handler'
}
```

如果没有指定，`’EXCEPTION_HANDLER‘`默认使用的是REST框架提供的标准的异常处理器：

```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler'
}
```

注意一点，异常处理器仅仅在响应是由抛出的异常产生时被调用。如果由视图直接返回的响应，它将不会被调用，例如`HTTP_400_BAD_REQUEST`响应是在序列化校验失败时由generic视图返回的，此时异常处理器就不会被调用。

---


## API 引用

### APIException
**Signature**: `APIException()`
所有在`APIView`类中或者`@api_view`抛出的异常的**基类**。

为了提供自定义异常，自定义个类，继承自`APIException`，并设置`.status_code`和`.default_detail`属性。

例如，如果你的API依赖第三方服务，这个服务有时候可能会不可用，你或许可以考虑为"503 Service Unavailable"HTTP响应码实现一个异常类，你可以这么做：

```python
from rest_framework.exceptions import APIException

class ServiceUnavailable(APIException):
    status_code = 503
    default_detail = 'Service temporarily unavailable, try again later.'

```


### ParseError
**Signature**: `ParseError(detail=None)`

在访问`request.data`的时候，如果请求包含了非法的数据，就会抛出该错误。

默认，该异常返回"400 Bad Request"状态码。


### AuthenticationFailed
**Signature**: `AuthenticationFailed(detail=None)`

当请求包含了错误的认证信息的时候抛出。
Raised when an incoming request includes incorrect authentication.

默认情况下，该异常返回`401 Unauthenticated`，但是也有可能返回`403 Forbidden`，这取决于使用的认证模式。详细内容参考[authentication documentation](http://www.django-rest-framework.org/api-guide/authentication/)


### NotAuthenticated
**Signature**: `NotAuthenticated(detail=None)`

当未认证的请求权限验证失败时抛出。

默认情况下，该异常返回`401 Unauthenticated`，但是也有可能返回`403 Forbidden`，这取决于使用的认证模式。详细内容参考[authentication documentation](http://www.django-rest-framework.org/api-guide/authentication/)

### PermissionDenied
**Signature**: `PermissionDenied(detail=None)`

当一个经认证的请求在权限校验失败时抛出。

默认返回`403 Forbidden`

### NotFound
**Signature**: `NotFound(detail=None)`

当给定的URL不存在时抛出。该异常等效于标准的Django`Http404 `异常。

默认返回`404 Not Found`.


### MethodNotAllowed
**Signature**: `MethodNotAllowed(method, detail=None)`

在视图中没有与请求匹配的处理方法时抛出。

默认返回`405 Method Not Allowed`


### NotAcceptable
**Signature**: `NotAcceptable(detail=None)`

当请求的接受头不满足任何可用的渲染器时抛出。

默认返回`406 Not Acceptable`


### UnsupportedMediaType
**Signature**: `UnsupportedMediaType(media_type, detail=None)`

当访问`request.data`时，没有解析器来处理请求数据的内容类型时抛出。

默认返回`415 Unsupported Media Type`


### Throttled
**Signature**: `Throttled(wait=None, detail=None)`
当请求超过最大限制时抛出。

默认返回`429 Too Many Requests`


### ValidationError
**Signature**: `ValidationError(detail)`

`ValidationError`跟其他的`APIException`类稍微有些不同：

The ValidationError exception is slightly different from the other APIException classes:

  * `detail`参数是强制的，非可选。 
  * `detail`参数可以是错误细节的列表或者字典，也可以是一个内嵌的数据结构。
  * 约定中，你应该导入序列化器模块并使用完整描述的`ValidationError`格式，这是为了跟Django的内置检验错误区分开来。例如.`raise serializers.ValidationError('This field must be an integer value.')`


`ValidationError`类应该通过验证器类为序列化器和字段校验使用。它也会在调用`serializer.is_valid`方法，并指定了`raise_exception`时被抛出。

```python
serializer.is_valid(raise_exception=True)
```

在generic视图中使用`raise_exception=True`标记，意味着你可以在你的API中全局复写校验错误响应的格式。如果你要这么做，建议你使用一个自定义的异常，上文有描述。

默认情况下，该异常返回`400 Bad Request`



[原文链接](http://www.django-rest-framework.org/api-guide/exceptions/)
