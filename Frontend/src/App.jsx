import React, { useEffect, useState } from 'react';
import 'prismjs/themes/prism-tomorrow.css';
import prism from 'prismjs';
import Editor from 'react-simple-code-editor';
import axios from 'axios';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { FaCode, FaCheckCircle, FaRocket } from 'react-icons/fa';

const App = () => {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post('ai-code-reviewer-78mk.vercel.app/ai/get-review', { code });
      setReview(response.data);
      setCode('');
    } catch (error) {
      setReview('❌ Error reviewing code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col md:flex-row h-screen bg-gray-900 text-white p-4 gap-4 overflow-hidden">

      {/* Code Editor Section */}
      <div className="md:w-1/2 w-full flex flex-col gap-4">
        <div className="bg-gray-800 rounded-lg shadow-md p-4 h-[300px] md:h-full overflow-y-auto relative">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FaCode className="text-blue-400" />
            Code Editor
          </h2>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={12}
            placeholder="Enter your code here..."
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              minHeight: '300px',
              overflow: 'auto',
            }}
          />
        </div>

        <button
          onClick={reviewCode}
          disabled={loading}
          className={`w-full md:w-fit px-5 py-2 font-semibold rounded-lg transition self-end flex items-center gap-2 justify-center
            ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
          `}
        >
          <FaRocket />
          {loading ? 'Reviewing...' : 'Review Code'}
        </button>
      </div>

      {/* Review Output Section */}
      <div className="md:w-1/2 w-full bg-gray-800 rounded-lg p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaCheckCircle className="text-green-400" />
          Code Review
        </h2>
        <div className="prose prose-invert max-w-none whitespace-pre-wrap">
          {loading ? (
            <p className="text-gray-400 italic">Analyzing your code, please wait...</p>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
