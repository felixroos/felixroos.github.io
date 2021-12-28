import React, { useState, useEffect } from 'react';
import iRealReader from 'ireal-reader';
import JSONViewer from '../common/JSONViewer';
import { Measure } from 'leetsheet/lib/Measure';
import { RealParser } from 'leetsheet/lib/RealParser';
import { Sheet } from 'leetsheet/lib/Sheet';
import { Snippet } from 'leetsheet/lib/Snippet';
import TextField from '@material-ui/core/TextField';
import D3Shell from '../common/D3Shell';
import treeMap from '../common/treeMap';
import {
  countUnique,
  parseChords,
  includesChords,
  parseTransitions,
  includesTransitions,
  averageRegularity,
  unique,
} from './analytics';
import DynamicTable, { sortString } from '../common/DynamicTable';

const songFields = [
  {
    property: 'title',
    sort: sortString,
  },
  {
    property: 'composer',
    sort: sortString,
  },
  {
    property: 'key',
    sort: sortString,
  },
  {
    property: 'style',
    sort: sortString,
  },
];

function scaleValue(value: number, start: number, end: number) {
  if ([value, start, end].map((v) => typeof v).includes('undefined')) {
    return value;
  }
  return (value - start) / (end - start);
}

const regularityField = (start?, end?) => ({
  property: 'regularity',
  display: (v) => `${Math.round(scaleValue(v, start, end) * 10000) / 100}%`,
  sort: (a, b) => b - a,
  defaultOrder: 'desc',
});

export function RealReader({ url }) {
  const playlist = iRealReader(decodeURI(url));
  return <JSONViewer src={playlist} collapsed={4} />;
}

export function getSheet(song, expand?, options?) {
  if (!song) {
    return;
  }
  let sheet = RealParser.parseSheet(song.music.raw).map((m) => {
    m = Measure.from(m);
    if (m.section === 'i') {
      m.section = 'IN';
      // m.body = ['XXX'];
    }
    return m;
  });
  if (expand) {
    sheet = Sheet.render(sheet, options);
  }
  return sheet;
}

export function RealRenderer({ url }) {
  const playlist = iRealReader(decodeURI(url));
  const song = playlist.songs[0];
  const sheet = getSheet(song);
  return <JSONViewer src={sheet} collapsed={1} />;
}

export function SheetSnippet({ url, expand, options }) {
  const playlist = iRealReader(decodeURI(url));
  const song = playlist.songs[0];
  const sheet = getSheet(song, expand, options);
  const snippet = Snippet.from(sheet);
  return <pre className="language-md">{snippet}</pre>;
}

export function RealSongs({ url, onChange }) {
  const [playlist, setPlaylist] = useState<any>({ songs: [] });
  useEffect(() => {
    if (onChange) {
      onChange;
    }
    setPlaylist(getPlaylist(url));
  }, [url]);
  function getPlaylist(url) {
    const list = url ? iRealReader(decodeURI(url)) : { songs: [] };
    if (onChange) {
      onChange(list);
    }
    return list;
  }
  return (
    <>
      <TextField
        label="URL"
        type="url"
        value={url}
        variant="filled"
        style={{ width: '100%' }}
        onChange={(e) => {
          const p = getPlaylist(e.target.value);
          setPlaylist(p);
        }}
      />
    </>
  );
}

export function getPlaylist(url) {
  return url ? iRealReader(decodeURI(url)) : { songs: [] };
}

export function RealPlaylist({ url, onChange }) {
  const [playlist, setPlaylist] = useState<any>(getPlaylist(url));
  const [songIndex, setSongIndex] = useState(0);
  return (
    <>
      <TextField
        label="URL"
        type="url"
        value={url}
        variant="filled"
        style={{ width: '100%' }}
        onChange={(e) => {
          const list = getPlaylist(e.target.value);
          if (onChange) {
            onChange(list);
          }
          setPlaylist(list);
        }}
      />
      {playlist?.songs?.length && (
        <>
          <TextField
            variant="filled"
            select
            label={`${playlist?.songs?.length} Songs`}
            style={{ width: '100%' }}
            value={songIndex}
            SelectProps={{
              native: true,
            }}
            onChange={(e) => setSongIndex(parseInt(e.currentTarget.value))}
          >
            {playlist.songs.map((song, index) => (
              <option key={index} value={index}>
                #{index + 1}: {song.composer} - {song.title}
              </option>
            ))}
          </TextField>
          <br />
          <pre className="language-md">{Snippet.from(getSheet(playlist.songs[songIndex]))}</pre>
        </>
      )}
    </>
  );
}

export function RealRanking(props) {
  const [ranking, setRanking] = useState([]);
  const [property, setProperty] = useState(props.property);
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState([]);
  useEffect(() => setProperty(props.property), [props.property]);
  function handleChange(_songs = songs, _property = property) {
    setSongs(_songs);
    setProperty(_property);
    const c = countUnique(_songs.map((song) => song[_property]))
      .sort((a, b) => b.count - a.count) // sort by count
      .slice(0, 20); // only use top 20
    setRanking(c);
  }
  const properties = ['composer', 'style', 'key'];
  const filteredSongs = songs.filter(({ [property]: prop }) => selected.includes(prop));
  return (
    <>
      <h3>top {property} ranking</h3>
      <RealSongs url={props.url} onChange={(list) => handleChange(list.songs)} />
      <TextField
        variant="filled"
        select
        label="Ranked Property"
        style={{ width: '100%' }}
        value={property}
        SelectProps={{
          native: true,
        }}
        onChange={(e) => {
          handleChange(songs, e.currentTarget.value);
        }}
      >
        {properties.map((property, index) => (
          <option key={index} value={property}>
            {property}
          </option>
        ))}
      </TextField>
      <D3Shell
        render={(container) => {
          return treeMap(container, {
            children: ranking.map(({ value, count }, index) => ({
              name: `${value} (${count})`,
              value: count,
              id: value,
              selected: selected.includes(value),
              onClick: () =>
                setSelected(selected.includes(value) ? selected.filter((s) => s !== value) : selected.concat([value])),
            })),
          });
        }}
      />
      {!!selected.length && <DynamicTable orderedBy="title" cols={songFields} rows={filteredSongs} />}
    </>
  );
}

