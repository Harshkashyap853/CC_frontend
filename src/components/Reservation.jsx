// Reservation.js

import React, { useEffect, useState } from "react";

const OPEN_HOURS = [
  "What time?",
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
  "5:00pm",
  "6:00pm",
  "7:00pm",
  "8:00pm",
  "9:00pm",
];

const formElement = "form";

function generateConfirmationCode(reservation) {
  const { first, last, time, date } = reservation;
  return `${last}${time}${date}-${first}`.toUpperCase().replace(/\s/g, "");
}

function Reservation() {
  const [reservation, setReservation] = useState({ time: "What time?" });
  const [btnValidation, setBtnValidation] = useState(true);
  const [hours, setHours] = useState(OPEN_HOURS);
  const [success, setSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const validateBtn = () => {
    if (
      reservation.date &&
      reservation.time !== "What time?" &&
      reservation.email &&
      reservation.first &&
      reservation.last
    )
      setBtnValidation(false);
  };

  const existingReservation = () => {
    // Check existing reservations logic
    // ...
    const storage = JSON.parse(localStorage.getItem("reservation"));

    if (!storage) return;

    if (reservation.date === storage.date) {
      const availableHours = hours.filter((hour) => hour !== storage.time);
      setHours(availableHours);
    } else {
      setHours(OPEN_HOURS);
    }
  };

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save reservation to MongoDB database
      const response = await fetch("http://localhost:5000/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...reservation, date: reservation.date.toString() }),
      });
      if (!response.ok) {
        throw new Error("Failed to save reservation");
      }
      const data = await response.json();
      console.log("Reservation saved:", data);
      setConfirmationCode(generateConfirmationCode(reservation));
      setSuccess(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
    }
  };

  useEffect(() => {
    validateBtn();
    existingReservation();
  }, [reservation]);

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      {/* Success message */}
      {success && (
        <div>
          <p
            style={{
              backgroundColor: "#212121",
              padding: "0.5rem 0",
              textAlign: "center",
              color: "white",
            }}
          >
            <span style={{ color: "green", fontWeight: "600" }}>Booked!</span>{" "}
            <strong>Confirmation Code:</strong> {confirmationCode}
          </p>
          <p>Please keep your confirmation code for future reference.</p>
        </div>
      )}

      {/* Form content */}
      <div>
        <input
          type="text"
          name="first"
          id="first"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last"
          id="last"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
      </div>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <div>
        <input
          type="date"
          name="date"
          id="date"
          onChange={handleChange}
          required
        />
        {hours.length === 0 ? (
          <h2>Sorry, We're all booked up.</h2>
        ) : (
          <select name="time" id="time" onChange={handleChange} required>
            {hours.map((hour, index) => (
              <option value={hour} key={index}>
                {hour}
              </option>
            ))}
          </select>
        )}
      </div>
      <button type="submit" disabled={btnValidation}>
        Submit
      </button>
    </form>
  );
}

export default Reservation;
