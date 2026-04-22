interface DeathScreenProps {
  onRespawn: () => void;
}

export function DeathScreen({ onRespawn }: DeathScreenProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,0,0,0.78)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        backdropFilter: "blur(3px)",
        animation: "deathFade 0.6s ease-out",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-title)",
          fontWeight: 600,
          fontSize: 42,
          color: "#FF4444",
          textShadow: "0 0 30px rgba(255,68,68,0.8)",
          marginBottom: 12,
        }}
      >
        쓰러졌습니다
      </div>
      <div
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 48,
        }}
      >
        몬스터에게 처치당했습니다
      </div>

      <button
        onClick={onRespawn}
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 900,
          fontSize: 15,
          padding: "12px 40px",
          background: "linear-gradient(135deg, #FF9900, #FFB300)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--r-full)",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(255,153,0,0.5)",
          transition: "transform 0.1s, filter 0.1s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.filter =
            "brightness(1.1)";
          (e.currentTarget as HTMLButtonElement).style.transform =
            "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.filter = "";
          (e.currentTarget as HTMLButtonElement).style.transform = "";
        }}
      >
        부활하기
      </button>

      <style>{`
        @keyframes deathFade { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
