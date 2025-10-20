interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{ page: number; content: string }>;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg px-4 py-3 max-w-[80%] ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-800 shadow'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-semibold mb-2 text-gray-700">Sources:</p>
            <div className="space-y-2">
              {message.sources.map((source, idx) => (
                <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                  <p className="font-medium text-gray-600 mb-1">Page {source.page}</p>
                  <p className="text-gray-500 line-clamp-2">{source.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
