import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Calendar, Loader2, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function Dashboard() {
  const { getToken } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const token = await getToken();
      const res = await api.get('/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const token = await getToken();
      await api.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full py-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6 border-b border-black pb-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-black mb-2">Dashboard</h1>
          <p className="text-black/60 text-lg">Manage your uploaded PDFs and knowledge base.</p>
        </div>
        <Link 
          to="/"
          className="px-6 py-4 bg-black text-white font-bold tracking-tight rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-2"
        >
          Upload New Document
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[var(--color-referrd-light)] border border-black rounded-md">
          <FileText className="h-16 w-16 mb-6 stroke-1 text-black" />
          <h3 className="text-3xl font-bold tracking-tighter text-black mb-4">No documents yet</h3>
          <p className="text-black/60 mb-8 text-center text-lg max-w-md">
            Upload your first PDF document to start chatting and extracting insights.
          </p>
          <Link 
            to="/"
            className="px-6 py-4 bg-white border border-black text-black font-bold rounded-md hover:bg-black hover:text-white transition-colors"
          >
            Go to Upload
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documents.map((doc) => (
            <div key={doc.id} className="group relative bg-white border border-black rounded-md p-8 flex flex-col hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 bg-[var(--color-referrd-light)] rounded-full flex items-center justify-center border border-black">
                  <FileText className="h-6 w-6 text-black stroke-[1.5]" />
                </div>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="text-black/40 hover:text-red-600 transition-colors p-2"
                  title="Delete Document"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold tracking-tighter text-black mb-4 line-clamp-2 leading-tight" title={doc.name}>
                {doc.name}
              </h3>
              
              <div className="mt-auto space-y-3 pt-6 border-t border-black/10 mb-8">
                <div className="flex items-center justify-between text-sm text-black/60 font-medium">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
                  <div className="px-3 py-1 bg-[var(--color-referrd-light)] text-black border border-black/20 rounded-full">
                    {doc.pageCount} PAGES
                  </div>
                  <div className="px-3 py-1 bg-[var(--color-referrd-accent)] text-black border border-black/20 rounded-full">
                    {doc.chunkCount} CHUNKS
                  </div>
                </div>
              </div>
              
              <Link 
                to={`/chat/${doc.id}`}
                className="w-full flex items-center justify-between py-4 px-6 bg-black text-white font-bold rounded-md hover:bg-neutral-800 transition-colors"
              >
                Start Chat
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