export function RealChords(props) {
  const [songs, setSongs] = useState([]);
  const [chords, setChords] = useState([]);
  const [relative, setRelative] = useState(true);
  const [normalize, setNormalize] = useState(true);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    const _chords = parseChords(songs, relative);
    console.log('chords', _chords);
    setChords(_chords.slice(0, 45));
  }, [songs, relative]);
  let [start, end] = [Infinity, 0];
  const filteredSongs = songs.filter(includesChords(selected, relative)).map((song) => {
    const regularity = averageRegularity(
      parseChords([song], relative).map((t) => t.value),
      chords
    );
    start = start < regularity ? start : regularity;
    end = end > regularity ? end : regularity;
    return {
      ...song,
      regularity,
    };
  });
  if (!normalize) {
    start = undefined;
    end = undefined;
  }
  // const regularityBounds = filteredSongs
  return (
    <>
      <RealSongs url={props.url} onChange={(list) => setSongs(list.songs)} />
      <D3Shell
        render={(container) => {
          return treeMap(container, {
            children: chords.map(({ value, count, regularity }) => ({
              name: `${value} (${Math.round(regularity * 10000) / 100}%)`,
              value: count,
              id: value,
              selected: selected.includes(value),
              onClick: () =>
                setSelected(selected.includes(value) ? selected.filter((s) => s !== value) : selected.concat([value])),
            })),
          });
        }}
      />
      <div style={{ float: 'right' }}>
        <label>
          <input type="checkbox" checked={normalize} onChange={(e) => setNormalize(e.target.checked)} />
          Normalize
        </label>
        <label>
          <input type="checkbox" checked={relative} onChange={(e) => setRelative(e.target.checked)} />
          Relative
        </label>
      </div>
      {filteredSongs.length} matching Songs
      <div style={{ overflow: 'auto', clear: 'both', maxHeight: '310px' }}>
        <DynamicTable
          orderedBy="regularity"
          cols={[regularityField(start, end), ...songFields]}
          rows={filteredSongs.sort((a, b) => b.regularity - a.regularity)}
        />
      </div>
    </>
  );
}

export function RealTransitions(props) {
  const [songs, setSongs] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [relative, setRelative] = useState(true);
  const [normalize, setNormalize] = useState(true);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    const t = parseTransitions(songs, relative).slice(0, 45);
    setTransitions(t);
  }, [songs, relative]);
  let [start, end] = [Infinity, 0];
  const filteredSongs = songs.filter(includesTransitions(selected, relative)).map((song) => {
    const regularity = averageRegularity(
      parseTransitions([song], relative).map((t) => t.value),
      transitions
    );
    start = start < regularity ? start : regularity;
    end = end > regularity ? end : regularity;
    return {
      ...song,
      regularity,
    };
  });
  if (!normalize) {
    start = undefined;
    end = undefined;
  }
  return (
    <>
      <RealSongs url={props.url} onChange={(list) => setSongs(list.songs)} />
      <D3Shell
        render={(container) => {
          return treeMap(container, {
            children: transitions.map(({ value, count, regularity }) => ({
              name: `${value} (${Math.round(regularity * 10000) / 100}%)`,
              value: count,
              id: value,
              selected: selected.includes(value),
              onClick: () =>
                setSelected(selected.includes(value) ? selected.filter((s) => s !== value) : selected.concat([value])),
            })),
          });
        }}
      />
      <div style={{ float: 'right' }}>
        <label>
          <input type="checkbox" checked={normalize} onChange={(e) => setNormalize(e.target.checked)} />
          Normalize
        </label>
        <label>
          <input type="checkbox" checked={relative} onChange={(e) => setRelative(e.target.checked)} />
          Relative
        </label>
      </div>
      {filteredSongs.length} matching Songs
      <div style={{ overflow: 'auto', maxHeight: '310px' }}>
        <DynamicTable
          orderedBy="regularity"
          cols={[regularityField(start, end), ...songFields]}
          rows={filteredSongs.sort((a, b) => b.regularity - a.regularity)}
        />
      </div>
    </>
  );
}

export function RealDiversity(props) {
  const [songs, setSongs] = useState([]);
  return (
    <>
      <RealSongs url={props.url} onChange={(list) => setSongs(list.songs)} />
      <div style={{ overflow: 'auto', maxHeight: '310px' }}>
        {songs.length} Songs
        <DynamicTable
          orderedBy="uniqueChords"
          cols={[
            {
              property: 'uniqueChords',
              sort: (a, b) => a - b,
              defaultOrder: 'asc',
            },
            ...songFields,
          ]}
          rows={songs
            .map((song) => ({
              ...song,
              uniqueChords: unique(song.music.measures.flat()).length,
            }))
            .sort((a, b) => b.uniqueChords - a.uniqueChords)}
        />
      </div>
    </>
  );
}
