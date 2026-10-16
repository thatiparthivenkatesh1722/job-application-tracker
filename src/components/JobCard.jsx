
import React from "react";

const JobCard = (props) => {
  const isAdmin = props.currentUser?.role === "admin";

 const alreadyApplied = props.applications.some(
  (job) =>
    job.id === props.id &&
    job.userEmail === props.currentUser.email
);

  return (
    <div className="job-card">
      <h2>{props.title}</h2>

      <p>Company: {props.company}</p>
      <p>Location: {props.location}</p>
      <p>Job Type: {props.type || "Not specified"}</p>
      <p>Salary: {props.salary || "Not specified"}</p>

      <button onClick={() => props.onViewJob(props.id)}>
        View Details
      </button>

      {isAdmin ? (
        <>
          <button onClick={() => props.onEditJob(props.id)}>
            Edit
          </button>

          <button onClick={() => props.onRemoveJob(props.id)}>
            Remove
          </button>
        </>
      ) : alreadyApplied ? (
        <button disabled>Already Applied</button>
      ) : (
        <button onClick={() => props.onApplyJob(props.id)}>
          Apply
        </button>
      )}
    </div>
  );
};

export default JobCard;

