import React, { memo, PropsWithChildren } from "react";

import { SlideInOutlet } from "./SlideInOutlet";

export const RootWrapper = memo(
  ({ children, routeId }: PropsWithChildren<{ routeId: string }>) => {
    return (
      <>
        <div>{children}</div>
        <SlideInOutlet routeId={routeId} />
      </>
    );
  },
);

RootWrapper.displayName = "RootWrapper";
