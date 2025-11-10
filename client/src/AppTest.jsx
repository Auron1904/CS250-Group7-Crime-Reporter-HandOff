import { useEffect, useRef, useState } from "react";
import "./Styles/App.css";
import MapTest from "./MapTest.jsx";
import CreateReportTest from "./CreateReportTest.jsx";
import Filter from "./Filter.jsx";
import AuthModal from "./LoginSignUp.jsx";

export default function AppTest() {
    // Reports state (for map pins)
    const [reports, setReports] = useState([]);
    const [viewReport, setViewReport] = useState(null);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);  // NEW
    const [authOpen, setAuthOpen] = useState(false);

    // Close modals on ESC
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") {
                setShowCreateModal(false);
                setAuthOpen(false);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Handle saving a new report
    const handleSaveReport = (reportId, formData) => {
        console.log('Report saved:', { reportId, formData });
        
        // Create new report object
        const newReport = {
            id: Date.now(),
            position: { lat: 32.7764, lng: -117.0719 }, // Default SDSU center
            formData: formData
        };
        
        setReports((prev) => [...prev, newReport]);
        setShowCreateModal(false);
        alert('✅ Report created successfully!');
    };

    // View an existing report
    const handleViewReport = (report) => {
        setViewReport(report);
    };

    return (
        <div className="page">
            <header className="header">
                <div className="schoolLogo"></div>
                <button className="loginBtn" onClick={() => setAuthOpen(true)}>
                    Login
                </button>
            </header>

            <nav className="navBar">
                <div className="card filtersCard">
                    <Filter />
                </div>
                <button 
                    className="createBtn" 
                    onClick={() => {
                        console.log('Opening create report modal');
                        setShowCreateModal(true);  // ← CHANGED!
                    }}
                >
                    Create Report
                </button>
            </nav>

            {/* Main content with left rail and map */}
            <main className="content">
                <section className="leftCol">
                    <div className="card reportCard">
                        <h2>REPORTS</h2>
                        {reports.length === 0 && <p>No reports yet. Click "Create Report" to add one!</p>}
                        {reports.map((r) => (
                            <div 
                                key={r.id} 
                                className="reportField"
                                style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}
                                onClick={() => handleViewReport(r)}
                            >
                                <strong>Report #{r.id}</strong>
                                {r.formData && (
                                    <>
                                        <p><strong>Type:</strong> {r.formData.incidentType?.join(', ')}</p>
                                        <p><strong>Date:</strong> {r.formData.date}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mapPanel">
                    <MapTest
                        reports={reports}
                        onMapClick={() => {}} // Disabled for now
                        onMarkerClick={handleViewReport}
                    />
                </section>
            </main>

            {/* Modal for creating a report */}
            {showCreateModal && (
                <CreateReportTest
                    report={{ 
                        id: Date.now(), 
                        formData: null,
                        lat: 32.7764,
                        lng: -117.0719
                    }}
                    onSave={handleSaveReport}
                    onClose={() => setShowCreateModal(false)}
                    readOnly={false}
                />
            )}

            {/* Modal for viewing a saved report */}
            {viewReport && viewReport.formData && (
                <CreateReportTest
                    report={viewReport}
                    onClose={() => setViewReport(null)}
                    readOnly={true}
                />
            )}

            {/* Auth Modal */}
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
}