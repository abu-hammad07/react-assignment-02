
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const projects = [
    {
      title: "Todo App",
      image: "/todo.png",
      github: "https://github.com/yourusername/todo-app",
      live: "https://todo.vercel.app",
      link: "/todo",
    },
    {
      title: "Quiz App",
      image: "/quiz.png",
      github: "https://github.com/yourusername/quiz-app",
      live: "https://quiz.vercel.app",
      link: "/quiz",
    },
    {
      title: "Multi-Step Form",
      image: "/form.png",
      github: "https://github.com/yourusername/form-app",
      live: "https://form.vercel.app",
      link: "/form",
    },
  ];

  return (
    <div className="p-10 flex gap-8 flex-wrap justify-center mt-10">
        <Header />
      {projects.map((p, i) => (
        <ProjectCard key={i} {...p} />
      ))}
    </div>
  );
};

export default Home;
