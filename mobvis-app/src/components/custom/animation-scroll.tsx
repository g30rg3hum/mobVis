import * as motion from "framer-motion/client";
import { ReactNode } from "react";

const isInTestEnvironemnt = process.env.NODE_ENV === "test";

interface Props {
  className?: string;
  children: ReactNode;
}
export default function FadeInScroll({ className, children }: Props) {
  if (isInTestEnvironemnt) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 2.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
