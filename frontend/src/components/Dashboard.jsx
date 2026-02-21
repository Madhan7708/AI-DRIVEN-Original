import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';
import axios from 'axios';

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

  // States for Daily Usages (Table 1)
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Predictions (Table 2)
  const [predictions, setPredictions] = useState([]);
  const [predLoading, setPredLoading] = useState(true);

  // --- FETCH FUNCTIONS ---

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/DBdata');
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activity data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      setPredLoading(true);
      const response = await axios.get('http://localhost:8000/predictiondb');
      setPredictions(response.data);
    } catch (error) {
      console.error("Error fetching prediction data:", error);
    } finally {
      setPredLoading(false);
    }
  };

  // Run both on mount
  useEffect(() => {
    fetchActivities();
    fetchPredictions();
  }, []);

  // --- HANDLERS ---

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const updatedData = {
      State: selectedItem.status,
      Timestamp: `${selectedItem.date} ${selectedItem.time}`
    };

    try {
      const response = await axios.put(`http://localhost:8000/update/${selectedItem.id}`, updatedData);
      if (response.status === 200) {
        alert("Updated successfully!");
        setShowModal(false);
        // Refresh both to stay in sync
        fetchActivities();
        fetchPredictions();
      }
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update record.");
    }
  };

const handleRefresh = async () => {
  try {
    
      setPredLoading(true);
      
      const response = await axios.post('http://localhost:8000/run-ml');
      
      if (response.data.success) {
        alert(`Refresh Successful`);
        // 3. Re-fetch the newly stored predictions to update the UI
        await fetchPredictions();
      }
  } catch (error) {
    console.error("Refresh failed:", error);
    alert("ML Service is currently unavailable. Please try again later.");
  } finally {
    setPredLoading(false);
  }
};

  return (
    <div className="dashboard-content">
      <h1 className="mb-4">Control Appliances Activity</h1>

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
              <i className="bi bi-cpu me-2"></i> Predict Usages
            </button>
          </li>
        </ul>

        
      </div>

      {/* Tab Content Area */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {activeTab === 'activity' ? (
            
            <div className="table-responsive">
              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
        </button>
        <br /><br />
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center p-4">Loading Activities...</td></tr>
                  ) : (
                    activities.map((item, index) => {
                      const [date, time] = item.Timestamp ? item.Timestamp.split(' ') : ['N/A', 'N/A'];
                      return (
                        <tr key={item._id || index}>
                          <td>{index + 1}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                          <td>
                            <span className={`badge ${item.State === 'ON' ? 'bg-success' : 'bg-danger'}`}>
                              {item.State}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditClick({ id: item._id, status: item.State, date, time })}>
                              <i className="bi bi-pencil me-1"></i> Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th><th>Date</th><th>Time</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {predLoading ? (
                    <tr><td colSpan="4" className="text-center p-4">Loading Predictions...</td></tr>
                  ) : (
                    predictions.map((item, index) => {
                      const [date, time] = item.Timestamp ? item.Timestamp.split(' ') : ['N/A', 'N/A'];
                      return (
                        <tr key={item._id || index}>
                          <td>{index + 1}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                          <td>
                            <span className={`badge ${item.State === 'ON' ? 'bg-success' : 'bg-danger'}`}>
                              {item.State}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal remains the same as your provided version, using selectedItem state */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Usages</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSaveChanges}>
                    <div className="mb-3">
                      <label className="form-label">Current Status</label>
                      <select className="form-select" value={selectedItem?.status} onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}>
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Update Time</label>
                      <input type="time" className="form-control" value={selectedItem?.time} onChange={(e) => setSelectedItem({ ...selectedItem, time: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Update Date</label>
                      <input type="date" className="form-control" value={selectedItem?.date} onChange={(e) => setSelectedItem({ ...selectedItem, date: e.target.value })} />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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