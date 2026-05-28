import React from "react";

export default function Mascot({ small = false }) {
  return (
    <div className={`mascot ${small ? "small" : ""}`} aria-hidden="true">
      <span className="mascotHead">
        <span className="mascotEye left" />
        <span className="mascotEye right" />
        <span className="mascotSmile" />
      </span>
      <span className="mascotBody" />
    </div>
  );
}
