import { createMemo } from "solid-js";
import saw from "../assets/saw.svg";

const Hadith = () => {
  return (
    <div class="hadith">
      <div class="hadithHeader">
        Daripada Abu Hurairah RA, beliau berkata, Rasulullah
        <img src={saw} style={{ width: "50px", height: "auto" }} />
        bersabda:
      </div>
      <div class="hadithText">
        “Allah SWT berfirman (hadith qudsi): Setiap amalan anak Adam adalah
        untuk dirinya melainkan puasa. Sesungguhnya puasa itu milik-Ku (Allah)
        dan Akulah yang akan membalasnya.”
      </div>
      <div class="hadithSource">
        Muttafaqun ‘Alayhi, riwayat al-Bukhari, Kitab ash-Shaum, Bab Hal Yaqulu
        Inni Shaimun Iza Sutima, no. 1904, Muslim, Kitab ash-Shiyam, Bab Fadhlu
        ash-Shiyam, no. 1151
      </div>
    </div>
  );
};

export default Hadith;
