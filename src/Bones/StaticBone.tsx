import React, { useContext } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle
} from 'react-native-reanimated';
import BoneHelper from '../BoneHelper';
import { ICustomViewStyle } from '../Constants';
import {
  SkeletonContextProps,
  SkeletonContentContext
} from '../SkeletonContentContext';

type UseStaticBoneStyle = Pick<StaticBoneProps, 'layoutStyle'> &
  Omit<SkeletonContextProps, 'prefix'>;

const useStaticBoneStyle = (props: UseStaticBoneStyle): ICustomViewStyle[] => {
  const animatedPulseStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      props.animationValue.value,
      [0, 1],
      [props.boneColor, props.highlightColor]
    )
  }));

  return [
    BoneHelper.getBoneStyle(
      props.layoutStyle,
      props.componentSize,
      props.animationType,
      props.animationDirection,
      props.boneColor
    ),
    ...(props.animationType === 'none' ? [] : [animatedPulseStyle])
  ];
};

type StaticBoneProps = {
  layoutStyle: ICustomViewStyle;
  id: number | string;
};

const StaticBone = ({ layoutStyle, id }: StaticBoneProps): JSX.Element => {
  const contextProps = useContext(SkeletonContentContext);
  const style = useStaticBoneStyle({ layoutStyle, ...contextProps });

  return <Animated.View key={layoutStyle.key || id} style={style} />;
};

export default StaticBone;
