import React from 'react';
import io from 'socket.io-client';
import Loading from './components/Loading';
import Alert from './components/Alert';
import Result from './components/Result';
import Camera from './components/Camera';
import Card from './components/Card';
import Face from './components/Face';
import { SOCKET, EVENT, STREAMING } from './configs';
import useToggle from './hooks/useToggle';

const socket = io(SOCKET.URL, {
  path: SOCKET.PATH,
  // query: {
  //   Authorization: new URLSearchParams(window.location.search).get('session'),
  // },
  auth: {
    token: new URLSearchParams(window.location.search).get('session'),
  },
});

interface CardResponse {
  success: boolean;
  message?: string;
}

interface ActionResponse {
  success: boolean;
  action: string | null;
}

interface PoseResponse {
  success: boolean;
  action: string | null;
}

interface ResultResponse {
  success: boolean;
  message?: string;
  ocr?: any;
  comparison?: any;
}

function App() {
  const [visibleLoading, toggleVisibleLoading] = useToggle(true);
  const [visibleAlert, toggleVisibleAlert] = useToggle(false);
  const [visibleResult, toggleVisibleResult] = useToggle(false);
  const [visibleFace, toggleVisibleFace] = useToggle(false);
  const [visibleCard, toggleVisibleCard] = useToggle(true);
  const [visibleCamera, toggleVisibleCamera] = useToggle(true);
  const [streamingCamera, toggleStreamingCamera] = useToggle(false);
  const [capturingCamera, setCapturingCamera] = React.useState(0);
  const capturingCameraOffset = React.useRef<any>(null);
  const streamingCameraOffset = React.useRef<any>(null);
  const [actionKey, setActionKey] = React.useState('');
  const [actionResult, setActionResult] = React.useState('');
  const [cardImageBlob, setCardImageBlob] = React.useState<any>(null);
  const levelAlert = React.useRef('');
  const messageAlert = React.useRef('');
  const dataResult = React.useRef<any>(null);

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log(Date.now(), 'connect');
      toggleVisibleLoading(false);
    });

    socket.on('connect_error', (err: unknown) => {
      console.error(Date.now(), 'connect_error', err, socket);
      levelAlert.current = 'warning';
      messageAlert.current = 'Session expired';
      toggleVisibleAlert(true);
      toggleVisibleLoading(false);
      socket.disconnect();
    });

    socket.on('disconnect', (err: unknown) => {
      console.error(Date.now(), 'disconnect', err, socket);
      levelAlert.current = 'warning';
      messageAlert.current = 'Session expired';
      toggleVisibleAlert(true);
      toggleVisibleLoading(false);
      socket.disconnect();
    });

    socket.on(EVENT.ON.RESULT, (res: ResultResponse) => {
      console.log(Date.now(), EVENT.ON.RESULT, res);
      toggleStreamingCamera(false);
      if (res) {
        if (res.ocr && res.comparison) {
          dataResult.current = {
            ocr: res.ocr,
            comparison: res.comparison,
          };
          toggleVisibleResult(true);
        } else {
          levelAlert.current = 'info';
          messageAlert.current = res.message || 'Liveness failed';
          toggleVisibleAlert(true);
        }
      } else {
        levelAlert.current = 'danger';
        messageAlert.current = 'Unknown error';
        toggleVisibleAlert(true);
      }
      toggleVisibleLoading(false);
    });

    // socket.on(EVENT.ON.POSE, (res: PoseResponse) => {
    //   console.log(Date.now(), EVENT.ON.POSE, res);
    //   if (res) {
    //     toggleStreamingCamera(false);
    //     setActionResult(`${res.success}`);
    //     if (res.action) {
    //       setActionResult('');
    //       setActionKey(res.action);
    //       setTimeout(() => {
    //         // wait user noticing to action description
    //         console.log(
    //           Date.now(),
    //           EVENT.ON.POSE,
    //           res.action,
    //           'toggleStreamingCamera'
    //         );
    //         toggleStreamingCamera(true);
    //       }, STREAMING.DELAY_POSE);
    //     } else {
    //       toggleStreamingCamera(false);
    //       socket.emit(EVENT.EMIT.POSE);
    //     }
    //   } else {
    //     levelAlert.current = 'danger';
    //     messageAlert.current = 'Unknown error';
    //     toggleVisibleAlert(true);
    //   }
    // });

    socket.on(EVENT.ON.ACTION, (res: ActionResponse) => {
      console.log(Date.now(), EVENT.ON.ACTION, res);
      if (res) {
        toggleStreamingCamera(false);
        setActionResult(`${res.success}`);
        if (res.action) {
          setActionResult('');
          setActionKey(res.action);
          setTimeout(() => {
            // wait user noticing to action description
            console.log(
              Date.now(),
              EVENT.ON.POSE,
              res.action,
              'toggleStreamingCamera'
            );
            toggleStreamingCamera(true);
          }, STREAMING.DELAY_POSE);
        } else {
          toggleStreamingCamera(false);
          toggleVisibleLoading(true);
        }
      } else {
        levelAlert.current = 'danger';
        messageAlert.current = 'Unknown error';
        toggleVisibleAlert(true);
      }
    });

    socket.on(EVENT.ON.CARD, (res: CardResponse) => {
      toggleVisibleCard(false);
      console.log(Date.now(), EVENT.ON.CARD, res);
      if (res && res.success) {
        setTimeout(() => {
          toggleStreamingCamera(true);
        }, 500);
        toggleVisibleFace(true);
      } else {
        levelAlert.current = 'danger';
        messageAlert.current = res.message || 'OCR Failed';
        toggleVisibleAlert(true);
      }
      toggleVisibleLoading(false);
    });

    return () => {
      socket.off(EVENT.ON.RESULT);
      // socket.off(EVENT.ON.POSE);
      socket.off(EVENT.ON.ACTION);
    };
  }, []);

  function handleCameraError(err: any) {
    console.error('handleCameraError', err);
    levelAlert.current = 'danger';
    messageAlert.current = 'Camera is disabled';
    toggleVisibleAlert(true);
  }

  function handleCardChangeError(err: string) {
    console.error('handleCardChangeError', err);
    levelAlert.current = 'danger';
    messageAlert.current = err;
    toggleVisibleAlert(true);
  }

  function handleCardCapture(offset: any) {
    setCapturingCamera(capturingCamera + 1);
    console.log('handleCardCapture', offset);
    if (offset) {
      capturingCameraOffset.current = offset;
    } else {
      capturingCameraOffset.current = null;
    }
  }

  function handleCardRecapture() {
    setCardImageBlob(null);
  }

  function handleCardSubmit(imageBlob: any) {
    socket.emit(EVENT.EMIT.CARD, imageBlob);
    toggleVisibleLoading(true);
  }

  function handleCameraCapture(imageBlob: any) {
    if (imageBlob) {
      setCardImageBlob(imageBlob);
    }
  }

  function handleCameraStream(imageBlob: any) {
    if (imageBlob) {
      console.log(Date.now(), EVENT.EMIT.ACTION, imageBlob);
      socket.emit(EVENT.EMIT.ACTION, imageBlob);
    }
  }

  function handleCameraOffsetStream(offset: any) {
    console.log('handleCameraOffsetStream', offset);
    if (offset) {
      streamingCameraOffset.current = offset;
    } else {
      streamingCameraOffset.current = null;
    }
  }

  return (
    <main className="w-full max-w-[640px] h-screen max-h-[1024px] my-0 mx-auto relative overflow-x-hidden overflow-y-auto bg-gray-50">
      <Camera
        // frontCamera={visibleCard}
        cameraMode={visibleCard ? 'card' : 'portrait'}
        visibility={visibleCamera}
        capturing={capturingCamera}
        capturingOffset={capturingCameraOffset.current}
        streamingOffset={streamingCameraOffset.current}
        streaming={streamingCamera}
        onError={handleCameraError}
        onCapture={handleCameraCapture}
        onStream={handleCameraStream}
      />
      <Card
        visibility={visibleCard}
        capturedImageBlob={cardImageBlob}
        onCardCapture={handleCardCapture}
        onCardRecapture={handleCardRecapture}
        onCardSubmit={handleCardSubmit}
        onCardChangeError={handleCardChangeError}
      />
      <Face
        visibility={visibleFace}
        actionKey={actionKey}
        actionResult={actionResult}
        onCameraOffsetStream={handleCameraOffsetStream}
      />
      <Result visibility={visibleResult} data={dataResult.current} />
      <Alert
        visibility={visibleAlert}
        level={levelAlert.current}
        message={messageAlert.current}
      />
      <Loading visibility={visibleLoading} />
    </main>
  );
}

export default App;
