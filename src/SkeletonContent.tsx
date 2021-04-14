import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';

import {
  DEFAULT_ANIMATION_DIRECTION,
  DEFAULT_ANIMATION_TYPE,
  DEFAULT_BONE_COLOR,
  DEFAULT_DURATION,
  DEFAULT_EASING,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_LOADING,
  styles
} from './Constants';
import {
  IPureSkeletonContentPropsFields,
  ISkeletonContentProps,
  ISkeletonMeta
} from './types';
import { getBones, useLayout } from './utils';

const SkeletonContent: React.FunctionComponent<ISkeletonContentProps &
  Partial<IPureSkeletonContentPropsFields>> = ({
  containerStyle = styles.container,
  easing = DEFAULT_EASING,
  duration = DEFAULT_DURATION,
  layout = [],
  animationType = DEFAULT_ANIMATION_TYPE,
  animationDirection = DEFAULT_ANIMATION_DIRECTION,
  isLoading = DEFAULT_LOADING,
  boneColor = DEFAULT_BONE_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  children,
  component: Component,
  componentProps
}) => {
  const animatedValue = useRef(new Animated.Value(0));

  const animatedCompositions = useRef<{
    shiverLoop?: Animated.CompositeAnimation;
    loop?: Animated.CompositeAnimation;
  }>({
    shiverLoop: undefined,
    loop: undefined
  });

  const [componentSize, onLayout] = useLayout();

  useEffect(() => {
    if (isLoading) {
      if (animationType === 'shiver') {
        if (!animatedCompositions.current.shiverLoop) {
          animatedCompositions.current.shiverLoop = Animated.loop(
            Animated.timing(animatedValue.current, {
              easing: easing as any,
              duration,
              toValue: 1,
              useNativeDriver: true
            })
          );
        }

        animatedCompositions.current.shiverLoop.start();
      } else {
        if (!animatedCompositions.current.loop) {
          animatedCompositions.current.loop = Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue.current, {
                easing: easing as any,
                toValue: 1,
                delay: duration,
                duration: duration / 2,
                useNativeDriver: true
              }),
              Animated.timing(animatedValue.current, {
                easing: easing as any,
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: true
              })
            ])
          );
        }

        animatedCompositions.current.loop.start();
      }
    } else if (animationType === 'shiver') {
      if (animatedCompositions.current.shiverLoop) {
        animatedCompositions.current.shiverLoop.stop();
      }
    } else if (animatedCompositions.current.loop) {
      animatedCompositions.current.loop.stop();
    }

    let composition: Animated.CompositeAnimation | undefined;

    if (animationType === 'shiver') {
      if (animatedCompositions.current.shiverLoop) {
        composition = animatedCompositions.current.shiverLoop;
      }
    } else if (animatedCompositions.current.loop) {
      composition = animatedCompositions.current.loop;
    }

    return () => {
      if (composition) {
        composition.stop();
      }
    };
  }, [isLoading, animationType, easing, duration]);

  const skeletonMeta = useMemo<ISkeletonMeta>(
    () => ({
      size: componentSize,
      animationType,
      highlightColor,
      boneColor,
      animationDirection
    }),
    [
      animationDirection,
      animationType,
      boneColor,
      componentSize,
      highlightColor
    ]
  );

  const bones = useMemo(() => {
    return isLoading
      ? getBones(layout, children, '', animatedValue.current, skeletonMeta)
      : null;
  }, [children, isLoading, layout, skeletonMeta]);

  const getComponent = () =>
    Component ? <Component {...componentProps} /> : children;

  return (
    <View style={containerStyle} onLayout={onLayout}>
      {isLoading ? bones : getComponent()}
    </View>
  );
};

export default React.memo(SkeletonContent);
