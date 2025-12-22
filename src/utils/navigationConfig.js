import { USER_ROLES } from "./constants";

/**
 * Navigation configuration mapping roles to their allowed menu items
 * Each menu item has: { label, path }
 * 
 * Note: Backend uses "school-admin" and "school-teacher" (hyphens),
 * but constants use "school_admin" and "school_teacher" (underscores).
 * We handle both formats.
 */
export const ROLE_NAVIGATION_CONFIG = {
  // 🟢 STUDENT
  [USER_ROLES.STUDENT]: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Portfolio", path: "/dashboard/portfolio" },
    { label: "Results", path: "/results" },
    { label: "Profile", path: "/profile" },
  ],

  // 🔵 UNIVERSITY
  [USER_ROLES.UNIVERSITY]: [
    { label: "University Dashboard", path: "/university" },
    { label: "Students Portfolios", path: "/university-panel" },
    { label: "Reservations", path: "/university-panel" },
    { label: "Profile", path: "/profile" },
  ],

  // 🟣 OWNER - Must see ALL system pages (superuser)
  [USER_ROLES.OWNER]: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Universities", path: "/university-panel" },
    { label: "Schools", path: "/admin" },
    { label: "Admin Panel", path: "/admin" },
    { label: "Results", path: "/results" },
    { label: "Users", path: "/owner" },
    { label: "Profile", path: "/profile" },
    { label: "System Settings", path: "/settings" },
  ],

  // 🔴 ADMIN
  [USER_ROLES.ADMIN]: [
    { label: "Admin Dashboard", path: "/admin" },
    { label: "Olympiads Management", path: "/admin" },
    { label: "Results Moderation", path: "/results" },
    { label: "Users Management", path: "/admin" },
    { label: "Schools", path: "/admin" },
    { label: "Universities", path: "/university-panel" },
    { label: "Profile", path: "/profile" },
  ],

  // 🟠 SCHOOL ADMIN
  [USER_ROLES.SCHOOL_ADMIN]: [
    { label: "School Dashboard", path: "/dashboard" },
    { label: "Students", path: "/dashboard" },
    { label: "Results", path: "/results" },
    { label: "Teachers", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
  ],
  "school-admin": [ // Backend format
    { label: "School Dashboard", path: "/dashboard" },
    { label: "Students", path: "/dashboard" },
    { label: "Results", path: "/results" },
    { label: "Teachers", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
  ],

  // 🟡 SCHOOL TEACHER
  [USER_ROLES.SCHOOL_TEACHER]: [
    { label: "Students", path: "/school-teacher" },
    { label: "Results", path: "/results" },
    { label: "Profile", path: "/profile" },
  ],
  "school-teacher": [ // Backend format
    { label: "Students", path: "/school-teacher" },
    { label: "Results", path: "/results" },
    { label: "Profile", path: "/profile" },
  ],

  // 🟤 RESOLTER
  [USER_ROLES.RESOLTER]: [
    { label: "Results Panel", path: "/resolter" },
    { label: "Profile", path: "/profile" },
  ],

  // ⚫ CHECKER
  [USER_ROLES.CHECKER]: [
    { label: "Verification Panel", path: "/checker" },
    { label: "Pending Submissions", path: "/checker" },
    { label: "Profile", path: "/profile" },
  ],
};

/**
 * Get navigation items for a specific role
 * @param {string} role - User role (can be from constants or backend format)
 * @returns {Array} Array of navigation items (deduplicated by path)
 */
export const getNavigationItems = (role) => {
  if (!role) return [];
  
  let items = [];
  
  // Try exact match first
  if (ROLE_NAVIGATION_CONFIG[role]) {
    items = ROLE_NAVIGATION_CONFIG[role];
  } else {
    // Handle role format variations (underscore vs hyphen)
    // Backend uses "school-admin" and "school-teacher" with hyphens
    // Constants use "school_admin" and "school_teacher" with underscores
    const normalizedRole = role.replace(/_/g, "-");
    if (ROLE_NAVIGATION_CONFIG[normalizedRole]) {
      items = ROLE_NAVIGATION_CONFIG[normalizedRole];
    } else {
      // Try reverse (hyphen to underscore)
      const reverseNormalized = role.replace(/-/g, "_");
      if (ROLE_NAVIGATION_CONFIG[reverseNormalized]) {
        items = ROLE_NAVIGATION_CONFIG[reverseNormalized];
      }
    }
  }
  
  // Deduplicate by path + label combination (allow same path with different labels)
  const seen = new Set();
  return items.filter(item => {
    const key = `${item.path}:${item.label}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Check if a path is active (matches current location)
 * Handles partial matches for nested routes
 */
export const isActiveRoute = (menuPath, currentPath) => {
  if (menuPath === currentPath) return true;
  
  // Handle portfolio route
  if (menuPath === "/dashboard/portfolio" && currentPath.startsWith("/dashboard/portfolio")) {
    return true;
  }
  
  // Handle dashboard and nested routes
  if (menuPath === "/dashboard" && currentPath.startsWith("/dashboard")) {
    // Exclude portfolio from dashboard active state
    if (currentPath.startsWith("/dashboard/portfolio")) return false;
    return true;
  }
  
  // Handle olympiad routes
  if (menuPath === "/dashboard" && currentPath.startsWith("/olympiad/")) {
    return true;
  }
  
  // Handle university panel routes
  if (menuPath === "/university-panel" && currentPath.startsWith("/university")) {
    return true;
  }
  
  // Handle admin panel routes
  if (menuPath === "/admin" && currentPath.startsWith("/admin")) {
    return true;
  }
  
  // Handle owner panel routes
  if (menuPath === "/owner" && currentPath.startsWith("/owner")) {
    return true;
  }
  
  // Handle checker panel routes
  if (menuPath === "/checker" && currentPath.startsWith("/checker")) {
    return true;
  }
  
  // Handle resolter panel routes
  if (menuPath === "/resolter" && currentPath.startsWith("/resolter")) {
    return true;
  }
  
  // Handle school teacher panel routes
  if (menuPath === "/school-teacher" && currentPath.startsWith("/school-teacher")) {
    return true;
  }
  
  return false;
};

