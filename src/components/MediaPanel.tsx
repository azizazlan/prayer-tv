// MediaPanel.tsx

type MediaPanelProps = {
  imageUrl: string; // SINGLE IMAGE MODE
};

export default function MediaPanel(props: MediaPanelProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0, // 🔑 fills LeftPanel
        zIndex: 10,
        backgroundColor: "black",
      }}
    >
      <img
        src={props.imageUrl}
        alt="Poster"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
