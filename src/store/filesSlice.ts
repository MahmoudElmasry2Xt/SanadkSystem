import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SystemFile {
  id: string;
  name: string;
  category: 'Contracts' | 'Proposals' | 'Client Files' | 'Employee Files';
  size: string;
  uploadDate: string;
  type: string;
}

interface FilesState {
  files: SystemFile[];
}

const mockFiles: SystemFile[] = [
  { id: 'f1', name: 'عقد توريد برمجيات النور.pdf', category: 'Contracts', size: '2.4 MB', uploadDate: '2026-06-01', type: 'pdf' },
  { id: 'f2', name: 'العرض الفني والمالي - ريد للمقاولات.docx', category: 'Proposals', size: '1.8 MB', uploadDate: '2026-06-08', type: 'docx' },
  { id: 'f3', name: 'صور الهوية التجارية - لوجو سندك.zip', category: 'Client Files', size: '15.5 MB', uploadDate: '2026-06-11', type: 'zip' },
  { id: 'f4', name: 'مسوغات تعيين الموظف محمود عبد السلام.pdf', category: 'Employee Files', size: '4.2 MB', uploadDate: '2026-01-15', type: 'pdf' }
];

const initialState: FilesState = {
  files: mockFiles
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile(state, action: PayloadAction<Omit<SystemFile, 'id' | 'uploadDate'>>) {
      const newFile: SystemFile = {
        ...action.payload,
        id: 'f' + (state.files.length + 1),
        uploadDate: new Date().toISOString().split('T')[0]
      };
      state.files.unshift(newFile);
    },
    deleteFile(state, action: PayloadAction<string>) {
      state.files = state.files.filter(f => f.id !== action.payload);
    }
  }
});

export const { addFile, deleteFile } = filesSlice.actions;
export default filesSlice.reducer;
