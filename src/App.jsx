import React, { useEffect, useState, useRef } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import Login from "./components/Login";

const App = () => {
  const applicationsRef = useRef(null);

  
  // LOGIN / LOGOUT
  

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function handleLogin(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  }

  
  // JOBS
 

  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem("jobs");

    if (savedJobs) {
      return JSON.parse(savedJobs);
    }

    return [
      {
        id: 1,
        title: "Python Developer",
        company: "ABC Technologies",
        location: "Hyderabad",
      },
      {
        id: 2,
        title: "React Developer",
        company: "XYZ Solutions",
        location: "Bangalore",
      },
      {
        id: 3,
        title: "Django Developer",
        company: "Tech Solutions",
        location: "Chennai",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");


  // APPLICATION FILTERS
  // =========================

  const [applicationStatusFilter, setApplicationStatusFilter] = useState("All");

  const [applicationSearch, setApplicationSearch] = useState("");

  // =========================
  // APPLICATIONS
  // =========================

  const [applications, setApplications] = useState(() => {
    
    const savedApplications = localStorage.getItem("applications");

    if (savedApplications) {
      return JSON.parse(savedApplications);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  // =========================
  // ADD JOB
  // =========================

  function addJob(newJob) {
    const jobWithId = {
      id: Date.now(),
      ...newJob,
    };

    setJobs((previousJobs) => [...previousJobs, jobWithId]);
  }

  // =========================
  // REMOVE JOB
  // =========================

  function removeJob(id) {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this job?",
    );

    if (!confirmRemove) {
      return;
    }

    setJobs((previousJobs) => previousJobs.filter((job) => job.id !== id));

    // Remove applications related to this job
    setApplications((previousApplications) =>
      previousApplications.filter((application) => application.id !== id),
    );
  }

  // =========================
  // EDIT JOB
  // =========================

  function startEditJob(id) {
    const jobToEdit = jobs.find((job) => job.id === id);

    setEditingJob(jobToEdit);
  }

  function editJob(updatedJob) {
    setJobs((previousJobs) =>
      previousJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
    );

    setEditingJob(null);
  }

  function cancelEdit() {
    setEditingJob(null);
  }

  // =========================
  // VIEW JOB DETAILS
  // =========================

  function viewJob(id) {
    const job = jobs.find((job) => job.id === id);

    setSelectedJob(job);
  }

  function closeDetails() {
    setSelectedJob(null);
  }

  // =========================
  // APPLY JOB
  // =========================

  function applyJob(id) {
    if (!currentUser) {
      return;
    }

    const alreadyApplied = applications.some(
      (application) =>
        application.id === id && application.userEmail === currentUser.email,
    );

    if (alreadyApplied) {
      return;
    }

    const job = jobs.find((job) => job.id === id);

    if (!job) {
      return;
    }

    const newApplication = {
      ...job,
      applicationId: Date.now(),
      userEmail: currentUser.email,
      status: "Applied",
      appliedDate: new Date().toLocaleDateString(),
    };

    setApplications((previousApplications) => [
      ...previousApplications,
      newApplication,
    ]);

    setTimeout(() => {
      applicationsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  // =========================
  // UPDATE APPLICATION STATUS
  // ADMIN ONLY
  // =========================

  function updateStatus(applicationId, newStatus) {
    setApplications((previousApplications) =>
      previousApplications.map((application) =>
        application.applicationId === applicationId
          ? {
              ...application,
              status: newStatus,
            }
          : application,
      ),
    );
  }

  // =========================
  // WITHDRAW APPLICATION
  // USER ONLY
  // =========================

  function removeApplication(applicationId) {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirmWithdraw) {
      return;
    }

    setApplications((previousApplications) =>
      previousApplications.filter(
        (application) => application.applicationId !== applicationId,
      ),
    );
  }

  // =========================
  // ROLE BASED APPLICATIONS
  // =========================

  const roleApplications = applications.filter((application) => {
    if (currentUser?.role === "admin") {
      return true;
    }

    return application.userEmail === currentUser?.email;
  });

  // =========================
  // SEARCH + STATUS FILTER
  // =========================

  const filteredApplications = roleApplications.filter((application) => {
    const search = applicationSearch.trim().toLowerCase();

    const title = String(application.title || "").toLowerCase();
    const company = String(application.company || "").toLowerCase();

    const location = String(application.location || "").toLowerCase();

    const matchesSearch =
      title.includes(search) ||
      company.includes(search) ||
      location.includes(search);

    const matchesStatus =
      applicationStatusFilter === "All" ||
      application.status === applicationStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATUS COUNTS
  // =========================

  const appliedCount = roleApplications.filter(
    (application) => application.status === "Applied",
  ).length;

  const underReviewCount = roleApplications.filter(
    (application) => application.status === "Under Review",
  ).length;

  const interviewCount = roleApplications.filter(
    (application) => application.status === "Interview",
  ).length;

  const selectedCount = roleApplications.filter(
    (application) => application.status === "Selected",
  ).length;

  const rejectedCount = roleApplications.filter(
    (application) => application.status === "Rejected",
  ).length;

  // =========================
  // LOGIN PAGE
  // =========================

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="app">
      <Navbar />

      {/* USER BAR */}

      <div className="user-bar">
        <span>
          Logged in as: <strong>{currentUser.email}</strong> ({currentUser.role}
          )
        </span>

        <button onClick={handleLogout}>Logout</button>
      </div>

      <main className="container">
        <h1>Job Application Tracker</h1>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="stats">
          <div className="stat-card">
            <h3>Available Jobs</h3>
            <p>{jobs.length}</p>
          </div>

          <div className="stat-card">
            <h3>Applied Jobs</h3>
            <p>{roleApplications.length}</p>
          </div>
        </div>

        {/* =========================
            APPLICATION STATUS
        ========================= */}

        <div className="status-summary">
          <h2>Application Status</h2>

          <div className="status-items">
            <div>
              <span>Applied</span>
              <strong>{appliedCount}</strong>
            </div>

            <div>
              <span>Under Review</span>
              <strong>{underReviewCount}</strong>
            </div>

            <div>
              <span>Interview</span>
              <strong>{interviewCount}</strong>
            </div>

            <div>
              <span>Selected</span>
              <strong>{selectedCount}</strong>
            </div>

            <div>
              <span>Rejected</span>
              <strong>{rejectedCount}</strong>
            </div>
          </div>
        </div>

        {/* =========================
            ADMIN - ADD / EDIT JOB
        ========================= */}

        {currentUser.role === "admin" && (
          <section className="form-section">
            <JobForm
              onAddJob={addJob}
              editingJob={editingJob}
              onEditJob={editJob}
              onCancelEdit={cancelEdit}
            />
          </section>
        )}

        {/* =========================
            AVAILABLE JOBS
        ========================= */}

        <section className="jobs-section">
          <JobList
            jobs={jobs}
            currentUser={currentUser}
            onRemoveJob={removeJob}
            onEditJob={startEditJob}
            onViewJob={viewJob}
            onApplyJob={applyJob}
            applications={applications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </section>

        {/* =========================
            APPLIED JOBS
        ========================= */}

        <section className="applications-section" ref={applicationsRef}>
          <h2>Applied Jobs</h2>

          <input
            type="text"
            placeholder="Search applied jobs..."
            value={applicationSearch}
            onChange={(e) => setApplicationSearch(e.target.value)}
          />

          <select
            className="status-filter"
            value={applicationStatusFilter}
            onChange={(e) => setApplicationStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* No applications at all */}

          {roleApplications.length === 0 ? (
            <div className="empty-state">
              <h3>📋 No applications yet</h3>

              <p>Apply to a job to start tracking your applications.</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            /* Applications exist but search/filter found nothing */

            <div className="empty-state">
              <h3>📋 No applications found</h3>

              <p>No applications match your current search or status filter.</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                className="application-card"
                key={
                  application.applicationId ||
                  `${application.id}-${application.userEmail}`
                }
              >
                <h3>{application.title}</h3>

                <p>Company: {application.company}</p>

                <p>Location: {application.location}</p>

                <p>Job Type: {application.type || "Not specified"}</p>

                <p>Salary: {application.salary || "Not specified"}</p>

                <p>Applied On: {application.appliedDate}</p>

                <div className="status-control">
                  <label>Status:</label>

                  <span
                    className={`status-badge ${String(application.status)
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {application.status}
                  </span>

                  {/* =========================
                      ADMIN - CHANGE STATUS
                  ========================= */}

                  {currentUser.role === "admin" && (
                    <select
                      value={application.status}
                      onChange={(e) =>
                        updateStatus(application.applicationId, e.target.value)
                      }
                    >
                      <option value="Applied">Applied</option>

                      <option value="Under Review">Under Review</option>

                      <option value="Interview">Interview</option>

                      <option value="Selected">Selected</option>

                      <option value="Rejected">Rejected</option>
                    </select>
                  )}

                  {/* =========================
                      USER - WITHDRAW
                  ========================= */}

                  {currentUser.role === "user" && (
                    <button
                      className="withdraw-btn"
                      onClick={() =>
                        removeApplication(application.applicationId)
                      }
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* =========================
          JOB DETAILS
      ========================= */}

      {selectedJob && <JobDetails job={selectedJob} onClose={closeDetails} />}
    </div>
  );
};

export default App;
