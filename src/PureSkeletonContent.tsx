import * as React from 'react';
import { IPureSkeletonContentProps } from './types';
import SkeletonContent from './SkeletonContent';

const didChange = <T extends object>(
  prev: any,
  next: any,
  removeKey?: keyof IPureSkeletonContentProps<T>
) => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) {
    return true;
  }

  const keys = new Set([...prevKeys, ...nextKeys]);

  if (removeKey) {
    keys.delete(removeKey);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    if (!Object.is(prev[key], next[key])) {
      return true;
    }
  }

  return false;
};

const PureSkeletonContent = <T,>(props: IPureSkeletonContentProps<T>) => {
  return <SkeletonContent {...props} />;
};

export default React.memo(PureSkeletonContent, (prev, next) => {
  if (didChange(prev, next, 'componentProps')) {
    return false;
  }

  if (Object.is(prev.componentProps, next.componentProps)) {
    return true;
  }

  if (
    typeof prev.componentProps === 'object' &&
    typeof next.componentProps === 'object'
  ) {
    return !didChange(prev.componentProps, next.componentProps);
  }

  return false;
}) as typeof PureSkeletonContent;
