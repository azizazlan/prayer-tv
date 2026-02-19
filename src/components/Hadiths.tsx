import { createSignal, onMount } from "solid-js";
import saw from "../assets/saw.svg";

type Hadith = {
  id: number;
  text: string;
  source?: string;
};

const Hadiths = () => {
  const [hadith, setHadith] = createSignal<Hadith | null>(null);

  const fetchHadith = async () => {
    try {
      const res = await fetch("http://localhost:3000/hadiths/random");
      const data = await res.json();
      console.log(data);
      setHadith(data);
    } catch (error) {
      console.error("Failed to fetch hadith:", error);
    }
  };

  onMount(() => {
    fetchHadith();
  });

  return (
    <div class="hadith">
      <div class="hadithText">{hadith()?.text || "Loading hadith..."}</div>
      <div class="hadithSource">{hadith()?.source || ""}</div>
    </div>
  );
};

export default Hadiths;
