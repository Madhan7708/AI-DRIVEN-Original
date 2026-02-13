import React, { useEffect,useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('userControl');
  const [tableData, setTableData] = useState([]);
  const [predictData, setpredictData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Use useEffect to fetch data when the component loads
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://ai-backend-wpt0.onrender.com/ml-data');
        const data = await response.json();
        console.log('Fetched data:', data);
        
        // Assuming the API returns an array of objects. 
        // If the array is inside a property (e.g., data.results), adjust this to setTableData(data.results)
        setTableData(data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPredictData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://ai-backend-wpt0.onrender.com/run-ml');
        const data = await response.json();
        console.log('Fetched predict data:', data);
        
        // Assuming the API returns an array of objects
        setpredictData(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Error fetching predict data:', error);
        setpredictData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictData();
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div className="logo">Appliances Control</div>
        <div className="nav-item">Home</div>
        <div className="nav-item">Analytics</div>
        <div className="nav-item">Reports</div>
        <div className="nav-item">Settings</div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="main-area">
        
        {/* TOP HEADER */}
        <div className="top-header">
          <div className="user-info">
            <span className="user-name">Alex Johnson</span>
            <div className="profile-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>

        {/* DASHBOARD CONTENT (NEW UI FROM IMAGE) */}
        <div className="content-area">
          
          

          {/* Info Cards */}
          <div className="cards-container">
            
            {/* Card 1: Name */}
            <div className="info-card card-purple">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="card-label">Username</div>
              <div className="card-value">Madhan</div>
            </div>

            {/* Card 2: Batch */}
            <div className="info-card card-teal">
              <div className="card-icon">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
</svg>
              </div>
              <div className="card-label">Application type</div>
              <div className="card-value">Fan</div>
            </div>

            {/* Card 3: Department */}
            <div className="info-card card-orange">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                </svg>
              </div>
              <div className="card-label">Role</div>
              <div className="card-value">Admin</div>
            </div>

          </div>

          {/* Tabs Section */}
          <div className="tabs-section">
            {/* Tab Headers */}
            <div className="tab-headers">
              <button 
                className={`tab-button ${activeTab === 'userControl' ? 'active' : ''}`}
                onClick={() => setActiveTab('userControl')}
              >
                User Control
              </button>
              <button 
                className={`tab-button ${activeTab === 'predictOutput' ? 'active' : ''}`}
                onClick={() => setActiveTab('predictOutput')}
              >
                Predict Output
              </button>
            </div>

            <div className="tab-content">
              
              {/* Conditional Rendering: Show this if User Control is active */}
              {activeTab === 'userControl' && (
                <div>
                  <h3>User Usage Data</h3>
                  {isLoading && <p>Loading data...</p>}
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
  {tableData.length > 0 ? (
    tableData.map((row, index) => {
      // 1. Safely split the Timestamp into Date and Time parts
      const datePart = row.Timestamp ? row.Timestamp.split(' ')[0] : 'N/A';
      const timePart = row.Timestamp ? row.Timestamp.split(' ')[1] : 'N/A';

      return (
        <tr key={index}>
          {/* 2. Map MongoDB _id, with a fallback just in case */}
          <td>{index + 1}</td> 
          
          {/* 3. Use the separated Date and Time */}
          <td>{datePart}</td>
          <td>{timePart}</td>
          
          {/* 4. Use row.State for Status and dynamically change color based on ON/OFF */}
          <td>
            <span style={{ 
              color: row.State === 'ON' ? '#10b981' : '#ef4444', // Green for ON, Red for OFF
              fontWeight: '600'
            }}>
              {row.State || 'Pending'}
            </span>
          </td>
          
          {/* 5. Keep the default View action */}
          <td>{row.action || 'View'}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
        No data available
      </td>
    </tr>
  )}
</tbody>
                  </table>
                </div>
              )}

              {/* Conditional Rendering: Show this if Predict Output is active */}
              {activeTab === 'predictOutput' && (
                <div>
                  <h3>Prediction Data Usage</h3>
                  {isLoading && <p>Loading data...</p>}
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
  {predictData.length > 0 ? (
    predictData.map((row, index) => {
      // 1. Safely split the Timestamp into Date and Time parts
      const datePart = row.Timestamp ? row.Timestamp.split(' ')[0] : 'N/A';
      const timePart = row.Timestamp ? row.Timestamp.split(' ')[1] : 'N/A';

      return (
        <tr key={index}>
          {/* 2. Map MongoDB _id, with a fallback just in case */}
          <td>{index + 1}</td> 
          
          {/* 3. Use the separated Date and Time */}
          <td>{datePart}</td>
          <td>{timePart}</td>
          
          {/* 4. Use row.State for Status and dynamically change color based on ON/OFF */}
          <td>
            <span style={{ 
              color: row.State === 'ON' ? '#10b981' : '#ef4444', // Green for ON, Red for OFF
              fontWeight: '600'
            }}>
              {row.State || 'Pending'}
            </span>
          </td>
          
          {/* 5. Keep the default View action */}
          <td>{row.action || 'View'}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
        No data available
      </td>
    </tr>
  )}
</tbody>
                  </table>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-copyright">
            &copy;  Designed and Maintained by Madhan.
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;