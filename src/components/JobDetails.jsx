import React from "react";

const JobDetails = ({ job, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Job Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <h3>{job.title}</h3>
          <p>
            <strong>Company:</strong> {job.company}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Job Type:</strong> {job.type || "Not specified"}
          </p>
          <p>
            <strong>Salary:</strong> {job.salary || "Not specified"}
          </p>
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default JobDetails;
