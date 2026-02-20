import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';

// Home Component
const Home = () => (
  <div className="dashboard-content">
    <h1>Welcome Madhan <i className="bi bi-emoji-smile"></i> ,</h1>
    <p>To control electrical appliances in your home.</p>
    <div className="stats">
      <div className="stat-card"><i className="bi bi-person"></i> <br />Name <br /> <br />Madhan M </div>
      <div className="stat-card"><i className="bi bi-bookmark-dash"></i> <br />Type <br /> <br />Admin</div>
      <div className="stat-card"><i className="bi bi-fan"></i><br /> Electrical Appliances <br /> <br />Fan </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="footer bg-white border-top py-3 mt-auto">
    <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center">
      <span className="text-muted">© 2024 Home Automation System</span>
      <ul className="list-inline mb-0">
        <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted">Privacy Policy</a></li>
        <li className="list-inline-item text-muted">|</li>
        <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted">Support</a></li>
      </ul>
    </div>
  </footer>
);
// Profile Component
const Profile = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="dashboard-content">
      <h1>control applicances Activity</h1>
      
     

      {/* Navigation Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-2 rounded shadow-sm">
  <ul className="nav nav-pills border-0">
    <li className="nav-item">
      <button 
        className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`} 
        onClick={() => setActiveTab('activity')}
      >
        <i className="bi bi-clock-history me-2"></i> Daily Usages
      </button>
    </li>
    <li className="nav-item">
      <button 
        className={`nav-link ${activeTab === 'devices' ? 'active' : ''}`} 
        onClick={() => setActiveTab('devices')}
      >
        <i className="bi bi-cpu me-2"></i> Predict usages
      </button>
    </li>
  </ul>

  {/* Refresh Button on the Right */}
  <button 
    className="btn btn-outline-secondary btn-sm d-flex align-items-center me-2"
    onClick={() => window.location.reload()} // Or trigger a data fetch function
  >
    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
  </button>
</div>
  <br /><br />

    
      {/* Tab Content Area */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {activeTab === 'activity' ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                   <td>1</td>
                    <td>2024-01-20</td>
                    <td>10:30 AM</td>
                    <td><span className="badge bg-success">ON</span></td>
                    <td>edit</td>

                  </tr>
                 <tr>
                   <td>1</td>
                    <td>2024-01-20</td>
                    <td>10:30 AM</td>
                   <td><span className="badge bg-danger">OFF</span></td>
                    <td>edit</td>

                  </tr>
                  <tr>
                   <td>1</td>
                    <td>2024-01-20</td>
                    <td>10:30 AM</td>
                    <td><span className="badge bg-success">ON</span></td>
                    <td>edit</td>

                  </tr>
                  <tr>
                   <td>1</td>
                    <td>2024-01-20</td>
                    <td>10:30 AM</td>
                    <td><span className="badge bg-danger">Off</span></td>
                     <td><button type="button" className="btn btn-sm btn-outline-warning"
                      onClick={() => handleEditClick({ id: 1, status: 'ON' })}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button></td>


                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                   <td>1</td>
                    <td>2024-01-55</td>
                    <td>10:30 AM</td>
                    <td><span className="badge bg-success">ON</span></td>
                   <td><button type="button" className="btn btn-sm btn-outline-warning"><span className="badge bg-warning">Edit</span></button></td>

                  </tr>
                 <tr>
                   <td>1</td>
                    <td>2024-01-20</td>
                    <td>10:30 AM</td>
                    <td><span className="badge bg-success">ON</span></td>
                    <td><button type="button" className="btn btn-sm btn-outline-warning"><span className="badge bg-warning">Edit</span></button></td>

                  </tr>
                  <tr>
                   <td>1</td>
                    <td>2024-01-20</td>
                    <td>10:30 AM</td>
                    <td><span className="badge bg-success">ON</span></td>
                    <td><button type="button" className="btn btn-sm btn-outline-warning"><span className="badge bg-warning">Edit</span></button></td>

                  </tr>
                  <tr>
                   <td>1</td>
                    <td>2024-01-20</td>
                    <td>10:30 AM</td>
                    <td><span className="badge bg-danger">OFF</span></td>
                    <td><button type="button" className="btn btn-sm btn-outline-warning"><span className="badge bg-warning">Edit</span></button></td>

                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* --- BOOTSTRAP MODAL --- */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
          
          {/* Modal Dialog */}
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Usage #{selectedItem?.id}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Current Status</label>
                      <select className="form-select" defaultValue={selectedItem?.status}>
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Update Time</label>
                      <input type="time" className="form-control" defaultValue="10:30" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Update Date</label>
                      <input type="date" className="form-control" defaultValue="2024-01-20" />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Function to handle logout and close sidebar
  const handleLogout = () => {
    closeSidebar();
    onLogout();
  };

  // Function to handle navigation and close sidebar
  const handleNavigation = () => {
    closeSidebar();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar - Only show when isSidebarOpen is true */}
      {isSidebarOpen && (
        <div className="sidebar-container">
          <Sidebar 
            onLogout={handleLogout} 
            onClose={closeSidebar}
            onNavigation={handleNavigation}
          />
          {/* Overlay for mobile when sidebar is open */}
          {isMobile && (
            <div className="sidebar-overlay" onClick={closeSidebar}></div>
          )}
        </div>
      )}
      
      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}>
        <header className="header">
          {/* Always show menu toggle button when sidebar is closed */}
          {!isSidebarOpen && (
            <button className="menu-toggle" onClick={openSidebar}>
              ☰ Menu
            </button>
          )}
          <h1>Dashboard</h1>
          <div className="user-info">Welcome, Admin!</div>
        </header>
        
        <div className="content-area">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/dashboard/home" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;