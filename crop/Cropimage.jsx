import react, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import axios from 'axios';
import styled from 'styled-components';
import 'cropperjs/dist/cropper.css';
function CropImage() {
  const blobUrlRef = useRef('');
  const hiddenAnchorRef = useRef(null);
  const cropperRef = useRef(null);
  // 유저가 첨부한 이미지
  const [inputImage, setInputImage] = useState(null);
  // 유저가 선택한 영역만큼 크롭된 이미지
  const [croppedImage, setCroppedImage] = useState(null);
  const [preview, setPreview] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [cropper, setCropper] = useState(null);
  const [cropData, setCropData] = useState('');
  const [data, setData] = useState([]);
  const [cropImage, setCropImage] = useState([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [limitHeight, setLimitHeight] = useState('');
  const [isInput, setIsInput] = useState(false);
  const onCrop = event => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const { width, height } = cropper.getCroppedCanvas();
    const widthData = cropper.canvasData.naturalWidth;
    const heightData = cropper.canvasData.naturalHeight;
    setIsInput(true);
    setCroppedImage(cropper.getCroppedCanvas().toDataURL());
    setWidth(width);
    setHeight(height);
  };

  const handleCropper = e => {
    let file = e.target.files[0];
    let data = URL.createObjectURL(e.target.files[0]);
    let width = 0;
    let height = 0;
    // let result = 0;
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = a => {
      let img = new Image();
      img.src = a.target.result;
      img.src = reader.result;
      img.onload = function () {
        width = this.width;
        height = this.height;
        if (width >= 5000) {
          // Limit Size 걸기! image업로드 하는 Input에서 제약을 건다.
          console.log('크다 커!');
        } else {
          setInputImage(URL.createObjectURL(e.target.files[0]));
        }
      };
    };
  };

  const handleCropData = async () => {
    const resultSetData = [...resultData];
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const { width, height } = cropper.getCroppedCanvas({
      // width: 100,
      // height: 100,
    });

    const file = await fetch(
      cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
    )
      .then(res => res.blob())
      .then(blob => {
        return new File([blob], '.png', { type: 'image/png' });
      });
    if (cropperRef.current?.cropper !== undefined) {
      resultSetData.push({
        data: cropperRef.current?.cropper.getCroppedCanvas().toDataURL(),
        width: width,
        height: height,
        file: file,
      });
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      setData(cropperRef.current?.cropper.getCroppedCanvas());
      setResultData(resultSetData);
    }
  };
  const handle200EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 200, height: 200 });
  };
  const handle1000EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 1000, height: 1000 });
  };
  const handle900EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 980, height: 735 });
  };
  const handle580EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.setData({ width: 580, height: 320 });
  };

  const handleFileDown = file => {
    const properties = { type: 'image/png' };
    let fileData = new File([file], properties);
    fileData = new Blob([file], properties);
    let url = window.URL.createObjectURL(fileData);
    const link = document.createElement('a');
    // document.getElementById('link').href = url;
    link.href = url;
    link.setAttribute('download', 'file');
    link.style.display = 'none';
    link.setAttribute('id', 'tempLink');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  };
  const fileDownLoaded = () => {
    // const target = cropperRef.current;
    // console.log('target', target);
    // domtoimage.toBlob(target).then(blob => {
    //   console.log('blob', blob);
    //   window.saveAs(blob, 'card.png');
    // });
  };
  const getCropData = async () => {
    const resultCropperImage = [...cropImage];
    if (cropData) {
      const file = await fetch(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
      )
        .then(res => res.blob())
        .then(blob => {
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
      <input type="file" accept="image/*" onChange={e => handleCropper(e)} />
      {inputImage?.length > 0 && (
        <Cropper
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={1}
          viewMode={1}
          // guides={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          // minWidth={100} // 800
          // minHeight={100} // 450
          background={false}
          responsive={false}
          autoCropArea={0.3}
          // autoCropArea={1}
          checkOrientation={false}
          cropBoxResizable={false}
          // cropBoxMovable={false}
          zoomOnWheel={false}
          // preview=".img-preview"
          src={inputImage}
          // crop={onCrop} // 실시간으로 적용되는 메소드를 사용하지 않으면, 크랩 윈도우 버퍼링이 없음
          ref={cropperRef}
        />
      )}

      {/* <div style={{ height: 100, width: '50%', fontSize: '50px' }}>
        <div>Width : {width}</div>
        <div>Height : {height}</div>
      </div>

      <div className="box" style={{ width: '50%', float: 'left' }}>
        <img
          style={{ width: '50%', height: '50%' }}
          alt="prewView"
          src={croppedImage}
        />
      </div> */}
      <div
        className="box"
        style={{ width: '50%', float: 'right', height: '300px' }}
      >
        <span style={{ fontSize: '50px' }}>Crop</span>
        <button style={{ float: 'right' }} onClick={handleCropData}>
          Crop Image
        </button>

        <button style={{ float: 'right' }} onClick={handle200EditSize}>
          200 x 200
        </button>
        <button style={{ float: 'right' }} onClick={handle1000EditSize}>
          1000 x 1000
        </button>
        <button style={{ float: 'right' }} onClick={handle900EditSize}>
          900 x 735
        </button>
        <button style={{ float: 'right' }} onClick={handle580EditSize}>
          580 x 320
        </button>
        <div>
          <button onClick={() => getCropData()} style={{ float: 'right' }}>
            Get Crop File
          </button>
        </div>
        {/* <button onClick={() => fileDownLoaded()} style={{ float: 'right' }}>
          Download Image
        </button> */}

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
        {resultData?.map((el, index) => {
          return (
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
                <span style={{ fontSize: '20px' }}>Width : {el.width}</span>
                <span style={{ fontSize: '20px' }}>Height : {el.height}</span>
                <span>
                  <button onClick={() => handleFileDown(el.file)}>
                    File Down
                  </button>
                </span>
              </div>

              <img
                style={{ width: '100%', height: '100%' }}
                alt="prewView"
                src={el.data}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
}
const Container = styled.div`
  .cropper-crop-box,
  .cropper-view-box {
    /* border-radius: 50%; */
    /* width: 100px;
    height: 100px; */
  }
  .cropper-crop-box {
  }
  .cropper-view-box {
    /* box-shadow: 0 0 0 1px #39f;
    outline: 0; */
  }

  /* .cropper-face {
    background-color: inherit !important;
  }

  .cropper-dashed,
  .cropper-point.point-se,
  .cropper-point.point-sw,
  .cropper-point.point-nw,
  .cropper-point.point-ne,
  .cropper-line {
    display: none !important;
  }

  .cropper-view-box {
    outline: inherit !important;
  } */
`;
export default CropImage;