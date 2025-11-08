import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Project } from "../../types";
import { useApp } from "../../context/AppContext";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { deleteProject } = useApp();

  const handleEdit = () => {
    onEdit(project);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(project.id);
    }
    setMenuOpen(false);
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition relative">
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {project.tags?.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Project Title + Menu */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="font-semibold text-gray-900 text-lg">{project.name}</h2>
        <div className="relative">
          <FiMoreVertical
            className="w-5 h-5 text-gray-500 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg border rounded-md text-sm">
              <div 
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleEdit}
              >
                Edit
              </div>
              <div 
                className="p-2 hover:bg-red-50 text-red-500 cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Images preview */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {project.images?.slice(0, 4).map((img: string, i: number) => (
          <img
            key={i}
            src={img}
            alt="Task Preview"
            className="w-full h-16 rounded-md object-cover"
          />
        ))}
      </div>

      {/* Bottom info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <img
            src={project.managerImage}
            className="w-6 h-6 rounded-full"
            alt="Manager"
          />
        </div>

        {project.deadline && (
          <p>{project.deadline}</p>
        )}

        <p className="flex items-center gap-1">
          {project.tasksCount} tasks
        </p>
      </div>
    </div>
  );
};
