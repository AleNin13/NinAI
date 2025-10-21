import { useRef, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  compact?: boolean;
}

export default function FileUpload({ onFileUpload, compact }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setLoading(true);
      try {
        await onFileUpload(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
      } finally {
        setLoading(false);
      }
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
        disabled={loading}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer inline-flex items-center bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          '📄'
        )}{' '}
        {loading ? 'Uploading...' : 'Upload PDF Document'}
      </label>
    </div>
  );
}
