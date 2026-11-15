import React from 'react';
import {C} from '../theme';
import {IllProps, Spark} from './common';

// #19 riak klik di layar HP yang dijempol
export const TapRipple: React.FC<IllProps> = ({t}) => (
  <g transform="translate(-40,46)">
    {[0, 1, 2].map((i) => {
      const u = ((t * 0.06 + i / 3) % 1);
      return <circle key={i} r={10 + u * 70} fill="none" stroke={C.cream} strokeWidth={4} opacity={(1 - u) * 0.9} />;
    })}
    <circle r={8} fill="#FFFFFF" opacity={0.9} />
    <Spark x={40} y={-40} s={0.6 + 0.3 * Math.sin(t * 0.4)} c={C.cream} />
  </g>
);
