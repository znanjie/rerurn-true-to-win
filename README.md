# Return true to Win
>  A series of JavaScript challenges.  
>>项目关于 Javascript 的一些有趣的知识点，只要让返回的结果为 `true` 即视为赢得了游戏，最优解是使用最少字符的答案。

## 挑战地址
- [Return true to Win](https://alf.nu/ReturnTrue)

## 环境
> macOS Mojave 10.14.3  
> Microsoft Edge 基于 Chromium  84.0.522.59

## 目录
- [x] [id (2)](#id)
- [x] [reflexive (3)](#reflexive)

## id
```js
function id(x) {
    return x;
}
id(!0); // true
```

## reflexive
```js
function reflexive(x) {
    return x != x;
}
reflexive(NaN); // true
```
> 值 `NaN` 是独一无二的，它不等于任何东西，包括它自身