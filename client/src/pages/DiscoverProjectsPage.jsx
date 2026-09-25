import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFilter } from '../components/projects/ProjectFilter';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Compass, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const DiscoverProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState('All');
  const [status, setStatus] = useState('All');
  const [lookingForTeammates, setLookingForTeammates] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (status !== 'All') params.status = status;
      if (lookingForTeammates) params.lookingForTeammates = 'true';

      const res = await projectService.getProjects(params);
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, category, difficulty, status, lookingForTeammates]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setDifficulty('All');
    setStatus('All');
    setLookingForTeammates(false);
    setSearchParams({});
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-brand-400" /> Discover Project Ideas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse real student projects, find teams looking for your skills, or publish your own project.
          </p>
        </div>

        <Link to="/projects/create">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Create Project
          </Button>
        </Link>
      </div>

      {/* Filter Component */}
      <ProjectFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        status={status}
        setStatus={setStatus}
        lookingForTeammates={lookingForTeammates}
        setLookingForTeammates={setLookingForTeammates}
        onReset={handleResetFilters}
      />

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No project ideas found"
          description="Try broadening your search term or resetting category filters."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
