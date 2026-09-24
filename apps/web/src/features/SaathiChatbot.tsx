import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Mic, Volume2, ShieldCheck, 
  Sparkles, ExternalLink, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

interface SaathiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApplication: () => void;
  onOpenPayment: () => void;
  onOpenDocuments: () => void;
  onOpenGrievance: () => void;
  onCheckEligibility: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  language?: string;
  toolsCalled?: string[];
  citations?: any[];
  actionButtons?: Array<{ label: string; action: string }>;
  timestamp: string;
}

export const SaathiChatbot: React.FC<SaathiChatbotProps> = ({
  isOpen,
  onClose,
  onOpenApplication,
  onOpenPayment,
  onOpenDocuments,
  onOpenGrievance,
  onCheckEligibility,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'saathi',
      text: "Namaste! I am **SAATHI**, your scholarship assistance companion for Ministry of Tribal Affairs (MoTA) schemes.\n\nHow can I guide your scholarship journey today?",
      language: 'en',
      actionButtons: [
        { label: "Why is my payment pending?", action: "PAYMENT_QUERY" },
        { label: "Application Status", action: "APP_STATUS" },
        { label: "Which scholarship can I apply for?", action: "CHECK_ELIGIBILITY" },
        { label: "मेरी छात्रवृत्ति का भुगतान (Hindi)", action: "HINDI_QUERY" }
      ],
      timestamp: "Just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (initialPrompt && initialPrompt !== '') {
        handleSendMessage(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await api.sendChatMessage(text);
      const saathiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'saathi',
        text: res.response,
        language: res.language,
        toolsCalled: res.tools_called,
        citations: res.citations,
        actionButtons: res.action_buttons,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, saathiMsg]);

      // Voice read aloud if Hindi or requested
      if (window.speechSynthesis && res.language === 'hi') {
        const utter = new SpeechSynthesisUtterance(res.response.replace(/[#*]/g, ''));
        utter.lang = 'hi-IN';
        window.speechSynthesis.speak(utter);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'saathi',
          text: "I am having temporary trouble connecting to the verification network. Please check the official scholarship guidelines or ask again shortly.",
          timestamp: "Just now"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'VIEW_APPLICATION':
        onOpenApplication();
        onClose();
        break;
      case 'VIEW_PAYMENT':
        onOpenPayment();
        onClose();
        break;
      case 'VIEW_DOCUMENTS':
      case 'UPLOAD_DOCUMENT':
        onOpenDocuments();
        onClose();
        break;
      case 'RAISE_GRIEVANCE':
        onOpenGrievance();
        onClose();
        break;
      case 'CHECK_ELIGIBILITY':
      case 'EXPLORE_SCHEMES':
        onCheckEligibility();
        onClose();
        break;
      case 'PAYMENT_QUERY':
        handleSendMessage("Why is my scholarship payment pending?");
        break;
      case 'APP_STATUS':
        handleSendMessage("What is my scholarship application status?");
        break;
      case 'HINDI_QUERY':
        handleSendMessage("मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?");
        break;
      default:
        handleSendMessage(action);
        break;
    }
  };

  // Section 35: Voice Input Simulation & Web Speech API
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Mock voice simulation
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage("मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?");
      }, 1500);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
      // Fallback query
      handleSendMessage("Why is my scholarship payment pending?");
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header (Section 28) */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-extrabold text-sm tracking-wide">SAATHI</h3>
              <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.2 rounded font-bold">
                AI Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Your scholarship companion</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Security & Authenticity Banner (Section 31 & 32) */}
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900 font-medium">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Verified RAG & Tool Architecture</span>
        </span>
        <span className="text-slate-500 font-mono text-[10px]">Guardrails Active</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-sm ${
                m.sender === 'user'
                  ? 'bg-blue-700 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none leading-relaxed'
              }`}
            >
              {/* Formatted Message Content */}
              <div className="whitespace-pre-line">
                {m.text}
              </div>

              {/* Citations if available (Section 29) */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center space-x-1">
                  <span className="font-semibold text-slate-700">Source:</span>
                  <span>{m.citations[0].source}</span>
                </div>
              )}
            </div>

            {/* Action Buttons if returned by SAATHI (Section 28) */}
            {m.actionButtons && m.actionButtons.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {m.actionButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleActionButton(btn.action)}
                    className="text-[11px] font-semibold bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 hover:border-blue-400 px-2.5 py-1 rounded-lg shadow-2xs transition flex items-center space-x-1"
                  >
                    <span>{btn.label}</span>
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                  </button>
                ))}
              </div>
            )}

            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 p-2.5 rounded-xl w-32">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span>Checking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Listening Banner */}
      {isListening && (
        <div className="bg-orange-50 border-t border-orange-200 p-2 text-center text-xs text-orange-800 font-semibold flex items-center justify-center space-x-2 animate-pulse">
          <Mic className="w-4 h-4 text-orange-600" />
          <span>Listening... बोलिए (हिंदी या English)</span>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Section 35: Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2 rounded-xl border transition ${
              isListening
                ? 'bg-orange-600 text-white border-orange-600'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
            }`}
            title="Speak using Voice (STT)"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask SAATHI in English or हिन्दी..."
            className="flex-1 text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className={`p-2.5 rounded-xl text-white transition ${
              inputMessage.trim() && !isTyping
                ? 'bg-blue-700 hover:bg-blue-800 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
