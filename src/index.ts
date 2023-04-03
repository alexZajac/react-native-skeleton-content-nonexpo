import { FunctionComponent } from 'react';

import PureSkeletonContent from './PureSkeletonContent';
import SkeletonContent from './SkeletonContent';
import { ISkeletonContentProps } from './types';

export * from './types';
export { PureSkeletonContent };
export default SkeletonContent as FunctionComponent<ISkeletonContentProps>;
