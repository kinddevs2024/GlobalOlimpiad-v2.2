import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Scene3D from "../../components/3D/Scene3D";
import "./Home.css";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const sections = [
    {
      id: "about",
      title: "About Global Olympiads",
      subject: "math",
      content: (
        <>
          <p>
            Welcome to Global Olympiads, the premier online platform for
            academic competitions across multiple subjects. Our platform brings
            together students from around the world to compete, learn, and excel
            in their chosen fields.
          </p>
          <p>
            Whether you're passionate about Mathematics, Physics, Chemistry,
            English, or Science, we provide a fair, secure, and engaging
            environment for you to showcase your knowledge and skills.
          </p>
        </>
      ),
    },
    {
      id: "features",
      title: "Platform Features",
      subject: "physics",
      content: (
        <>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🎯 Multiple Olympiad Types</h3>
              <p>
                Test-based and Essay formats to suit different learning styles
                and assessment methods.
              </p>
            </div>
            <div className="feature-card">
              <h3>📹 Advanced Proctoring</h3>
              <p>
                Real-time camera and screen monitoring to ensure fair
                competition and academic integrity.
              </p>
            </div>
            <div className="feature-card">
              <h3>⏱️ Timer System</h3>
              <p>
                Countdown timer with auto-submit functionality to manage your
                time effectively.
              </p>
            </div>
            <div className="feature-card">
              <h3>📊 Real-time Leaderboard</h3>
              <p>
                Live rankings via Socket.io to track your progress and see how
                you rank among participants.
              </p>
            </div>
            <div className="feature-card">
              <h3>👥 Role-based Access</h3>
              <p>
                Student, Admin, Owner, Resolter, and School Teacher roles with
                appropriate permissions.
              </p>
            </div>
            <div className="feature-card">
              <h3>🎨 Modern UI</h3>
              <p>
                Beautiful black & white design inspired by Nothing Phone with
                smooth animations.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "subjects",
      title: "Available Subjects",
      subject: "chemistry",
      content: (
        <>
          <div className="subjects-grid">
            <div className="subject-card">
              <h3>Mathematics</h3>
              <p>
                Challenge yourself with complex problems, equations, and
                mathematical reasoning.
              </p>
            </div>
            <div className="subject-card">
              <h3>Physics</h3>
              <p>
                Explore the laws of nature, mechanics, thermodynamics, and
                quantum physics.
              </p>
            </div>
            <div className="subject-card">
              <h3>Chemistry</h3>
              <p>
                Dive into molecular structures, reactions, and chemical
                processes.
              </p>
            </div>
            <div className="subject-card">
              <h3>English</h3>
              <p>
                Test your language skills, comprehension, and writing abilities.
              </p>
            </div>
            <div className="subject-card">
              <h3>Science</h3>
              <p>
                Comprehensive scientific knowledge covering biology, astronomy,
                and more.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "how-it-works",
      title: "How It Works",
      subject: "english",
      content: (
        <>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up & Complete Profile</h3>
                <p>
                  Create your account and complete your profile to get started.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Browse Available Olympiads</h3>
                <p>
                  Explore upcoming and active olympiads in your preferred
                  subjects.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start & Complete</h3>
                <p>
                  Begin the olympiad, answer questions, and submit your
                  responses before time runs out.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>View Results & Leaderboard</h3>
                <p>
                  Check your results, see your ranking, and compare with other
                  participants.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "get-started",
      title: "Get Started Today",
      subject: "science",
      content: (
        <>
          <p className="get-started-text">
            Ready to test your knowledge and compete with students worldwide?
            Join Global Olympiads today and embark on your academic journey!
          </p>
          <div className="cta-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/auth" className="cta-button primary">
                  Sign Up Now
                </Link>
                <Link to="/auth" className="cta-button secondary">
                  Log In
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="cta-button primary">
                  Go to Dashboard
                </Link>
                <Link to="/results" className="cta-button secondary">
                  View Results
                </Link>
              </>
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-3d">
          <Scene3D subject="math" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-glow">Global Olympiads</span>
          </h1>
          <p className="hero-subtitle">Compete, Learn, Excel</p>
          <p className="hero-description">
            The premier online platform for academic competitions across
            Mathematics, Physics, Chemistry, English, and Science.
          </p>
          {!isAuthenticated && (
            <Link to="/auth" className="hero-cta">
              Get Started
            </Link>
          )}
        </div>
      </section>

      {/* Informative Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          className={`info-section ${section.id}-section`}
        >
          <div className="section-3d">
            <Scene3D subject={section.subject} />
          </div>
          <div className="section-content">
            <div className="container">
              <h2 className="section-title">{section.title}</h2>
              <div className="section-body">{section.content}</div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2024 Global Olympiads. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
