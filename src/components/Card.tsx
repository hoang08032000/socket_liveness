import React, { ChangeEventHandler } from 'react';
import {
  CloudArrowUpIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

interface Props {
  visibility: Boolean;
  onCardChangeError: Function;
  onCardCapture: Function;
  onCardRecapture: Function;
  onCardSubmit: Function;
  capturedImageBlob?: any;
}

const LIMIT_UPLOAD_SIZE = 3 * 1e6; // MB

export default function Card({
  visibility,
  onCardChangeError,
  onCardCapture,
  onCardRecapture,
  onCardSubmit,
  capturedImageBlob,
}: Props) {
  const [attachFile, setAttachFile] = React.useState<any>(null);
  const [clipLeft, setClipLeft] = React.useState<number>(0.1);
  const [clipTop, setClipTop] = React.useState<number>(0.3);

  const fileBlob = React.useMemo(
    () => attachFile && URL.createObjectURL(attachFile),
    [attachFile]
  );
  
  const capturedImageSrc = React.useMemo(
    () => capturedImageBlob && URL.createObjectURL(capturedImageBlob),
    // () => capturedImageBlob,
    [capturedImageBlob]
  );
  const cardStyles = React.useMemo(() => {
    if (attachFile) return {};
    const clipPath = computeClipPath();
    return {
      clipPath: clipPath,
      WebkitClipPath: clipPath,
    };
  }, [attachFile]);

  // React.useEffect(() => {
  //   const ratio = 1.6;
  //   const left = 0.1;
  //   let h = window.innerHeight;
  //   if (h > 1024) h = 1024;
  //   let w = window.innerWidth;
  //   if (w > 640) w = 640;
  //   let boxLeft = w * left;
  //   let boxW = w - 2 * boxLeft;
  //   let boxH = boxW / ratio;
  //   let boxTop = (h - boxH) / 2;
  //   const top = Number.parseFloat((boxTop / h).toFixed(2));
  //   setClipLeft(left);
  //   setClipTop(top);
  // }, []);

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (!isSupportedFile(file))
      return onCardChangeError('Unsupported media type');
    if (file.size > LIMIT_UPLOAD_SIZE)
      return onCardChangeError('Payload too large');
    // setAttachFile(URL.createObjectURL(file));
    setAttachFile(file);
  }

  function handleFileSubmit() {
    if (attachFile) {
      // onCardSubmit({
      //   data: attachFile,
      //   ext: attachFile.name.split('.').pop(),
      // });
      onCardSubmit(attachFile);
    }
    if (capturedImageBlob) {
      // onCardSubmit({
      //   data: capturedImageBlob,
      //   ext: 'png',
      // });
      onCardSubmit(capturedImageBlob);
    }
  }

  function handleCapture() {
    onCardCapture({ 
      // left: clipLeft,
      left: 0,
      top: clipTop 
    });
  }

  function handleRecapture() {
    onCardRecapture();
  }

  function computeClipPath() {
    const ratio = 1.6;
    const left = 0.1;
    let h = window.innerHeight;
    if (h > 1024) h = 1024;
    let w = window.innerWidth;
    if (w > 640) w = 640;
    let boxLeft = w * left;
    let boxW = w - 2 * boxLeft;
    let boxH = boxW / ratio;
    let boxTop = (h - boxH) / 2;
    const top = Number.parseFloat((boxTop / h).toFixed(2));
    setClipLeft(left);
    setClipTop(top);
    return `polygon(
      0% 0%, 0% 100%,
      ${100 * left}% 100%,
      ${100 * left}% ${100 * top}%,
      ${100 - 100 * left}% ${100 * top}%,
      ${100 - 100 * left}% ${100 - 100 * top}%,
      ${100 * left}% ${100 - 100 * top}%,
      ${100 * left}% 100%,
      100% 100%, 100% 0%
    )`;
  }

  return (
    <section
      className={`absolute w-full h-full ${
        visibility ? '' : 'hidden'
      }`}
    >
      <article
        className={`absolute w-full h-full flex flex-col justify-center items-center px-4 bg-gray-50 ${
          capturedImageBlob ? '' : 'hidden'
        }`}
      >
        <img src={capturedImageSrc} />
      </article>
      <div
        className="absolute w-full h-full flex flex-col justify-between items-center px-4 bg-gray-50"
        style={cardStyles}
      >
        <div className="w-full flex"></div>
        <div
          className={`w-full h-[480px] flex bg-no-repeat bg-center bg-contain ${
            attachFile ? '' : 'hidden'
          }`}
          style={{ backgroundImage: `url(${fileBlob})` }}
        ></div>
        <div className="flex flex-col gap-3 w-full mb-8">
          <div className="w-full flex gap-3">
            <form className="w-full">
              <label htmlFor="dropzone-file">
                <div className="w-full bg-blue-600 text-gray-50 text-center p-3 cursor-pointer">
                  Choose image
                </div>
              </label>
              <input
                id="dropzone-file"
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </form>
            <button
              className={`w-full bg-blue-600 text-gray-50 p-3 disabled:bg-gray-300 ${
                capturedImageBlob ? 'hidden' : ''
              }`}
              disabled={attachFile}
              onClick={handleCapture}
            >
              Capture
            </button>
            <button
              className={`w-full bg-blue-600 text-gray-50 p-3 disabled:bg-gray-300 ${
                capturedImageBlob ? '' : 'hidden'
              }`}
              disabled={attachFile}
              onClick={handleRecapture}
            >
              Recapture
            </button>
          </div>
          <button
            className="w-full bg-green-600 text-gray-50 p-3 disabled:bg-gray-300"
            disabled={!attachFile && !capturedImageBlob}
            onClick={handleFileSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}

function isSupportedFile(file: any) {
  return (
    file.size &&
    file.type &&
    (file.type.includes('pdf') || file.type.includes('image/'))
  );
}

// function UploadZone() {
//   return (
//     <article
//       className="w-full h-[480px] flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg bg-no-repeat bg-center bg-contain"
//       style={{ backgroundImage: `url(${fileBlob})` }}
//     >
//       <div
//         className={`flex flex-col items-center justify-center pt-5 pb-6 ${
//           attachFile ? 'hidden' : ''
//         }`}
//       >
//         <IdentificationIcon className="h-24 w-24 text-gray-500" />
//         <p className="mb-2 text-sm text-gray-500">
//           <span className="font-semibold">Card image</span>
//         </p>
//         <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 5MB)</p>
//       </div>
//     </article>
//   )
// }

// interface DropzoneProps {
//   onFileChange: ChangeEventHandler;
// }

// function Dropzone({ onFileChange }: DropzoneProps) {
//   return (
//     <form className="flex items-center justify-center w-full">
//       <label
//         htmlFor="dropzone-file"
//         className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100  hover:bg-gray-200"
//       >
//         <div className="flex flex-col items-center justify-center pt-5 pb-6">
//           <CloudArrowUpIcon className="h-12 w-12 text-gray-500" />
//           <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//             <span className="font-semibold">Click to upload </span>
//             {/* or drag and drop */}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             PNG, JPG or PDF (MAX. 25MB)
//           </p>
//         </div>
//       </label>
//       <input
//         id="dropzone-file"
//         type="file"
//         hidden
//         accept="image/*,.pdf"
//         onChange={onFileChange}
//       />
//     </form>
//   );
// }
