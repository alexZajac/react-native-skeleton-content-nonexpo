import * as React from 'react';

import SkeletonContent from './SkeletonContent';
import { IPureSkeletonContentProps } from './types';

export const didChange = <T extends object>(
  prev: any,
  next: any,
  removeKeys?: (keyof IPureSkeletonContentProps<T>)[]
) => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) {
    return true;
  }

  const keys = new Set([...prevKeys, ...nextKeys]);

  if (Array.isArray(removeKeys) && removeKeys.length > 0) {
    removeKeys.forEach(key => keys.delete(key));
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    if (!Object.is(prev[key], next[key])) {
      return true;
    }
  }

  return false;
};

const PureSkeletonContent = <T,>(props: IPureSkeletonContentProps<T>) => (
  <SkeletonContent {...props} />
);

export default React.memo(PureSkeletonContent, (prev, next) => {
  if (didChange(prev, next, ['layout', 'componentProps'])) {
    return false;
  }

  // is not same length
  if (prev.layout?.length !== next.layout?.length) {
    return false;
  }

  // if shallow equal
  if (
    Object.is(prev.componentProps, next.componentProps) &&
    Object.is(prev.layout, next.layout)
  ) {
    return true;
  }

  // since already tested above for being undefined
  // check if items in layout are equal
  if (prev.layout && next.layout) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of prev.layout) {
      if (!next.layout.find(it => Object.is(it, item))) {
        return false;
      }
    }
  }

  if (
    typeof prev.componentProps === 'object' &&
    typeof next.componentProps === 'object'
  ) {
    return !didChange(prev.componentProps, next.componentProps);
  }

  return false;
}) as typeof PureSkeletonContent;
