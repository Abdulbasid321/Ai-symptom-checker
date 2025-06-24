
// 'use client';

// import { useEffect, useState } from 'react';

// interface SymptomEntry {
//   _id: string;
//   userInput: string;
//   aiResponse: string;
//   createdAt: string;
// }

// export default function HistoryPage() {
//   const [history, setHistory] = useState<SymptomEntry[]>([]);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/symptoms/history');
//         const data = await res.json();
//         setHistory(data);
//       } catch (err) {
//         console.error('Failed to fetch history:', err);
//       }
//     };

//     fetchHistory();
//   }, []);

//   const toggleCard = (id: string) => {
//     setActiveId(activeId === id ? null : id);
//   };

//   return (
//     <main className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">📋 Symptom Check History</h1>

//         {history.map((entry) => (
//           <div
//             key={entry._id}
//             className="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-blue-50 transition"
//             onClick={() => toggleCard(entry._id)}
//           >
//             <p className="text-sm text-gray-500">
//               {new Date(entry.createdAt).toLocaleString()}
//             </p>
//             <p className="mt-2 text-blue-800 font-semibold">🧍 You:</p>
//             <p>{entry.userInput}</p>

//             {activeId === entry._id && (
//               <div className="mt-4 border-t pt-2">
//                 <p className="text-green-700 font-semibold">🤖 AI Response:</p>
//                 <p className="whitespace-pre-wrap">{entry.aiResponse}</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SymptomEntry {
  _id: string;
  userInput: string;
  aiResponse: string;
  language?: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SymptomEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/symptoms/history');
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleCard = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-blue-800">📋 Symptom Check History</h1>
          <Link
            href="/"
            className="text-white bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md"
          >
            ⬅ Back to Home
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-600">No history found yet.</p>
        ) : (
          history.map((entry) => (
            <div
              key={entry._id}
              className="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-blue-50 transition"
              onClick={() => toggleCard(entry._id)}
            >
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{new Date(entry.createdAt).toLocaleString()}</span>
                {entry.language && <span>🌍 {entry.language}</span>}
              </div>
              <p className="mt-2 text-blue-800 font-semibold">🧍 You:</p>
              <p className="text-gray-800">{entry.userInput}</p>

              {activeId === entry._id && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-green-700 font-semibold">🤖 AI Response:</p>
                  <p className="whitespace-pre-wrap text-gray-800">{entry.aiResponse}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
