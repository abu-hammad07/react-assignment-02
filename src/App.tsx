import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Quiz from "./pages/Quiz";
import MultiStepForm from "./pages/MultiStepForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/form" element={<MultiStepForm />} />
      </Routes>
    </Router>
  );
}

export default App;
