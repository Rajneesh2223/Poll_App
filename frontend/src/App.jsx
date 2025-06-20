import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Hero from "./component/Hero";
import Navbar from "./component/Navbar";
import QuestionDashboard from "./component/QuestionDashboard";
import Student from "./component/Student";
import StudentPollInterface from "./component/StudentPollInterface";
import StudentQuestion from "./component/StudentQuestion";
import Teacher from "./component/Teacher";
import TeacherPollHistory from "./component/TeacherPollHistory";
import TeacherPollResults from "./component/TeacherPollResults";

const App = () => {
  return (
    <Router>
      <Navbar />
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
