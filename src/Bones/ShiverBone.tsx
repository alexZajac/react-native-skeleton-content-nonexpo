import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { ICustomViewStyle } from '../Constants';
import BoneHelper from '../BoneHelper';
import { SkeletonContentContext } from '../SkeletonContentContext';

const styles = StyleSheet.create({
  absoluteGradient: {
    height: '100%',
    position: 'absolute',
    width: '100%'
  },
  gradientChild: {
    flex: 1
  }
});

const {
  getBoneStyle,
  getGradientTransform,
  getGradientSize,
  getGradientEndDirection
} = BoneHelper;

type ShiverBoneProps = {
  layoutStyle: ICustomViewStyle;
  id: number | string;
};

const ShiverBone = ({ layoutStyle, id }: ShiverBoneProps): JSX.Element => {
  const {
    animationValue,
    animationType,
    animationDirection,
    componentSize,
    boneColor,
    highlightColor
  } = useContext(SkeletonContentContext);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: getGradientTransform(
      layoutStyle,
      componentSize,
      animationValue,
      animationDirection
    ),
    ...getGradientSize(layoutStyle, componentSize, animationDirection)
  }));

  const gradientEndDirection = React.useMemo(
    () =>
      getGradientEndDirection(
        layoutStyle,
        componentSize,
        animationType,
        animationDirection
      ),
    [layoutStyle, componentSize, animationType, animationDirection]
  );

  return (
    <View
      key={layoutStyle.key || id}
      style={getBoneStyle(
        layoutStyle,
        componentSize,
        animationType,
        animationDirection,
        boneColor
      )}
    >
      <Animated.View style={[styles.absoluteGradient, animatedStyle]}>
        <LinearGradient
          colors={[boneColor, highlightColor, boneColor]}
          start={{ x: 0, y: 0 }}
          end={gradientEndDirection}
          style={styles.gradientChild}
        />
      </Animated.View>
    </View>
  );
};

export default ShiverBone;
