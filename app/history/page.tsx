// "use client";

// import { useEffect, useState } from 'react';

// interface SymptomEntry {
//   _id: string;
//   userInput: string;
//   aiResponse: string;
//   createdAt: string;
// }

// export default function HistoryPage() {
//   const [history, setHistory] = useState<SymptomEntry[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/symptoms/history");
//         const data = await res.json();
//         setHistory(data);
//       } catch (error) {
//         console.error("Failed to fetch history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">🕓 Symptom History</h1>

//       {loading ? (
//         <p className="text-center">Loading history...</p>
//       ) : (
//         <div className="space-y-4 max-w-3xl mx-auto">
//           {history.map((entry) => (
//             <div key={entry._id} className="bg-white shadow-md p-4 rounded-md">
//               <p className="text-sm text-gray-400 mb-1">
//                 {new Date(entry.createdAt).toLocaleString()}
//               </p>
//               <p className="text-blue-700 font-semibold">🧍 You:</p>
//               <p className="mb-2">{entry.userInput}</p>
//               <p className="text-green-700 font-semibold">🤖 AI:</p>
//               <p className="whitespace-pre-wrap">{entry.aiResponse}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';

interface SymptomEntry {
  _id: string;
  userInput: string;
  aiResponse: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SymptomEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/symptoms/history');
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };

    fetchHistory();
  }, []);

  const toggleCard = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">📋 Symptom Check History</h1>

        {history.map((entry) => (
          <div
            key={entry._id}
            className="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-blue-50 transition"
            onClick={() => toggleCard(entry._id)}
          >
            <p className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
            <p className="mt-2 text-blue-800 font-semibold">🧍 You:</p>
            <p>{entry.userInput}</p>

            {activeId === entry._id && (
              <div className="mt-4 border-t pt-2">
                <p className="text-green-700 font-semibold">🤖 AI Response:</p>
                <p className="whitespace-pre-wrap">{entry.aiResponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
