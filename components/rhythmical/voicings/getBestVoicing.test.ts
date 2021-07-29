import { lefthand } from './dictionary'
import { topNoteDiff } from './generateVoicings'
import { getBestVoicing } from './getBestVoicing'

test('getBestVoicing', () => {
  expect(getBestVoicing('Dm7', lefthand, ['F3', 'A4'], topNoteDiff)).toEqual([
    'F3', 'A3', 'C4', 'E4'
  ])
  expect(getBestVoicing('Dm7', lefthand, ['F3', 'A4'], topNoteDiff, ['C4', 'E4', 'G4', 'B4'])).toEqual([
    'C4', 'E4', 'F4', 'A4',
  ])
})