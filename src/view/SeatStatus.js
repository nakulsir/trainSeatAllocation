import React from "react";
import "./temp.css";

export default function SeatStatus({ bookedSeats = [], totalSeatArr = [] }) {
  return (
    <>
      <div className="container">
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Booked Seats Status:
        </h2>
        <p>Booked Seats Count: {bookedSeats.length}</p>
        <p>Available Seats Count: {totalSeatArr.length - bookedSeats.length}</p>
        <table className="grid">
          <tbody>
            <tr>
              {totalSeatArr.map((row) => (
                <td
                  className={
                    bookedSeats.includes(row) ? "reserved" : "available"
                  }
                  key={row}
                >
                  {row}{" "}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
