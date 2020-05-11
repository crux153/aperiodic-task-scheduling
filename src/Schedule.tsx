import React from "react";

export function Schedule({ schedule }: { schedule: (string | null)[] }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <p>0</p>
        <p>{schedule.length}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          border: "1px solid black",
        }}
      >
        {schedule.map((color, idx) => (
          <div
            key={idx}
            style={{
              width: "100%",
              height: 50,
              backgroundColor: color ?? "#fff",
            }}
          />
        ))}
      </div>
    </div>
  );
}
