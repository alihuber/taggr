import React from 'react';
import { mount } from 'enzyme';
import NumberingDialog from '../src/components/NumberingDialog';

beforeEach(() => {
  jest.resetModules();
});

const mockHandleClose = () => {};

const handleNumberingDialogClose = (storeZeros = false, storeTracks = false, filesContext = {}) => {
  const { filesMetadata } = filesContext;
  if (filesMetadata) {
    filesMetadata.forEach((data, idx) => {
      if (data.selected) {
        let trackNum = String(idx + 1);
        let trackCount = String(filesMetadata.length);
        let maxLength = String(filesMetadata.length).length;
        if (maxLength === 1) {
          maxLength = 2;
        }
        if (storeZeros && storeTracks) {
          trackNum = trackNum.padStart(maxLength, '0');
          if (filesMetadata.length < 10) {
            trackCount = trackCount.padStart(2, '0');
          }
          data.numbering = `${trackNum}/${trackCount}`;
        }
        if (storeZeros && !storeTracks) {
          trackNum = trackNum.padStart(maxLength, '0');
          data.numbering = trackNum;
        }
        if (!storeZeros && storeTracks) {
          data.numbering = `${trackNum}/${trackCount}`;
        }
        if (!storeZeros && !storeTracks) {
          data.numbering = trackNum;
        }
      }
    });
    filesContext.setMetadata(filesMetadata);
  }
};

const mockEmptyFilesContext = {};
const mockUnselectedNewFileEntry = {
  numbering: '',
  title: '',
  artist: '',
  fileName: '/home/foo/bar',
  albumArtist: '',
  album: '',
  genre: '',
  year: '',
  comment: '',
  cover: '',
  selected: false,
};
const mockSelectedNewFileEntry = {
  numbering: '',
  title: '',
  artist: '',
  fileName: '/home/foo/bar',
  albumArtist: '',
  album: '',
  genre: '',
  year: '',
  comment: '',
  cover: '',
  selected: true,
};
let mockMetadata = [];
mockMetadata.push(mockSelectedNewFileEntry);
const mockUnselectedMetadata = [];
mockUnselectedMetadata.push(mockUnselectedNewFileEntry);
const mockSingleMetadata = {
  filesMetadata: mockMetadata,
  setMetadata: data => (mockMetadata = data),
};
const mockUnselectedSingleMetadata = {
  filesMetadata: mockUnselectedMetadata,
};

test('NumberingDialog renders', () => {
  const dialog = mount(<NumberingDialog open={true} handleClose={mockHandleClose} filesContext={mockEmptyFilesContext} />);
  expect(dialog.find('button').text()).toContain('Apply');
});

test('NumberingDialog does nothing when unselected', () => {
  const dialog = mount(<NumberingDialog open={true} handleClose={mockHandleClose} filesContext={mockUnselectedSingleMetadata} />);
  dialog
    .find('input')
    .first()
    .simulate('change');
  dialog
    .find('input')
    .last()
    .simulate('change');
  dialog.find('button').simulate('click');
  expect(mockSelectedNewFileEntry.numbering).toEqual('');
});

test('NumberingDialog sets nn/nn when all is checked, even when n < 10', () => {
  const dialog = mount(<NumberingDialog open={true} handleClose={handleNumberingDialogClose} filesContext={mockSingleMetadata} />);
  dialog
    .find('input')
    .first()
    .simulate('change');
  dialog
    .find('input')
    .last()
    .simulate('change');
  dialog.find('button').simulate('click');
  expect(mockSelectedNewFileEntry.numbering).toEqual('01/01');
});

test('NumberingDialog sets n when nothing is checked', () => {
  const dialog = mount(<NumberingDialog open={true} handleClose={handleNumberingDialogClose} filesContext={mockSingleMetadata} />);
  dialog.find('button').simulate('click');
  expect(mockSelectedNewFileEntry.numbering).toEqual('1');
});

test('NumberingDialog sets nn when first is checked, even n < 10', () => {
  const dialog = mount(<NumberingDialog open={true} handleClose={handleNumberingDialogClose} filesContext={mockSingleMetadata} />);
  dialog
    .find('input')
    .first()
    .simulate('change');
  dialog.find('button').simulate('click');
  expect(mockSelectedNewFileEntry.numbering).toEqual('01');
});

test('NumberingDialog sets n/n when second is checked', () => {
  const dialog = mount(<NumberingDialog open={true} handleClose={handleNumberingDialogClose} filesContext={mockSingleMetadata} />);
  dialog
    .find('input')
    .last()
    .simulate('change');
  dialog.find('button').simulate('click');
  expect(mockSelectedNewFileEntry.numbering).toEqual('1/1');
});

// ensure you're resetting modules before each test
// Takes the context data we want to test, or uses defaults
// const getLanguageSelectorWithContext = (context = {languages: ['en', 'fr', 'es'], activeLanguage: 'en'}) => {

//   // Will then mock the LocalizeContext module being used in our LanguageSelector component
//   jest.doMock('./LocalizeContext', () => {
//     return {
//       LocalizeContext: {
//         Consumer: (props) => props.children(context)
//       }
//     }
//   });

//   // you need to re-require after calling jest.doMock.
//   // return the updated LanguageSelector module that now includes the mocked context
//   return require('./LanguageSelector').LanguageSelector;
// };

// describe('<LanguageSelector />', () => {
//   it('should return default list of languages', () => {
//     // This will use the default context param since we pass nothing
//     const LanguageSelector = getLanguageSelectorWithContext();
//     const wrapper = mount(<LanguageSelector />);
//     expect(wrapper.find('li').length).toBe(3);
//   });

//   it('should render no languages', () => {
//     // Here we override the context with the values we want for this specific test
//     const LanguageSelector = getLanguageSelectorWithContext({languages: [], activeLanguage: null});
//     const wrapper = mount(<LanguageSelector />);
//     expect(wrapper.find('li').length).toBe(0);
//   });
// });
