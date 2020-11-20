import { ViewStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { ComponentType } from 'react';

export type AnimationType = 'none' | 'shiver' | 'pulse' | undefined;
export type AnimationDirection =
  | 'horizontalLeft'
  | 'horizontalRight'
  | 'verticalTop'
  | 'verticalDown'
  | 'diagonalDownLeft'
  | 'diagonalDownRight'
  | 'diagonalTopLeft'
  | 'diagonalTopRight'
  | undefined;

export interface ICustomViewStyle extends ViewStyle {
  children?: ICustomViewStyle[];
  key?: number | string;
}

export interface ISkeletonContentProps {
  isLoading: boolean;
  layout?: ICustomViewStyle[];
  duration?: number;
  containerStyle?: StyleProp<ViewStyle>;
  animationType?: AnimationType;
  animationDirection?: AnimationDirection;
  boneColor?: string;
  highlightColor?: string;
  easing?: Animated.EasingFunction;
  children?: any;
}

export interface IPureSkeletonContentPropsFields<T = any> {
  component: ComponentType<T>;
  componentProps: T;
}

export interface IPureSkeletonContentProps<T>
  extends IPureSkeletonContentPropsFields<T>,
    Omit<ISkeletonContentProps, 'children'> {}

export interface IDirection {
  x: number;
  y: number;
}
