import { getProjects } from "@/api/projects.api";
import React from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import Link from "next/link";

const ProjectCards = async () => {
  const data = await getProjects();
  const projects = data?.items || [];

  if (projects.length === 0) return <div>No projects found</div>;

  return (
    <div className="project__cards">
      {projects.map((item) => (
        <Link href={`/projects/${item.id}`} key={item.id} scroll={false}>
          <ProjectCard
            id={item.id}
            title={item.title}
            discription={item.description}
            skills={item.skills}
          />
        </Link>
      ))}
    </div>
  );
};

export default ProjectCards;
