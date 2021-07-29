import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function SongList({ songs, onSelect }) {
  console.log('render songlist..');
  return (
    <div
      style={{
        maxHeight: '300px',
        overflow: 'auto',
        marginTop: '10px',
        border: '1px solid #efefef',
      }}
    >
      <List component="nav" dense={true} style={{ backgroundColor: '#fff' }}>
        {songs.map((song, i) => (
          <ListItem button onClick={() => onSelect(song)} key={i}>
            <ListItemText
              primary={
                <>
                  {song.composer} - {song.title}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
