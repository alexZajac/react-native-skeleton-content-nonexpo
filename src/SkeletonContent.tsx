import * as React from 'react';
import { useMemo } from 'react';
import { useCode, cond, eq, set } from 'react-native-reanimated';

import { View } from 'react-native';
import { loop, useValue } from 'react-native-redash/lib/module/v1';
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
  const animationValue = useValue(0);
  const loadingValue = useValue(isLoading ? 1 : 0);
  const shiverValue = useValue(animationType === 'shiver' ? 1 : 0);

  const [componentSize, onLayout] = useLayout();

  useCode(
    () =>
      cond(eq(loadingValue, 1), [
        cond(
          eq(shiverValue, 1),
          [
            set(
              animationValue,
              loop({
                duration,
                easing
              })
            )
          ],
          [
            set(
              animationValue,
              loop({
                duration: duration! / 2,
                easing,
                boomerang: true
              })
            )
          ]
        )
      ]),
    [loadingValue, shiverValue, animationValue]
  );

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
      ? getBones(layout, children, '', animationValue, skeletonMeta)
      : null;
  }, [animationValue, children, isLoading, layout, skeletonMeta]);

  const getComponent = () =>
    Component ? <Component {...componentProps} /> : children;

  return (
    <View style={containerStyle} onLayout={onLayout}>
      {isLoading ? bones : getComponent()}
    </View>
  );
};

export default React.memo(SkeletonContent);
