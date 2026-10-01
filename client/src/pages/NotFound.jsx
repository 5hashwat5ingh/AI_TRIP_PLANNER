import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 bg-[#F6F3ED]">
      <span className="text-xs font-mono text-terracotta uppercase tracking-widest font-bold mb-2">
        ERROR 404
      </span>
      <h1 className="text-4xl sm:text-5xl font-serif text-ink tracking-tight">
        UNMAPPED DESTINATION
      </h1>
      <p className="text-xs sm:text-sm font-sans text-ink-muted max-w-sm mt-2 mb-8">
        The route or dossier you requested does not exist in our flight and transit registry.
      </p>
      <Link to="/">
        <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Return to Home →
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
