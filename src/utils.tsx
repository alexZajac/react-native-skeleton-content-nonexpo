import * as React from 'react';
import { useCallback, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { DEFAULT_BORDER_RADIUS, styles } from './Constants';
import {
  IComponentSize,
  ICustomViewStyle,
  IDirection,
  ISkeletonMeta
} from './types';

export const useLayout: () => [
  IComponentSize,
  (event: LayoutChangeEvent) => void
] = () => {
  const [size, setSize] = useState<IComponentSize>({ width: 0, height: 0 });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

// use layout dimensions for percentages (string type)
const getBoneLayout = (
  boneLayout: ICustomViewStyle,
  layout: IComponentSize
) => ({
  width:
    (typeof boneLayout.width === 'string' ? layout.width : boneLayout.width) ||
    0,
  height:
    (typeof boneLayout.height === 'string'
      ? layout.height
      : boneLayout.height) || 0
});

const getGradientEndDirection = (
  boneLayout: ICustomViewStyle,
  { size, animationType, animationDirection }: ISkeletonMeta
): IDirection => {
  let direction = { x: 0, y: 0 };

  if (animationType === 'shiver') {
    if (
      animationDirection === 'horizontalLeft' ||
      animationDirection === 'horizontalRight'
    ) {
      direction = { x: 1, y: 0 };
    } else if (
      animationDirection === 'verticalTop' ||
      animationDirection === 'verticalDown'
    ) {
      direction = { x: 0, y: 1 };
    } else if (
      animationDirection === 'diagonalTopRight' ||
      animationDirection === 'diagonalDownRight' ||
      animationDirection === 'diagonalDownLeft' ||
      animationDirection === 'diagonalTopLeft'
    ) {
      const { width, height } = getBoneLayout(boneLayout, size);

      if (width && height && width > height) {
        return { x: 0, y: 1 };
      }
      return { x: 1, y: 0 };
    }
  }
  return direction;
};

const getBoneStyles = (
  boneLayout: ICustomViewStyle,
  { size, boneColor, animationType, animationDirection }: ISkeletonMeta
): ICustomViewStyle => {
  const boneStyle: ICustomViewStyle = {
    ...getBoneLayout(boneLayout, size),
    borderRadius: boneLayout.borderRadius || DEFAULT_BORDER_RADIUS,
    ...boneLayout
  };

  if (animationType !== 'pulse') {
    boneStyle.overflow = 'hidden';
    boneStyle.backgroundColor = boneLayout.backgroundColor || boneColor;
  }
  if (
    animationDirection === 'diagonalDownRight' ||
    animationDirection === 'diagonalDownLeft' ||
    animationDirection === 'diagonalTopRight' ||
    animationDirection === 'diagonalTopLeft'
  ) {
    boneStyle.justifyContent = 'center';
    boneStyle.alignItems = 'center';
  }
  return boneStyle;
};

const getGradientSize = (
  boneLayout: ICustomViewStyle,
  { size, animationDirection }: ISkeletonMeta
): ICustomViewStyle => {
  const gradientStyle = getBoneLayout(boneLayout, size);

  if (
    animationDirection === 'diagonalDownRight' ||
    animationDirection === 'diagonalDownLeft' ||
    animationDirection === 'diagonalTopRight' ||
    animationDirection === 'diagonalTopLeft'
  ) {
    if (gradientStyle.height >= gradientStyle.width) {
      gradientStyle.height *= 1.5;
    } else {
      gradientStyle.width *= 1.5;
    }
  }

  return gradientStyle;
};

const getStaticBoneStyles = (
  boneLayout: ICustomViewStyle,
  animatedValue: Animated.Value<number>,
  meta: ISkeletonMeta
): (ICustomViewStyle | { backgroundColor: any })[] => {
  const pulseStyles = [
    getBoneStyles(boneLayout, meta),
    {
      backgroundColor: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [meta.boneColor!, meta.highlightColor!]
      })
    }
  ];

  if (meta.animationType === 'none') {
    pulseStyles.pop();
  }

  return pulseStyles;
};

