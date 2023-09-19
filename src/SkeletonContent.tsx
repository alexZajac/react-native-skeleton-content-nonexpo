import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  useDerivedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import Bones from './Bones/Bones';
import {
  ISkeletonContentProps,
  DEFAULT_EASING,
  DEFAULT_DURATION,
  DEFAULT_ANIMATION_TYPE,
  DEFAULT_ANIMATION_DIRECTION,
  DEFAULT_LOADING,
  DEFAULT_BONE_COLOR,
  DEFAULT_HIGHLIGHT_COLOR
} from './Constants';
import { SkeletonContextProps } from './SkeletonContentContext';
import SkeletonContentContextProvider from './SkeletonContentContextProvider';
import { useLayout } from './useLayout'; // eslint-disable-line

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});

const SkeletonContent: React.FC<ISkeletonContentProps> = ({
  containerStyle = styles.container,
  easing = DEFAULT_EASING,
  duration = DEFAULT_DURATION,
  layout = [],
  animationType = DEFAULT_ANIMATION_TYPE,
  animationDirection = DEFAULT_ANIMATION_DIRECTION,
  isLoading = DEFAULT_LOADING,
  boneColor = DEFAULT_BONE_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  children
}) => {
  const shiverValue = animationType === 'shiver' ? 1 : 0;

  const [componentSize, onLayout] = useLayout();

  const animationValue = useDerivedValue(() => {
    if (isLoading) {
      if (shiverValue === 1) {
        return withRepeat(withTiming(1, { duration, easing }), -1);
      }

      return withRepeat(
        withTiming(1, { duration: duration / 2, easing }),
        -1,
        true
      );
    }

    return 0;
  });

  const contextProps: SkeletonContextProps = {
    animationValue,
    animationType,
    animationDirection,
    componentSize,
    boneColor,
    highlightColor
  };

  return (
    <View style={containerStyle} onLayout={onLayout}>
      {isLoading ? (
        <SkeletonContentContextProvider value={contextProps}>
          <Bones bonesLayout={layout} childrenItems={children} />
        </SkeletonContentContextProvider>
      ) : (
        children
      )}
    </View>
  );
};

export default React.memo(SkeletonContent);
