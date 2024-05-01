import React , {useState} from "react";
import Reservation from "./Reservation";

function Contact() {


  const [confirmationCode, setConfirmationCode] = useState("");
  const [reservationInfo, setReservationInfo] = useState(null);

  const handleSearch = async () => {
    try {
      // Fetch reservation details from backend using confirmation code
      const response = await fetch(`http://localhost:5000/api/reservation/${confirmationCode}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reservation");
      }
      const data = await response.json();
      setReservationInfo(data);
    } catch (error) {
      console.error("Error fetching reservation:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Send request to delete reservation using confirmation code
      const response = await fetch(`http://localhost:5000/api/reservation/${confirmationCode}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }
      // Reset reservation info after deletion
      setReservationInfo(null);
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };
  return (
    <section id="contact">
      <h1 className="heading-contact">Contact</h1>
      <div className="contact-container">
        <div className="contact-hours">
          <h1>See reservation</h1>
          <input
            type="text"
            placeholder="Enter Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          {reservationInfo && Object.keys(reservationInfo).length > 0 && (
  <div className="reservation-details">
    {/* Display reservation details */}
    <p>First Name: {reservationInfo.first}</p>
    <p>Last Name: {reservationInfo.last}</p>
    <p>Email: {reservationInfo.email}</p>
    <p>Date: {reservationInfo.date}</p>
    <p>Time: {reservationInfo.time}</p>
    <button onClick={handleDelete}>Delete</button>
  </div>
)}
        </div>
        <div className="contact-booking">
          <h1>Need a Table?</h1>
          <h2>Note: Maximum of 5 clients per reservation</h2>
          <Reservation />
        </div>
      </div>
    </section>
  );
}

export default Contact;
