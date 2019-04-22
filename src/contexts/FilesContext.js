import React from 'react';

const FilesContext = React.createContext({ filePaths: [], setLoadedFiles: () => {}, filesLoaded: false });

export const FilesProvider = FilesContext.Provider;
export const FilesConsumer = FilesContext.Consumer;
