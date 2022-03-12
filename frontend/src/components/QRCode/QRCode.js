import React, {  useRef, useMemo } from 'react';
import ReactQRCode from "react-qr-code";

export default function QRCode({value='', size=256, title='QR Code', bgColor='#fff', fgColor='#000'}) {
  const svgRef = useRef(null);
  
  function svgDataURL() {
    const svg = svgRef?.current?.children[0];
    const svgData = new XMLSerializer().serializeToString(svg).replace('style="display: none;"','style="padding: 30px"');
    const imgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;


      var dArr = [-50,-50, 0,-50, 50,-50, -50,0, 50,0, -50,50, 0,50, 50,50], // offset array
      s = 2,  // thickness scale
      i = 0,  // iterator
      x = 10,  // final position
      y = 10;
  
      // draw images at offsets from the array scaled by s
      for(; i < dArr.length; i += 2)
        ctx.drawImage(img, x + dArr[i]*s, y + dArr[i+1]*s);
      
      // fill with color
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width , canvas.height );
      
      // draw original image in normal mode
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, x + 40, y + 40);


      // ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(imgData)}`;
      return "data:image/svg+xml," + encodeURIComponent(svgData);
  }
  
  // function svgDataURL() {
  //   const svg = svgRef?.current?.children[0];
  //   var svgAsXML = (new XMLSerializer()).serializeToString(svg).replace('style="display: none;"','style="padding: 30px"');
  //   return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
  // }

  function download(){
    var dl = document.createElement("a");
    document.body.appendChild(dl); // This line makes it work in Firefox.
    dl.setAttribute("href", svgDataURL());
    dl.setAttribute("download", `member-${value}.svg`);
    dl.click();
  }

  const qrCode = useMemo(() => {
    return svgRef?.current?.children[0];
  },[svgRef]);

  return (
    <div ref={svgRef}>
      <ReactQRCode 
        value={value} 
        size={512}
        title={title}
        bgColor={bgColor}
        fgColor={fgColor}
        style={{display: 'none'}}
      />
      <ReactQRCode 
        value={value} 
        size={size}
        // title={title}
        bgColor={bgColor}
        fgColor={fgColor}
        onClick={() => download(qrCode)}
        style={{cursor: 'pointer'}}
        title="Download"
      />
    </div>
  )
}
