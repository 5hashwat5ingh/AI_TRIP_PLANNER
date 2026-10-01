import React, { useState } from 'react';
import { Copy, Check, Globe } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export const ShareTripModal = ({ isOpen, onClose, tripId, shareId, tripTitle }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/share/trip/${shareId || tripId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SHARE TRAVEL DOSSIER"
      subtitle="Publish your itinerary link for collaborators and fellow travelers."
    >
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-mono font-bold text-ink uppercase tracking-wider mb-2">
            Public Dossier URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-3 text-ink text-xs font-mono select-all focus:outline-none focus:border-ink"
            />
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="md"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-olive" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-[#F6F3ED] border border-sand-border text-xs font-mono text-ink-muted">
          <span>
            Shared itineraries open in read-only editorial mode with PDF downloads and interactive route maps.
          </span>
        </div>

        <div className="pt-4 border-t border-sand-border flex justify-end">
          <Button variant="ghost" size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareTripModal;
