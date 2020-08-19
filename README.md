# Return true to Win
>  A series of JavaScript challenges.  
>>项目关于 Javascript 的一些**有趣**的知识点，只要让返回的结果为 `true` 即视为赢得了游戏，最优解是使用最少字符的答案。

## 挑战地址
- [Return true to Win](https://alf.nu/ReturnTrue)

## 环境
> macOS Mojave 10.14.3  
> Microsoft Edge 基于 Chromium  84.0.522.59

## 目录
- [x] [id (2)](#id)
- [x] [reflexive (3)](#reflexive)
- [x] [transitive (8)](#transitive)
- [x] [peano ()](#peano)

## id
```js
function id(x) {
    return x;
}
id(!0); // true
```
> 热身题

## reflexive
```js
function reflexive(x) {
    return x != x;
}
reflexive(NaN); // true
```
> 值 `NaN` 是独一无二的，它不等于任何东西，包括它自身

## transitive
```js
function transitive(x,y,z) {
    return x && x == y && y == z && x != z;
}
transitive('0',0,''); // true
```
> 类型转换问题。对于基本类型 `Boolean`，`Number`，`String`，三者之间做比较时，总是向 `Number` 进行类型转换，然后再比较。
### 上述类型转换过程：
```js
x = '0', y = 0, z = '';
/*
 * 1. Boolean(x) ==> true
 * 2. Number(x) == y ==> true
 * 3. y == Number(z) ==> true
 */
```
### 基本类型转换拓展之对象（Object）
```js
x = 1, y = {i:0, valueOf() {return ++this.i;}}, z = 2;
transitive(1,{i:0, valueOf() {return ++this.i;}},2); // true

// === 类型转换过程 ===
/*
 * 1. Boolean(x) ==> true
 * 2. x == Number(y) ==> true, Number(y) === 1
 * 3. Number(y) == z ==> true, Number(y) === 2
 */
```
> 代码中的 `x == y` 和 `y == z`，都触发了类型转换，也就是 `Number(y)` 触发了 `valueOf()` 方法。  
> 上述方案重写了对象的 `valueOf()`，使其每次触发类型转换时返回的值 +1。

## peano
```js
function peano(x) {
    return (x++ !== x) && (x++ === x);
}
```