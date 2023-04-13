import React from 'react';
import AnimatedFace from './AnimatedFace';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import faceDown from '../assets/icons/face_down.webp';

interface Map {
  [key: string]: any;
}

const DESC: Map = {
  normal: 'Look straight',
  up: 'Face up',
  down: 'Face down',
  left: 'Turn left',
  right: 'Turn right',
};

interface Props {
  visibility: Boolean;
  actionKey: string;
  actionResult: string;
  onCameraOffsetStream: Function;
}

export default function Face({ 
  visibility, 
  actionKey, 
  actionResult, 
  onCameraOffsetStream,
}: Props) {
  const actionEl = React.useRef<any>(null);
  const bgRadial = React.useRef<number>(0);
  const actionDesc = React.useMemo(
    () => DESC[actionKey || 'normal'],
    [actionKey]
  );
  const ActionResult = React.useMemo(() => {
    if (actionResult === 'true')
      return <CheckIcon className="w-8 h-8 text-green-600" />;
    if (actionResult === 'false')
      return <XMarkIcon className="w-8 h-8 text-red-600" />;
    return <span className="w-8 h-8" />;
  }, [actionResult]);

  React.useEffect(() => {
    const left = 0.1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let offset = w > h ? 7.5 : 0;
    if (w > 640) w = 640;
    if (h > 1024) h = 1024;
    let d = Math.sqrt(w * w + h * h);
    let r = w / 2 - w * left;
    let topHeight = actionEl.current.offsetHeight;
    let diffHeight = h / 2 - topHeight;
    if (r >= diffHeight) r = diffHeight - 10;
    bgRadial.current =
      Number.parseFloat(((r * 100) / (d / 2)).toFixed(2)) - offset;
    onCameraOffsetStream({
      left: 0.5 - bgRadial.current / 100,
      top: Number.parseFloat(((h/2 - bgRadial.current * w /100) / h).toFixed(2))
    });
  }, []);

  function bgCircle(): string {
    return `radial-gradient(
      circle at center, 
      transparent ${bgRadial.current}%, 
      #4172ff ${bgRadial.current + 0.5}%, 
      rgba(255, 255, 255, 1) ${bgRadial.current + 1.25}%
    )`;
  }

  return (
    <section
      className={`absolute w-full h-full ${visibility ? '' : 'hidden'}`}
      style={{ background: `${bgCircle()}` }}
    >
      <article
        ref={actionEl}
        className="w-full flex flex-col items-center pt-10"
      >
        <AnimatedFace action={actionKey} />
        <p className="text-lg text-blue-600 mt-1">
          <span className="font-semibold">{actionDesc}</span>
        </p>
        {ActionResult}
      </article>
    </section>
  );
}
