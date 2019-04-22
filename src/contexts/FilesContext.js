import React from 'react';

const FilesContext = React.createContext({ filePaths: [], setLoadedFiles: () => {}, filesLoaded: false, filesMetadata: [] });

export const FilesProvider = FilesContext.Provider;
export const FilesConsumer = FilesContext.Consumer;
