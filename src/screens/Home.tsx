import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerList from "../components/PrayerList";
import NextAzan from "../components/NextAzan";
import Duha from "../components/Duha";
import "../styles/home.css";

export default function Home() {
  return (
    <div class="screen">
      <Clock />
      <DateInfo />
      <PrayerList />
      <Duha />
      <NextAzan />
    </div>
  );
}
