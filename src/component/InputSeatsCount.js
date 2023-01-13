import React, { useEffect, useState } from "react";
import InputTrainNumber from "../view/InputTrainNumber";
import SeatResults from "./SeatResults";

export default function InputSeatsCount() {
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trainReservation, setTrainReservation] = useState({});
  const [reservedSeats, setReservedSeats] = useState([]);
  const [noOfSeatsToBeBooked, setNoOfSeatsToBeBooked] = useState(0);
  const totalSeats = 80;
  const maxSeatsInRow = 7;
  const numerOfRows = Math.ceil(totalSeats / maxSeatsInRow);
  let [arr, setArr] = useState(new Array(numerOfRows));

  const resetError = () => {
    setShowError(false);
    setErrorMsg("");
  };

  const resetSeat = () => {
    resetSeatsDetail();
  };

  const handleInputSeat = (event) => {
    resetError();
    if (event && event != null) {
      if (event.target.value) {
        const seatCount = event.target.value;
        if (seatCount <= 0) {
          setShowError(true);
          setErrorMsg("Seats Input cannot be 0 or Negative");
        } else if (seatCount > 7) {
          setShowError(true);
          setErrorMsg("Seats Input cannot be more than 7");
        } else {
          if (totalSeats - reservedSeats.length < seatCount) {
            setShowError(true);
            setErrorMsg("No Seats are available");
          } else if (reservedSeats.length === totalSeats) {
            setShowError(true);
            setErrorMsg("No Seats are available");
          } else {
            setNoOfSeatsToBeBooked(Number(seatCount));
          }
        }
      }
    }
  };

  const bookedSeats = [];

  useEffect(() => {
    if (localStorage.getItem("train_reservation")) {
      const train_reservation = JSON.parse(
        localStorage.getItem("train_reservation")
      );
      setArr(train_reservation.seatMap);
      setReservedSeats(train_reservation.reservedSeats);
      setTrainReservation(train_reservation);
    } else {
      resetSeatsDetail();
    }
  }, []);

  const resetSeatsDetail = () => {
    let count = 1;
    for (let i = 0; i < numerOfRows; i++) {
      if (i === numerOfRows - 1) {
        arr[i] = new Array(totalSeats % maxSeatsInRow);
      } else {
        arr[i] = new Array(maxSeatsInRow);
      }
      for (let j = 0; j < maxSeatsInRow; j++) {
        if (count > totalSeats) break;
        arr[i][j] = count;
        count++;
      }
    }
    setReservedSeats([]);
    let obj = {
      seatMap: arr,
      availableSeats: totalSeats,
      reservedSeats: [],
    };
    localStorage.setItem("train_reservation", JSON.stringify(obj));
    setTrainReservation(obj);
  };

  const allocateSeat = () => {
    let currSeatBook = 0;
    let remainingRow = [];

    let startingRowIndex = 0;
    let vacantRowIndex = arr.indexOf(
      arr.find((row, index) => {
        if (
          row.length === noOfSeatsToBeBooked &&
          row.find((item) => item !== 0)
        ) {
          return row;
        } else if (
          row.filter((item) => item !== 0).length === noOfSeatsToBeBooked
        ) {
          return row;
        }
      })
    );

    if (vacantRowIndex > 0) {
      startingRowIndex = vacantRowIndex;
    }

    for (let i = startingRowIndex; i < numerOfRows; i++) {
      let seatsRemain = [];

      for (let j = 0; j < maxSeatsInRow; j++) {
        if (i === numerOfRows - 1 && j > 2) break;
        if (arr[i][j] !== 0) {
          seatsRemain.push(arr[i][j]);
          remainingRow.push([i, j]);
        }
      }

      if (seatsRemain.length >= noOfSeatsToBeBooked) {
        for (let j = 0; j < maxSeatsInRow; j++) {
          if (arr[i][j] !== 0) {
            bookedSeats.push(arr[i][j]);
            arr[i][j] = 0;
            currSeatBook++;
          }
          if (currSeatBook === noOfSeatsToBeBooked) {
            break;
          }
        }
      }

      if (currSeatBook === noOfSeatsToBeBooked) {
        break;
      }
    }

    if (currSeatBook !== noOfSeatsToBeBooked) {
      let reference = [0, 0];
      let distances = remainingRow.map((point) => {
        let distance = Math.sqrt(
          Math.pow(point[0] - reference[0], 2) +
            Math.pow(point[1] - reference[1], 2)
        );
        return [point, distance];
      });

      distances.reverse();
      // distances.sort((a, b) => a[1] - b[1]);

      const result = distances
        .slice(0, noOfSeatsToBeBooked)
        .map((pointWithDistance) => pointWithDistance[0]);

      for (let value in result) {
        const ele = arr[result[value[0]][0]][result[value[0]][1]];
        bookedSeats.push(ele);
        arr[result[value[0]][0]][result[value[0]][1]] = 0;
        currSeatBook = noOfSeatsToBeBooked;
      }
    }

    if (bookedSeats.length > 0) {
      let obj = {
        seatMap: arr,
        availableSeats: totalSeats,
        reservedSeats: [...reservedSeats, ...bookedSeats],
      };
      console.log("reservedSeats", reservedSeats);
      setReservedSeats([...reservedSeats, ...bookedSeats]);
      localStorage.setItem("train_reservation", JSON.stringify(obj));
      setTrainReservation(obj);
    }
    setNoOfSeatsToBeBooked(0);
  };

  return (
    <>
      <InputTrainNumber
        handleInputSeat={handleInputSeat}
        showError={showError}
        errorMsg={errorMsg}
        allocateSeat={allocateSeat}
        resetSeat={resetSeat}
      />
      <SeatResults trainReservation={trainReservation} />
    </>
  );
}
