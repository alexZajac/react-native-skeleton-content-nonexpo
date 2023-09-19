import React from 'react';
import { View } from 'react-native';
import { ICustomViewStyle } from './Constants';

type BoneContainerProps = {
  layoutStyle: ICustomViewStyle;
  childrenBones: JSX.Element[];
  id: number | string;
  container?: React.ComponentType;
  containerProps?: any;
};

const BoneContainer = ({
  layoutStyle,
  childrenBones,
  id,
  container,
  containerProps
}: BoneContainerProps) => {
  const Wrapper = container || View;

  return (
    <Wrapper
      key={layoutStyle.key || id}
      style={layoutStyle}
      {...containerProps}
    >
      {childrenBones}
    </Wrapper>
  );
};

export default BoneContainer;
