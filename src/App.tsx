/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Phone, 
  AlertCircle, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Clock,
  User,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

interface CheckIn {
  timestamp: string;
  dateKey: string;
  streak: number;
  message?: string;
}

const WARM_MESSAGES = [
  "오늘도 건강하셔서 감사해요! ❤️",
  "밝은 미소로 가득한 하루 되세요! ✨",
  "어르신의 오늘을 응원합니다! 🍀",
  "오늘도 평안한 하루 보내세요! 🏠",
  "항상 건강하시길 기원합니다! 🙏",
  "오늘도 멋진 하루가 될 거예요! 🌟"
];

// --- Sub-Components ---

/** SOS 섹션 컴포넌트 */
function SOSSection({ 
  isSOSActive, 
  countdown, 
  isPressing, 
  pressProgress, 
  onPressStart, 
  onPressEnd, 
  onCancel 
}: {
  isSOSActive: boolean;
  countdown: number;
  isPressing: boolean;
  pressProgress: number;
  onPressStart: () => void;
  onPressEnd: () => void;
  onCancel: () => void;
}) {
  return (
    <section id="sos-section" className={`bg-white rounded-2xl p-4 shadow-lg border-2 text-center transition-colors ${isSOSActive ? 'border-red-600' : 'border-red-100'}`}>
      <h2 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
        <AlertCircle className="text-red-600" size={20} /> 긴급 상황
      </h2>
      
      {!isSOSActive ? (
        <div className="relative overflow-hidden rounded-xl">
          <button
            id="sos-button"
            onMouseDown={onPressStart}
            onMouseUp={onPressEnd}
            onMouseLeave={onPressEnd}
            onTouchStart={onPressStart}
            onTouchEnd={onPressEnd}
            className="w-full h-28 bg-red-600 hover:bg-red-700 active:scale-95 transition-all flex flex-col items-center justify-center text-white shadow-lg relative z-10"
          >
            <span className="text-3xl font-black mb-1">긴급 SOS</span>
            <span className="text-base">3초간 꾹 누르세요</span>
          </button>
          {/* Progress Bar Background */}
          {isPressing && (
            <div 
              className="absolute bottom-0 left-0 h-full bg-red-800 transition-all duration-75 ease-linear pointer-events-none"
              style={{ width: `${pressProgress}%`, opacity: 0.5 }}
            />
          )}
        </div>
      ) : (
        <div className="space-y-3 py-2 relative z-20">
          <div className="text-6xl font-black text-red-600 drop-shadow-sm">
            {countdown}
          </div>
          <p className="text-xl font-bold text-red-800">
            {countdown > 0 ? "긴급 알림 전송 중..." : "알림이 전송되었습니다!"}
          </p>
          <button
            id="cancel-sos-button"
            onClick={onCancel}
            className="w-full h-16 bg-gray-900 text-white rounded-xl text-2xl font-bold flex items-center justify-center gap-2 shadow-xl border-2 border-white/20"
          >
            <XCircle size={24} /> 취소하기
          </button>
        </div>
      )}
    </section>
  );
}

