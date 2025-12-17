"use client";

import { useState, useEffect } from "react";
import { Edit2, Save, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Court } from "@/lib/types/booking";

export default function AdminCourtsPage() {
  const supabase = createClient();
  const [courts, setCourts] = useState<Court[]>([]);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch courts on mount
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const { data, error } = await supabase
          .from("courts")
          .select("*")
          .order("name");

        if (error) throw error;
        setCourts(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [supabase]);

  const handleEdit = (court: Court) => {
    // Ensure tags is an array and hourly_rate exists
    const courtWithTags: Court & { tags: string[]; hourly_rate: number } = {
      ...court,
      tags: Array.isArray(court.tags) ? court.tags : [],
      hourly_rate: court.hourly_rate || 20.0,
    };
    setEditingCourt(courtWithTags);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourt) return;

    try {
      const { error } = await supabase
        .from("courts")
        .update({
          name: editingCourt.name,
          description: editingCourt.description,
          image_url: editingCourt.image_url,
          status: editingCourt.status,
          tags: editingCourt.tags,
          hourly_rate: editingCourt.hourly_rate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingCourt.id);

      if (error) throw error;

      // Update local state
      setCourts(
        courts.map((c) => (c.id === editingCourt.id ? editingCourt : c))
      );
      setIsModalOpen(false);
      setEditingCourt(null);
    } catch (error) {
      console.error("Error updating court:", error);
      alert("Failed to update court. Please try again.");
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingCourt) {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();

      const currentTags = editingCourt.tags || [];
      if (value && !currentTags.includes(value)) {
        setEditingCourt({
          ...editingCourt,
          tags: [...currentTags, value],
        });
        input.value = "";
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    if (editingCourt) {
      const currentTags = editingCourt.tags || [];
      setEditingCourt({
        ...editingCourt,
        tags: currentTags.filter((tag: string) => tag !== tagToRemove),
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Court Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage court details, pricing, and tags
            </p>
          </div>
        </div>

        {courts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No courts found. Please add courts in your database.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courts.map((court) => (
              <div
                key={court.id}
                className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={court.image_url ?? ""}
                    alt={court.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${court.status === "active"
                        ? "bg-emerald-500 text-white"
                        : "bg-yellow-500 text-black"
                        }`}
                    >
                      {court.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {court.name}
                      </h2>
                      <p className="text-emerald-400 font-semibold">
                        ${court.hourly_rate}/hr
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(court)}
                      className="p-2 bg-slate-800 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {court.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {court.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded-md border border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingCourt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white">
              Edit {editingCourt.name}
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Court Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourt.name}
                    onChange={(e) =>
                      setEditingCourt({ ...editingCourt, name: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={editingCourt.hourly_rate || 20.0}
                    onChange={(e) =>
                      setEditingCourt({
                        ...editingCourt,
                        hourly_rate: parseFloat(e.target.value),
                      } as Court & { hourly_rate: number })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingCourt.image_url || ""}
                  onChange={(e) =>
                    setEditingCourt({
                      ...editingCourt,
                      image_url: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="/images/court-1.png"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingCourt.description || ""}
                  onChange={(e) =>
                    setEditingCourt({
                      ...editingCourt,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Status
                </label>
                <select
                  value={editingCourt.status}
                  onChange={(e) =>
                    setEditingCourt({
                      ...editingCourt,
                      status: e.target.value as Court["status"],
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tags (Press Enter to add)
                </label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {((editingCourt).tags || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-md border border-emerald-500/20"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={handleTagAdd}
                    placeholder="Add a tag..."
                    className="w-full bg-transparent text-white focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
