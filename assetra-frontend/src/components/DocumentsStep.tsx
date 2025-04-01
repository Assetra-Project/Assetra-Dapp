import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DocumentsStepProps {
  onNext: () => void;
}

export default function DocumentsStep({ onNext }: DocumentsStepProps) {
  const [clientPhoto, setClientPhoto] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'id') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'photo') {
        setClientPhoto(file);
      } else {
        setIdDocument(file);
      }
    }
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Photo <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-2 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Upload className="mx-auto h-12 w-12" />
                </div>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => handleFileChange(e, 'photo')}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG, PDF up to 4.8MB</p>
              </div>
            </div>
          </div>
          {clientPhoto && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: {clientPhoto.name}
            </p>
          )}
        </div>

        {/* ID Document Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Identification Document (Front and Back Side) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-2 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Upload className="mx-auto h-12 w-12" />
                </div>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => handleFileChange(e, 'id')}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG, PDF up to 4.8MB</p>
              </div>
            </div>
          </div>
          {idDocument && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: {idDocument.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Next
          <FileText className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}