import React from "react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  image: string;
  github: string;
  live: string;
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, image, github, live, link }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-72">
      <img src={image} alt={title} className="rounded-lg mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="flex gap-4 mb-4">
        <a href={github} target="_blank" className="text-blue-500 underline">GitHub</a>
        <a href={live} target="_blank" className="text-green-500 underline">Live</a>
      </div>
      <Link to={link} className="block bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700">
        View Project
      </Link>
    </div>
  );
};

export default ProjectCard;
