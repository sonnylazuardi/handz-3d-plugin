import * as React from "react";
import "react-figma-plugin-ds/styles/figma-plugin-ds.min.css";

declare function require(path: string): any;

const { colors, types, items } = require("./data");

const { Tip, Button, Select } = require("react-figma-plugin-ds");

async function encodeFigma(canvas, ctx, imageData) {
  ctx.putImageData(imageData, 0, 0);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      //@ts-ignore
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = () => reject(new Error("Could not read from blob"));
      reader.readAsArrayBuffer(blob);
    });
  });
}

const getImageData = (image, canvasRef) => {
  const canvas = canvasRef.current;
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  return {
    imageData: context.getImageData(0, 0, image.width, image.height),
    canvas,
    context,
  };
};

const loadImage = async (src, imgRef) =>
  new Promise((resolve, reject) => {
    const img = imgRef.current;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });

const Home = (props) => {
  const [search, setSearch] = React.useState("");
  const [color, setColor] = React.useState("White");
  const [type, setType] = React.useState("Jacket");
  const canvasRef = React.useRef(null);
  const imgRef = React.useRef(null);

  const prefix = `https://handz.netlify.app/${color}/${type}/${color}-in-${type}`;
  return (
    <div className="content">
      <div className="searchbar">
        <input
          type="text"
          autoFocus={true}
          className="input"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          placeholder="Search Handz Gesture..."
        />
        <div className="selectbar">
          <Select
            className="select"
            defaultValue={color}
            onChange={(value) => {
              setColor(value.value);
            }}
            options={colors.map((color) => ({ label: color, value: color }))}
            placeholder="Select Color"
          />
          <Select
            className="select"
            defaultValue={type}
            onChange={(value) => {
              setType(value.value);
            }}
            options={types.map((type) => ({ label: type, value: type }))}
            placeholder="Select Type"
          />
        </div>
      </div>
      <div className="grid">
        {items
          .filter((item) => {
            return item.keywords.includes(search.toLowerCase());
          })
          .map((item, i) => {
            return (
              <button
                className="item"
                key={i}
                onClick={() => {
                  const setBg = async () => {
                    const image = await loadImage(
                      `${prefix}${item.number}.png`,
                      imgRef
                    );
                    const { imageData, canvas, context } = getImageData(
                      image,
                      canvasRef
                    );

                    const newBytes = await encodeFigma(
                      canvas,
                      context,
                      imageData
                    );

                    parent.postMessage(
                      {
                        pluginMessage: { type: "set-bg", data: { newBytes } },
                      },
                      "*"
                    );
                  };
                  setBg();
                }}
              >
                <img
                  crossOrigin={"anonymous"}
                  src={`${prefix}${item.number}.png`}
                  width="100%"
                />
              </button>
            );
          })}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img ref={imgRef} style={{ display: "none" }} />
    </div>
  );
};

export default Home;
