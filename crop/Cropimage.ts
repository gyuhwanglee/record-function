import { useRef, useState } from "react";

function CropImage() {
  const blobUrlRef = useRef("");
  const hiddenAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const cropperRef = useRef<HTMLImageElement>(null);

  const [inputImage, setInputImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [resultData, setResultData] = useState<
    { data: string; width: number; height: number; file: File }[]
  >([]);
  const [cropData, setCropData] = useState<string>("");
  const [data, setData] = useState<HTMLCanvasElement | null>(null);
  const [cropImage, setCropImage] = useState<Blob[]>([]);
  const [width, setWidth] = useState<number | "">(0);
  const [height, setHeight] = useState<number | "">(0);
  const [limitHeight, setLimitHeight] = useState("");
  const [isInput, setIsInput] = useState(false);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const { width, height } = cropper?.getCroppedCanvas() || { width: 0, height: 0 };
    const widthData = cropper?.canvasData.naturalWidth;
    const heightData = cropper?.canvasData.naturalHeight;

    setIsInput(true);
    setCroppedImage(cropper?.getCroppedCanvas().toDataURL() || null);
    setWidth(width);
    setHeight(height);
  };

  const handleCropper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const data = URL.createObjectURL(file);
    let width = 0;
    let height = 0;
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = a => {
      let img = new Image();
      img.src = a.target?.result as string;
      img.src = reader.result as string;
      img.onload = function () {
        width = this.width;
        height = this.height;
        if (width >= 5000) {
          console.log("크다 커!");
        } else {
          setInputImage(file);
        }
      };
    };
  };

  const handleCropData = async () => {
    const resultSetData = [...resultData];
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const { width, height } = cropper?.getCroppedCanvas({
      // width: 100,
      // height: 100,
    }) || { width: 0, height: 0 };

    const file = await fetch(cropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL() || "")
      .then(res => res.blob())
      .then(blob => {
        return new File([blob], ".png", { type: "image/png" });
      });
    if (cropper?.cropper !== undefined) {
      resultSetData.push({
        data: cropper?.cropper.getCroppedCanvas().toDataURL(),
        width: width,
        height: height,
        file: file,
      });
      setCropData(cropper?.cropper.getCroppedCanvas().toDataURL());
      setData(cropper?.cropper.getCroppedCanvas());
      setResultData(resultSetData);
    }
  };

  const handle200EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper?.setData({ width: 200, height: 200 });
  };

  const handle1000EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper?.setData({ width: 1000, height: 1000 });
  };

  const handle900EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper?.setData({ width: 980, height: 735 });
  };

  const handle580EditSize = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper?.setData({ width: 580, height: 320 });
  };

  const handleFileDown = (file: File) => {
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
  
)
}