import React, { ProviderProps } from 'react';
import {
  SkeletonContextProps,
  SkeletonContentContext
} from './SkeletonContentContext';

const SkeletonContentContextProvider = ({
  value,
  children
}: ProviderProps<SkeletonContextProps>) => (
  <SkeletonContentContext.Provider value={value}>
    {children}
  </SkeletonContentContext.Provider>
);

export default SkeletonContentContextProvider;
