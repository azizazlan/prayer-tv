import { createSignal, onMount } from "solid-js";

type Hadith = {
  id: number;
  text: string;
  source?: string;
};

const Hadiths = () => {
  const [hadith, setHadith] = createSignal<Hadith | null>(null);

  const fetchHadith = async () => {
    try {
      const response = await fetch("/data/hadiths.json");
      const hadiths: Hadith[] = await response.json();

      if (hadiths.length > 0) {
        const randomIndex = Math.floor(Math.random() * hadiths.length);
        setHadith(hadiths[randomIndex]);
      }
    } catch (error) {
      console.error("Error loading hadith:", error);
    }
  };

  onMount(() => {
    fetchHadith();
  });

  return (
    <div style={{ "margin-top": "2rem", "text-align": "center" }}>
      <div style={{ color: "black", "font-size": "2.7rem" }}>
        {hadith()?.text || "Loading hadith..."}
      </div>
      <div style={{ color: "darkgreen", "font-size": "2rem" }}>
        {hadith()?.source ? `— ${hadith()?.source}` : ""}
      </div>
    </div>
  );
};

export default Hadiths;
