import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Show navbar on public pages even if not authenticated
  const publicPages = ["/", "/about", "/contact", "/services", "/auth"];
  const isPublicPage = publicPages.includes(location.pathname);
  const isPortfolioPage = location.pathname.startsWith("/portfolio/");

  // Hide navbar on portfolio pages
  if (isPortfolioPage) {
    return null;
  }

  if (!isAuthenticated && !isPublicPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-logo">
          <span className="text-glow">Olympiad</span>
        </Link>

        <div className="navbar-menu">
          {!isAuthenticated && (
            <>
              <Link to="/" className="navbar-link">
                Home
              </Link>
              <Link to="/about" className="navbar-link">
                About
              </Link>
              <Link to="/services" className="navbar-link">
                Services
              </Link>
              <Link to="/contact" className="navbar-link">
                Contact
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/dashboard/portfolio" className="navbar-link">
                Portfolio
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <Link to="/results" className="navbar-link">
                Results
              </Link>

              <div className="navbar-user">
                <span className="navbar-username">{user?.email}</span>
                <span className="navbar-role">({user?.role})</span>
              </div>

              <button
                onClick={handleLogout}
                className="button-secondary navbar-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="navbar-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
