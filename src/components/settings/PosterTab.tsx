import { createSignal } from "solid-js";

export default function PosterTab(props: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      props.onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>Poster Upload</h2>

      <input type="file" accept="image/*" onChange={handleFile} />

      {props.value && (
        <img
          src={props.value}
          style={{
            width: "100%",
            "margin-top": "2vh",
            "border-radius": "1vh",
          }}
        />
      )}
    </div>
  );
}
