import React, { useState, useEffect, useRef } from "react";

const JobForm = ({ onAddJob, editingJob, onEditJob, onCancelEdit }) => {
  const formRef = useRef(null);
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
  });
  useEffect(() => {
    if (editingJob) {
      setJob({
        title: editingJob.title,
        company: editingJob.company,
        location: editingJob.location,
        type: editingJob.type || "",
        salary: editingJob.salary || "",
      });

      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setJob({
        title: "",
        company: "",
        location: "",
        type: "",
        salary: "",
      });
    }
  }, [editingJob]);

  function handleChange(e) {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      job.title.trim() === "" ||
      job.company.trim() === "" ||
      job.location.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingJob) {
      onEditJob({
        id: editingJob.id,
        ...job,
      });
    } else {
      onAddJob(job);
    }

    setJob({
      title: "",
      company: "",
      location: "",
      type: "",
      salary: "",
    });
  }

  return (
    <div ref={formRef}>
      <h2>{editingJob ? "Edit Job" : "Add New Job"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={job.company}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
        />

        <select name="type" value={job.type} onChange={handleChange}>
          <option value="">Select Job Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <input
          type="text"
          name="salary"
          placeholder="Salary (e.g. ₹5 LPA)"
          value={job.salary}
          onChange={handleChange}
        />

        <button type="submit">{editingJob ? "Update Job" : "Add Job"}</button>

        {editingJob && (
          <button
            type="button"
            onClick={() => {
              setJob({
                title: "",
                company: "",
                location: "",
              });

              onCancelEdit();
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default JobForm;
