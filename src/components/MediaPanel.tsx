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
        "z-index": 10,
        "background-color": "black",
      }}
    >
      <img
        src={props.imageUrl}
        alt="Poster"
        style={{
          width: "100%",
          height: "auto",
          "object-fit": "cover",
        }}
      />
    </div>
  );
}
