import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import UploadPage from './pages/Upload';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/Chat';
import About from './pages/About';
import Layout from './components/Layout';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!clerkPubKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-200 text-center max-w-lg">
          <h1 className="text-2xl font-bold text-rose-600 mb-4">Missing Clerk Publishable Key</h1>
          <p className="text-slate-600 mb-6">
            The application cannot start because the <code className="bg-slate-100 px-2 py-1 rounded text-rose-500 text-sm">VITE_CLERK_PUBLISHABLE_KEY</code> environment variable is not set.
          </p>
          <div className="text-left bg-slate-50 p-4 rounded-xl text-sm text-slate-700 border border-slate-200 space-y-2">
            <p><strong>To fix this:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Copy <code className="bg-slate-200 px-1 rounded">client/.env.example</code> to <code className="bg-slate-200 px-1 rounded">client/.env</code></li>
              <li>Add your Clerk publishable key from the Clerk Dashboard.</li>
              <li>Restart the Vite dev server.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: '#0a1c12',
          fontFamily: "'Poppins', sans-serif",
          borderRadius: '0px'
        },
        elements: {
          card: 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none',
          formButtonPrimary: 'border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all',
          socialButtonsBlockButton: 'border-2 border-black hover:bg-slate-50 transition-all',
          modalContent: 'mx-auto my-auto',
          modalBackdrop: 'flex items-center justify-center bg-black/50 backdrop-blur-sm'
        }
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UploadPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            } />
            <Route path="/chat/:documentId" element={
              <>
                <SignedIn>
                  <ChatPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            } />
          </Route>
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
