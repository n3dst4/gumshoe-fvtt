import { LazyMotion } from "framer-motion";
import { PropsWithChildren } from "react";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export const CustomLazyMotion = ({ children }: PropsWithChildren) => {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  );
};
