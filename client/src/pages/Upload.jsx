import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import { UploadCloud, File, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function UploadPage() {
  const { isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    setError('');
    setSuccess('');
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      if (selected.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        return;
      }
      setFile(selected);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUpload = async () => {
    console.log("Upload button clicked!");
    if (!file) {
      console.log("No file selected.");
      return;
    }

    console.log("Setting isUploading to true");
    setIsUploading(true);
    setError('');

    try {
      console.log("Getting Clerk token...");
      const token = await getToken();
      console.log("Token received.");

      const formData = new FormData();
      formData.append('file', file);

      console.log("Sending API request to backend...");
      const res = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Upload successful:", res.data);

      setSuccess('Document uploaded and processed successfully!');
      setTimeout(() => {
        navigate(`/chat/${res.data.document.id}`);
      }, 1500);

    } catch (err) {
      console.error('Upload Error Details:', err);
      if (err.response) {
        console.error('Backend returned an error:', err.response.data);
        setError(err.response.data.error || 'Failed to upload document.');
      } else if (err.request) {
        console.error('No response received from backend (CORS or server down):', err.request);
        setError('Could not connect to the server. Please ensure the backend is running.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Failed to setup upload request.');
      }
    } finally {
      console.log("Upload process finished, setting isUploading to false");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-73px)] -mt-8">
      <div className="bg-[var(--color-referrd-green)] flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden">
        <div className="w-full max-w-[800px] opacity-100 scale-90 md:scale-110">
          <lottie-player
            src="/uploadscreen.json"
            background="transparent"
            speed="1"
            style={{ width: '100%', height: '100%' }}
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>

      {/* Right Side: Upload Interface */}
      <div className="bg-white flex flex-col items-center justify-center p-8 md:p-16 border-l border-slate-200">

        {!isSignedIn ? (
          <div className="w-full max-w-md">
            <h3 className="text-3xl font-bold tracking-tighter mb-4 text-black text-center">Get Started</h3>
            <p className="text-black/60 mb-8 text-center text-lg">Sign in or create an account to start uploading your documents.</p>
            <SignInButton mode="modal">
              <button className="w-full py-4 px-6 bg-black text-white font-semibold rounded-md hover:bg-neutral-800 transition-colors">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col">
            <h3 className="text-3xl font-bold tracking-tighter mb-8 text-black text-center">Upload Document</h3>

            <div
              {...getRootProps()}
              className={`
                relative flex flex-col items-center justify-center p-16 border-2 border-dashed transition-all duration-200 bg-white
                ${isDragActive ? 'border-black bg-slate-50' : 'border-slate-300 hover:border-black cursor-pointer'}
                ${file ? 'border-black' : ''}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />

              {file ? (
                <div className="flex flex-col items-center text-black">
                  <File className="h-16 w-16 mb-4 stroke-1" />
                  <p className="font-bold text-lg text-center break-all">{file.name}</p>
                  <p className="text-sm text-black/60 mt-2 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-black">
                  <UploadCloud className="h-16 w-16 mb-6 stroke-1" />
                  <p className="text-xl font-bold tracking-tight mb-2">
                    {isDragActive ? 'Drop it here' : 'Select a PDF'}
                  </p>
                  <p className="text-black/60 font-medium">or drag & drop it here</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-md flex items-center justify-center gap-3 font-medium border border-red-100">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-[var(--color-referrd-light)] text-indigo-900 rounded-md flex items-center justify-center gap-3 font-medium border border-indigo-100">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {file && (
              <button
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={isUploading}
                className="mt-8 w-full py-4 px-6 bg-black text-white font-bold rounded-md hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 tracking-wide"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upload and Process'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
