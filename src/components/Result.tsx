import React from 'react';
import {
  CreditCardIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from '@heroicons/react/24/outline';

interface Props {
  visibility: Boolean;
  data: any;
}

interface Map {
  [key: string]: any;
}

const TITLES: Map = {
  id: 'ID',
  id_eng: 'ID in english',
  name: 'Name',
  name_eng: 'Name in english',
  birthday: 'Birthday',
  birthday_eng: 'Birthday in English',
  father_name: `Father's name`,
  comparison: `Face comparison`,
};

const COMPARISON: Map = {
  GOOD: {
    icon: FaceSmileIcon,
    bgColor: 'bg-green-600',
    textColor: 'text-green-700',
    // desc: 'Similar faces',
    desc: 'Similarity',
  },
  NOT_MATCH: {
    icon: FaceFrownIcon,
    bgColor: 'bg-red-600',
    textColor: 'text-red-700',
    // desc: 'Different faces',
    desc: 'Similarity',
  },
};

const OCR = {
  icon: CreditCardIcon,
  bgColor: 'bg-blue-600',
  textColor: 'text-blue-700',
};

const ocrKeys = [
  'id',
  'id_eng',
  'name',
  'name_eng',
  'birthday',
  'birthday_eng',
  // 'father_name',
];

interface ResultField {
  title: string;
  icon: Function;
  bgColor: string;
  textColor: string;
  content: string;
}

export default function Result({ visibility, data }: Props) {
  const fields = React.useMemo(() => {
    let results: ResultField[] = [];
    if (!data) return results;
    if (data.comparison) {
      const temp = COMPARISON[data.comparison.level];
      results.push({
        title: TITLES['comparison'],
        icon: temp.icon,
        bgColor: temp.bgColor,
        textColor: temp.textColor,
        content: `${temp.desc} ${data.comparison.similarity}%`,
      });
    }
    ocrKeys.forEach((key) => {
      if (data.ocr[key]) {
        results.push({
          title: TITLES[key],
          icon: OCR.icon,
          bgColor: OCR.bgColor,
          textColor: OCR.textColor,
          content: data.ocr[key],
        });
      }
    });
    return results;
  }, [data]);

  return (
    <section
      className={`absolute w-full h-full flex flex-col justify-center items-center gap-4 px-4 bg-gray-50 ${
        visibility ? '' : 'hidden'
      }`}
    >
      {fields.map((el, idx) => (
        <article key={`fields_${idx}`} className="flex items-center w-full max-w-sm gap-4">
          <div className={`rounded-full p-2 ${el.bgColor}`}>
            <el.icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600">{el.title}</p>
            <p className={`text-lg ${el.textColor}`}>{el.content}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
