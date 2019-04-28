import React from 'react';

const AttributesContext = React.createContext({
  titleValue: '',
  artistValue: '',
  albumArtistValue: '',
  albumValue: '',
  genreValue: '',
  yearValue: '',
  commentValue: '',
  setFieldValue: () => {},
  getFieldValue: () => {},
});

export const AttributesProvider = AttributesContext.Provider;
export const AttributesConsumer = AttributesContext.Consumer;
