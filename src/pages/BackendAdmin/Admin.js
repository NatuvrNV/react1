import { useEffect, useState } from "react";
import "./admin.css"; // Import CSS file
import { MdDelete, MdEdit, MdSave, MdClose } from "react-icons/md";

const Admin = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editedLead, setEditedLead] = useState({});
  const leadsPerPage = 10;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    fetch("http://localhost:5000/api/leads", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeads(data);
          setFilteredLeads(data);
        } else {
          setLeads([]);
          setFilteredLeads([]);
        }
      })
      .catch(() => {
        setLeads([]);
        setFilteredLeads([]);
      });
  };

  const handleEdit = (lead) => {
    setEditingLeadId(lead._id);
    setEditedLead(lead);
  };

  const handleChange = (e, field) => {
    setEditedLead({ ...editedLead, [field]: e.target.value });
  };

  const handleSave = (id) => {
    fetch(`http://localhost:5000/api/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedLead),
      credentials: "include",
    }).then(() => {
      fetchLeads();
      setEditingLeadId(null);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(fetchLeads);
    }
  };

  useEffect(() => {
    const filtered = leads.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.brochure?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [searchTerm, leads]);

  const totalPages = Math.max(Math.ceil(filteredLeads.length / leadsPerPage), 1);
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  return (
    <div className="admin-container">
      <aside className="sidebar-admin">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
          <li><a href="/admin">Leads</a></li>
            {/* <li><a href="/projects">Projects</a></li>
            <li><a href="/products">Products</a></li> */}
            <li>
              <button className="logout-button" onClick={() => window.location.href = "/login"}>Logout</button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-navbar">
          <h1>Leads Management</h1>
          <button className="export-button">Export CSV</button>
        </header>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email, brochure, or message..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
              <th>Date & Time</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Brochure</th>
                <th>Message</th>
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead._id}>
                  {editingLeadId === lead._id ? (
                    <>
                    <td><input className="updateLead" value={editedLead.createdAt} onChange={(e) => handleChange(e, "createdAt")} /></td>
                      <td><input className="updateLead" value={editedLead.name} onChange={(e) => handleChange(e, "name")} /></td>
                      <td><input className="updateLead" value={editedLead.email} onChange={(e) => handleChange(e, "email")} /></td>
                      <td><input className="updateLead" value={editedLead.phone} onChange={(e) => handleChange(e, "phone")} /></td>
                      <td><input className="updateLead" value={editedLead.brochure} onChange={(e) => handleChange(e, "brochure")} /></td>
                      <td><input className="updateLead" value={editedLead.message} onChange={(e) => handleChange(e, "message")} /></td>
                      
                      <td>
                        <button onClick={() => handleSave(lead._id)}><MdSave size={20} /></button>
                        <button onClick={() => setEditingLeadId(null)}><MdClose size={20} /></button>
                      </td>
                    </>
                  ) : (
                    <>
                       <td>
                        {lead.createdAt 
                          ? new Date(lead.createdAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })
                          : "N/A"}
                      </td>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.brochure || lead.message?.match(/requested the (.+?) brochure/)?.[1] || "N/A"}</td>
                      <td>{lead.message || "N/A"}</td>
                   
                      <td>
                        <button onClick={() => handleEdit(lead)}><MdEdit size={20} /></button>
                        <button onClick={() => handleDelete(lead._id)}><MdDelete size={20} /></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>◀</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>▶</button>
        </div>
      </main>
    </div>
  );
};

export default Admin;
