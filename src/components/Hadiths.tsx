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
    <div class="text-center bg-white h-full flex flex-col justify-center p-3">
      <div class="text-black text-[4.5rem]">
        {hadith()?.text || "Loading hadith..."}
      </div>

      <div class="text-green-800 text-[2rem]">
        {hadith()?.source ? `— ${hadith()?.source}` : ""}
      </div>
    </div>
  );
};

export default Hadiths;
