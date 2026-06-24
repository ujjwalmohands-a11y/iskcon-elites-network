'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function AdminDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Alumni');
  const [fullName, setFullName] = useState('');
  const [cohort, setCohort] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // Right Column data state
  const [records, setRecords] = useState({ alumni: [], speakers: [] });

  useEffect(() => {
    fetch('/api/directory')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error("Failed to fetch records:", err));
  }, [isPublishing]); // Refresh after publishing

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch (err) {
      console.error("Upload interface error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setStatusMsg({ text: '', type: '' });

    try {
      const res = await fetch('/api/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          category,
          profileImage: imageUrl,
          cohort: category === 'Alumni' ? cohort : undefined,
          title: category === 'Speaker' ? title : undefined,
          bio
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({ text: 'Entry published successfully!', type: 'success' });
        // Reset form
        setFullName('');
        setCohort('');
        setTitle('');
        setBio('');
        setImageUrl('');
      } else {
        setStatusMsg({ text: data.error || 'Failed to publish entry', type: 'error' });
      }
    } catch (err) {
      setStatusMsg({ text: 'A network error occurred', type: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  const totalRecords = (records.alumni?.length || 0) + (records.speakers?.length || 0);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-200">
      {/* Premium Subdued Navigation */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono tracking-wider text-xs uppercase bg-zinc-900 text-white px-2 py-0.5 rounded">Studio</span>
            <h1 className="text-sm font-medium tracking-tight text-zinc-800">Platform Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Input Panel */}
        <section className="lg:col-span-1 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-base font-semibold mb-6 tracking-tight">Create Directory Entry</h2>
          
          <form className="space-y-5" onSubmit={handlePublish}>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50/50 transition-colors" placeholder="e.g., Jane Doe" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50/50 transition-colors">
                <option>Alumni</option>
                <option>Speaker</option>
                <option>Featured Guest</option>
              </select>
            </div>

            {category === 'Alumni' && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">Cohort</label>
                <input type="text" value={cohort} onChange={e => setCohort(e.target.value)} required className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50/50 transition-colors" placeholder="e.g., Class of 2024" />
              </div>
            )}

            {category === 'Speaker' && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">Title / Organization</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50/50 transition-colors" placeholder="e.g., Sr. Engineer at TechCorp" />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} required rows={4} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50/50 transition-colors" placeholder="Professional biography..." />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">Profile Image</label>
              <div className="border border-dashed border-zinc-200 rounded-lg p-4 text-center hover:bg-zinc-50 transition-colors relative cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading || isPublishing} />
                <p className="text-xs text-zinc-500">{isUploading ? "Uploading to Cloudflare..." : "Drag & drop or click to upload"}</p>
              </div>
              {imageUrl && (
                <div className="mt-3 text-xs text-emerald-600 font-mono break-all p-2 bg-emerald-50 rounded border border-emerald-100">
                  ✓ Uploaded: {imageUrl}
                </div>
              )}
            </div>

            <button type="submit" disabled={isPublishing} className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors mt-2 shadow-sm disabled:opacity-50">
              {isPublishing ? 'Publishing...' : 'Publish Entry'}
            </button>

            {statusMsg.text && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {statusMsg.text}
              </div>
            )}
          </form>
        </section>

        {/* Right Column: Database Records Grid View */}
        <section className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold tracking-tight">Active Directory Records</h2>
            <span className="text-xs font-mono text-zinc-400">Total: {totalRecords} records</span>
          </div>

          {totalRecords === 0 ? (
            <div className="border border-zinc-100 rounded-lg p-12 text-center bg-zinc-50/30">
              <p className="text-sm text-zinc-400 font-normal">No entries populated yet. Use the creation panel to write to the Supabase database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.alumni?.map((alumnus: any) => (
                <div key={alumnus.id} className="border border-zinc-100 rounded-lg p-4 flex items-start gap-4 hover:border-zinc-300 transition-colors">
                  {alumnus.avatarUrl ? (
                    <img src={alumnus.avatarUrl} alt={alumnus.name} className="w-12 h-12 rounded-full object-cover bg-zinc-100 border border-zinc-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 font-bold text-sm">
                      {alumnus.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{alumnus.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{alumnus.cohort} • Alumni</p>
                  </div>
                </div>
              ))}
              
              {records.speakers?.map((speaker: any) => (
                <div key={speaker.id} className="border border-zinc-100 rounded-lg p-4 flex items-start gap-4 hover:border-zinc-300 transition-colors">
                  {speaker.avatarUrl ? (
                    <img src={speaker.avatarUrl} alt={speaker.name} className="w-12 h-12 rounded-full object-cover bg-zinc-100 border border-zinc-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 font-bold text-sm">
                      {speaker.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{speaker.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{speaker.title} • Speaker</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
