import React from 'react';
import { STREAMING } from '../configs';

interface CameraProps {
  visibility: Boolean;
  onError: Function;
  onCapture: Function;
  onStream: Function;
  capturing?: number;
  capturingOffset?: any;
  streamingOffset?: any;
  streaming?: Boolean;
  // frontCamera?: Boolean;
  cameraMode?: string;
}

export default function Camera({
  visibility = true,
  onError,
  onCapture,
  onStream,
  capturing = 0,
  capturingOffset,
  streamingOffset,
  streaming = false,
  // frontCamera = false,
  cameraMode = 'portrait',
}: CameraProps) {
  // const flipCamera = frontCamera ? '' : '-scale-x-100';
  const flipCamera = isCardMode() ? '' : '-scale-x-100';
  const videoEl = React.useRef<any>(null);
  const streamer = React.useRef<any>(null);

  React.useEffect(() => {
    open();
    return () => close();
  }, [cameraMode]);

  React.useEffect(() => {
    if (capturing) {
      if (capturingOffset) {
        const { left, top } = capturingOffset;
        draw({ left, top }).then((imageBlob) => {
          onCapture(imageBlob);
        });
      } else {
        draw().then((imageBlob) => {
          onCapture(imageBlob);
        });
      }
    }
  }, [capturing]);

  React.useEffect(() => {
    console.warn('streaming', streaming);
    let streamingInterval: number | null = null;
    if (streaming) {
      streamingInterval = setInterval(() => {
        if (streamingOffset) {
          const { left, top } = streamingOffset;
          draw({ left, top }).then((imageBlob) => {
            onStream(imageBlob);
          });
        } else {
          draw().then((imageBlob) => {
            onStream(imageBlob);
          });
        }
      }, STREAMING.FPS);
    }
    return () => {
      if (streamingInterval) {
        clearInterval(streamingInterval);
        console.log('clear interval');
      }
    };
  }, [streaming]);

  function isPortraitMode() {
    return cameraMode === 'portrait';
  }
  function isCardMode() {
    return cameraMode === 'card';
  }

  function draw(options?: any) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.current.videoWidth;
      canvas.height = videoEl.current.videoHeight;
      const context = canvas.getContext('2d');
      console.log('context', options);
      if (context) {
        // if (options && options.left && options.top) {
        if (options) {
          const left = options.left || 0;
          const top = options.top || 0;
          const cw = canvas.width;
          const ch = canvas.height;
          let ww = window.innerWidth;
          if (ww > 640) ww = 640;
          let wh = window.innerHeight;
          if (wh > 1024) wh = 1024;
          // const ww = window.innerWidth;
          // const wh = window.innerHeight;
          const vw = ww;
          const vh = (vw * ch) / cw;
          const wTop = top * wh;
          const centerToTop = wh / 2 - wTop;
          const vTop = vh / 2 - centerToTop;
          const cTop = (ch * vTop) / vh;
          const sx = cw * left;
          // const sx = 0;
          const sy = cTop;
          const sw = cw - sx * 2;
          const sh = ch - sy * 2;
          const dx = 0;
          const dy = 0;
          const dw = sw;
          const dh = sh;
          canvas.width = dw;
          canvas.height = dh;
          console.log('drawImage', {
            top,
            cw,
            ch,
            ww,
            wh,
            vw,
            vh,
            wTop,
            centerToTop,
            vTop,
            cTop,
            sx,
            sy,
            sw,
            sh,
          });
          context.drawImage(videoEl.current, sx, sy, sw, sh, dx, dy, dw, dh);
        } else {
          context.drawImage(videoEl.current, 0, 0);
          console.log('drawImage', 0, 0);
        }
        canvas.toBlob(
          (blob) => {
            return resolve(blob);
          },
          'image/jpeg',
          1.0
        );
        // const blob = canvas.toDataURL('image/jpeg', 1.0);
        // return resolve(blob);
      }
      return null;
    });
  }

  function open() {
    const defaultConstraints = {
      audio: false,
      video: { facingMode: 'user' },
    };
    const fullHdConstraints = {
      audio: false,
      video: {
        facingMode: 'user',
        width: { ideal: 1920 },
        // height: { min: 360, ideal: 1920 }
      },
    };
    const rearFullHdConstraints = {
      audio: false,
      video: {
        facingMode: { exact: 'environment' },
        width: { ideal: 1920 },
        // height: { min: 360, ideal: 1920 }
      },
    };
    let constraints: any = defaultConstraints;
    if (isCardMode()) {
      constraints = rearFullHdConstraints;
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const mediaTimeout = setTimeout(() => {
        onError('navigator is null');
      }, 30 * 1000);
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          streamer.current = stream;
          videoEl.current.srcObject = stream;
        })
        .catch((err) => {
          if (isCardMode()) {
            navigator.mediaDevices
              .getUserMedia(fullHdConstraints)
              .then((stream) => {
                streamer.current = stream;
                videoEl.current.srcObject = stream;
              })
              .catch((err) => {
                onError(err);
              })
              .finally(() => {
                clearTimeout(mediaTimeout);
              });
          } else {
            onError(err);
          }
        })
        .finally(() => {
          clearTimeout(mediaTimeout);
        });
    }
    // else if (navigator.getUserMedia) {
    //   // Standard
    //   navigator.getUserMedia(
    //     constraints,
    //     stream => {
    //       this.streamer = stream;
    //       this.view.src = stream;
    //       // this.$emit("open-camera", true);
    //       // this.view.src = window.URL.createObjectURL(mediaStream);
    //     },
    //     onError
    //   );
    // }
    // else if (navigator.webkitGetUserMedia) {
    //   // WebKit-prefixed
    //   navigator.webkitGetUserMedia(
    //     constraints,
    //     stream => {
    //       this.streamer = stream;
    //       this.view.src = window.webkitURL.createObjectURL(stream);
    //       this.$emit("open-camera", true);
    //     },
    //     onError
    //   );
    // }
    // else if (navigator.mozGetUserMedia) {
    //   // Mozilla-prefixed
    //   navigator.mozGetUserMedia(
    //     constraints,
    //     stream => {
    //       this.streamer = stream;
    //       this.view.src = window.URL.createObjectURL(stream);
    //       this.$emit("open-camera", true);
    //     },
    //     onError
    //   );
    // }
    else {
      onError('navigator is null');
    }
  }

  function close() {
    if (streamer.current) {
      streamer.current.getTracks().forEach((track: any) => {
        track.stop();
      });
    }
  }

  return (
    <section className={`absolute w-full h-full ${visibility ? '' : 'hidden'}`}>
      <video
        className={`absolute w-full h-full ${flipCamera}`}
        ref={videoEl}
        muted
        autoPlay
        playsInline
      ></video>
    </section>
  );
}
