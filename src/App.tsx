import Home from "./screens/Home";

let audioUnlocked = false;

export function unlockAudio() {
  if (audioUnlocked) return;

  const audio = new Audio("/alarm.mp3");
  audio.muted = true;

  audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      audioUnlocked = true;
      console.log("Audio unlocked");
    })
    .catch(console.error);
}

const alarmAudio = new Audio("/alarm.mp3");

export function playAlarm() {
  alarmAudio.currentTime = 0;
  alarmAudio.play().catch(console.error);
}

export default function App() {
  return <Home />;
}
