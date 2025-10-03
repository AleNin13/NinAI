import { useRef } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  compact?: boolean;
}

export default function FileUpload({ onFileUpload, compact }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    } else if (file) {
      alert('Please upload a PDF file');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-compact"
        />
        <label
          htmlFor="file-upload-compact"
          className="cursor-pointer bg-gray-100 text-gray-700 rounded-lg px-4 py-3 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          📎 Upload PDF
        </label>
      </>
    );
  }

  return (
    <div className="inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
      >
        📄 Upload PDF Document
      </label>
    </div>
  );
}
