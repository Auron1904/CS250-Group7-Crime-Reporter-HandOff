import { useEffect, useRef, useState } from "react";
import "./Styles/App.css";
import MapTest from "./MapTest.jsx";
import CreateReportTest from "./CreateReportTest.jsx";
import Filter from "./Filter.jsx";
import AuthModal from "./LoginSignUp.jsx";
import { reportAPI } from './services/reportApi';
import { tokenManager } from './services/authApi';
import { checkAndAlertThreshold, getCreditUsage, recordApiUsage } from "./services/apiCreditTracker.js";
import FBIDataNoticeTest from "./FBIDataNoticeTest.jsx";

export default function AppTest() {
    // Reports state (for map pins)
    const [reports, setReports] = useState([]);
    const [viewReport, setViewReport] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);

    // User state
    const [currentUser, setCurrentUser] = useState(null);

    // NEW: Pin-dropping state
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Load user info on mount
    useEffect(() => {
        const user = tokenManager.getUser();
        setCurrentUser(user);
    }, []);

    // Load all reports when component mounts
    useEffect(() => {
        loadReports();
    }, []);

    // Close modals on ESC
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") {
                setShowCreateModal(false);
                setAuthOpen(false);
                setViewReport(null);
                setSelectedLocation(null); // Clear pin on ESC
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Check API credit status on app load
    useEffect(() => {
        const usage = getCreditUsage();
        checkAndAlertThreshold(usage);
    }, []);

    // Load reports from backend
    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await reportAPI.getAllReports();
            
            // Transform backend data to frontend format
            const transformedReports = data.map(r => ({
                id: r.reportId,
                position: {
                    lat: parseFloat(r.cordLat) || 32.7764,
                    lng: parseFloat(r.cordLng) || -117.0719
                },
                formData: {
                    date: r.date,
                    time: r.time,
                    ampm: r.ampm,
                    yourAge: r.yourAge,
                    yourGender: r.yourGender,
                    personName: r.personName,
                    personAge: r.personAge,
                    personGender: r.personGender,
                    incidentType: r.incidentType ? r.incidentType.split(',') : [],
                    description: r.description
                },
                reporterId: r.reporterId
            }));
            
            setReports(transformedReports);
        } catch (error) {
            console.error('Error loading reports:', error);
            // Don't show alert on initial load, just log
        } finally {
            setLoading(false);
        }
    };

    // NEW: Handle map click for pin dropping
    const handleMapClick = (location) => {
        if (showCreateModal) {
            setSelectedLocation(location);
            console.log('📍 Pin dropped at:', location);
        }
    };

    // Handle saving a new report
    const handleSaveReport = async () => {
        // Reload reports after saving
        await loadReports();
        setShowCreateModal(false);
        setSelectedLocation(null); // Clear pin after save
        const usage = recordApiUsage(1); // 1 credit for saving a report
        checkAndAlertThreshold(usage);
    };

    // View an existing report
    const handleViewReport = (report) => {
        setViewReport(report);
    };

    // Handle successful auth
    const handleAuthSuccess = (user) => {
        setCurrentUser(user);
        setAuthOpen(false);
    };

    // Handle logout
    const handleLogout = () => {
        tokenManager.removeToken();
        tokenManager.removeUser();
        setCurrentUser(null);
        loadReports(); // Reload to show public view
    };

    // Handle create report button
    const handleCreateReportClick = () => {
        if (!currentUser) {
            alert('⚠️ You must be logged in to create a report.');
            setAuthOpen(true);
            return;
        }
        // Start with default SDSU center
        setSelectedLocation({ lat: 32.7764, lng: -117.0719 });
        setShowCreateModal(true);
    };

    // Handle closing create modal
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setSelectedLocation(null); // Clear pin on close
    };

    return (
        <div className="page">
            <header className="header">
                <div className="schoolLogo"></div>
                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: 'whitesmoke', fontSize: '14px' }}>
                            Welcome, {currentUser.firstName}!
                        </span>
                        <button className="loginBtn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button className="loginBtn" onClick={() => setAuthOpen(true)}>
                        Login
                    </button>
                )}
            </header>

            <nav className="navBar">
                <div className="card filtersCard">
                    <Filter />
                </div>
                <button 
                    className="createBtn" 
                    onClick={handleCreateReportClick}
                >
                    Create Report
                </button>
            </nav>
            <FBIDataNoticeTest />

            {/* Main content with left rail and map */}
            <main className="content">
                <section className="leftCol">
                    <div className="card reportCard">
                        <h2>REPORTS</h2>
                        {loading && <p>Loading reports...</p>}
                        {!loading && reports.length === 0 && (
                            <p>No reports yet. Click "Create Report" to add one!</p>
                        )}
                        {!loading && reports.map((r) => (
                            <div 
                                key={r.id} 
                                className="reportField"
                                style={{ 
                                    cursor: 'pointer', 
                                    padding: '10px', 
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: viewReport?.id === r.id ? '#f0f0f0' : 'transparent'
                                }}
                                onClick={() => handleViewReport(r)}
                            >
                                <strong>Report #{r.id.substring(0, 8)}...</strong>
                                {r.formData && (
                                    <>
                                        <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                                            <strong>Type:</strong> {r.formData.incidentType?.join(', ') || 'N/A'}
                                        </p>
                                        <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                                            <strong>Date:</strong> {r.formData.date || 'N/A'}
                                        </p>
                                        <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#666' }}>
                                            {r.formData.description?.substring(0, 50)}
                                            {r.formData.description?.length > 50 ? '...' : ''}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mapPanel">
                    {/* NEW: Instruction banner when creating report */}
                    {showCreateModal && (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(76, 175, 80, 0.95)',
                            color: 'white',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            zIndex: 1000,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            pointerEvents: 'none'
                        }}>
                            📍 Click anywhere on the map to set incident location
                        </div>
                    )}
                    
                    <MapTest
                        reports={reports}
                        onMapClick={handleMapClick}
                        onMarkerClick={handleViewReport}
                        selectedLocation={selectedLocation}
                        isCreatingReport={showCreateModal}
                    />
                </section>
            </main>

            {/* Modal for creating a report */}
            {showCreateModal && selectedLocation && (
                <CreateReportTest
                    report={{ 
                        id: null, 
                        formData: null,
                        lat: selectedLocation.lat,
                        lng: selectedLocation.lng
                    }}
                    onSave={handleSaveReport}
                    onClose={handleCloseCreateModal}
                    readOnly={false}
                />
            )}

            <footer className="footer">
                <div className="footer-content">
                    <span className="footer-text">SDSU Crime Reporter</span>
                    <span className="footer-divider">|</span>
                    <span className="team-badge">Group 4 & 7</span>
                    <span className="footer-divider">|</span>
                    <span className="footer-text">CS 250 Fall 2025</span>
                </div>
            </footer>

            {/* Modal for viewing a saved report */}
            {viewReport && viewReport.formData && (
                <CreateReportTest
                    report={viewReport}
                    onClose={() => setViewReport(null)}
                    readOnly={true}
                />
            )}

            {/* Auth Modal */}
            <AuthModal 
                open={authOpen} 
                onClose={() => setAuthOpen(false)}
                onSuccess={handleAuthSuccess}
            />
        </div>
    );
}