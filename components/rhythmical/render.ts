import { tieReducer } from './reducers';
import { inheritProperty } from './features/inherit';
import { renderRhythmObject } from './rhythmical';

export const renderRhythm = (json) =>
  renderRhythmObject({ ...json }, [inheritProperty('instrument')]).reduce(tieReducer(), []);