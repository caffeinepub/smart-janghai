import { AlertCircle } from 'lucide-react';

interface FormErrorTextProps {
  error?: string;
}

export default function FormErrorText({ error }: FormErrorTextProps) {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-destructive mt-1">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}
