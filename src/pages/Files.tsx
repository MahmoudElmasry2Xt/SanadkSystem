import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type SystemFile } from '../store/useAppStore';
import { Folder, FileText, Upload, Trash2, X, Archive } from 'lucide-react';

export const Files: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const { files, addFile, deleteFile } = useAppStore();

  const [activeFolder, setActiveFolder] = useState<SystemFile['category'] | 'All'>('All');
  const [formOpen, setFormOpen] = useState(false);

  // Form State
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<SystemFile['category']>('Contracts');

  const folders: SystemFile['category'][] = ['Contracts', 'Proposals', 'Client Files', 'Employee Files'];

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    
    // Auto-detect extension
    const ext = fileName.split('.').pop() || 'pdf';
    
    addFile({
      name: fileName,
      category,
      size: '1.0 MB',
      type: ext
    });

    setFormOpen(false);
    setFileName('');
  };

  const filteredFiles = activeFolder === 'All'
    ? files
    : files.filter(f => f.category === activeFolder);

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('files')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'مستودع الوثائق: تصنيف وتخزين العقود، العروض الفنية، وملفات العملاء.' : 'Manage client contracts and documents.'}
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          <span>{isRtl ? 'رفع مستند جديد' : 'Upload File'}</span>
        </button>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          onClick={() => setActiveFolder('All')}
          className={`custom-card p-4 cursor-pointer text-center flex flex-col items-center justify-center gap-2 border-t-4 transition-all ${
            activeFolder === 'All' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <Archive className="w-6 h-6 text-red-600" />
          <span className="font-bold text-xs text-gray-900">{isRtl ? 'كل الملفات' : 'All Files'}</span>
          <span className="text-[10px] text-gray-400 font-semibold">{files.length} {isRtl ? 'مستند' : 'files'}</span>
        </div>

        {folders.map((folder) => {
          const count = files.filter(f => f.category === folder).length;
          return (
            <div
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`custom-card p-4 cursor-pointer text-center flex flex-col items-center justify-center gap-2 border-t-4 transition-all ${
                activeFolder === folder ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
              }`}
            >
              <Folder className="w-6 h-6 text-red-600 fill-red-50/50" />
              <span className="font-bold text-xs text-gray-900 truncate w-full">{folder}</span>
              <span className="text-[10px] text-gray-400 font-semibold">{count} {isRtl ? 'مستند' : 'files'}</span>
            </div>
          );
        })}
      </div>

      {/* File Ledger List */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white">
          <span className="font-bold text-xs text-gray-900">
            {activeFolder === 'All' ? (isRtl ? 'مستودع الملفات العام' : 'General File Explorer') : activeFolder}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'اسم الملف' : 'Filename'}</th>
                <th className="p-4 text-start">{isRtl ? 'المجلد / القسم' : 'Folder Category'}</th>
                <th className="p-4 text-start">{isRtl ? 'حجم الملف' : 'File Size'}</th>
                <th className="p-4 text-start">{t('date')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{file.category}</td>
                  <td className="p-4 text-gray-500 font-mono">{file.size}</td>
                  <td className="p-4 text-gray-500 font-mono">{file.uploadDate}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    لا يوجد ملفات في هذا المجلد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload File Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleUploadFile}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-black text-gray-900 text-sm mb-6">{isRtl ? 'تسجيل مستند جديد بالمستودع' : 'Register Document'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'اسم الملف (مع الامتداد)' : 'Filename (with extension)'}</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="custom-input text-xs"
                  placeholder="عقد صيانة.pdf"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{isRtl ? 'المجلد المستهدف' : 'Category Folder'}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="custom-input text-xs"
                >
                  <option value="Contracts">Contracts</option>
                  <option value="Proposals">Proposals</option>
                  <option value="Client Files">Client Files</option>
                  <option value="Employee Files">Employee Files</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {isRtl ? 'إرسال وتسجيل المستند' : 'Register'}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
