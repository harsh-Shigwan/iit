import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import img from "../assets/404.png"
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6 text-center">
     
      <motion.img
        src={img}
        alt="404"
        className="w-96 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />

    
      <motion.h1
        className="text-6xl font-bold text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Oops! Page Not Found
      </motion.h1>

      <motion.p
        className="text-gray-600 text-lg mt-3"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        The page you are looking for does not exist.
      </motion.p>

     
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link to="/home">
          <button className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition">
            Go Home
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
