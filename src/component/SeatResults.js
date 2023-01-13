import React, { useEffect, useState } from "react";
import SeatStatus from "../view/SeatStatus";

export default function SeatResults({ trainReservation }) {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [totalSeatArr, setTotalSeatArr] = useState([]);

  const TotalSeats = 80;

  useEffect(() => {
    if (trainReservation) {
      // const train_reservation = JSON.parse(trainReservation);
      const bookedSeats = trainReservation.reservedSeats;
      setBookedSeats(bookedSeats);
    }

    const totalSeatArr = [];
    for (let i = 1; i <= TotalSeats; i++) {
      totalSeatArr.push(i);
    }
    setTotalSeatArr(totalSeatArr);
  }, []);

  return (
    <SeatStatus
      bookedSeats={trainReservation.reservedSeats}
      totalSeatArr={totalSeatArr}
    />
  );
}
