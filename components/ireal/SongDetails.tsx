import React from 'react';
import { getSheet } from './RealParser';
import { Snippet } from 'leetsheet/lib/Snippet';

export default function SongDetail({ song, expand = false, options }) {
  const sheet = getSheet(song, expand, options);
  let snippet = Snippet.from(sheet);
  return <pre>{snippet}</pre>;
}
