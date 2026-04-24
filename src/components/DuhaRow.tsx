import { padZero } from "../utils/time";

export default function DuhaRow(props: { dateDuha: Date; dateSyuruk?: Date }) {
  return (
    <div class="bg-white px-[3vw] pb-5 flex flex-row text-[2.7vh] items-center justify-between">
      {/* Left column: Duha */}
      <div class="flex flex-col items-center justify-start leading-[1.3]">
        <div
          class="font-black text-[3.7vh] font-[Cairo] text-green-800 text-left"
          dir="rtl"
        >
          يبدأ الضحى الساعة
        </div>

        <div class="text-green-800">DUHA BERMULA</div>

        <div class="text-[6.5vh] font-medium text-green-800">
          {padZero(props.dateDuha.getHours())}:
          {padZero(props.dateDuha.getMinutes())}
        </div>
      </div>

      {/* Right column: Syuruk */}
      <div class="flex flex-col items-center justify-end leading-[1.3]">
        <div
          class="font-black text-[3.7vh] font-[Cairo] text-green-800"
          dir="rtl"
        >
          الشروق
        </div>

        <div class="text-green-800 text-right">MATAHARI TERBIT</div>

        <div class="text-[6.5vh] font-medium text-right text-[#c0392b]">
          {props.dateSyuruk
            ? `${padZero(props.dateSyuruk.getHours())}:${padZero(
                props.dateSyuruk.getMinutes(),
              )}`
            : "N/A"}
        </div>
      </div>
    </div>
  );
}