const getPositionRange = (
  boneLayout: ICustomViewStyle,
  { size, animationDirection }: ISkeletonMeta
): number[] => {
  const outputRange: number[] = [];

  const { width: boneWidth, height: boneHeight } = getBoneLayout(
    boneLayout,
    size
  );

  if (animationDirection === 'horizontalRight') {
    outputRange.push(-boneWidth, +boneWidth);
  } else if (animationDirection === 'horizontalLeft') {
    outputRange.push(+boneWidth, -boneWidth);
  } else if (animationDirection === 'verticalDown') {
    outputRange.push(-boneHeight, +boneHeight);
  } else if (animationDirection === 'verticalTop') {
    outputRange.push(+boneHeight, -boneHeight);
  }

  return outputRange;
};

const getGradientTransform = (
  boneLayout: ICustomViewStyle,
  animatedValue: Animated.Value<number>,
  meta: ISkeletonMeta
): object => {
  let transform = {};
  const { size, animationDirection } = meta;
  const { width: boneWidth, height: boneHeight } = getBoneLayout(
    boneLayout,
    size
  );

  if (
    animationDirection === 'verticalTop' ||
    animationDirection === 'verticalDown' ||
    animationDirection === 'horizontalLeft' ||
    animationDirection === 'horizontalRight'
  ) {
    const interpolatedPosition = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: getPositionRange(boneLayout, meta)
    });
    if (
      animationDirection === 'verticalTop' ||
      animationDirection === 'verticalDown'
    ) {
      transform = { translateY: interpolatedPosition };
    } else {
      transform = { translateX: interpolatedPosition };
    }
  } else if (
    animationDirection === 'diagonalDownRight' ||
    animationDirection === 'diagonalTopRight' ||
    animationDirection === 'diagonalDownLeft' ||
    animationDirection === 'diagonalTopLeft'
  ) {
    const diagonal = Math.sqrt(boneHeight * boneHeight + boneWidth * boneWidth);
    const mainDimension = Math.max(boneHeight, boneWidth);
    const oppositeDimension =
      mainDimension === boneWidth ? boneHeight : boneWidth;
    const diagonalAngle = Math.acos(mainDimension / diagonal);
    let rotateAngle =
      animationDirection === 'diagonalDownRight' ||
      animationDirection === 'diagonalTopLeft'
        ? Math.PI / 2 - diagonalAngle
        : Math.PI / 2 + diagonalAngle;
    const additionalRotate =
      animationDirection === 'diagonalDownRight' ||
      animationDirection === 'diagonalTopLeft'
        ? 2 * diagonalAngle
        : -2 * diagonalAngle;
    const distanceFactor = (diagonal + oppositeDimension) / 2;

    if (mainDimension === boneWidth && boneWidth !== boneHeight) {
      rotateAngle += additionalRotate;
    }
    const sinComponent = Math.sin(diagonalAngle) * distanceFactor;
    const cosComponent = Math.cos(diagonalAngle) * distanceFactor;
    let xOutputRange = [0, 0];
    let yOutputRange = [0, 0];

    if (
      animationDirection === 'diagonalDownRight' ||
      animationDirection === 'diagonalTopLeft'
    ) {
      xOutputRange =
        animationDirection === 'diagonalDownRight'
          ? [-sinComponent, sinComponent]
          : [sinComponent, -sinComponent];
      yOutputRange =
        animationDirection === 'diagonalDownRight'
          ? [-cosComponent, cosComponent]
          : [cosComponent, -cosComponent];
    } else {
      xOutputRange =
        animationDirection === 'diagonalDownLeft'
          ? [-sinComponent, sinComponent]
          : [sinComponent, -sinComponent];
      yOutputRange =
        animationDirection === 'diagonalDownLeft'
          ? [cosComponent, -cosComponent]
          : [-cosComponent, cosComponent];
      if (mainDimension === boneHeight && boneWidth !== boneHeight) {
        xOutputRange.reverse();
        yOutputRange.reverse();
      }
    }

    let translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: xOutputRange
    });
    let translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: yOutputRange
    });

    // swapping the translates if width is the main dim
    if (mainDimension === boneWidth) {
      [translateX, translateY] = [translateY, translateX];
    }
    const rotate = `${rotateAngle}rad`;

    transform = { translateX, translateY, rotate };
  }

  return transform;
};

