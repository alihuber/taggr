import React from 'react';

const FilesContext = React.createContext({
  filePaths: [],
  setLoadedFiles: () => {},
  filesLoaded: false,
  filesMetadata: [],
  allSelected: false,
  setAllSelected: () => {},
  setMetadata: () => {},
  moreThanOneSelected: false,
  oneSelected: false,
  setMoreThanOneSelected: false,
  setOneSelected: false,
});

export const FilesProvider = FilesContext.Provider;
export const FilesConsumer = FilesContext.Consumer;
