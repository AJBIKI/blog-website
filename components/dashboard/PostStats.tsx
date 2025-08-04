import { FileText, Globe, Clock } from 'lucide-react';

interface PostStatsProps {
  title: string;
  count: number;
  status: 'draft' | 'published' | 'scheduled';
}

export default function PostStats({ title, count, status }: PostStatsProps) {
  const getIcon = () => {
    switch (status) {
      case 'draft':
        return <FileText className="w-6 h-6 text-gray-600" />;
      case 'published':
        return <Globe className="w-6 h-6 text-green-600" />;
      case 'scheduled':
        return <Clock className="w-6 h-6 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
      {getIcon()}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
        <span className={`inline-block px-2 py-1 text-sm rounded ${getStatusColor()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
}