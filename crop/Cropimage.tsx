import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import axios from 'axios';
import styled from 'styled-components';
import 'cropperjs/dist/cropper.css';

function CropImage() {
  const blobUrlRef = useRef<string>('');
  const hiddenAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const cropperRef = useRef<Cropper>(null);

  // 유저가 첨부한 이미지
  const [inputImage, setInputImage] = useState<string | null>(null);
  // 유저가 선택한 영역만큼 크롭된 이미지
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [resultData, setResultData] = useState<any[]>([]);
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const [cropData, setCropData] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [cropImage, setCropImage] = useState<File[]>([]);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [limitHeight, setLimitHeight] = useState<string>('');
  const [isInput, setIsInput] = useState<boolean>(false);

  const onCrop = () => {
    const imageElement = cropperRef.current?.image;
    const cropper = imageElement?.cropper;
    const { width, height } = cropper.getCroppedCanvas();
    const widthData = cropper.canvasData.naturalWidth;
    const heightData = cropper.canvasData.naturalHeight;
    setIsInput(true);
    setCroppedImage(cropper.getCroppedCanvas().toDataURL());
    setWidth(width.toString());
    setHeight(height.toString());
  };

  const handleCropper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const data = URL.createObjectURL(file);
    let width = 0;
    let height = 0;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (a) => {
      const img = new Image();
      img.src = a.target?.result as string;
      img.onload = function () {
        width = this.width;
        height = this.height;
        if (width >= 5000) {
          // Limit Size 걸기! image based input screen.
          console.log('Fuck you!');
        } else {
          setInputImage(URL.createObjectURL(file));
        }
      };
    };
  };

  const handleCropData = async () => {
    const resultSetData = [...resultData];
    const imageElement = cropperRef.current?.image;
    const cropper = imageElement?.cropper;
    const { width, height } = cropper.getCroppedCanvas();

    const file = await fetch(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
      .then((res) => res.blob())
      .then((blob) => {
        return new File([blob], '.png', { type: 'image/png' });
      });

    if (cropperRef.current?.cropper !== undefined) {
      resultSetData.push({
        data: cropperRef.current?.cropper.getCroppedCanvas().toDataURL(),
        width: width,
        height: height,
        file: file,
      });
      setCropData(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
      setData(cropperRef.current?.cropper.getCroppedCanvas());
      setResultData(resultSetData);
    }
  };

  

  const handle200EditSize = () => {
    const imageElement = cropperRef.current?.image;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 200, height: 200 });
  };

  const handle1000EditSize = () => {
    const imageElement = cropperRef.current?.image;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 1000, height: 1000 });
  };

  const handle900EditSize = () => {
    const imageElement = cropperRef.current?.image;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 980, height: 735 });
  };

  const handle580EditSize = () => {
    const imageElement = cropperRef.current?.image;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 580, height: 320 });
  };

  const handleFileDown = (file: File) => {
    const properties = { type: 'image/png' };
    let fileData = new File([file], 'file.png', properties);
    fileData = new Blob([file], properties);
    let url = window.URL.createObjectURL(fileData);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file');
    link.style.display = 'none';
    link.setAttribute('id', 'tempLink');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getCropData = async () => {
    const resultCropperImage = [...cropImage];
    if (cropData) {
      const file = await fetch(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], '.png', { type: 'image/png' });
        });
      if (file) {
        resultCropperImage.push(file);
        setCropImage(resultCropperImage);
      }
    }
  };

  return (
    <Container>
      <input type="file" accept="image/*" onChange={handleCropper} />
      {inputImage && (
        <Cropper
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={1}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={false}
          autoCropArea={0.3}
          checkOrientation={false}
          cropBoxResizable={false}
          zoomOnWheel={false}
          src={inputImage}
          ref={cropperRef}
        />
      )}
  
      <div className="box" style={{ width: '50%', float: 'right', height: '300px' }}>
        <span style={{ fontSize: '50px' }}>Crop</span>
        <button style={{ float: 'right' }} onClick={handleCropData}>
          Crop Image
        </button>
        <button style={{ float: 'right' }} onClick={handle200EditSize}>
          200 x
        </button>
        <button style={{ float: 'right' }} onClick={handle1000EditSize}>
          1000 x
        </button>
        <button style={{ float: 'right' }} onClick={handle900EditSize}>
          900 x 735 pixels
        </button>
        <button style={{ float: 'right' }} onClick={handle580EditSize}>
          580 x 320 pixels
        </button>
        <div>
          <button onClick={getCropData} style={{ float: 'right' }}>
            Get Crop File
          </button>
        </div>
        <img style={{ width: '100%' }} src={cropData} alt="cropped" />
      </div>
      <div
        style={{
          width: '100%',
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          marginLeft: '20px',
        }}
      >
        {resultData.map((el, index) => (
          <div
            style={{
              display: 'flex',
              width: '25%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
            key={index}
          >
            <div style={{ marginTop: '30px' }}>
              <h1 style={{ fontSize: '50px' }}>Clap Image {index + 1}</h1>
              <span style={{ fontSize: '20px' }}>Width: {el.width}</span>
              <span style={{ fontSize: '20px' }}>Height: {el.height}</span>
              <span>
                <button onClick={() => handleFileDown(el.file)}>File Down</button>
              </span>
            </div>
            <img style={{ width: '100%', height: '100%' }} alt="preview" src={el.data} />
          </div>
        ))}
      </div>
    </Container>
  );
  
}

const Container = styled.div`
  .cropper-crop-box,
  .cropper-view-box {
  }

  .cropper-crop-box {
  }

  .cropper-view-box {
  }
`;

export default CropImage;


