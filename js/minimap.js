/* A MiniMap for vis-network
Draws a small version of the network, if and only if the whole network is not visible (i.e. some nodes are outside the viewport).  The visible portion of the network is outlined in the minimap.  Users can steer around the network by dragging or zooming the outline.  The minimap is updated whenever the network is resized, panned or zoomed.
*/

const ratio = 5; // Ratio is difference between original VisJS Network and Minimap.
const nodes = [
  {
    id: 0,
    label: "0",
    group: 0
  },
  {
    id: 1,
    label: "1",
    group: 0
  },
  {
    id: 2,
    label: "2",
    group: 0
  },
  {
    id: 3,
    label: "3",
    group: 1
  },
  {
    id: 4,
    label: "4",
    group: 1
  },
  {
    id: 5,
    label: "5",
    group: 1
  },
  {
    id: 6,
    label: "6",
    group: 2
  },
  {
    id: 7,
    label: "7",
    group: 2
  },
  {
    id: 8,
    label: "8",
    group: 2
  },
  {
    id: 9,
    label: "9",
    group: 3
  },
  {
    id: 10,
    label: "10",
    group: 3
  },
  {
    id: 11,
    label: "11",
    group: 3
  },
  {
    id: 12,
    label: "12",
    group: 4
  },
  {
    id: 13,
    label: "13",
    group: 4
  },
  {
    id: 14,
    label: "14",
    group: 4
  },
  {
    id: 15,
    label: "15",
    group: 5
  },
  {
    id: 16,
    label: "16",
    group: 5
  },
  {
    id: 17,
    label: "17",
    group: 5
  },
  {
    id: 18,
    label: "18",
    group: 6
  },
  {
    id: 19,
    label: "19",
    group: 6
  },
  {
    id: 20,
    label: "20",
    group: 6
  },
  {
    id: 21,
    label: "21",
    group: 7
  },
  {
    id: 22,
    label: "22",
    group: 7
  },
  {
    id: 23,
    label: "23",
    group: 7
  },
  {
    id: 24,
    label: "24",
    group: 8
  },
  {
    id: 25,
    label: "25",
    group: 8
  },
  {
    id: 26,
    label: "26",
    group: 8
  },
  {
    id: 27,
    label: "27",
    group: 9
  },
  {
    id: 28,
    label: "28",
    group: 9
  },
  {
    id: 29,
    label: "29",
    group: 9
  }
];
const edges = [
  {
    from: 1,
    to: 0
  },
  {
    from: 2,
    to: 0
  },
  {
    from: 4,
    to: 3
  },
  {
    from: 5,
    to: 4
  },
  {
    from: 4,
    to: 0
  },
  {
    from: 7,
    to: 6
  },
  {
    from: 8,
    to: 7
  },
  {
    from: 7,
    to: 0
  },
  {
    from: 10,
    to: 9
  },
  {
    from: 11,
    to: 10
  },
  {
    from: 10,
    to: 4
  },
  {
    from: 13,
    to: 12
  },
  {
    from: 14,
    to: 13
  },
  {
    from: 13,
    to: 0
  },
  {
    from: 16,
    to: 15
  },
  {
    from: 17,
    to: 15
  },
  {
    from: 15,
    to: 10
  },
  {
    from: 19,
    to: 18
  },
  {
    from: 20,
    to: 19
  },
  {
    from: 19,
    to: 4
  },
  {
    from: 22,
    to: 21
  },
  {
    from: 23,
    to: 22
  },
  {
    from: 22,
    to: 13
  },
  {
    from: 25,
    to: 24
  },
  {
    from: 26,
    to: 25
  },
  {
    from: 25,
    to: 7
  },
  {
    from: 28,
    to: 27
  },
  {
    from: 29,
    to: 28
  },
  {
    from: 28,
    to: 0
  }
];

// Create network
const container = document.getElementById("mynetwork");
const data = {
  nodes: new vis.DataSet(nodes),
  edges: new vis.DataSet(edges)
};

// Network options
const options = {
  nodes: {
    shape: "dot",
    size: 30,
    font: {
      size: 32,
      color: "#333"
    },
    borderWidth: 1
  },
  edges: {
    arrows: "to",
    chosen: false,
    color: {
      color: "#333"
    }
  },
  interaction: {
    dragNodes: false
  }
};
const network = new vis.Network(container, data, options);

function drawMinimap(ratio = 5) {
  let fullNetPane,
    fullNetwork,
    initialScale,
    initialPosition,
    minimapWidth,
    minimapHeight;
  const minimapWrapper = document.getElementById("minimapWrapper"); // a div to contain the minimap
  const minimapImage = document.getElementById("minimapImage"); // an img, child of minimapWrapper
  const minimapRadar = document.getElementById("minimapRadar"); // a div, child of minimapWrapper
  // size the minimap
  minimapSetup();
  // set up dragging of the radar overlay
  let dragging = false; // if true, ignore clicks when user is dragging radar overlay
  dragRadar();
  /**
   * Set the size of the minimap and its components
   */
  function minimapSetup() {
    const { clientWidth, clientHeight } = network.body.container;
    minimapWidth = clientWidth / ratio;
    minimapHeight = clientHeight / ratio;
    minimapWrapper.style.width = `${minimapWidth}px`;
    minimapWrapper.style.height = `${minimapHeight}px`;
    minimapRadar.style.width = `${minimapWidth}px`;
    minimapRadar.style.height = `${minimapHeight}px`;
    drawMinimapImage();
    drawRadar();
  }
  /**
   * Draw a copy of the full network offscreen, then create an image of it
   * The visible network can't be used, because it may be scaled and panned, but the minimap image needs to
   * show the full network
   */
  function drawMinimapImage() {
    if (! document.getElementById("fullnetPane")) {
      // if the full network does not exist, create it
      fullNetPane = document.createElement("div");
      fullNetPane.style.position = "absolute";
      fullNetPane.style.top = "-9999px";
      fullNetPane.style.left = "-9999px";
      fullNetPane.style.width = `${mynetwork.offsetWidth}px`;
      fullNetPane.style.height = `${mynetwork.offsetHeight}px`;
      fullNetPane.id = "fullNetPane";
      mynetwork.appendChild(fullNetPane);
      fullNetwork = new vis.Network(fullNetPane, data, {
        physics: { enabled: false }
      });
    }
    fullNetwork.setOptions();
    fullNetwork.fit();
    initialScale = fullNetwork.getScale();
    initialPosition = fullNetwork.getViewPosition();

    const fullNetworklCanvas = fullNetPane.firstElementChild.firstElementChild;
    fullNetwork.on("afterDrawing", () => {
      // make the image as a reduced version of the fullNetwork
      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");
      tempCanvas.width = minimapWidth;
      tempCanvas.height = minimapHeight;
      tempContext.drawImage(
        fullNetworklCanvas,
        0,
        0,
        minimapWidth,
        minimapHeight
      );
      minimapImage.src = tempCanvas.toDataURL();
      minimapImage.width = minimapWidth;
      minimapImage.height = minimapHeight;
    });
  }
  /**
   * Move a radar overlay on the minimap to show the current view of the network
   */
  function drawRadar() {
    const scale = initialScale / network.getScale();
    // fade out the whole minimap if the network is all visible in the viewport
    // (there is no value in having a minimap in this case)
    if (scale >= 1 && networkInPane()) {
      minimapWrapper.style.opacity = 0;
      return;
    } else minimapWrapper.style.opacity = 1;
    const currentDOMPosition = network.canvasToDOM(network.getViewPosition());
    const initialDOMPosition = network.canvasToDOM(initialPosition);

    minimapRadar.style.left = `${Math.round(
      ((currentDOMPosition.x - initialDOMPosition.x) * scale) / ratio +
        (minimapWidth * (1 - scale)) / 2
    )}px`;
    minimapRadar.style.top = `${Math.round(
      ((currentDOMPosition.y - initialDOMPosition.y) * scale) / ratio +
        (minimapHeight * (1 - scale)) / 2
    )}px`;
    minimapRadar.style.width = `${minimapWidth * scale}px`;
    minimapRadar.style.height = `${minimapHeight * scale}px`;
  }
  /**
   *
   * @returns {boolean} - true if the network is entirely within the viewport
   */
  function networkInPane() {
    const netPaneTopLeft = network.DOMtoCanvas({ x: 0, y: 0 });
    const netPaneBottomRight = network.DOMtoCanvas({
      x: mynetwork.clientWidth,
      y: mynetwork.clientHeight
    });
    for (const nodeId of data.nodes.getIds()) {
      const boundingBox = network.getBoundingBox(nodeId);
      if (boundingBox.left < netPaneTopLeft.x) return false;
      if (boundingBox.right > netPaneBottomRight.x) return false;
      if (boundingBox.top < netPaneTopLeft.y) return false;
      if (boundingBox.bottom > netPaneBottomRight.y) return false;
    }
    return true;
  }
  /**
   * Whenever the network is resized, the minimap needs to be resized and the radar overlay moved
   */
  network.on("resize", () => {
    minimapSetup();
  });
  /**
   * Whenever the network is changed, panned or zoomed, the radar overlay needs to be moved
   */
  network.on("afterDrawing", () => {
    drawRadar();
  });
  /**
   * Set up dragging of the radar overlay
   */
  function dragRadar() {
    let x, y, radarStart;
    minimapRadar.addEventListener("pointerdown", dragMouseDown);
    minimapWrapper.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        // reject all but vertical touch movements
        if (Math.abs(e.deltaX) <= 1) zoomscroll(e);
      },
      { passive: false }
    );

    function dragMouseDown(e) {
      e.preventDefault();
      (x = e.clientX), (y = e.clientY);
      radarStart = { x: minimapRadar.offsetLeft, y: minimapRadar.offsetTop };
      minimapRadar.addEventListener("pointermove", drag);
      minimapRadar.addEventListener("pointerup", dragMouseUp);
    }

    function drag(e) {
      e.preventDefault();
      dragging = true;
      let dx = e.clientX - x;
      let dy = e.clientY - y;
      let left = radarStart.x + dx;
      let top = radarStart.y + dy;
      if (left < 0) left = 0;
      if (left + minimapRadar.offsetWidth >= minimapWidth)
        left = minimapWidth - minimapRadar.offsetWidth;
      if (top < 0) top = 0;
      if (top + minimapRadar.offsetHeight >= minimapHeight)
        top = minimapHeight - minimapRadar.offsetHeight;
      minimapRadar.style.left = `${Math.round(left)}px`;
      minimapRadar.style.top = `${Math.round(top)}px`;
      let initialDOMPosition = network.canvasToDOM(initialPosition);
      const scale = initialScale / network.getScale();
      const radarRect = minimapRadar.getBoundingClientRect();
      const wrapperRect = minimapWrapper.getBoundingClientRect();
      network.moveTo({
        position: network.DOMtoCanvas({
          x:
            ((radarRect.left -
              wrapperRect.left +
              (radarRect.width - wrapperRect.width) / 2) *
              ratio) /
              scale +
            initialDOMPosition.x,
          y:
            ((radarRect.top -
              wrapperRect.top +
              (radarRect.height - wrapperRect.height) / 2) *
              ratio) /
              scale +
            initialDOMPosition.y
        })
      });
    }

    function dragMouseUp(e) {
      e.preventDefault();
      if (!dragging) return;
      minimapRadar.removeEventListener("pointermove", drag);
      minimapRadar.removeEventListener("pointerup", dragMouseUp);
    }
  }
}
/**
 * Zoom using a trackpad (with a mousewheel or two fingers)
 * @param {Event} event
 */
var clicks = 0; // accumulate 'mousewheel' clicks sent while display is updating
var ticking = false; // if true, we are waiting for an AnimationFrame */
// see https://www.html5rocks.com/en/tutorials/speed/animations/
function zoomscroll(event) {
  clicks += event.deltaY;
  requestZoom();
}
function requestZoom() {
  if (!ticking) requestAnimationFrame(zoomUpdate);
  ticking = true;
}
const MOUSEWHEELZOOMRATE = 0.01; // how many 'clicks' of the mouse wheel/finger track correspond to 1 zoom increment
function zoomUpdate() {
  zoomincr(-clicks * MOUSEWHEELZOOMRATE);
  ticking = false;
  clicks = 0;
}
function zoomincr(incr) {
  let newScale = network.getScale();
  newScale += incr;
  if (newScale > 4) newScale = 4;
  if (newScale <= 0.1) newScale = 0.1;
  network.moveTo({ scale: newScale });
}

drawMinimap();