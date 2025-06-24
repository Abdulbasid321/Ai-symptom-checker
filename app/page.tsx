// "use client";

// import { useState, FormEvent } from 'react';
// import { FiSend } from 'react-icons/fi';
// import { BsRobot, BsPerson } from 'react-icons/bs';
// import Link from 'next/link';

// export default function Home() {
//   const [input, setInput] = useState<string>('');
//   const [response, setResponse] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setResponse('');

//     try {
//       const res = await fetch(`http://localhost:5000/api/symptoms/check`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userInput: input }),
//       });

//       const data = await res.json();
//       setResponse(data.aiResponse);
//     } catch (error) {
//       console.error('Error:', error);
//       setResponse('⚠️ Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 p-4 flex items-center justify-center">
//       <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
//         {/* Header + View History Link */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-blue-800">🧠 AI Symptom Checker</h1>
//           <Link href="/history" className="text-sm text-blue-600 hover:underline">
//             View History →
//           </Link>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <label htmlFor="symptoms" className="block font-medium text-gray-700">
//             Describe your symptoms:
//           </label>
//           <textarea
//             id="symptoms"
//             className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             rows={5}
//             placeholder="e.g. I've had a headache for 3 days and slight fever..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             required
//           ></textarea>

//           <button
//             type="submit"
//             disabled={loading}
//             className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? 'Checking...' : 'Check Symptoms'}
//             <FiSend />
//           </button>
//         </form>

//         {/* Chat-style response */}
//         <div className="space-y-4">
//           {input && (
//             <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-md">
//               <BsPerson className="text-blue-600 mt-1" />
//               <p className="text-gray-800">{input}</p>
//             </div>
//           )}

//           {loading && (
//             <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-md">
//               <BsRobot className="text-green-600 mt-1" />
//               <p className="text-gray-500 italic animate-pulse">Analyzing symptoms...</p>
//             </div>
//           )}

//           {!loading && response && (
//             <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-md">
//               <BsRobot className="text-green-600 mt-1" />
//               <p className="text-gray-800 whitespace-pre-line">{response}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState, FormEvent } from "react";
import { FiSend, FiMic, FiDownload } from "react-icons/fi";
import { BsRobot, BsPerson } from "react-icons/bs";
import Link from "next/link";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import jsPDF from "jspdf";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [loading, setLoading] = useState<boolean>(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`http://localhost:5000/api/symptoms/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await res.json();
      setResponse(data.aiResponse);
      if (data.language) setLanguage(data.language);
    } catch (error) {
      console.error("Error:", error);
      setResponse("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartVoice = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-NG" });
  };

  const handleUseTranscript = () => {
    setInput(transcript);
    SpeechRecognition.stopListening();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("🧠 AI Symptom Checker Report", 10, 10);
    doc.text(`Language: ${language}`, 10, 20);
    doc.text("User Input:", 10, 30);
    doc.text(input, 10, 40);
    doc.text("AI Response:", 10, 60);
    doc.text(response || "No response", 10, 70);
    doc.save("symptom_response.pdf");
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-800">🧠 AI Symptom Checker</h1>
          <Link href="/history" className="text-sm text-blue-600 hover:underline">
            View History →
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="symptoms" className="block font-medium text-gray-700">
            Describe your symptoms:
          </label>

          <div className="relative">
            <textarea
              id="symptoms"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={5}
              placeholder="e.g. I've had a headache for 3 days and slight fever..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            ></textarea>

            {/* Voice Input */}
            <button
              type="button"
              onClick={handleStartVoice}
              className="absolute right-3 bottom-3 text-blue-500 hover:text-blue-700"
              title="Start voice input"
            >
              <FiMic size={20} />
            </button>
          </div>

          {transcript && (
            <div className="text-sm text-gray-600 flex justify-between items-center">
              <p className="italic">🎤 {transcript}</p>
              <button
                onClick={handleUseTranscript}
                type="button"
                className="text-blue-600 hover:underline text-xs"
              >
                Use this
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Symptoms"}
            <FiSend />
          </button>
        </form>

        {/* Chat-style response */}
        <div className="space-y-4">
          {input && (
            <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-md">
              <BsPerson className="text-blue-600 mt-1" />
              <div>
                <p className="text-gray-800">{input}</p>
                <p className="text-xs text-gray-400 mt-1">Language: {language}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-md">
              <BsRobot className="text-green-600 mt-1" />
              <p className="text-gray-500 italic animate-pulse">Analyzing symptoms...</p>
            </div>
          )}

          {!loading && response && (
            <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-md relative">
              <BsRobot className="text-green-600 mt-1" />
              <p className="text-gray-800 whitespace-pre-line">{response}</p>
              <button
                onClick={handleExportPDF}
                className="absolute top-2 right-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                title="Download as PDF"
              >
                <FiDownload /> Export
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// "use client";

// import { useState, FormEvent } from 'react';
// import { FiSend } from 'react-icons/fi';
// import { BsRobot, BsPerson } from 'react-icons/bs';
// import Link from 'next/link';

// export default function Home() {
//   const [input, setInput] = useState<string>('');
//   const [response, setResponse] = useState<string>('');
//   const [language, setLanguage] = useState<string>('English');
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setResponse('');

//     try {
//       const res = await fetch(`http://localhost:5000/api/symptoms/check`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userInput: input, language }),
//       });

//       const data = await res.json();
//       setResponse(data.aiResponse);
//     } catch (error) {
//       console.error('Error:', error);
//       setResponse('⚠️ Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 p-4 flex items-center justify-center">
//       <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
//         {/* Header + View History Link */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-blue-800">🧠 AI Symptom Checker</h1>
//           <Link href="/history" className="text-sm text-blue-600 hover:underline">
//             View History →
//           </Link>
//         </div>

//         {/* Language Selector */}
//         <div className="flex items-center gap-3">
//           <label htmlFor="language" className="font-medium text-gray-700">
//             Language:
//           </label>
//           <select
//             id="language"
//             className="border rounded-md p-2"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="English">English</option>
//             <option value="Hausa">Hausa</option>
//             <option value="Yoruba">Yoruba</option>
//           </select>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <label htmlFor="symptoms" className="block font-medium text-gray-700">
//             Describe your symptoms:
//           </label>
//           <textarea
//             id="symptoms"
//             className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             rows={5}
//             placeholder="e.g. I've had a headache for 3 days and slight fever..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             required
//           ></textarea>

//           <button
//             type="submit"
//             disabled={loading}
//             className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? 'Checking...' : 'Check Symptoms'}
//             <FiSend />
//           </button>
//         </form>

//         {/* Chat-style response */}
//         <div className="space-y-4">
//           {input && (
//             <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-md">
//               <BsPerson className="text-blue-600 mt-1" />
//               <p className="text-gray-800">{input}</p>
//             </div>
//           )}

//           {loading && (
//             <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-md">
//               <BsRobot className="text-green-600 mt-1" />
//               <p className="text-gray-500 italic animate-pulse">Analyzing symptoms...</p>
//             </div>
//           )}

//           {!loading && response && (
//             <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-md">
//               <BsRobot className="text-green-600 mt-1" />
//               <p className="text-gray-800 whitespace-pre-line">{response}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
