import React from 'react';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Table } from 'react-bootstrap';



export default function PatientsListCard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { providerId } = useParams(); // Get providerId from URL parameters
    const [patients, setPatients] = useState([]);
    const [providerName, setProviderName] = useState('');

    // Fetch patients and provider name from the database by providerId
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage

                // Fetch patients
                const patientsResponse = await fetch(`${process.env.REACT_APP_BE_URL}/patients/${providerId}/all`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Include token in headers
                    }
                });

                if (patientsResponse.status === 401) {
                    alert("Unauthorized: Please log in.");
                    navigate('/login');
                    return;
                }

                if (!patientsResponse.ok) {
                    throw new Error(`HTTP error! Status: ${patientsResponse.status}`);
                }

                const patientsData = await patientsResponse.json();
                console.log('Fetched Patients:', patientsData); // Debugging log
                setPatients(patientsData); // Update state with fetched patient data

                // Fetch provider name
                const providerResponse = await fetch(`${process.env.REACT_APP_BE_URL}/providers/${providerId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Include token in headers
                    }
                });

                if (!providerResponse.ok) {
                    throw new Error(`HTTP error! Status: ${providerResponse.status}`);
                }

                const providerData = await providerResponse.json();
                console.log('Fetched Provider:', providerData); // Debugging log
                setProviderName(`${providerData.name}`); // Set provider name

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [providerId, navigate]); // Add providerId as a dependency


return (
        <Card className="m-3 mb-3">
            <div className="patientsCard">
                <Card.Body className="text-auto">
                    <Card.Title>
                        <Link to={location.pathname === `/patients/${providerId}/all` ? `/providers/${providerId}` : `/patients/${providerId}/all`}>
                            {location.pathname === `/patients/${providerId}/all` ? 'Back to Provider Page' : 'Patient List'}
                        </Link>
                    </Card.Title>
                    <Card.Text>All Patients for Provider: {providerName}</Card.Text>
                    <Table striped bordered hover responsive="md" className="mt-3">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient Full Name</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Member ID</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length > 0 ? (
                                patients.map((patient, index) => (
                                    <tr key={patient._id}
                                    onClick={()=> navigate(`/patients/${patient._id}`)}
                                    style={{ cursor: 'pointer' }} >
                                        <td>{index + 1}</td>
                                        <td>{patient.lastName || 'N/A'}, {patient.firstName || 'N/A'}</td>
                                        <td>{patient.dateOfBirth || 'N/A'}</td>
                                        <td>{patient.gender || 'N/A'}</td>
                                        <td>{`${patient.address?.Address || 'N/A'}, ${patient.address?.City || 'N/A'}, ${patient.address?.State || 'N/A'}, ${patient.address?.Zip || 'N/A'}`}</td>
                                        <td>{patient.memberId || 'N/A'}</td>
                                        <td>{patient.isActive ? "Active" : "Inactive"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No Patients Found for This Provider
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </div>
        </Card>
    );
}

