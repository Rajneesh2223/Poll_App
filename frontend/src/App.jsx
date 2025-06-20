import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./component/Hero";
import Student from "./component/Student";
import QuestionDashboard from "./component/QuestionDashboard";
import TeacherPollResults from "./component/TeacherPollResults";
import StudentPollInterface from "./component/StudentPollInterface";
import StudentQuestion from "./component/StudentQuestion";
import Teacher from "./component/Teacher";
import Navbar from "./component/Navbar";
import TeacherPollHistory from "./component/TeacherPollHistory";

const App = () => {
  return (
    <Router>
      <Navbar /> {/* 👈 This will be shown on all routes */}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/student" element={<Student />} />
        <Route path="/poll" element={<StudentQuestion />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher-dashboard" element={<QuestionDashboard />} />
        <Route path="/results" element={<TeacherPollResults />} />
        <Route path="/question" element={<StudentPollInterface />} />

        <Route path="/poll-history" element={<TeacherPollHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
