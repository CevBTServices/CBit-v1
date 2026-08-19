import React from "react";

// Tip tanımları
interface AlertProps {
  type: "success" | "error" | "info";
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    // alert-box sınıfı üzerinden index.css içindeki stilleri çağırıyoruz
    <div className={`alert-box ${type}`}>
      {/* Tip bazlı SVG İkonlar eklenerek görsel algı güçlendirildi */}
      {type === "success" && (
        <svg
          className="alert-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}

      {type === "error" && (
        <svg
          className="alert-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}

      {type === "info" && (
        <svg
          className="alert-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )}

      {/* Mesaj içeriği */}
      <span className="alert-message">{message}</span>
    </div>
  );
};
