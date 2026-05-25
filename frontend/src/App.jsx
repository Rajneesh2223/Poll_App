import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./component/LandingPage";
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
      <Routes>
        {/* Landing page has its own full-screen layout — no shared Navbar */}
        <Route path="/" element={<LandingPage />} />

        {/* Inner app pages use the shared Navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/student" element={<Student />} />
                <Route path="/poll" element={<StudentQuestion />} />
                <Route path="/teacher" element={<Teacher />} />
                <Route path="/teacher-dashboard" element={<QuestionDashboard />} />
                <Route path="/results" element={<TeacherPollResults />} />
                <Route path="/question" element={<StudentPollInterface />} />
                <Route path="/poll-history" element={<TeacherPollHistory />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