const getBoneContainer = (
  layoutStyle: ICustomViewStyle,
  childrenBones: JSX.Element[],
  key: number | string
) => (
  <View key={layoutStyle.key || key} style={layoutStyle}>
    {childrenBones}
  </View>
);

const getStaticBone = (
  layoutStyle: ICustomViewStyle,
  key: number | string,
  animatedValue: Animated.Value<number>,
  skeletonMeta: ISkeletonMeta
): JSX.Element => (
  <Animated.View
    key={layoutStyle.key || key}
    style={getStaticBoneStyles(layoutStyle, animatedValue, skeletonMeta)}
  />
);

const getShiverBone = (
  layoutStyle: ICustomViewStyle,
  key: number | string,
  animatedValue: Animated.Value<number>,
  skeletonMeta: ISkeletonMeta
): JSX.Element => {
  const { boneColor, highlightColor } = skeletonMeta;
  const animatedStyle: any = {
    transform: [getGradientTransform(layoutStyle, animatedValue, skeletonMeta)],
    ...getGradientSize(layoutStyle, skeletonMeta)
  };

  return (
    <View
      key={layoutStyle.key || key}
      style={getBoneStyles(layoutStyle, skeletonMeta)}
    >
      <Animated.View style={[styles.absoluteGradient, animatedStyle]}>
        <LinearGradient
          colors={[boneColor!, highlightColor!, boneColor!]}
          start={{ x: 0, y: 0 }}
          end={getGradientEndDirection(layoutStyle, skeletonMeta)}
          style={styles.gradientChild}
        />
      </Animated.View>
    </View>
  );
};

export const getBones = (
  bonesLayout: ICustomViewStyle[] | undefined,
  childrenItems: any,
  prefix: string | number = '',
  animatedValue: Animated.Value<number>,
  skeletonMeta: ISkeletonMeta
): JSX.Element[] => {
  const { animationType } = skeletonMeta;

  if (bonesLayout && bonesLayout.length > 0) {
    const iterator: number[] = new Array(bonesLayout.length).fill(0);

    return iterator.map((_, i) => {
      // has a nested layout
      if (bonesLayout[i].children && bonesLayout[i].children!.length > 0) {
        const containerPrefix = bonesLayout[i].key || `bone_container_${i}`;
        const { children: childBones, ...layoutStyle } = bonesLayout[i];
        return getBoneContainer(
          layoutStyle,
          getBones(
            childBones,
            [],
            containerPrefix,
            animatedValue,
            skeletonMeta
          ),
          containerPrefix
        );
      }
      if (animationType === 'pulse' || animationType === 'none') {
        return getStaticBone(
          bonesLayout[i],
          prefix ? `${prefix}_${i}` : i,
          animatedValue,
          skeletonMeta
        );
      }
      return getShiverBone(
        bonesLayout[i],
        prefix ? `${prefix}_${i}` : i,
        animatedValue,
        skeletonMeta
      );
    });
    // no layout, matching children's layout
  }

  return React.Children.map(childrenItems, (child, i) => {
    const styling = child.props.style || {};
    if (animationType === 'pulse' || animationType === 'none') {
      return getStaticBone(styling, i, animatedValue, skeletonMeta);
    }
    return getShiverBone(styling, i, animatedValue, skeletonMeta);
  });
};
