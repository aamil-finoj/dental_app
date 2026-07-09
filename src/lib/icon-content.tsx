export function renderIcon(size: number, rounded = false) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0ea5e9",
        borderRadius: rounded ? size * 0.22 : 0,
      }}
    >
      <span
        style={{
          fontSize: size * 0.55,
          color: "white",
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        S
      </span>
    </div>
  );
}
