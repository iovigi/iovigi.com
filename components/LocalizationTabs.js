'use client';

export default function LocalizationTabs({ activeTab, setActiveTab }) {
    return (
        <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
                <a className={`nav-link ${activeTab === 'en' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('en'); }}>English</a>
            </li>
            <li className="nav-item">
                <a className={`nav-link ${activeTab === 'bg' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('bg'); }}>Bulgarian</a>
            </li>
        </ul>
    );
}
