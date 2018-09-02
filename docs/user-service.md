# 添加用户服务

本节我们将创建用户服务 UserService。 UserService 专注于为视图提供数据。

同时， 不需要使用 new 来创建此服务的实例，而要依靠 Angular 的依赖注入机制把它注入到 UsersComponent 的构造函数中。


## 创建 UserService


使用 Angular CLI 创建一个名叫 user 的服务。

```ts
ng generate service user
```


可以在控制台看到如下输出信息：

```ts
ng generate service user

CREATE src/app/user.service.spec.ts (362 bytes)
CREATE src/app/user.service.ts (133 bytes)
```

其中，该命令会在 src/app/user.service.ts 中生成的是 UserService 类的骨架。 UserService 类的代码如下：

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
}
```


在 src/app/user.service.ts 中生成的是 UserService 类的测试代码：

```ts
import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
```



## @Injectable() 服务

注意，这个新的服务导入了 Angular 的 Injectable 符号，并且给这个服务类添加了 @Injectable() 装饰器。 UserService 类将会提供一个可注入的服务，并且它还可以拥有自己的待注入的依赖。 目前它还没有依赖，但是很快就会有了。

@Injectable() 装饰器会接受该服务的元数据对象，就像 @Component() 对组件类的作用一样。

如果你熟悉 Java 的注解，那么这个 @Injectable() 装饰器可以简单理解为是 Java 中的 @Inject 注解。

## 获取用户数据

UserService 职责是提供用户数据的查询，而使用这个服务的调用方是不需要关心 UserService 的数据来源的。UserService 可以从任何地方去获取数据：Web 服务、本地存储（LocalStorage）或一个模拟的数据源。

我们将要从组件中移除数据访问逻辑，将数据访问的逻辑移到 UserService 中，这样组件只需要依赖于 UserService 来提供数据。这意味着将来任何时候你都可以改变目前的 UserService 实现方式，而不用改动任何组件。因为，这些组件不需要了解该服务的内部实现。

我们将原来在组件中实现的“获取模拟的用户列表”的功能，迁移至 UserService 中。具体修改如下。

### 导入 User 和 USERS

导入 User 和 USERS:

```ts
import { User } from './user';
import { USERS } from './mock-users';
```

### 添加一个 getUsers 方法

添加一个 getUsers 方法，让它返回模拟的用户列表。

```ts
getUsers(): User[] {
  return USERS;
}
```


## 提供 UserService

在要求 Angular 把 UserService 注入到 UsersComponent 之前，你必须先把这个服务提供给依赖注入系统。你可以通过注册提供商来做到这一点。提供商用来创建和交付服务，在这个例子中，它会对 UserService 类进行实例化，以提供该服务。

现在，你需要确保 UserService 已经作为该服务的提供商进行过注册。你要用一个注入器注册它。注入器就是一个对象，负责在需要时选取和注入该提供商。

默认情况下，Angular CLI 命令 ng generate service 会通过给 @Injectable 装饰器添加元数据的形式，为该服务把提供商注册到根注入器上。

如果你看看 UserService 紧前面的 @Injectable() 语句定义，就会发现 providedIn 元数据的值是 'root'：

```ts
@Injectable({
  providedIn: 'root',
})
```


当你在顶层提供该服务时，Angular 就会为 UserService 创建一个单一的、共享的实例，并把它注入到任何想要它的类上。 在 @Injectable 元数据中注册该提供商，还能让 Angular 可以通过移除那些完全没有用过的服务，来进行优化。

如果需要，你也可以在不同的层次上注册提供商 —— 在 UsersComponent 中、在 AppComponent 中，或在 AppModule 中。 比如，你可以通过附加 --module=app 参数来告诉 CLI 要自动在模块级提供该服务。

```ts
ng generate service user --module=app
```



现在 UserService 已经准备好插入到 UsersComponent 中了。

## 修改 UsersComponent

打开 UsersComponent 类文件 users.component.ts。

删除 USERS 的导入语句，因为你以后不会再用它了。 转而导入 UserService。


```ts
import { UserService } from '../user.service';
```

把 heroes 属性的定义改为一句简单的声明。

```ts
users: User[];
```

### 注入 UserService

往构造函数中添加一个私有的 userService，其类型为 UserService。

```ts
constructor(private userService: UserService) { }
```

这个参数同时做了两件事：

1. 声明了一个私有 userService 属性;
2. 把它标记为一个 UserService 的注入点。

当 Angular 创建 UsersComponent 时，依赖注入系统就会把这个 userService 参数设置为 UserService 的单例对象。

### 添加 getHeroes()

创建一个函数，以便从服务中获取这些用户数据。

```ts
getUsers(): void {
    this.users = this.userService.getUsers();
}
```

### 在 ngOnInit 中调用它

你固然可以在构造函数中调用 getUsers()，但那不是最佳实践。

让构造函数保持简单，只做初始化操作，比如把构造函数的参数赋值给属性。构造函数不应该做任何事。它肯定不能调用某个函数来向远端服务（比如真实的数据服务）发起 HTTP 请求。

而是选择在 ngOnInit 生命周期钩子中调用 getUsers()，之后交由 Angular 处理，它会在构造出 UsersComponent 的实例之后的某个合适的时机调用 ngOnInit。

```ts
ngOnInit() {
    this.getUsers();
}
```

### 查看运行效果

执行 ng serve 命名以启动应用，在浏览器中访问<http://localhost:4200/>。该应用的运行效果，应该跟之前是一样的。