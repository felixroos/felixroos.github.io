import { Scale } from '@tonaljs/tonal';
import oneOfModes from './oneOfModes';

export default (...families) => Scale.names().filter(oneOfModes(families));