'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Trash2, Edit2 } from 'lucide-react';
import EditEntryModal from '../directory/EditEntryModal';
import { DirectoryMember } from '../directory/DirectoryClient';
import { AnimatePresence } from 'framer-motion';

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
  type RecordType = { id: string; name: string; avatarUrl: string | null; cohort?: string; title?: string; bio?: string; email?: string | null; story?: string | null; recommendation?: string | null; category?: string; isApproved?: boolean };
  const [records, setRecords] = useState<{ alumni: RecordType[], speakers: RecordType[] }>({ alumni: [], speakers: [] });
  const [editingMember, setEditingMember] = useState<DirectoryMember | null>(null);

  // Admin / User Management State
  type UserType = { id: string; clerkId: string; email: string; role: 'USER' | 'ADMIN' | 'SUPERADMIN'; createdAt: string };
  const [users, setUsers] = useState<UserType[]>([]);
  const [activeTab, setActiveTab] = useState<'directory' | 'users'>('directory');

  const handleEdit = (record: RecordType, type: 'Alumni' | 'Speaker') => {
    const member: DirectoryMember = {
      id: record.id,
      name: record.name,
      avatarUrl: record.avatarUrl,
      roleType: type,
      primaryLabel: type === 'Alumni' ? record.cohort || '' : (record.title === 'Featured Guest' ? 'Guest' : 'Speaker'),
      secondaryLabel: type === 'Alumni' ? record.category || '' : record.title || '',
      bio: record.bio,
      email: record.email,
      story: record.story,
      recommendation: record.recommendation,
      category: record.category,
      cohort: record.cohort,
      title: record.title,
      isApproved: record.isApproved,
    };
    setEditingMember(member);
  };

  const handleApprove = async (id: string, category: 'alumni' | 'speaker') => {
    try {
      const res = await fetch(`/api/directory/${id}/approve?category=${category}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecords(prev => ({
          ...prev,
          [category === 'alumni' ? 'alumni' : 'speakers']: prev[category === 'alumni' ? 'alumni' : 'speakers'].map((item: RecordType) => 
            item.id === id ? { ...item, isApproved: true } : item
          )
        }));
      } else {
        alert(data.error || 'Failed to approve record');
      }
    } catch {
      alert('A network error occurred while approving');
    }
  };

  useEffect(() => {
    fetch('/api/directory')
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => setRecords(data))
      .catch(err => console.error("Failed to fetch records:", err));
  }, [isPublishing, editingMember]); // Refresh after publishing or editing

  useEffect(() => {
    if (activeTab === 'users') {
      fetch('/api/users')
        .then(async res => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then(data => setUsers(data.users || []))
        .catch(err => console.error("Failed to fetch users:", err));
    }
  }, [activeTab]);

  const handleRoleChange = async (id: string, newRole: 'USER' | 'ADMIN' | 'SUPERADMIN') => {
    if (!confirm(`Are you sure you want to change this user to ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        alert(data.error || 'Failed to update role');
      }
    } catch {
      alert('Network error while updating role');
    }
  };

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
    } catch {
      setStatusMsg({ text: 'A network error occurred', type: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id: string, category: 'alumni' | 'speaker') => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`/api/directory?id=${id}&category=${category}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Trigger a re-fetch
        setRecords(prev => ({
          ...prev,
          [category === 'alumni' ? 'alumni' : 'speakers']: prev[category === 'alumni' ? 'alumni' : 'speakers'].filter((item: RecordType) => item.id !== id)
        }));
      } else {
        alert(data.error || 'Failed to delete record');
      }
    } catch {
      alert('A network error occurred while deleting');
    }
  };

  const totalRecords = (records.alumni?.length || 0) + (records.speakers?.length || 0);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-white/20">
      {/* Premium Subdued Navigation */}
      <header className="border-b border-white/10 bg-[#0B0C10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono tracking-wider text-xs uppercase bg-white/5 border border-white/10 text-white px-3 py-1 rounded-full">Studio</span>
            <h1 className="text-sm font-medium tracking-tight text-zinc-300">Platform Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-4">
        <div className="flex items-center gap-6 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'directory' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Directory Records
            {activeTab === 'directory' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#45F3FF]" />}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'users' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            User Management
            {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#45F3FF]" />}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {activeTab === 'directory' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {/* Left Column: Input Panel */}
        <section className="md:col-span-1 bg-[#12141C] border border-white/10 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-base font-semibold mb-6 tracking-tight text-white">Create Directory Entry</h2>

          <form className="space-y-5" onSubmit={handlePublish}>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#C5C6C7] mb-1.5">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#45F3FF] bg-black/40 text-white transition-colors" placeholder="e.g., Jane Doe" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#C5C6C7] mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#45F3FF] bg-black/40 text-white transition-colors">
                <option>Alumni</option>
                <option>Speaker</option>
                <option>Featured Guest</option>
              </select>
            </div>

            {category === 'Alumni' && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#C5C6C7] mb-1.5">Cohort</label>
                <input type="text" value={cohort} onChange={e => setCohort(e.target.value)} required className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#45F3FF] bg-black/40 text-white transition-colors" placeholder="e.g., Class of 2024" />
              </div>
            )}

            {category === 'Speaker' && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#C5C6C7] mb-1.5">Title / Organization</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#45F3FF] bg-black/40 text-white transition-colors" placeholder="e.g., Sr. Engineer at TechCorp" />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#C5C6C7] mb-1.5">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} required rows={4} className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#45F3FF] bg-black/40 text-white transition-colors" placeholder="Professional biography..." />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#C5C6C7] mb-1.5">Profile Image</label>
              <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors relative cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading || isPublishing} />
                <p className="text-xs text-zinc-500">{isUploading ? "Uploading to Cloudflare..." : "Drag & drop or click to upload"}</p>
              </div>
              {imageUrl && (
                <div className="mt-3 text-xs text-emerald-400 font-mono break-all p-2 bg-emerald-950/30 rounded border border-emerald-900">
                  ✓ Uploaded: {imageUrl}
                </div>
              )}
            </div>

            <button type="submit" disabled={isPublishing} className="w-full py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors mt-2 shadow-sm disabled:opacity-50">
              {isPublishing ? 'Publishing...' : 'Publish Entry'}
            </button>

            {statusMsg.text && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${statusMsg.type === 'success' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900' : 'bg-red-950/30 text-red-400 border border-red-900'}`}>
                {statusMsg.text}
              </div>
            )}
          </form>
        </section>

        {/* Right Column: Database Records Grid View */}
        <section className="md:col-span-2 bg-[#12141C] border border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold tracking-tight text-white">Active Directory Records</h2>
            <span className="text-xs font-mono text-zinc-500">Total: {totalRecords} records</span>
          </div>

          {totalRecords === 0 ? (
            <div className="border border-white/10 rounded-lg p-12 text-center bg-black/40">
              <p className="text-sm text-zinc-500 font-normal">No entries populated yet. Use the creation panel to write to the Supabase database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.alumni?.map((alumnus: RecordType) => (
                <div key={alumnus.id} className="border border-white/5 bg-white/5 rounded-lg p-4 flex items-start gap-4 hover:border-white/20 transition-colors">
                  {alumnus.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={alumnus.avatarUrl} alt={alumnus.name} className="w-12 h-12 rounded-full object-cover bg-black border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-500 font-bold text-sm">
                      {alumnus.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-white">{alumnus.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{alumnus.cohort} • Alumni</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {!alumnus.isApproved && (
                      <button
                        onClick={() => handleApprove(alumnus.id, 'alumni')}
                        className="p-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30 rounded-md transition-colors font-semibold text-xs border border-emerald-500/20"
                        title="Approve Record"
                      >
                        APPROVE
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(alumnus, 'Alumni')}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(alumnus.id, 'alumni')}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {records.speakers?.map((speaker: RecordType) => (
                <div key={speaker.id} className="border border-white/5 bg-white/5 rounded-lg p-4 flex items-start gap-4 hover:border-white/20 transition-colors">
                  {speaker.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={speaker.avatarUrl} alt={speaker.name} className="w-12 h-12 rounded-full object-cover bg-black border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-500 font-bold text-sm">
                      {speaker.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-white">{speaker.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{speaker.title} • Speaker</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {!speaker.isApproved && (
                      <button
                        onClick={() => handleApprove(speaker.id, 'speaker')}
                        className="p-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30 rounded-md transition-colors font-semibold text-xs border border-emerald-500/20"
                        title="Approve Record"
                      >
                        APPROVE
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(speaker, 'Speaker')}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(speaker.id, 'speaker')}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
          </div>
        ) : (
          <section className="bg-[#12141C] border border-white/10 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-white mb-6">Registered Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 text-[#C5C6C7] text-xs uppercase tracking-wider">
                    <th className="pb-3 font-medium px-4">Email</th>
                    <th className="pb-3 font-medium px-4">Clerk ID</th>
                    <th className="pb-3 font-medium px-4">Role</th>
                    <th className="pb-3 font-medium px-4">Joined</th>
                    <th className="pb-3 font-medium px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white">{user.email}</td>
                      <td className="py-3 px-4 text-zinc-500 font-mono text-xs">{user.clerkId.substring(0, 12)}...</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'SUPERADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          user.role === 'ADMIN' ? 'bg-[#45F3FF]/10 text-[#45F3FF] border border-[#45F3FF]/20' :
                          'bg-zinc-800 text-zinc-400 border border-white/10'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {user.role === 'USER' && (
                          <button 
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#45F3FF]/10 text-[#45F3FF] hover:bg-[#45F3FF]/20 transition-colors"
                          >
                            Make Admin
                          </button>
                        )}
                        {user.role === 'ADMIN' && (
                          <button 
                            onClick={() => handleRoleChange(user.id, 'USER')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            Revoke Admin
                          </button>
                        )}
                        {user.role === 'SUPERADMIN' && (
                          <button 
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                          >
                            Revoke Superadmin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500">
                        Loading users...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMember && (
          <EditEntryModal
            member={editingMember}
            onClose={() => setEditingMember(null)}
            onSuccess={() => {
              setEditingMember(null);
              // useEffect will trigger re-fetch because editingMember changes
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
