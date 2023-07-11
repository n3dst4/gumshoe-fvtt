# Irid

This is a local copy of a color-wrangling toolkit called Irid that I wrote ages ago. Currently the library is in a STATE and needs lots of TLC, so as stopgap I have ported it here and converted it to TS. This gets round some of the weird import issues I was having with it, and also gives me a springboard for a newly revitalised version of the library.

## Usage

```ts
import { irid } from "irid";

const myColor = irid("#ff0000");

// irids are immutable, so all "setters" actually return a new object.
const myOtherColor = myColor.blue(0.5).alpha(0.5);

// getters and setters are overloaded (it was a bit inspired by jQuery!)
myOtherColor.red(); // 255
myOtherColor.green(); // 0
myOtherColor.blue(); // 128
myOtherColor.alpha(); // 0.5

// output as a hex string
myOtherColor.toHexString(); // '#ff008080'

// irid also works in HSL space, and doesn't just squash everything down to RGB
const myHSLColor = irid("hsl(0, 100%, 50%)");
```

After that, I recommend just seeing what TS autocomplete offers you.

## Design decisions

### Immutability

The most common use case for this library is to create a handful of variant colors to be used in something like a theme, or for a specific part of a UI. Without Immutability, you'd need to create a new color object for each variant, which would be a pain. With Immutability, you can just chain the setters and get a new object back each time.

### Overloaded getters and setters

This is just a holdover from being influenced by jQuery back in the day. We could just use proper JS/TS get/set methods now, but that's a new feature.
