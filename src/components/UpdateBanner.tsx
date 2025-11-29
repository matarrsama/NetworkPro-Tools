import React from "react";

type Props = {
  message?: string;
  onInstall: () => void;
  onLater: () => void;
  downloading?: boolean;
  progress?: number; // 0-100
};

const UpdateBanner: React.FC<Props> = ({
  message = "An update is ready to install.",
  onInstall,
  onLater,
  downloading = false,
  progress = 0,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 20,
        display: "flex",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          color: "var(--text-primary)",
          padding: "12px 16px",
          borderRadius: 8,
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          minWidth: 340,
          maxWidth: 760,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{message}</div>
          {downloading ? (
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  height: 8,
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(Math.max(progress, 0), 100)}%`,
                    height: "100%",
                    background: "var(--accent-color)",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                Downloading... {Math.round(progress)}%
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Choose Install to restart now or Later to continue.
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-primary"
            onClick={onInstall}
            type="button"
            disabled={downloading}
          >
            Install Now
          </button>
          <button className="btn btn-secondary" onClick={onLater} type="button">
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanner;