/** 안부 확인 섹션 컴포넌트 */
function CheckInSection({ 
  isTodayDone, 
  checkIn, 
  onCheckIn 
}: {
  isTodayDone: boolean;
  checkIn: CheckIn | null;
  onCheckIn: () => void;
}) {
  return (
    <section id="checkin-section" className="bg-white rounded-2xl p-4 shadow-lg border-2 border-[#03A9F4]/20">
      <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
        <Heart className="text-[#03A9F4]" size={20} /> 안부 확인
      </h2>
      
      <button
        id="checkin-button"
        onClick={onCheckIn}
        className="w-full h-16 bg-[#FFB300] hover:bg-[#FFA000] active:scale-95 transition-all rounded-xl flex items-center justify-center gap-3 text-[#1A237E] shadow-md mb-3"
      >
        <CheckCircle2 size={28} />
        <span className="text-xl font-bold">오늘 괜찮아요</span>
      </button>

      {checkIn && (
        <div className="space-y-3">
          {isTodayDone && checkIn.message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#E3F2FD] p-4 rounded-xl border border-[#03A9F4]/30 text-center"
            >
              <p className="text-xl font-bold text-[#1A237E]">{checkIn.message}</p>
            </motion.div>
          )}
          <div className="bg-[#FFF8E1] p-3 rounded-xl border border-[#FFB300]/30 flex items-start gap-3">
            <Clock className="text-[#FFB300] mt-1" size={18} />
            <div>
              <p className="text-xs text-gray-600 font-medium">마지막 확인 시간</p>
              <p className="text-lg font-bold leading-tight">{checkIn.timestamp}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/** 가족 연락처 섹션 컴포넌트 */
function ContactSection({
  contacts,
  showAddForm,
  setShowAddForm,
  newName,
  setNewName,
  newRelation,
  setNewRelation,
  newPhone,
  setNewPhone,
  onAdd,
  onDelete
}: {
  contacts: Contact[];
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newName: string;
  setNewName: (val: string) => void;
  newRelation: string;
  setNewRelation: (val: string) => void;
  newPhone: string;
  setNewPhone: (val: string) => void;
  onAdd: (e: FormEvent) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section id="contacts-section" className="bg-white rounded-2xl p-4 shadow-lg border-2 border-[#1A237E]/10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Phone className="text-[#1A237E]" size={20} /> 가족 연락처
        </h2>
        {contacts.length < 3 && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1.5 bg-[#1A237E] text-white rounded-full shadow-md"
          >
            <UserPlus size={20} />
          </button>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={onAdd}
            className="mb-6 bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-[#1A237E]/20 space-y-3 overflow-hidden"
          >
            <input 
              type="text" 
              placeholder="이름 (예: 홍길동)" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-lg"
              required
            />
            <input 
              type="text" 
              placeholder="관계 (예: 아들)" 
              value={newRelation}
              onChange={(e) => setNewRelation(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-lg"
            />
            <input 
              type="tel" 
              placeholder="전화번호" 
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-lg"
              required
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                className="flex-1 h-12 bg-[#1A237E] text-white rounded-lg font-bold"
              >
                등록하기
              </button>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 h-12 bg-gray-300 rounded-lg font-bold"
              >
                취소
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Contact List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-lg">등록된 연락처가 없습니다.</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-[#1A237E]/10 p-3 rounded-full">
                  <User className="text-[#1A237E]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{contact.name}</span>
                    <span className="text-sm bg-[#03A9F4]/10 text-[#03A9F4] px-2 py-0.5 rounded-md font-medium">{contact.relation}</span>
                  </div>
                  <p className="text-lg text-gray-600">{contact.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href={`tel:${contact.phone}`}
                  className="p-3 bg-green-500 text-white rounded-xl shadow-md active:scale-90 transition-transform"
                >
                  <Phone size={24} />
                </a>
                <button 
                  onClick={() => onDelete(contact.id)}
                  className="p-3 bg-gray-200 text-gray-600 rounded-xl active:scale-90 transition-transform"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function App() {
  // State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('care_contacts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [checkIn, setCheckIn] = useState<CheckIn | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('care_checkin');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Voice Guidance Function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9; // Slightly slower for better clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  // Show visual message
  const showMessage = (text: string) => {
    setActionMessage(text);
    speak(text);
    setTimeout(() => setActionMessage(null), 3000);
  };
  
  // Form state for adding contact
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('care_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('care_checkin', JSON.stringify(checkIn));
  }, [checkIn]);

  const todayKey = new Date().toISOString().split('T')[0];
  const isTodayDone = checkIn?.dateKey === todayKey;

  // Long Press Logic
  useEffect(() => {
    let timer: number;
    if (isPressing && !isSOSActive) {
      const startTime = Date.now();
      timer = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / 3000) * 100, 100);
        setPressProgress(progress);
        
        if (progress >= 100) {
          setIsSOSActive(true);
          setCountdown(10);
          setIsPressing(false);
          setPressProgress(0);
          clearInterval(timer);
        }
      }, 50);
    } else {
      setPressProgress(0);
    }
    return () => clearInterval(timer);
  }, [isPressing, isSOSActive]);

  // SOS Countdown logic
  useEffect(() => {
    let timer: number;
    if (isSOSActive && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // In a real app, this would trigger an actual emergency call/SMS
      console.log("Emergency Alert Sent!");
    }
    return () => clearInterval(timer);
  }, [isSOSActive, countdown]);

  // Handlers
  const handlePressStart = () => {
    if (!isSOSActive) {
      setIsPressing(true);
      speak("긴급 버튼을 3초 동안 꾹 누르세요.");
    }
  };

  const handlePressEnd = () => {
    setIsPressing(false);
  };

  const handleCancelSOS = () => {
    setIsSOSActive(false);
    setCountdown(10);
    setIsPressing(false);
    setPressProgress(0);
    showMessage("긴급 호출을 취소했습니다.");
  };

  const handleCheckIn = () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}시 ${now.getMinutes()}분`;
    const dateKey = now.toISOString().split('T')[0];
    
    let newStreak = 1;
    if (checkIn) {
      const lastDate = new Date(checkIn.dateKey);
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (checkIn.dateKey === dateKey) {
        newStreak = checkIn.streak;
      } else if (diffDays === 1) {
        newStreak = checkIn.streak + 1;
      }
    }

    const randomMsg = WARM_MESSAGES[Math.floor(Math.random() * WARM_MESSAGES.length)];
    setCheckIn({ timestamp: formattedDate, dateKey, streak: newStreak, message: randomMsg });
    showMessage("안부 확인을 완료했습니다. 오늘도 건강하세요!");
  };

  const addContact = (e: FormEvent) => {
    e.preventDefault();
    if (contacts.length >= 3) {
      showMessage("연락처는 최대 3명까지 등록 가능합니다.");
      return;
    }
    if (!newName || !newPhone) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName,
      relation: newRelation,
      phone: newPhone
    };

    setContacts([...contacts, newContact]);
    setNewName('');
    setNewRelation('');
    setNewPhone('');
    setShowAddForm(false);
    showMessage(`${newName} 님을 연락처에 등록했습니다.`);
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(contacts.filter(c => c.id !== id));
    if (contact) showMessage(`${contact.name} 님을 삭제했습니다.`);
  };

  return (
    <div className={`min-h-screen bg-gray-50 font-sans text-[#1A237E] transition-colors duration-300 ${isSOSActive && countdown > 0 ? 'animate-pulse-red' : ''}`}>
      {/* Full Screen Alert Overlay */}
      <AnimatePresence>
        {isSOSActive && countdown > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="fixed inset-0 bg-red-600 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="bg-[#1A237E] text-white p-4 shadow-lg text-center relative overflow-hidden">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">안심케어</h1>
          <p className="text-sm opacity-90">낙상 알림 프로토타입</p>
        </div>
        
        {/* Today's Check-in Badge */}
        <div className="mt-2 flex justify-center gap-2">
          {isTodayDone ? (
            <>
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-green-400">
                <CheckCircle2 size={14} /> 오늘 확인 완료
              </div>
              <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/30 backdrop-blur-sm">
                🔥 {checkIn?.streak}일 연속
              </div>
            </>
          ) : (
            <div className="bg-[#FFB300] text-[#1A237E] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-[#FFA000]">
              <Clock size={14} /> 오늘 미확인
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4 pb-20">
        
        {/* 1. SOS Section */}
        <SOSSection 
          isSOSActive={isSOSActive}
          countdown={countdown}
          isPressing={isPressing}
          pressProgress={pressProgress}
          onPressStart={handlePressStart}
          onPressEnd={handlePressEnd}
          onCancel={handleCancelSOS}
        />

        {/* 2. Check-in Section */}
        <CheckInSection 
          isTodayDone={isTodayDone}
          checkIn={checkIn}
          onCheckIn={handleCheckIn}
        />

        {/* 3. Family Contacts Section */}
        <ContactSection 
          contacts={contacts}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          newName={newName}
          setNewName={setNewName}
          newRelation={newRelation}
          setNewRelation={setNewRelation}
          newPhone={newPhone}
          setNewPhone={setNewPhone}
          onAdd={addContact}
          onDelete={deleteContact}
        />
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 text-center z-40">
        <p className="text-gray-500 text-sm">안심케어 프로토타입 v1.0</p>
      </footer>

      {/* Action Message Overlay */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 right-4 bg-[#1A237E] text-white p-6 rounded-2xl shadow-2xl z-50 text-center border-4 border-[#03A9F4]"
          >
            <p className="text-2xl font-bold leading-tight">{actionMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
