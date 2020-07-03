/* global figma, __html__*/

figma.showUI(__html__, { width: 340, height: 400 });


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
    let node = figma.currentPage.selection[0];
    if (!node) {
      node = figma.createRectangle();
      node.resize(800, 600)
    }
    figma.notify('Added to canvas');

    const newFills = []
    //@ts-ignore
    for (const paint of node.fills) {
      const newPaint = JSON.parse(JSON.stringify(paint))
      newPaint.blendMode = "NORMAL"
      newPaint.filters = {
        contrast: 0,
        exposure: 0,
        highlights: 0,
        saturation: 0,
        shadows: 0,
        temperature: 0,
        tint: 0,
      }
      newPaint.imageTransform = [
        [1, 0, 0],
        [0, 1, 0]
      ]
      newPaint.opacity = 1
      newPaint.scaleMode = "FILL"
      newPaint.scalingFactor = 0.5
      newPaint.visible = true
      newPaint.type = "IMAGE"
      delete newPaint.color
      newPaint.imageHash = figma.createImage(newBytes).hash
      newFills.push(newPaint)
    }
    //@ts-ignore
    node.fills = newFills

    return;
  }
}