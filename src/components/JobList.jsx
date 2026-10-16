import React, { useState } from "react";
import JobCard from "./JobCard";

const JobList = ({
  jobs,
  currentUser,
  onRemoveJob,
  onEditJob,
  onViewJob,
  onApplyJob,
  applications,
  searchTerm,
  setSearchTerm,
}) => {
  const [jobTypeFilter, setJobTypeFilter] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.trim().toLowerCase();

    const title = String(job.title || "").toLowerCase();
    const company = String(job.company || "").toLowerCase();
    const location = String(job.location || "").toLowerCase();

    const matchesSearch =
      title.includes(search) ||
      company.includes(search) ||
      location.includes(search);

    const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div>
      <h2>Available Jobs</h2>
      <input
        type="text"
        placeholder="Search your Job.."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="job-type-filter"
        value={jobTypeFilter}
        onChange={(e) => setJobTypeFilter(e.target.value)}
      >
        <option value="All">All Job Types</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="Internship">Internship</option>
        <option value="Contract">Contract</option>
      </select>

      {(searchTerm || jobTypeFilter !== "All") && (
        <button
          className="clear-filters-btn"
          onClick={() => {
            setSearchTerm("");
            setJobTypeFilter("All");
          }}
        >
          Clear Filters
        </button>
      )}

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h3>🔍 No jobs found</h3>
          <p>Try searching with a different job title.</p>
          <button onClick={() => setSearchTerm("")}>Clear Search</button>
        </div>
      ) : (
        filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            type={job.type}
            salary={job.salary}
            currentUser={currentUser}
            onRemoveJob={onRemoveJob}
            id={job.id}
            onEditJob={onEditJob}
            onViewJob={onViewJob}
            onApplyJob={onApplyJob}
            applications={applications}
          />
        ))
      )}
    </div>
  );
};

export default JobList;
