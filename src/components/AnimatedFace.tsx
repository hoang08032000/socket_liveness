import React from 'react';
import normalFace0 from '../assets/icons/ic_face_normal_0.png';
import normalFace1 from '../assets/icons/ic_face_normal_1.png';
import normalFace2 from '../assets/icons/ic_face_normal_2.png';
import normalFace3 from '../assets/icons/ic_face_normal_3.png';
import normalFace4 from '../assets/icons/ic_face_normal_4.png';
import normalFace5 from '../assets/icons/ic_face_normal_5.png';
import normalFace6 from '../assets/icons/ic_face_normal_6.png';
import normalFace7 from '../assets/icons/ic_face_normal_7.png';
import upFace0 from '../assets/icons/ic_face_up_0.png';
import upFace1 from '../assets/icons/ic_face_up_1.png';
import upFace2 from '../assets/icons/ic_face_up_2.png';
import upFace3 from '../assets/icons/ic_face_up_3.png';
import upFace4 from '../assets/icons/ic_face_up_4.png';
import upFace5 from '../assets/icons/ic_face_up_5.png';
import upFace6 from '../assets/icons/ic_face_up_6.png';
import upFace7 from '../assets/icons/ic_face_up_7.png';
import downFace0 from '../assets/icons/ic_face_down_0.png';
import downFace1 from '../assets/icons/ic_face_down_1.png';
import downFace2 from '../assets/icons/ic_face_down_2.png';
import downFace3 from '../assets/icons/ic_face_down_3.png';
import downFace4 from '../assets/icons/ic_face_down_4.png';
import downFace5 from '../assets/icons/ic_face_down_5.png';
import downFace6 from '../assets/icons/ic_face_down_6.png';
import downFace7 from '../assets/icons/ic_face_down_7.png';
import leftFace0 from '../assets/icons/ic_face_turn_left_0.png';
import leftFace1 from '../assets/icons/ic_face_turn_left_1.png';
import leftFace2 from '../assets/icons/ic_face_turn_left_2.png';
import leftFace3 from '../assets/icons/ic_face_turn_left_3.png';
import leftFace4 from '../assets/icons/ic_face_turn_left_4.png';
import leftFace5 from '../assets/icons/ic_face_turn_left_5.png';
import leftFace6 from '../assets/icons/ic_face_turn_left_6.png';
import leftFace7 from '../assets/icons/ic_face_turn_left_7.png';
import rightFace0 from '../assets/icons/ic_face_turn_right_0.png';
import rightFace1 from '../assets/icons/ic_face_turn_right_1.png';
import rightFace2 from '../assets/icons/ic_face_turn_right_2.png';
import rightFace3 from '../assets/icons/ic_face_turn_right_3.png';
import rightFace4 from '../assets/icons/ic_face_turn_right_4.png';
import rightFace5 from '../assets/icons/ic_face_turn_right_5.png';
import rightFace6 from '../assets/icons/ic_face_turn_right_6.png';
import rightFace7 from '../assets/icons/ic_face_turn_right_7.png';

interface Props {
  action?: string;
}

interface Map {
	[key: string]: any;
}

const actions: Map = {
  normal: [
    normalFace0,
    normalFace1,
    normalFace2,
    normalFace3,
    normalFace4,
    normalFace5,
    normalFace6,
    normalFace7,
  ],
  up: [
    upFace0,
    upFace1,
    upFace2,
    upFace3,
    upFace4,
    upFace5,
    upFace6,
    upFace7,
  ],
  down: [
    downFace0,
    downFace1,
    downFace2,
    downFace3,
    downFace4,
    downFace5,
    downFace6,
    downFace7,
  ],
  left: [
    leftFace0,
    leftFace1,
    leftFace2,
    leftFace3,
    leftFace4,
    leftFace5,
    leftFace6,
    leftFace7,
  ],
  right: [
    rightFace0,
    rightFace1,
    rightFace2,
    rightFace3,
    rightFace4,
    rightFace5,
    rightFace6,
    rightFace7,
  ],
};

export default function AnimatedFace({ action }: Props) {
  const [src, setSrc] = React.useState(actions['normal'][0]);

  React.useEffect(() => {
    if (action) {
      animate([...actions[action]]);
    }
  }, [action]);

  function animate(faces: any) {
    if (faces.length > 0) {
      const face = faces.shift();
      setSrc(face);
      setTimeout(() => {
        animate(faces);
      }, 1000 / 24);
    }
  }

  return <img src={src} width="48" height="48"/>;
}
