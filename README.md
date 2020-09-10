# Return true to Win
>  A series of JavaScript challenges.  
>
>  >项目关于 Javascript 的一些**有趣**的知识点，只要让返回的结果为 `true` 即视为赢得了游戏，最优解是使用最少字符的答案。

## 挑战地址
- [Return true to Win](https://alf.nu/ReturnTrue)

## 环境
> Google Chrome 84.0.4147.135（正式版本） （64 位）

## 目录
- [x] [id (2)](#id)
- [x] [reflexive (3)](#reflexive)
- [x] [transitive (7)](#transitive)
- [x] [peano (7)](#peano)
- [x] [counter (13)](#counter)
- [x] [array (23)](#array)
- [x] [instance (15)](#instance)
- [x] [instance2 (38)](#instance2)
- [x] [proto1 (16)](#proto1)
- [x] [undef (12)](#undef)
- [x] [symmetric (20)](#symmetric)

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
> 值 `NaN` 是独一无二的，它不等于任何东西，包括它自身。

## transitive
```js
function transitive(x,y,z) {
    return x && x == y && y == z && x != z;
}
transitive('0',0,''); // true
transitive([],0,[]); // true
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

### 对象--原始值转换（Symbol.toPrimitive）
对于第二个答案的类型转换分析会复杂一点。这里主要涉及的知识点：
- 所有的对象在布尔上下文（context）中均为 `true`。所以对于对象，不存在 `to-boolean` 转换，只有字符串和数值转换。
- 数值转换发生在对象相减或应用数学函数时。例如，`Date` 对象相减可以得到两个日期的差值
- 字符串的转换通常发生在 `console.log(obj)` 这样输出一个对象或类似的执行上下文中。

```js
x = [], y = 0, z = [];
/*
 * 1. Boolean(x) ==> true
 * 2. ToPrimitive(x) == y ==> true
 * 3. y == ToPrimitive(z) ==> true
 */
```
> 代码中的 `x == y` 和 `y == z`，触发了对象到原始类型的转换。其主要过程如下:

```js
/*
 * @description 对象到原始类型转换的抽象操作
 * @name Symbol.toPrimitive
 * @param {String} hint ['number', 'string', 'default']
 */
Array.prototype[Symbol.toPrimitive] = hint=>{
    console.log(hint);
};
const a = ([] == 0); // print: default
const b = (0 == []); // print: default
```
如果 hint 为 'default'，那么流程将和 'number' 的一样，实际发生的转换是:
```js
[] == 0;
/*
 * ToPrimitive([]) ==> [].valueOf().toString() === '';
 * 1. ToPrimitive([]) == 0 ==> '' == 0
 * 2. Number('') == 0 ==> 0 == 0 ==> true
 */
```

- [ECMA 262规范](https://tc39.es/ecma262/#sec-toprimitive)


## peano
```js
function peano(x) {
    return (x++ !== x) && (x++ === x);
}
peano(2**53-1); // true
```
> 最大安全整数：`Number.MAX_SAFE_INTEGER === (Math.pow(2, 53) - 1) === (2**53 - 1)`
### 安全整数
这里的知识点其实已经和 JavaScript 无关了，但凡遵循**IEEE二进制浮点数算术标准**（`IEEE 754`）的编程语言都有相似的表现。  
- JavaScript 的数字是以64位（64-bits）的二进制格式存储的。

||符号位（sign）|指数（exponent）|尾数（fraction）
---|---|---|---
Size/bit|1bit|11bit|52bit
Index|63|62-52|51-0
- [Safe integers in JavaScript](https://2ality.com/2013/10/safe-integers.html)
> In the range (−253, 253) (excluding the lower and upper bounds), JavaScript integers are safe: there is a one-to-one mapping between mathematical integers and their representations in JavaScript.  

简单翻译理解：在 (-2^53, 2^53) 的开区间中的所有整数为安全整数，**双精度浮点数和整数具有一对一（one-to-one）的映射关系**，也就是说在这个范围内的双精度浮点数只能表达**唯一**的整数。超出了这个范围的双精度浮点数是可以表达多个整数的。
### 数值对比
十进制|科学计数|双精度浮点数|描述
:---:|:---:|---|---
![](https://latex.codecogs.com/svg.latex?2^{53})|1.{53个0} * ![](https://latex.codecogs.com/svg.latex?2^{53})|1.{52个0} * ![](https://latex.codecogs.com/svg.latex?2^{53})|浮点数尾数部分只保留52位，浮点数最后一位无法存储被省略。
![](https://latex.codecogs.com/svg.latex?2^{53}+1)|1.{52个0}1 * ![](https://latex.codecogs.com/svg.latex?2^{53})|1.{52个0} * ![](https://latex.codecogs.com/svg.latex?2^{53})|浮点数尾数部分只保留52位，浮点数最后一位无法存储被省略。

可以看出，双精度浮点数 `1.{52个0} * 2^53` 可以表示两个整数，在 JavaScript 中会被认为是`不安全整数`，它们不符合**双精度浮点数和整数具有一对一（one-to-one）的映射关系**这一描述。而实际中，这个两个非安全数对比，也就是 `(2^53 === 2^53 + 1) ===> true` , JavaScript 对比的其实是两个数的双精度浮点数，也就是 `(1.{52个0} * 2^53 === 1.{52个0} * 2^53) ===> true`。

## counter
```js
function counter(f) {
    var a = f(), b = f();
    return a() == 1 && a() == 2 && a() == 3
        && b() == 1 && b() == 2;
}
// answer
counter((i=0)=>$=>++i);// true
counter(i=>$=>i=-~i)
// detail
counter(()=>{
    let i = 0;
    return ()=> ++i;
}); // true
```
> 闭包：内部函数总是可以访问其所在的外部函数中声明的变量和参数，即使在其外部函数被返回（寿命终结）了之后。  
### 词法环境（Lexical Environment）
在 `ES6` 之前我们通常把这称为 `作用域`。
> 在 JavaScript 中，每个运行的函数，代码块 `{...}` 以及整个脚本，都有一个被称为 **词法环境（Lexical Environment）** 的内部（隐藏）的关联**对象**。

词法环境对象由两部分组成：
- **环境记录（Environment Record）**：一个存储所有局部变量作为其属性（包括一些其他信息，例如 this 的值）的对象。
  - **声明式环境记录（Declarative Environment Record）**
  - **对象式环境记录（Object Environment Record）**
  - **全局环境记录（Global Environment Record）**：唯一的词法环境。
- **对外部词法环境的引用（Outer）**：对 **外部词法环境** 的引用，与外部代码相关联

<br>
<div align=center>
    <img src="./static/img/lexical-env.png">
</div>
<br>

- [【译】词法环境——闭包的隐秘角落](https://www.notion.so/1d00c58de07b4a779ae037227e62e30d)

## array
```js
function array(x,y) {
    return Array.isArray(x) && !(x instanceof Array) &&
          !Array.isArray(y) && (y instanceof Array);
}
// answer
array(0,[Array.isArray=z=>!z]); // true
// detail
Array.isArray = z=>!z
Array.isArray(0); // true
!(0 instanceof Array); // true
!Array.isArray([]); // true
[] instanceof Array; // true
```
> 在传递实参时重写了 `Array.isArray()` 这个函数。同时也涉及到了类型转换。

## instance
```js
function instance(x,y) {
  return x instanceof y && y instanceof x && x !== y;
}
// answer
instance(Object,Function)
```
## instance2
```js
function instance2(a,b,c) {
  return a !== b && b !== c && a !== c
      && a instanceof b
      && b instanceof c
      && c instanceof a;
}
// answer
instance2(a=Object,Function,c=$=>$,c.__proto__=a)
```

### instance & instance2 详解
> `instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。  

`Object instanceof Function`：检查 `Object` 这个构造函数在原型链的某个位置上是否具有 `Function.prototype` 的实例。
```js
Object.__proto__ === Function.prototype; // true
```
`Object` 构造函数继承自 `Function.prototype`。

<br>

`Function instanceof Object`：检查 `Function` 这个构造函数在原型链的某个位置上是否具有 `Object.prototype` 的实例。
```js
Function.__proto__.__proto__ === Object.prototype; // true
```
`Function` 构造函数间接继承自 `Object.prototype`

<br>

**所有对象都是 `Object` 构造函数的实例，所有函数都是 `Function` 构造函数的实例。**
```js
Object ---> Function.prototype ---> Object.prototype ---> null
Function ---> Function.prototype ---> Object.prototype ---> null
```
- [【译】惊人优雅的 JavaScript 类型](https://www.notion.so/JavaScript-c5d1960e8443471184682a867a12cef3)
- [Why in JavaScript both “Object instanceof Function” and “Function instanceof Object” return true?](https://stackoverflow.com/questions/23622695/why-in-javascript-both-object-instanceof-function-and-function-instanceof-obj?answertab=votes#tab-top)

## proto1
```js
function proto1(x) {
    return x && !("__proto__" in x);
}
// answer
proto1(Object.create(null)); // true
proto1({__proto__:null}); // true
```  
> 规范中把 `[[Prototype]]` 称为 **“原型”**，而`__proto__` 是 `[[Prototype]]` 的因历史原因而留下来的 getter/setter。  
> `__proto__` 与 `[[Prototype]]` 不一样。`__proto__` 是 `[[Prototype]]` 的 getter/setter

### in 运算符
> 如果指定的属性在指定的对象或其原型链中，则 `in` 运算符返回true。

`Object.create(null)` 以及 `{__proto__:null}` 都是创建的是一个“纯粹”的对象，不继承任何的属性，该对象是不具备原型（即 `[[Prototype]]`）的，也不存在对应的 `__proto__` 访问器属性。对于 `in` 运算符来说，`__proto__` 是不存在的。

## undef
```js
function undef(x) {
    return !{ undefined: { undefined: 1 } }[typeof x][x];
}
// answer
undef(document.all); // true
undef(Object.prototype.number=0); // true
```

### 上述过程分析
`document.all` 属于浏览器 API，已移除标准，但浏览器为了兼容还保留着。  

根据规范所描述的：
> `all` 属性必须返回一个以 `Document` 节点为根的并且匹配了所有页面元素的 `HTMLAllCollection` 集合。  
> `all` 返回的对象具有以下几种异常情况：  
> 1. 在 JavaScript 中，当对 `all` 返回的对象进行“布尔转换”的时候，返回的值为 `false`。  
> 2. `all` 返回的对象的在进行弱类型比较（`==`）的时候与 `undefined` 以及 `null` 相等，即返回 `true` （严格相等的时候不会发生类型转换，为 `false`）。  
> 3. `all` 使用 `typeof` 操作符时返回 `undefined`。  

- [HTML Standard](https://html.spec.whatwg.org/multipage/obsolete.html#dom-document-all)

```js
// document.all
// 代码执行过程
// 1.对象声明
const obj = {
    undefined: {
        undefined: 1
    }
}
// 2.找到 [typeof x]的属性值
typeof document.all === 'undefined';
obj['undefined']; // ==> {undefined: 1}
// 3.找到 [document.all]的属性值
obj['undefined'][document.all]; // ==> undefined
!undefined; // ==> true
```

```js
// Object.prototype.number=0
// 代码执行过程
// 1.对象实例原型属性添加
Object.prototype.number = 0;
x = 0;
// 2.对象声明
const obj = {
    undefined: {
        undefined: 1
    }
};
obj.__proto__ === Object.prototype;
typeof x === 'number';
obj['number'] === obj.__proto__.number === 0;
obj['number'][0]; // undefined
!undefined; // true
```

## symmetric
```js
function symmetric(x,y) {
    return x == y && y != x;
}
// answer
symmetric(i=0,{valueOf:$=>i++}); // true
```
主要是基于对象转换为基本类型的原理，转换过程参考 [transitive](#transitive) 所述。