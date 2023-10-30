import React, { useContext } from 'react';
import BoneContainer from './BoneContainer';
import ShiverBone from './ShiverBone';
import StaticBone from './StaticBone';
import { ICustomViewStyle } from '../Constants';
import { SkeletonContentContext } from '../SkeletonContentContext';

type BonesProps = {
  bonesLayout: ICustomViewStyle[] | undefined;
  childrenItems: any;
};

const Bones = ({ bonesLayout, childrenItems }: BonesProps) => {
  const { animationType, prefix } = useContext(SkeletonContentContext);

  if (bonesLayout?.length) {
    return Array(bonesLayout.length)
      .fill(undefined)
      .map((_, i) => {
        // has a nested layout
        if (bonesLayout[i].children?.length) {
          const containerPrefix = bonesLayout[i].key || `bone_container_${i}`;
          const {
            children: childBones,
            container,
            containerProps,
            ...layoutStyle
          } = bonesLayout[i];

          return (
            <BoneContainer
              key={containerPrefix}
              layoutStyle={layoutStyle}
              childrenBones={Bones({
                bonesLayout: childBones?.map((it, index) => ({
                  ...it,
                  key: `nested_${index}`
                })),
                childrenItems: []
              })}
              id={containerPrefix}
              container={container}
              containerProps={containerProps}
            />
          );
        }

        if (animationType === 'pulse' || animationType === 'none') {
          return (
            <StaticBone
              key={prefix ? `${prefix}_${i}` : i}
              layoutStyle={bonesLayout[i]}
              id={prefix ? `${prefix}_${i}` : i}
            />
          );
        }

        return (
          <ShiverBone
            key={prefix ? `${prefix}_${i}` : i}
            layoutStyle={bonesLayout[i]}
            id={prefix ? `${prefix}_${i}` : i}
          />
        );
      });
    // no layout, matching children's layout
  }

  return React.Children.map(childrenItems, (child, i) => {
    const styling = child.props.style || {};

    if (animationType === 'pulse' || animationType === 'none') {
      return <StaticBone layoutStyle={styling} id={i} />;
    }

    return <ShiverBone layoutStyle={styling} id={i} />;
  });
};

export default Bones;
