import WebMidi from 'webmidi';

export default function enableWebMidi() {
  return new Promise((resolve, reject) => {
    if (WebMidi.enabled) {
      resolve(WebMidi)
      return;
    }
    WebMidi.enable((err) => {
      if (err) {
        reject(err)
      }
      resolve(WebMidi);
    })
  });
}