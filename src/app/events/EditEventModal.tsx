import { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditEventModalProps {
  event: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEventModal({ event, onClose, onSuccess }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title || '');
  const [location, setLocation] = useState(event.location || '');
  const [date, setDate] = useState(event.date ? new Date(event.date).toISOString().split('T')[0] : '');
  const [time, setTime] = useState(event.time || '');
  const [description, setDescription] = useState(event.description || '');
  const [imageUrl, setImageUrl] = useState(event.imageUrl || '');
  const [isHighlighted, setIsHighlighted] = useState(event.isHighlighted || false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location, date, time, description, imageUrl, isHighlighted })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to update event');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1A30]/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-[#0C1A30] mb-6">Edit Event</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Event Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0C1A30] focus:outline-none focus:border-[#D98A29] focus:ring-1 focus:ring-[#D98A29] transition-all"
              placeholder="e.g., Global Leadership Summit" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Location / Platform</label>
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0C1A30] focus:outline-none focus:border-[#D98A29] focus:ring-1 focus:ring-[#D98A29] transition-all"
              placeholder="e.g., New Delhi, India (Hybrid) or Zoom" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0C1A30] focus:outline-none focus:border-[#D98A29] focus:ring-1 focus:ring-[#D98A29] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Time</label>
            <input 
              type="text" 
              value={time} 
              onChange={e => setTime(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0C1A30] focus:outline-none focus:border-[#D98A29] focus:ring-1 focus:ring-[#D98A29] transition-all"
              placeholder="e.g., 09:00 AM - 05:00 PM IST" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description (Optional)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0C1A30] focus:outline-none focus:border-[#D98A29] focus:ring-1 focus:ring-[#D98A29] transition-all"
              placeholder="Short description of the event..." 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Event Image (Optional)</label>
            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative cursor-pointer bg-gray-50/50">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading || isSubmitting} />
              <p className="text-xs text-gray-500">{isUploading ? "Uploading..." : "Drag & drop or click to upload"}</p>
            </div>
            {imageUrl && (
              <div className="mt-2 text-xs text-emerald-600 font-medium break-all">
                ✓ Image uploaded successfully
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center cursor-pointer gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isHighlighted} 
                  onChange={(e) => setIsHighlighted(e.target.checked)} 
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isHighlighted ? 'bg-[#D98A29]' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isHighlighted ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="text-sm font-semibold text-[#0C1A30]">Set as Highlighted Event</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || isUploading} 
            className="w-full py-4 bg-[#D98A29] hover:bg-[#c47a22] text-white rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
