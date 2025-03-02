import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <motion.div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-blue-500 rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
        <p className="mt-4 text-gray-600 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
