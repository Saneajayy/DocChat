import { Link } from 'react-router-dom';
import { Search, Zap, Shield, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full bg-[var(--color-referrd-green)] text-white py-24 px-4 border-b-2 border-black">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            Stop reading.<br />Start conversing.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-medium leading-relaxed mb-12">
            DocChat transforms static PDFs into interactive knowledge bases. Instantly extract insights, summarize complex textbooks, and find exactly what you need without skimming.
          </p>
          <Link 
            to="/"
            className="px-8 py-5 bg-white text-black font-bold text-lg rounded-md hover:bg-[var(--color-referrd-light)] transition-colors border-2 border-transparent"
          >
            Upload a Document
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-[var(--color-referrd-light)] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black mb-4">Powerful Features</h2>
            <p className="text-black/60 text-xl font-medium max-w-xl">Built from the ground up to make reading large documents a thing of the past.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-black p-8 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[var(--color-referrd-light)] border border-black rounded-full flex items-center justify-center mb-6">
                <Search className="h-7 w-7 text-black" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-black mb-3">AI-Powered Extraction</h3>
              <p className="text-black/70 font-medium leading-relaxed">
                Our AI understands the semantic context of your questions and pulls exact answers directly from the source material.
              </p>
            </div>

            <div className="bg-white border-2 border-black p-8 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-[var(--color-referrd-accent)] border border-black rounded-full flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-black" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-black mb-3">Lightning Fast</h3>
              <p className="text-black/70 font-medium leading-relaxed">
                Powered by Google's Gemini LLM and Pinecone vector search, queries are processed and answered in milliseconds.
              </p>
            </div>

            <div className="bg-white border-2 border-black p-8 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-blue-100 border border-black rounded-full flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-black" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-black mb-3">Secure Storage</h3>
              <p className="text-black/70 font-medium leading-relaxed">
                Your documents are securely encrypted and isolated to your account. Your personal data is never used to train public models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="w-full bg-white py-24 px-4 border-t border-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black mb-12 text-center">Who is this for?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--color-referrd-light)] border-2 border-black p-8 rounded-md flex flex-col items-start min-h-[320px]">
              <span className="bg-black text-white px-4 py-1 font-bold text-lg rounded-full mb-8">01</span>
              <h4 className="text-3xl font-bold text-black mb-4">Students</h4>
              <p className="text-black/80 font-medium leading-relaxed">
                Summarize massive textbooks instantly and generate study guides based on syllabus material without manually digging for answers.
              </p>
            </div>

            <div className="bg-[var(--color-referrd-accent)] border-2 border-black p-8 rounded-md flex flex-col items-start min-h-[320px]">
              <span className="bg-black text-white px-4 py-1 font-bold text-lg rounded-full mb-8">02</span>
              <h4 className="text-3xl font-bold text-black mb-4">Researchers</h4>
              <p className="text-black/80 font-medium leading-relaxed">
                Query academic papers and whitepapers to extract specific data points, methodologies, and citations without reading the entire document.
              </p>
            </div>

            <div className="bg-white border-2 border-black p-8 rounded-md flex flex-col items-start min-h-[320px]">
              <span className="bg-black text-white px-4 py-1 font-bold text-lg rounded-full mb-8">03</span>
              <h4 className="text-3xl font-bold text-black mb-4">Professionals</h4>
              <p className="text-black/80 font-medium leading-relaxed">
                Instantly find specific clauses, financial figures, or compliance rules buried deep within corporate contracts or dense reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="w-full bg-[var(--color-referrd-green)] py-24 px-4 border-t-2 border-black">
        <div className="max-w-4xl mx-auto text-center text-white">
           <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-90" />
           <h3 className="text-5xl md:text-6xl font-bold tracking-tighter mb-10 leading-tight">Ready to dive in?</h3>
           <Link to="/" className="inline-block px-10 py-5 bg-white text-black font-bold text-xl rounded-md hover:bg-[var(--color-referrd-light)] transition-colors border-2 border-transparent">
             Start Chatting Now
           </Link>
        </div>
      </section>
    </div>
  );
}
