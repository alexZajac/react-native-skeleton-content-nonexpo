import { ComponentType } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

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
  easing?: Animated.EasingNodeFunction;
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

export interface IComponentSize {
  width: number;
  height: number;
}

export interface ISkeletonMeta {
  boneColor: string;
  highlightColor: string;
  size: IComponentSize;
  animationType: AnimationType;
  animationDirection: AnimationDirection;
}
