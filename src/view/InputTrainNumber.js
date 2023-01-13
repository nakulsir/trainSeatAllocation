import React, { useRef } from "react";

export default function InputTrainNumber({
  handleInputSeat,
  showError,
  allocateSeat,
  errorMsg,
  resetSeat,
}) {
  const inputElement = useRef();
  const bookSeats = () => {
    if (inputElement.current.value.trim() !== "") allocateSeat();
    inputElement.current.value = "";
  };
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div>Train Seat Booking</div>
      <div>
        <h3>Enter Number of Seats you want to Book:</h3>
        <input
          ref={inputElement}
          id="seatCount"
          type={"number"}
          onInput={(event) => {
            // setTimeout(() => {
            //   handleInputSeat(event);
            // }, 1000);
            handleInputSeat(event);
          }}
        ></input>
        <button onClick={bookSeats} disabled={showError}>Book seats</button>
        <button onClick={resetSeat}>Reset seats</button>
        {showError ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
      </div>
    </div>
  );
}
