import { useState, useEffect } from "react";
import { universityAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PortfolioTable from "../../components/PortfolioTable/PortfolioTable";
import UnlockContactsModal from "../../components/UnlockContactsModal/UnlockContactsModal";
import NotificationToast from "../../components/NotificationToast";
import Pagination from "../../components/Pagination";
import { useTheme } from "../../context/ThemeContext";
import { formatDate } from "../../utils/helpers";
import QuestionFormStep from "../../components/QuestionFormStep/QuestionFormStep";
import "../AdminPanel/AdminPanel.css"; // Import for form styles (step-indicator, type-selection, etc.)
import "./UniversityDashboard.css";

const UniversityDashboard = () => {
  const { user } = useAuth();
  const { itemsPerPage } = useTheme();
  const [activeTab, setActiveTab] = useState("portfolios"); // "portfolios" or "olympiads"

  // Portfolio state
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    verificationStatus: "all",
    ilsLevel: "",
    olympiadLevel: "",
  });
  const [sortBy, setSortBy] = useState("rating"); // rating, name, status
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [contactsUnlocked, setContactsUnlocked] = useState({});
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Olympiad state
  const [olympiads, setOlympiads] = useState([]);
  const [olympiadsLoading, setOlympiadsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdOlympiadId, setCreatedOlympiadId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "Mathematics",
    type: "",
    startTime: "",
    endTime: "",
    duration: 60,
    status: "draft",
    olympiadLogo: null,
    universityName: "", // University name field
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (activeTab === "portfolios") {
      fetchPortfolios();
    } else if (activeTab === "olympiads") {
      fetchOlympiads();
    }
  }, [filters, activeTab]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await universityAPI.getAllStudentPortfolios(filters);
      let portfoliosData = response.data || [];

      // Sort portfolios
      portfoliosData = sortPortfolios(portfoliosData, sortBy, sortOrder);

      setPortfolios(portfoliosData);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setNotification({
        message: "Failed to load portfolios",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const sortPortfolios = (data, sortBy, order) => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "rating":
          aVal = a.portfolioRating || 0;
          bVal = b.portfolioRating || 0;
          break;
        case "name":
          aVal = (a.studentName || "").toLowerCase();
          bVal = (b.studentName || "").toLowerCase();
          break;
        case "status":
          aVal = a.verificationStatus || "unverified";
          bVal = b.verificationStatus || "unverified";
          break;
        default:
          return 0;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      } else {
        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
      }
    });
    return sorted;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  useEffect(() => {
    if (portfolios.length > 0) {
      const sorted = sortPortfolios(portfolios, sortBy, sortOrder);
      setPortfolios(sorted);
    }
  }, [sortBy, sortOrder]);

  const handleViewPortfolio = (portfolio) => {
    window.open(`/portfolio/${portfolio.slug}`, "_blank");
  };

  const handleUnlockContacts = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowUnlockModal(true);
  };

  const handleUnlockConfirm = async () => {
    if (!selectedPortfolio) return;

    try {
      await universityAPI.unlockContacts(selectedPortfolio._id);
      setContactsUnlocked((prev) => ({
        ...prev,
        [selectedPortfolio._id]: true,
      }));

      // Fetch contact info
      const response = await universityAPI.getStudentContacts(
        selectedPortfolio._id
      );
      if (response.data) {
        setPortfolios((prev) =>
          prev.map((p) =>
            p._id === selectedPortfolio._id ? { ...p, ...response.data } : p
          )
        );
      }

      setNotification({
        message: "Contacts unlocked successfully",
        type: "success",
      });
      setShowUnlockModal(false);
      setSelectedPortfolio(null);
    } catch (error) {
      console.error("Error unlocking contacts:", error);
      setNotification({
        message: error.response?.data?.message || "Failed to unlock contacts",
        type: "error",
      });
    }
  };

  const getPaginatedPortfolios = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return portfolios.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(portfolios.length / itemsPerPage);
  };

  // Olympiad management functions
  const fetchOlympiads = async () => {
    try {
      setOlympiadsLoading(true);
      const response = await universityAPI.getAllOlympiads();
      setOlympiads(response.data || []);
    } catch (error) {
      console.error("Error fetching olympiads:", error);
      setNotification({
        message: "Failed to load olympiads",
        type: "error",
      });
    } finally {
      setOlympiadsLoading(false);
    }
  };

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, type });
    setCurrentStep(2);
  };

  const handleCreateOlympiad = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      setNotification({
        message: "Please provide a title for the olympiad",
        type: "error",
      });
      return;
    }

    if (!formData.type) {
      setNotification({
        message: "Please select an olympiad type",
        type: "error",
      });
      return;
    }

    setOlympiadsLoading(true);
    try {
      const formatDateTime = (dateTimeLocal) => {
        if (!dateTimeLocal) return "";
        return new Date(dateTimeLocal).toISOString();
      };

      const olympiadData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        subject: formData.subject,
        startTime: formatDateTime(formData.startTime),
        endTime: formatDateTime(formData.endTime),
        duration: formData.duration * 60,
        status: formData.status,
        universityName: formData.universityName, // Include university name
      };

      const response = await universityAPI.createOlympiad(olympiadData);
      const olympiadId = response.data?._id || response.data?.id;

      if (olympiadId) {
        setCreatedOlympiadId(olympiadId);

        // Upload logo if provided
        if (formData.olympiadLogo) {
          try {
            await universityAPI.uploadOlympiadLogo(
              formData.olympiadLogo,
              olympiadId
            );
          } catch (logoError) {
            console.error("Logo upload failed:", logoError);
          }
        }

        setCurrentStep(3);
        setNotification({
          message: "Olympiad created! Now add questions.",
          type: "success",
        });
      } else {
        setNotification({
          message:
            "Olympiad created but ID not received. Please refresh and try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating olympiad:", error);
      setNotification({
        message: error.response?.data?.message || "Failed to create olympiad",
        type: "error",
      });
    } finally {
      setOlympiadsLoading(false);
    }
  };

  const handleAddQuestion = async (questionData) => {
    if (!createdOlympiadId) {
      setNotification({
        message: "Olympiad ID not found. Please refresh and try again.",
        type: "error",
      });
      return;
    }

    try {
      const questionWithOlympiad = {
        ...questionData,
        olympiadId: createdOlympiadId,
      };
      await universityAPI.addQuestion(questionWithOlympiad);
      setQuestions([...questions, questionData]);
    } catch (error) {
      console.error("Error adding question:", error);
      setNotification({
        message: "Failed to add question",
        type: "error",
      });
    }
  };

  const handleFinish = () => {
    setNotification({
      message: "Olympiad created successfully with questions!",
      type: "success",
    });
    setShowCreateForm(false);
    setCurrentStep(1);
    setCreatedOlympiadId(null);
    setQuestions([]);
    setFormData({
      title: "",
      description: "",
      subject: "Mathematics",
      type: "",
      startTime: "",
      endTime: "",
      duration: 60,
      status: "draft",
      olympiadLogo: null,
      universityName: "",
    });
    fetchOlympiads();
  };

  if (loading && activeTab === "portfolios") {
    return (
      <div className="university-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="university-dashboard-page">
      <div className="container">
        <div className="university-header">
          <h1 className="university-title text-glow">University Dashboard</h1>
          <p className="university-subtitle">
            {activeTab === "portfolios"
              ? "View and manage student portfolios"
              : "Create and manage olympiads"}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-filters" style={{ marginBottom: "2rem" }}>
          <button
            className={`filter-button ${
              activeTab === "portfolios" ? "active" : ""
            }`}
            onClick={() => setActiveTab("portfolios")}
          >
            Student Portfolios
          </button>
          <button
            className={`filter-button ${
              activeTab === "olympiads" ? "active" : ""
            }`}
            onClick={() => setActiveTab("olympiads")}
          >
            My Olympiads
          </button>
        </div>

        {/* Olympiads Tab */}
        {activeTab === "olympiads" && (
          <>
            <div
              className="university-header-actions"
              style={{
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>Olympiad Management</h2>
              <button
                className="button-primary"
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  if (showCreateForm) {
                    setCurrentStep(1);
                    setCreatedOlympiadId(null);
                    setQuestions([]);
                    setFormData({
                      title: "",
                      description: "",
                      subject: "Mathematics",
                      type: "",
                      startTime: "",
                      endTime: "",
                      duration: 60,
                      status: "draft",
                      olympiadLogo: null,
                      universityName: "",
                    });
                  }
                }}
              >
                {showCreateForm ? "Cancel" : "+ Create Olympiad"}
              </button>
            </div>

            {showCreateForm && (
              <div
                className="create-form card"
                style={{ marginBottom: "2rem" }}
              >
                {/* Step Indicator */}
                <div className="step-indicator">
                  <div
                    className={`step ${currentStep >= 1 ? "active" : ""} ${
                      currentStep > 1 ? "completed" : ""
                    }`}
                  >
                    <span className="step-number">1</span>
                    <span className="step-label">Choose Type</span>
                  </div>
                  <div
                    className={`step ${currentStep >= 2 ? "active" : ""} ${
                      currentStep > 2 ? "completed" : ""
                    }`}
                  >
                    <span className="step-number">2</span>
                    <span className="step-label">Basic Info</span>
                  </div>
                  <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Add Questions</span>
                  </div>
                </div>

                {/* Step 1: Choose Type */}
                {currentStep === 1 && (
                  <div className="step-content">
                    <h2>Step 1: Choose Olympiad Type</h2>
                    <p className="step-description">
                      Select the type of olympiad you want to create
                    </p>
                    <div className="type-selection">
                      <button
                        type="button"
                        className={`type-card ${
                          formData.type === "test" ? "selected" : ""
                        }`}
                        onClick={() => handleTypeSelect("test")}
                      >
                        <div className="type-icon">📝</div>
                        <h3>Test</h3>
                        <p>Multiple choice questions with automatic grading</p>
                      </button>
                      <button
                        type="button"
                        className={`type-card ${
                          formData.type === "essay" ? "selected" : ""
                        }`}
                        onClick={() => handleTypeSelect("essay")}
                      >
                        <div className="type-icon">✍️</div>
                        <h3>Essay</h3>
                        <p>Essay questions requiring manual grading</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Basic Info */}
                {currentStep === 2 && (
                  <div className="step-content">
                    <h2>Step 2: Basic Information</h2>
                    <p className="step-description">
                      Fill in the olympiad details
                    </p>
                    <form onSubmit={handleCreateOlympiad}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            placeholder="e.g., Math Olympiad 2025"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Subject</label>
                          <select
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subject: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="Mathematics">Mathematics</option>
                            <option value="English">English</option>
                            <option value="Science">Science</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the olympiad..."
                          rows="4"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Start Time</label>
                          <input
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                startTime: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>End Time</label>
                          <input
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                endTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>University Name</label>
                          <input
                            type="text"
                            value={formData.universityName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                universityName: e.target.value,
                              })
                            }
                            placeholder="e.g., Harvard University"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Duration (minutes)</label>
                          <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                duration: parseInt(e.target.value) || 60,
                              })
                            }
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Olympiad Logo (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              olympiadLogo: e.target.files[0] || null,
                            })
                          }
                        />
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => setCurrentStep(1)}
                        >
                          Back
                        </button>
                        <button type="submit" className="button-primary">
                          Create & Add Questions
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Add Questions */}
                {currentStep === 3 && (
                  <div className="step-content">
                    <h2>Step 3: Add Questions</h2>
                    <p className="step-description">
                      Add questions to your{" "}
                      {formData.type === "test" ? "test" : "essay"} olympiad
                    </p>

                    {questions.length > 0 && (
                      <div className="questions-list">
                        <h3>Added Questions ({questions.length})</h3>
                        {questions.map((q, index) => (
                          <div key={index} className="question-item card">
                            <div className="question-header">
                              <span className="question-number">
                                Q{index + 1}
                              </span>
                              <span className="question-points">
                                {q.points} pts
                              </span>
                            </div>
                            <p className="question-text">{q.question}</p>
                            {q.type === "multiple-choice" && q.options && (
                              <div className="question-options">
                                {q.options.map((opt, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`option ${
                                      opt === q.correctAnswer ? "correct" : ""
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}. {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <QuestionFormStep
                      olympiadId={createdOlympiadId}
                      olympiadType={formData.type}
                      questions={questions}
                      onAddQuestion={handleAddQuestion}
                      onFinish={handleFinish}
                      onBack={() => setCurrentStep(2)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Olympiads List */}
            {olympiadsLoading ? (
              <div className="university-loading">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="olympiads-grid">
                {olympiads.map((olympiad) => (
                  <div
                    key={olympiad._id}
                    className="olympiad-card card card-interactive"
                  >
                    <div className="olympiad-card-header">
                      <div className="olympiad-title">{olympiad.title}</div>
                      <span
                        className={`status-badge status-${
                          olympiad.status || "draft"
                        }`}
                      >
                        {olympiad.status || "draft"}
                      </span>
                    </div>
                    <div className="olympiad-meta">
                      {olympiad.universityName && (
                        <div className="olympiad-meta-item">
                          <span className="meta-label">University:</span>
                          <span className="meta-value">
                            {olympiad.universityName}
                          </span>
                        </div>
                      )}
                      <div className="olympiad-meta-item">
                        <span className="meta-label">Subject:</span>
                        <span className="meta-value">{olympiad.subject}</span>
                      </div>
                      <div className="olympiad-meta-item">
                        <span className="meta-label">Type:</span>
                        <span className="meta-value">{olympiad.type}</span>
                      </div>
                      {olympiad.startTime && (
                        <div className="olympiad-meta-item">
                          <span className="meta-label">Start:</span>
                          <span className="meta-value">
                            {formatDate(olympiad.startTime)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="olympiad-card-actions">
                      <a
                        href={`/olympiad/${olympiad._id}`}
                        className="button-secondary"
                        style={{
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        View Details
                      </a>
                      <a
                        href={`/olympiad/${olympiad._id}/results`}
                        className="button-primary"
                        style={{
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        View Results
                      </a>
                    </div>
                  </div>
                ))}
                {olympiads.length === 0 && !olympiadsLoading && (
                  <div className="empty-state">
                    <div className="empty-icon">🏆</div>
                    <h3>No olympiads yet</h3>
                    <p>Create your first olympiad to get started.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Portfolios Tab */}
        {activeTab === "portfolios" && (
          <>
            {/* Filters Panel */}
            <div className="resolter-filters">
              <div className="filter-group">
                <label>Verification Status:</label>
                <select
                  className="filter-select"
                  value={filters.verificationStatus}
                  onChange={(e) =>
                    handleFilterChange("verificationStatus", e.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="unverified">Unverified</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="filter-group">
                <label>ILS Level:</label>
                <select
                  className="filter-select"
                  value={filters.ilsLevel}
                  onChange={(e) =>
                    handleFilterChange("ilsLevel", e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                  <option value="5">Level 5</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Olympiad Level:</label>
                <select
                  className="filter-select"
                  value={filters.olympiadLevel}
                  onChange={(e) =>
                    handleFilterChange("olympiadLevel", e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort By:</label>
                <select
                  className="filter-select"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                >
                  <option value="rating-desc">Rating (High to Low)</option>
                  <option value="rating-asc">Rating (Low to High)</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="status-asc">Status</option>
                </select>
              </div>
            </div>

            {/* Portfolio Table */}
            <div className="resolter-results card">
              <div className="results-header">
                <h2 className="results-title">
                  Student Portfolios ({portfolios.length})
                </h2>
              </div>

              <PortfolioTable
                portfolios={getPaginatedPortfolios()}
                onViewPortfolio={handleViewPortfolio}
                onUnlockContacts={handleUnlockContacts}
                contactsUnlocked={contactsUnlocked}
              />

              {portfolios.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={getTotalPages()}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </>
        )}

        {/* Unlock Contacts Modal */}
        {showUnlockModal && selectedPortfolio && (
          <UnlockContactsModal
            portfolio={selectedPortfolio}
            onConfirm={handleUnlockConfirm}
            onClose={() => {
              setShowUnlockModal(false);
              setSelectedPortfolio(null);
            }}
          />
        )}

        {/* Notification Toast */}
        {notification && (
          <NotificationToast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default UniversityDashboard;
