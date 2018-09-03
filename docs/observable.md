# 自定义 Observable

Observables 方式属于响应式编程（Reactive Programming），数据流是异步传输的，采用 Observables 方式需要引入 [RxJS 库](http://reactivex.io/rxjs/)。当然，Angular自带了 RxJS 库，我们只需开箱即用即可。

## 在 UserService 中实现 Observable


打开 UserService 文件 user.service.ts ，并从 RxJS 中导入 Observable 和 of 符号。

```ts
import { Observable, of } from 'rxjs';
```


把 getUsers 方法改成这样：

```ts
getUsers(): Observable<User[]> {
    return of(USERS);
}
```


其中，of(USERS) 会返回一个 Observable<User[]>，它会发出单个值，这个值就是这些模拟用户的数组。

## 在 UsersComponent 中订阅

UserService.getUsers() 方法之前返回一个 User[]， 现在它返回的是 Observable<User[]>。所以，必须要在 UsersComponent 中修改使用 UserService 方法的方式。


你必须在 UsersComponent 中也向本服务中的这种形式看齐。

找到 getUsers() 方法，并且把它替换为如下代码：

```ts
getUsers(): void {
    this.userService.getUsers()
        .subscribe(users => this.users = users);
}
```

Observable.subscribe() 是关键的差异点。这样，只要数据源发生变化，this.users 的值就能立即得到最新的变化，实现异步。

当然，目前还无法体会到 Observable 所带来的好处，因为现在的数据是模拟的、硬编在代码里面。在后续章节中，我们还会继续展示 Observable 带来的响应式编程的好处。