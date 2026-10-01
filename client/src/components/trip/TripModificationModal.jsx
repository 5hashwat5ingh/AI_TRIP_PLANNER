import React, { useState } from 'react';
import { ArrowRight, Sliders } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export const TripModificationModal = ({ isOpen, onClose, onModify, isModifying }) => {
  const [prompt, setPrompt] = useState('');

  const suggestedActions = [
    'Make it cheaper',
    'Add more nature',
    'More food experiences',
    'Remove nightlife',
    'Add photography spots',
    'Upgrade hotels',
    'Reduce travel time'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onModify(prompt);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CHANGE YOUR JOURNEY"
      subtitle="Enter an editorial instruction. Only the affected specialized agents will recalculate."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-mono font-bold text-ink uppercase tracking-wider mb-2">
            Command Instruction
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Make this trip more relaxed with longer meal breaks and add more cultural tea ceremonies..."
            className="w-full bg-[#F6F3ED] border border-sand-border rounded-none p-4 text-ink focus:outline-none focus:border-ink text-sm font-sans leading-relaxed"
            required
          />
        </div>

        <div>
          <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider block mb-2 font-bold">
            Suggested Actions:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(`Please ${action.toLowerCase()} across this itinerary.`)}
                className="text-xs font-mono uppercase px-3 py-1.5 bg-sand border border-sand-border text-ink hover:border-ink transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-sand-border flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={isModifying}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Apply Change →
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TripModificationModal;
