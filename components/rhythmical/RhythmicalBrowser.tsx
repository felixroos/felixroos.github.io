import { Switch } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import standards from '../../posts/ireal/jazz1350.json';
// import pop400 from '../../posts/ireal/pop400.json';
import { toTonalChord } from '../common/toTonalChord';
import { getPlaylist, getSheet } from '../ireal/RealParser';
import SheetGrid from '../score/SheetGrid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SongList from './SongList';
import RhythmicalComposer from './RhythmicalComposer';

export default function RhythmicalBrowser() {
  const [songs, setSongs] = useState<any>();
  const [song, setSong] = useState<any>();
  const [sheet, setSheet] = useState<any>();
  const [chords, setChords] = useState<any>([]);
  const [showScales, setShowScales] = useState(false);
  const songList = useMemo(() => songs && <SongList songs={songs} onSelect={selectSong} />, [songs]);
  useEffect(() => {
    console.log('load playlist..');
    const list = getPlaylist(standards);
    setSongs(list.songs);
    selectSong(randomElement(list.songs));
  }, []);

  function selectSong(song) {
    console.log('select song', song);
    const _sheet = getSheet(song);
    const _chords = _sheet.map(({ body }: any) => body.map(toTonalChord));
    // console.log('chords', _chords);
    setSong(song);
    setSheet(_sheet);
    setChords(_chords);
  }

  return (
    <Card elevation={3}>
      <CardContent style={{ width: '100%', overflow: 'auto' }}>
        {song && (
          <>
            <h3>
              {song.composer} - {song.title}
            </h3>
            <p>Style: {song.style}</p>
            <label>
              chords
              <Switch checked={showScales} color="default" onChange={(e) => setShowScales(e.target.checked)} />
              scales
            </label>
            {sheet && (
              <SheetGrid
                showScales={showScales}
                rows={[1, 1, 1, 1]}
                measures={chords}
                rawText={true}
                loop={true}
                innerBorders={false}
              />
            )}
            {chords && <RhythmicalComposer chords={chords} />}
          </>
        )}
        {songList}
      </CardContent>
    </Card>
  );
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
