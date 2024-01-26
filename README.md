# VisJS Network - Minimap

This is a basic implementation of minimap.

![](https://s13.gifyu.com/images/S0XE8.gif)

#### Example ( Pure JS )
- [Minimap Codepen](https://codepen.io/savkelita/pen/XwNgXE) - Fixed Size
- [Minimap JSFiddle](https://jsfiddle.net/savke/m476zwns/) - Responsive

#### What is Vis ?
**Vis.js** is a dynamic, browser based visualization library. The library is designed to be easy to use, handle large amounts of dynamic data, and enable manipulation of the data. [https://github.com/almende/vis](https://github.com/almende/vis)

#### Panning support:
Thanks to [Aleksey Boev](https://github.com/aboev) now we can control network through minimap. 🎉

**_Important note_:**

Currently Minimap doesn't support `dragNodes` option. You need to turn it off:

```
const options = {
  nodes: {},
  edges: {},
  interaction: {
    dragNodes: false,
  },
};
```

Your advice or suggestions will be much appreciated and welcomed.


Made with :heartbeat:
