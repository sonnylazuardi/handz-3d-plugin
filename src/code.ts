/* global figma, __html__*/

figma.showUI(__html__, { width: 340, height: 600 });


function clone(val) {
  return JSON.parse(JSON.stringify(val))
}

figma.ui.onmessage = (msg) => {

  if (msg.type === 'window-resize') {
    figma.ui.resize(msg.data.width, msg.data.height);
    return;
  }

  if (msg.type === 'notify') {
    figma.notify(msg.data.message);
    return;
  }

  if (msg.type === 'set-bg') {
    const newBytes: Uint8Array = msg.data.newBytes;
    const dropPosition = msg.data.dropPosition;
    const windowSize = msg.data.windowSize;
    let node = figma.currentPage.selection[0];
    if (!node || dropPosition) {
      node = figma.createRectangle();
      node.resize(800, 600)
    }
    figma.notify('Added to canvas');

    const newFills = [{
      type: "IMAGE",
      opacity: 1,
      scaleMode: "FILL",
      blendMode: "NORMAL",
      imageTransform: [
        [1,0,0],
        [0,1,0],
      ],
      imageHash: figma.createImage(newBytes).hash,
    }]
    //@ts-ignore
    node.fills = newFills

    if (dropPosition) {
      console.log(dropPosition, windowSize)
      const bounds = figma.viewport.bounds;
      const zoom = figma.viewport.zoom;

      // Math.round is used here because sometimes it may return a floating point number very close but not exactly the window width.
      const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;

      const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;
      const xFromCanvas = hasUI ? dropPosition.clientX - leftPaneWidth : dropPosition.clientX;
      const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY;


      node.x = bounds.x + xFromCanvas / zoom - node.width / 2;
      node.y = bounds.y + yFromCanvas / zoom - node.height / 2;
    } else {
      node.x = figma.viewport.center.x - node.width / 2;
      node.y = figma.viewport.center.y - -(node.height / 2);
    }

    figma.currentPage.selection = [node];

    return;
  }
}