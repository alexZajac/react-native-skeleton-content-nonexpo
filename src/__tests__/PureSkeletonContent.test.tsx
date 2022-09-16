import { Text, TextStyle } from 'react-native';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import Animated from 'react-native-reanimated';

import LinearGradient from 'react-native-linear-gradient';
import { create } from 'react-test-renderer';
import PureSkeletonContent from '../PureSkeletonContent';
import { DEFAULT_BONE_COLOR, DEFAULT_BORDER_RADIUS } from '../Constants';
import { ISkeletonContentProps } from '../types';

const staticStyles = {
  borderRadius: DEFAULT_BORDER_RADIUS,
  overflow: 'hidden',
  backgroundColor: DEFAULT_BONE_COLOR
};

const Greetings: FunctionComponent<{ name: string; style?: TextStyle }> = ({
  name,
  style
}) => {
  return <Text style={style}>Hello {name}</Text>;
};

const RenderCounter: FunctionComponent<{ count?: number }> = ({ count }) => {
  const localCount = useRef(0);

  useEffect(() => {
    localCount.current += 1;
  });

  return (
    <Text>
      Local: {localCount.current} Props: {count}
    </Text>
  );
};

const RenderFromTop: FunctionComponent<{
  isLoading?: boolean;
  count?: number;
  otherField?: number;
}> = ({ isLoading, count }) => {
  return (
    <PureSkeletonContent
      isLoading={!!isLoading}
      component={RenderCounter}
      componentProps={{ count }}
    />
  );
};

describe('PureSkeletonContent test suite', () => {
  it('should render empty alone', () => {
    const tree = create(
      <PureSkeletonContent
        isLoading={false}
        component={Greetings}
        componentProps={{ name: 'World' }}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should pass down props to component', () => {
    const instance = create(
      <PureSkeletonContent
        isLoading={false}
        component={Greetings}
        componentProps={{ name: 'mernxl' }}
      />
    );

    expect(instance.root.findAllByType(Greetings)[0].props.name).toEqual(
      'mernxl'
    );
  });

  it('should not render component when isLoading is true', () => {
    const instance = create(
      <PureSkeletonContent
        isLoading
        component={Greetings}
        componentProps={{ name: 'mernxl' }}
      />
    );

    expect(instance.root.findAllByType(Greetings).length).toBe(0);
  });

  it('should not re-render PureSkeleton on top component and same props re-render', () => {
    // first render local = 0
    const instance = create(<RenderFromTop count={0} />);
    expect(instance.toJSON()).toMatchSnapshot();

    // update props, local should be 1
    instance.update(<RenderFromTop count={1} />);
    expect(instance.toJSON()).toMatchSnapshot();

    // cause FromTop to re-render, local stays 1
    instance.update(<RenderFromTop otherField={2} count={1} />);
    expect(instance.toJSON()).toMatchSnapshot();

    // update props local goes to 2, since count now undefined
    instance.update(<RenderFromTop />);

    expect(instance.toJSON()).toMatchSnapshot();
  });

  it('should have the correct layout when loading', () => {
    const layout = [
      {
        width: 240,
        height: 100,
        marginBottom: 10
      },
      {
        width: 180,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'grey'
      }
    ];
    const props: ISkeletonContentProps = {
      layout,
      isLoading: true,
      animationType: 'none'
    };
    const instance = create(
      <PureSkeletonContent
        {...props}
        component={Greetings}
        componentProps={{ name: 'mernxl' }}
      />
    );

    const component = instance.root;
    const bones = component.findAllByType(Animated.View);

    // two bones and parent component
    expect(bones.length - 1).toEqual(layout.length);
    expect(bones[0].props.style).toEqual({ flex: 1 });
    // default props that are not set
    expect(bones[1].props.style).toEqual([{ ...layout[0], ...staticStyles }]);
    expect(bones[2].props.style).toEqual([
      { overflow: 'hidden', ...layout[1] }
    ]);
    expect(instance.toJSON()).toMatchSnapshot();
  });

  it('should have correct props and layout between loading states', () => {
    const w1 = { width: 240, height: 100, marginBottom: 10 };
    const w2 = { width: 180, height: 40 };
    const layout = [w1, w2];
    const props: ISkeletonContentProps = {
      layout,
      isLoading: true,
      animationType: 'shiver'
    };
    const childStyle = { fontSize: 24 };
    const instance = create(
      <PureSkeletonContent
        {...props}
        component={Greetings}
        componentProps={{ name: 'one', style: childStyle }}
      />
    );
    const component = instance.root;
    let bones = component.findAllByType(LinearGradient);
    // one animated view child for each bone + parent
    expect(bones.length).toEqual(layout.length);
    bones = component.findAllByType(Animated.View);
    expect(bones[1].props.style).toEqual({
      ...staticStyles,
      ...w1
    });
    expect(bones[3].props.style).toEqual({
      ...staticStyles,
      ...w2
    });
    let children = component.findAllByType(Text);
    // no child since it's loading
    expect(children.length).toEqual(0);

    // update props
    instance.update(
      <PureSkeletonContent
        {...props}
        isLoading={false}
        component={Greetings}
        componentProps={{ name: 'one', style: childStyle }}
      />
    );

    bones = instance.root.findAllByType(LinearGradient);
    expect(bones.length).toEqual(0);

    children = instance.root.findAllByType(Text);
    expect(children.length).toEqual(1);
    expect(children[0].props.style).toEqual(childStyle);

    // re-update to loading state
    instance.update(
      <PureSkeletonContent
        {...props}
        component={Greetings}
        componentProps={{ name: 'one', style: childStyle }}
      />
    );

    bones = instance.root.findAllByType(LinearGradient);
    expect(bones.length).toEqual(layout.length);
    bones = component.findAllByType(Animated.View);
    expect(bones[1].props.style).toEqual({
      ...staticStyles,
      ...w1
    });
    expect(bones[3].props.style).toEqual({
      ...staticStyles,
      ...w2
    });
    children = instance.root.findAllByType(Text);
    // no child since it's loading
    expect(children.length).toEqual(0);

    // snapshot
    expect(instance.toJSON()).toMatchSnapshot();
  });
});
