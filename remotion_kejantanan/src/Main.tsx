import React from 'react';
import {World} from './World';
import {renderIllustrations} from './illustrations';

// Video final 1080x1920: satu world one-shot, ilustrasi asli, grain 3%.
export const Main: React.FC = () => <World mode="final" renderIll={renderIllustrations} />;
