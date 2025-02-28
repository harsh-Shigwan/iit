import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import Reports from "./pages/students/Reports";
import Add_Students from "./pages/students/Add_Students";
import Add_Recording from "./pages/students/Add_Recording";
import Edit_Student from "./pages/students/Edit_Student";
import About from "./pages/About";
//port Header from "./components/Header";

function App() {
  return (
    <AuthProvider>
      <Router>
    
        <Routes>
        <Route path="/" element={<SignIn/>}/>
         
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
          
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports/>}/>
          <Route path="/reports/:studentId" element={<Reports/>}/>
          <Route path="/edit_students/:studentId" element={<Edit_Student/>}/>
          <Route path="/add_students" element={<Add_Students/>}/>
          <Route path="/add_recordings" element={<Add_Recording/>}/>
        </Route>
        
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
