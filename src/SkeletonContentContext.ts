import { createContext } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { AnimationDirection, AnimationType, ISize } from './Constants';

export type SkeletonContextProps = {
  animationValue: SharedValue<number>;
  animationType: AnimationType;
  animationDirection: AnimationDirection;
  componentSize: ISize;
  boneColor: string;
  highlightColor: string;
  prefix?: string | number;
};

export const SkeletonContentContext = createContext<SkeletonContextProps>(
  undefined!
);
