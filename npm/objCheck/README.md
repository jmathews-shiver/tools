# objcheck
Performs detailed Object evaluation to determine Object type. 

# Functions
<dl>
<dt><a href="#What">What(item)</a> ⇒ <code>string</code></dt>
<dd><p>Preforms a detailed evaluation to determine an Object type.</p>
</dd>
<dt><a href="#Path">Path(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Path</p>
</dd>
<dt><a href="#Number">Number(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Number</p>
</dd>
<dt><a href="#String">String(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a String</p>
</dd>
<dt><a href="#Array">Array(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object an Array</p>
</dd>
<dt><a href="#JSON">JSON(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a JSON</p>
</dd>
<dt><a href="#Boolean">Boolean(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Boolean</p>
</dd>
<dt><a href="#Date">Date(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Date</p>
</dd>
<dt><a href="#NamedFunction">NamedFunction(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Named Function</p>
</dd>
<dt><a href="#RawClass">RawClass(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object an non-instantiated Class</p>
</dd>
<dt><a href="#NewFunction">NewFunction(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object an Instantiated Function</p>
</dd>
<dt><a href="#NewClass">NewClass(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object an Instantiated Class</p>
</dd>
<dt><a href="#Function">Function(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Function</p>
</dd>
<dt><a href="#Error">Error(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object an Error</p>
</dd>
<dt><a href="#Symbol">Symbol(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Symbol</p>
</dd>
<dt><a href="#Promise">Promise(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Promise</p>
</dd>
<dt><a href="#Set">Set(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Set</p>
</dd>
<dt><a href="#Undefined">Undefined(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Undefined</p>
</dd>
<dt><a href="#Null">Null(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Null</p>
</dd>
<dt><a href="#Map">Map(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Map</p>
</dd>
<dt><a href="#Generator">Generator(item)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is object a Generator</p>
</dd>
</dl>

<a name="What"></a>

## What(item) ⇒ <code>string</code>
<strong>Kind</strong>: global function

Preforms a detailed evaluation to determine an Object type.

<strong>Objects Evaluated</strong>
* Number: ['[object Number]']
* String: ['[object String]']
* Array: ['[object Array]']
* JSON: ['[object JSON]']
* Boolean: '[object Boolean]'
* Date: '[object Date]'
* NamedFunction: ['[function Raw]']
* AnonFunction: ['[function Raw]']
* ArrowFunction: ['[function Arrow]']
* RawClass: ['[class Raw]']
* NewFunction: ['[function Instantiated]']
* NewClass: ['[class Instantiated]']
* Function: ['[function Arrow]', '[function Raw]', '[class Raw]', '[class Instantiated]']
* Error: '[object Error]'
* Symbol: '[object Symbol]'
* Promise: '[object Promise]'
* Undefined: '[object Undefined]'
* Null: '[object Null]'
* Empty: ['[object Undefined]', '[object Null]']
* Map: '[object Map]'
* Generator: '[object Generator]'
* Set: '[object Set]'

<a name="Path"></a>
## Path(item) ⇒ <code>boolean</code>
<strong>Kind</strong>: global function

Is object a Path

