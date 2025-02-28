// Module declarations for libraries without TypeScript definitions

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export const useAnimation: any;
  export const useMotionValue: any;
  export const useTransform: any;
}

declare module '@hookform/resolvers/zod' {
  export const zodResolver: any;
}

// Add any other missing module declarations here 