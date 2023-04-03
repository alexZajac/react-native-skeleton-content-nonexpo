## React Native Skeleton Content Nonexpo

> This the not-expo dependant version of [this package](https://github.com/alexZajac/react-native-skeleton-content).

<img width="220px" align="right" src="https://raw.githubusercontent.com/alexZajac/react-native-skeleton-content/master/demos/main.gif" />

React native Skeleton Content, a simple yet fully customizable component made to achieve loading animation in a Skeleton-style. Works in both iOS and Android.

### New Features

- The package has been rewritten to Hooks and is using the declarative [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) package for animations
- It now supports nested layouts for children bones, see an example on [this snack](https://snack.expo.io/@alexandrezajac/skeleton-content-demo)
- It finally supports percentages dimensions for bones, for any type of animation!

[![Build Status](https://travis-ci.org/alexZajac/react-native-skeleton-content-nonexpo.svg?branch=master)](https://travis-ci.org/alexZajac/react-native-skeleton-content-nonexpo) [![Coverage Status](https://coveralls.io/repos/github/alexZajac/react-native-skeleton-content-nonexpo/badge.svg?branch=master)](https://coveralls.io/github/alexZajac/react-native-skeleton-content-nonexpo?branch=master) [![npm version](https://img.shields.io/npm/v/react-native-skeleton-content-nonexpo.svg?style=flat-square)](https://www.npmjs.com/package/react-native-skeleton-content)

- [React Native Skeleton Content](#react-native-skeleton-content)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Props](#props)
  - [Examples](#examples)
  - [Playground](#playground)

### Installation

```shell script
npm install react-native-skeleton-content-nonexpo
```

> This package requires the `react-native-linear-gradient` package, make sure it's installed and working on your project.
 
Also install the following peer dependencies as the package depends on them. We prefer you install these dependencies 
inorder to prevent double instance errors.

```shell script
npm install react-native-reanimated
```

### Usage

1.  Import react-native-skeleton-content:

```javascript
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
```

2.  Once you create the SkeletonContent, you have two options:

- **Child Layout** : The component will figure out the layout of its bones with the dimensions of its direct children.
- **Custom Layout** : You provide a prop `layout` to the component specifying the size of the bones (see the [Examples](#examples) section below). Herunder is the example with a custom layout. A key prop is optional but highly recommended.

```javascript
export default function Placeholder() {
  return (
    <SkeletonContent
      containerStyle={{ flex: 1, width: 300 }}
      isLoading={false}
      layout={[
        { key: 'someId', width: 220, height: 20, marginBottom: 6 },
        { key: 'someOtherId', width: 180, height: 20, marginBottom: 6 }
      ]}
    >
      <Text style={styles.normalText}>Your content</Text>
      <Text style={styles.bigText}>Other content</Text>
    </SkeletonContent>
  );
}
```

3.  Then simply sync the prop `isLoading` to your state to show/hide the SkeletonContent when the assets/data are available to the user.

```javascript
export default function Placeholder () {
  const [loading, setLoading] = useState(true);
  return (
    <SkeletonContent
       	containerStyle={{flex: 1, width: 300}}
        isLoading={isLoading}
        {...otherProps}
    />
  )
}
```

### Props

| Name               | Type             | Default                 | Description                                                                                                                       |
| ------------------ | ---------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| isLoading          | bool             | **required**            | Shows the Skeleton bones when true                                                                                                |
| layout             | array of objects | []                      | A custom layout for the Skeleton bones                                                                                            |
| duration           | number           | 1200 ms                 | Duration of one cycle of animation                                                                                                |
| containerStyle     | object           | flex: 1                 | The style applied to the View containing the bones                                                                                |
| easing             | Easing           | bezier(0.5, 0, 0.25, 1) | Easing of the bones animation                                                                                                     |
| animationType      | string           | "shiver"                | The animation to be used for animating the bones (see demos below)                                                                |
| animationDirection | string           | "horizontalRight"       | Used only for shiver animation, describes the direction and end-point (ex: horizontalRight goes on the x-axis from left to right) |
| boneColor          | string           | "#E1E9EE"               | Color of the bones                                                                                                                |
| highlightColor     | string           | "#F2F8FC"               | Color of the highlight of the bones                                                                                               |

**Note**: The Easing type function is the one provided by [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated), so if you want to change the default you will have to install it as a dependency.

## PureSkeletonContent
If you are really concerned about performance, or you don't want your components mounting being runned while
`isLoading` is **false**, then you may need to consider using `PureSkeletonContent`.

### Point to note 
All props passed to PureSkeletonContent should be a **constant** prop, **memoize** it if it will change sometime.
Otherwise, you should consider using the good old `SkeletonContent`.
> This point does not apply to **componentProps** as it is shallow checked to know if we should re-render the Skeleton or not.


```typescript jsx
import { FunctionComponent } from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { PureSkeletonContent, ICustomViewStyle } from 'react-native-skeleton-content-nonexpo'; 

const Greetings: FunctionComponent<{ name: string }> = ({ name }) => 
  (<Text>Hello {name}</Text>);

const GreetingsSC: ICustomViewStyle[] = [{ height: 40, width: 200, paddingVertical: 2 }];

const SomeComponent: FunctionComponent<{name: string}> = ({ name }) => {
  const [loading, setLoading] = useState(true);

  return (
    <PureSkeletonContent 
      isLoading={isLoading}
      layout={GreetingsSC}
      component={Greetings} 
      componentProps={{ name }} // will be shallow checked, you don't need to memoize this
      containerStyle={styles.container} // notice we using styles from styleSheet
    />
  )
}

const styles = StyleSheet({
  container: {
    flex: 1, width: 300
  }
})
```

### Examples

See the playground section to experiment :
**1** - Changing the direction of the animation (animationDirection prop) :

<p align="center">
<img width="300px" src="https://raw.githubusercontent.com/alexZajac/react-native-skeleton-content/master/demos/direction_change.gif" />
</p>

```javascript
export default function Placeholder () {
  return (
    <SkeletonContent
        containerStyle={{flex: 1, width: 300}}
        animationDirection="horizontalLeft"
        isLoading={true}
        // ...
    />
  )
}
```

**2** - Changing the colors and switching to "pulse" animation (boneColor, highlightColor and animationType prop) :

<p align="center">
<img width="300px" src="https://raw.githubusercontent.com/alexZajac/react-native-skeleton-content/master/demos/color_change.gif" />
</p>

```javascript
export default function Placeholder () {
  return (
    <SkeletonContent
        containerStyle={{flex: 1, width: 300}}
        boneColor="#121212"
        highlightColor="#333333"
        animationType="pulse"
        isLoading={true}
        // ...
    />
  )
}
```

**3** - Customizing the layout of the bones (layout prop) :

<p align="center">
<img width="300px" src="https://raw.githubusercontent.com/alexZajac/react-native-skeleton-content/master/demos/layout_change.gif" />
</p>

```javascript
export default function Placeholder () {
  return (
    <SkeletonContent
        containerStyle={{flex: 1, width: 300}}
        animationDirection="horizontalLeft"
        layout={[
			// long line
			{ width: 220, height: 20, marginBottom: 6 },
			// short line
			{ width: 180, height: 20, marginBottom: 6 },
			// ...
        ]}
        isLoading={true}
       	// ...
    />
  )
}
```

### Playground

You can test out the features and different props easily on [**Snack**](https://snack.expo.io/@alexandrezajac/skeleton-content-demo).
Don't hesitate to take contact if anything is unclear !
