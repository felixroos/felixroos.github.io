import canUseDOM from '../components/canUseDOM'
import { rack } from '../components/rhythmical/instruments/rack';

export default {
  load: async () => {
    const samples = {
      bd: "../samples/tidal/bd/BT0A0D0.wav",
      sn: "../samples/tidal/sn/ST0T0S3.wav",
      hh: "../samples/tidal/hh/000_hh3closedhh.wav",
      cp: "../samples/tidal/cp/HANDCLP0.wav",
      mt: "../samples/tidal/mt/MT0D3.wav",
      ht: "../samples/tidal/ht/HT0D3.wav",
      lt: "../samples/tidal/lt/LT0D3.wav",
    }
    return canUseDOM() && (await rack(samples, { volume: -20 })()).toDestination();
  }
}