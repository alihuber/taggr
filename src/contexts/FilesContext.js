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
});

export const FilesProvider = FilesContext.Provider;
export const FilesConsumer = FilesContext.Consumer;
