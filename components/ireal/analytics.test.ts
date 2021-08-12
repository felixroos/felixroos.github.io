import iRealReader from 'ireal-reader';
import { parseChords } from './analytics'
import standards from '../../posts/ireal/realbook1.json';


describe('parseSongs', () => {
  const playlist = iRealReader(decodeURI(standards));
  test('realParser', () => {
    expect(playlist.songs.length).toEqual(284) // number of songs in realbook 1
  })
  test('parseChords', () => {
    const chords = parseChords(playlist.songs);
    expect(chords.length).toEqual(52) // number of different chord symbols in realbook 1
    expect(chords.map(({ value }) => value)).toEqual(["7", "-7", "^7", "7b9", "h7", "6", "-", "7sus", "M", "o7", "-6", "^7#11", "7#11", "-11", "-^7", "7#9", "7#5", "13", "7alt", "7b13", "^9", "sus", "o", "9sus", "-9", "9", "h", "-b6", "7#9#5", "13b9", "^7#5", "69", "7b5", "7b9sus", "7b13sus", "9#5", "13sus", "7b9b13", "7b9b5", "^9#11", "7#9b5", "9#11", "add9", "-69", "7susadd3", "9b5", "7b9#9", "5", "+", "13#11", "-7b5", "7b9#11"])
    // TODO: test regularity + count values
    console.log('chords', chords);
  })
})


