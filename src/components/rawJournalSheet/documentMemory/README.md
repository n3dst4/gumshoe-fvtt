# Document memory

A weekend project gone awry.

An over-engineered solution to a problem that never existed.

## Background

So, I'm writing the fancy new HTML editor for journals and it strikes me that I want some kind of version-saving mechanism, so that mistakes can be safely corrected, and we can review the history of a document.

There are two questions to answer:

* What mechanism or algorithm will we use?
* Where will be store the data?

The second one (where to store it) is a question for another day.

The first one (algorithm) is where this mini-project comes in. Ideas I rapidly dropped:

* Just store the last *n* state! REJECTED - I want to be able to store a decent age of history, like at least 100 and maybe a thousand? If the document is a megabyte (which is huge but possible) you're looking at a *gigabyte* of backups!
* Store a long list of diffs - this is a lot better! But you're still going to be dealing with monotonically increasing storage until you hit that history limit.

I want to say now that actually a simple history of the last 1000 diffs would have be *fine*. If I was launching a startup that's what I would have done.

But I figured we could do better. What I envisioned was something where older states were stored with decreasing granularity, getting collapsed together as they age. So you can always go back to *near* the start, but the number of individual states you can restore to gets less the older you go. And the moist recent states are all individually addressable.

So I had the idea of a series of stacks. The top-level stack is where the most recent diffs get pushed. When there are *n* diffs built up, we combine them together and push them onto the next stack down.

## The first version

My first jab at this had the problem that the number of accessible edits would fluctuate.

To illustrate, imagine a document where I'm typing in the letters of the alphabet, a to z.

* First state: "a".
* Second state: "ab".
* Third state: "abc".
* etc.

Now imagine that we're using a stack size of 3.

First state: "a"

```
Stack
-----
+a
```

Second state: "ab"

```
Stack
-----
+a
+b
```

Third state: "abc"

```
Stack
-----
+a
+b
+c
```

Fourth state: "abcd"

```
Stack
-----
+a
+b
+c
+d
```

But because we hit our "stack size" limit of 3, we roll the first three into a combined edit on the next stack:

```
Stack 1    Stack 2
-------    -------
+d         +abc
```

After a bunch more edits we have something like:

```
Stack 1    Stack 2    Stack 3
-------    -------    -------
+r         +lmn       +abcdefijk
+s         +opq
+t
```

The problem is we lose fidelity on each stack every time we "push" a combined commit up to the next one.


## The bomb bay system

I went through a bunch of options here, and here's where I ended up: each stack has a list of edits, of size n, and a second list, called the "bomb bay" of commits which will be pushed onto the next stack in due course. Only the main list of edits is addressable in terms of restoring history. This uses more space, but gives much nicer behaviour. You will always have the most recent n edits, then every n^2th edit for the next n commits, then every n^3th commits etc.

```
Stack 1    Stack 2
=======    =======
Bomb bay   Bomb bay
--------   --------
+p          +abc
+q          +def

Edits      Edits
-----      -----
+r          +ghi
+s          +jkl
+t          +nmo
```

What this shows is that stack 1 has two edits waiting to combined and pushed to stack 2 when the next edit comes in. Stack 2 likewise has two edits waiting to go to stack three. So on the very next keystroke, we add the letter u. Lets walk though this. First it gets added to the stack 1 edits, and +r gets moved into the bomb bay:

```
Stack 1    Stack 2    Stack 3
=======    =======    =======
Bomb bay   Bomb bay   Bomb bay
--------   --------   --------
+p         +abc
+q         +def
+r

Edits      Edits      Edits
-----      -----      -----
+s         +ghi
+t         +jkl
+u         +nmo
```

But now the stack 1 bomb bay is full, so we push "+pqr" to stack 2 (and +ghi gets moved into the bomb bay):

```
Stack 1    Stack 2
=======    =======
Bomb bay   Bomb bay
--------   --------
           +abc
           +def
           +ghi

Edits      Edits
-----      -----
+s         +jkl
+t         +nmo
+u         +pqr
```

And the same happens in stack 2, in the process, creating stack 3:

```
Stack 1    Stack 2    Stack 3
=======    =======    =======
Bomb bay   Bomb bay   Bomb bay
--------   --------   --------

Edits      Edits      Edits
-----      -----      -----
+s         +jkl       +abcdefghi
+t         +nmo
+u         +pqr
```

Stack three is new so there's nothing in the bomb bay yet.


## Serial numbers

The memory has a property called `serial` which is a monotonically increasing number. Each new edit is tagged with the current serial. When edits get squashed and pushed, the squashed edit is tagged with the most recent serial in the squash.

This magic serial allows us to do something epically stupid, and that's what I did. See, looking at that algo above, it's pretty obvious that the moment to squash and push is "when the bomb bay is full". However... you can also work it out mathematically. If the stack period is p, each stack will push every `p^d` edits, where d is the dept of the stack (starting at 1.)

So stack 1 pushes every 3 edits; stack 2 pushes every 9 edits; stack 3 pushes every 27 edits. You can see that intuitively looking at those ascii diagrams - how many letters are in the bomb bay when we push?

There's also an offset, because these pushes don'#t start straight away. Think about ti - stack 1 pushes every 3, but doesn't start until 6. Stack 2 pushes every 9, but doesn't start until 21.

Wait what, 21? Yeah. The formula for the "offset" is

```
(p^d) + (p^d + p^d-1 + ... + p^1)
```

So if p is 3, and d is 2:

```
3^2 + 3^2 + 3^1
= 9 + 9 + 3
= 21
```

If p is 3 and d is 3:

```
3^3 + 3^3 + 3^2 + 3^1
= 27 + 27 + 9 + 3
= 66
```

You can think of this as "each stack needs to fill its own size *twice* and the size of all the higher stacks *once each* before pushing downwards.

Just to be look at bigger numbers, if we had p = 100 and d = 4 (plausible production numbers for a large document with lots of edits):

```
100^4 + 100^4 + 100^3 + 100^2 + 100^1
= 100000000 + 100000000 + 1000000 + 10000 + 100
= 201010100
```

And because I can do it with maths, I did.


## Snapshots and state

