import { FunctionComponent } from 'react';
import SkeletonContent from './SkeletonContent';
import PureSkeletonContent from './PureSkeletonContent';
import { ISkeletonContentProps } from './types';

export * from './types';
export { PureSkeletonContent };
export default SkeletonContent as FunctionComponent<ISkeletonContentProps>;
