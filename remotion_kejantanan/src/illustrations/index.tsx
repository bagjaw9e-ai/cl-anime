import React from 'react';
import {ILLS} from '../illustrationTrack';
import {IllProps, IllWrap} from './common';
import {Shield} from './Shield';
import {PhoneRed} from './PhoneRed';
import {Hourglass} from './Hourglass';
import {Calendar} from './Calendar';
import {ShadowCrack} from './ShadowCrack';
import {HoloBrain} from './HoloBrain';
import {ThreeSlots} from './ThreeSlots';
import {PhoneBig} from './PhoneBig';
import {Dopamine} from './Dopamine';
import {Hook} from './Hook';
import {LoopArrows} from './LoopArrows';
import {WifiGlobe} from './WifiGlobe';
import {ScrollColumn} from './ScrollColumn';
import {TapRipple} from './TapRipple';
import {CardsBurst} from './CardsBurst';
import {GridWall} from './GridWall';
import {FrozenBrain} from './FrozenBrain';
import {VolumeKnob} from './VolumeKnob';
import {WiltFlower} from './WiltFlower';
import {StarFade} from './StarFade';
import {WallClock} from './WallClock';
import {Gauge} from './Gauge';
import {Spiral} from './Spiral';
import {Treadmill} from './Treadmill';
import {EmptyRoom} from './EmptyRoom';
import {FadeIcons} from './FadeIcons';
import {ThoughtBubble} from './ThoughtBubble';
import {Autopilot} from './Autopilot';
import {Battery} from './Battery';
import {BoredomChart} from './BoredomChart';
import {PanicBrain} from './PanicBrain';
import {Flatline} from './Flatline';
import {TossPhone} from './TossPhone';
import {Checklist} from './Checklist';
import {GuideBook} from './GuideBook';
import {WorldLogo} from './WorldLogo';
import {RewiredBrain} from './RewiredBrain';

type Reg = {C: React.FC<IllProps>; layer: 'back' | 'front'; out?: 'shrink' | 'fly' | 'none'; inS?: 'pop' | 'fade' | 'none'};
export const REGISTRY: Record<string, Reg> = {
  shield: {C: Shield, layer: 'front'}, phoneRed: {C: PhoneRed, layer: 'front'}, hourglass: {C: Hourglass, layer: 'front'},
  calendar: {C: Calendar, layer: 'front'}, shadow: {C: ShadowCrack, layer: 'back', inS: 'fade'}, holoBrain: {C: HoloBrain, layer: 'front'},
  threeSlots: {C: ThreeSlots, layer: 'front', inS: 'none'}, phoneBig: {C: PhoneBig, layer: 'front'}, dopamine: {C: Dopamine, layer: 'front'},
  hook: {C: Hook, layer: 'front', inS: 'fade'}, loop: {C: LoopArrows, layer: 'back', inS: 'fade'}, wifi: {C: WifiGlobe, layer: 'front'},
  scroll: {C: ScrollColumn, layer: 'front'}, tap: {C: TapRipple, layer: 'front', inS: 'fade'}, cards: {C: CardsBurst, layer: 'back', inS: 'none'},
  wall: {C: GridWall, layer: 'back', inS: 'none'}, frozenBrain: {C: FrozenBrain, layer: 'front'}, knob: {C: VolumeKnob, layer: 'front'},
  flower: {C: WiltFlower, layer: 'front'}, star: {C: StarFade, layer: 'front'}, clock: {C: WallClock, layer: 'front'},
  gauge: {C: Gauge, layer: 'front'}, spiral: {C: Spiral, layer: 'back', inS: 'fade'}, treadmill: {C: Treadmill, layer: 'back', inS: 'fade'},
  room: {C: EmptyRoom, layer: 'back', inS: 'fade'}, icons: {C: FadeIcons, layer: 'front'}, bubble: {C: ThoughtBubble, layer: 'front', out: 'fly'},
  autopilot: {C: Autopilot, layer: 'front', inS: 'fade'}, battery: {C: Battery, layer: 'front'}, chart: {C: BoredomChart, layer: 'front'},
  panicBrain: {C: PanicBrain, layer: 'front'}, flatline: {C: Flatline, layer: 'front'}, tossPhone: {C: TossPhone, layer: 'front', inS: 'none', out: 'none'},
  checklist: {C: Checklist, layer: 'front'}, guide: {C: GuideBook, layer: 'front'}, logo: {C: WorldLogo, layer: 'front', inS: 'none', out: 'none'},
  rewired: {C: RewiredBrain, layer: 'front'},
};

export const renderIllustrations = (f: number) => {
  const mk = (layer: 'back' | 'front') => ILLS.filter((il) => REGISTRY[il.key]?.layer === layer).map((il) => {
    const r = REGISTRY[il.key];
    return <IllWrap key={il.key} il={il} f={f} outStyle={r.out ?? 'shrink'} inStyle={r.inS ?? 'pop'}>{(p) => <r.C {...p} />}</IllWrap>;
  });
  return {back: mk('back'), front: mk('front')};
};
