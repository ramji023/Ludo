import { Outlet } from "react-router-dom";
import AudioManager from "../../audioManager";
import useSocketStore from "../../store/SocketStore";

export default function Layout() {
  const audio = new AudioManager();

  const setAudioManager = useSocketStore((s) => s.setAudioManager); // update audio manager
  setAudioManager(audio);
  audio.preload(
    "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981644/lobbySound_vufxrq.mp3",
  );
  audio.preload(
    "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981643/start_mudwqg.mp3",
  );
  audio.preload(
    "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981643/rolling_cssnt7.mp3",
  );
  audio.preload(
    "https://res.cloudinary.com/dqr7qcgch/video/upload/v1769921939/snake-hiss-4-quicksoundscom-ypwaqg_OPdi99Xh_qs1vku.mp3",
  );

  audio.preload("https://res.cloudinary.com/dqr7qcgch/video/upload/v1769921271/move-itcn9d_8oJkSMIx_v7k1cn.mp3")

  audio.preload("https://res.cloudinary.com/dqr7qcgch/video/upload/v1769922435/ochoochogift-winner-laugh-154997_pcmr4d.mp3");

  audio.preload("https://res.cloudinary.com/dqr7qcgch/video/upload/v1769923713/winning-218995_rtzqnf.mp3")
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/*background image*/}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/ludo-bg/ludo-bg (3).jpg')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* ludo logo  */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <img
            src="/ludo-bg/ludo_logo.png"
            alt="Ludo Master Logo"
            className="w-25 h-25 object-contain"
          />
        </div>
        {/* render children component  */}
        <Outlet />
      </div>
    </>
  );
}
