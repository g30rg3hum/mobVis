import * as motion from "framer-motion/client";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function FadeInScroll({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 2.5 }}
    >
      {children}
    </motion.div>
  );
}
