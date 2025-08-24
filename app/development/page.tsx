'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Save, 
  Play, 
  Trash2, 
  Upload, 
  FileText, 
  Image,
  Code,
  ChevronUp,
  ChevronDown,
  Settings,
  Download,
  Eye,
  Copy
} from 'lucide-react';

// ממשק השלב
interface ProcessStep {
  id: string;
  title: string;
  description: string;
  content: string;
  files: Array<{
    name: string;
    type: string;
    content: string;
  }>;
  order: number;
}

// ממשק התהליך
interface Process {
  id?: string;
  name: string;
  description: string;
  steps: ProcessStep[];
  created_at?: string;
  updated_at?: string;
}

export default function DevelopmentPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [currentProcess, setCurrentProcess] = useState<Process>({
    name: '',
    description: '',
    steps: []
  });
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  // טעינת תהליכים
  const loadProcesses = async () => {
    try {
      const response = await fetch('/api/processes');
      if (response.ok) {
        const data = await response.json();
        setProcesses(data);
      }
    } catch (error) {
      console.error('Error loading processes:', error);
    }
  };

  useEffect(() => {
    loadProcesses();
  }, []);

  // שמירת תהליך
  const saveProcess = async () => {
    if (!currentProcess.name.trim()) {
      alert('חובה להזין שם לתהליך');
      return;
    }

    setLoading(true);
    try {
      const method = selectedProcessId ? 'PUT' : 'POST';
      const url = selectedProcessId ? `/api/processes/${selectedProcessId}` : '/api/processes';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProcess),
      });

      if (response.ok) {
        const savedProcess = await response.json();
        if (selectedProcessId) {
          setProcesses(prev => prev.map(p => p.id === selectedProcessId ? savedProcess : p));
        } else {
          setProcesses(prev => [...prev, savedProcess]);
          setSelectedProcessId(savedProcess.id);
        }
        alert('התהליך נשמר בהצלחה!');
      }
    } catch (error) {
      console.error('Error saving process:', error);
      alert('שגיאה בשמירת התהליך');
    } finally {
      setLoading(false);
    }
  };

  // הוספת שלב חדש
  const addStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      title: '',
      description: '',
      content: '',
      files: [],
      order: currentProcess.steps.length
    };

    setCurrentProcess(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  // עדכון שלב
  const updateStep = (stepId: string, field: keyof ProcessStep, value: any) => {
    setCurrentProcess(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  // מחיקת שלב
  const deleteStep = (stepId: string) => {
    setCurrentProcess(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  // העלאת קובץ
  const handleFileUpload = async (stepId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newFile = {
        name: file.name,
        type: file.type,
        content: content
      };

      updateStep(stepId, 'files', [
        ...currentProcess.steps.find(s => s.id === stepId)?.files || [],
        newFile
      ]);
    };
    reader.readAsDataURL(file);
  };

  // יצירת prompt מלא
  const generateFullPrompt = () => {
    if (currentProcess.steps.length === 0) return '';

    let prompt = `# ${currentProcess.name}\n\n`;
    prompt += `${currentProcess.description}\n\n`;
    prompt += `## תהליך מורכב ${currentProcess.steps.length} שלבים:\n\n`;

    currentProcess.steps.forEach((step, index) => {
      prompt += `### שלב ${index + 1}: ${step.title}\n\n`;
      prompt += `**הסבר:** ${step.description}\n\n`;
      prompt += `**הוראות:**\n${step.content}\n\n`;
      
      if (step.files.length > 0) {
        prompt += `**קבצים נלווים:**\n`;
        step.files.forEach(file => {
          prompt += `- ${file.name} (${file.type})\n`;
        });
        prompt += '\n';
      }
      
      prompt += '---\n\n';
    });

    return prompt;
  };

  // טעינת תהליך קיים
  const loadProcess = (process: Process) => {
    setCurrentProcess(process);
    setSelectedProcessId(process.id || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div dir="rtl">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">מחלקת פיתוח</h1>
              <p className="text-gray-600">בניית תהליכים מתקדמים לסוכני AI</p>
            </div>
            <div className="flex items-center space-x-4" dir="ltr">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(!showPreview)}
                className="bg-green-500 text-white px-4 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-all duration-200"
              >
                <Eye className="w-5 h-5" />
                <span dir="rtl">תצוגה מקדימה</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveProcess}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span dir="rtl">{loading ? 'שומר...' : 'שמור תהליך'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* רשימת תהליכים */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4" dir="rtl">תהליכים שמורים</h3>
              
              <button
                onClick={() => {
                  setCurrentProcess({ name: '', description: '', steps: [] });
                  setSelectedProcessId(null);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mb-4 flex items-center justify-center space-x-2"
                dir="ltr"
              >
                <Plus className="w-4 h-4" />
                <span dir="rtl">תהליך חדש</span>
              </button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {processes.map((process) => (
                  <motion.div
                    key={process.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => loadProcess(process)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedProcessId === process.id
                        ? 'bg-blue-100 border-blue-500 border-2'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <h4 className="font-medium text-gray-800" dir="rtl">{process.name}</h4>
                    <p className="text-sm text-gray-600" dir="rtl">{process.description}</p>
                    <div className="text-xs text-gray-500 mt-1" dir="rtl">
                      {process.steps.length} שלבים
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* עורך התהליך */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4" dir="rtl">פרטי התהליך</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    שם התהליך
                  </label>
                  <input
                    type="text"
                    value={currentProcess.name}
                    onChange={(e) => setCurrentProcess(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="הזן שם לתהליך..."
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    תיאור כללי
                  </label>
                  <input
                    type="text"
                    value={currentProcess.description}
                    onChange={(e) => setCurrentProcess(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="תיאור קצר של התהליך..."
                    dir="rtl"
                  />
                </div>
              </div>

              {/* שלבי התהליך */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800" dir="rtl">שלבי התהליך</h4>
                <button
                  onClick={addStep}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors"
                  dir="ltr"
                >
                  <Plus className="w-4 h-4" />
                  <span dir="rtl">הוסף שלב</span>
                </button>
              </div>

              <AnimatePresence>
                {currentProcess.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-800" dir="rtl">שלב {index + 1}</h5>
                      <button
                        onClick={() => deleteStep(step.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                          כותרת השלב
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="כותרת השלב..."
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                          הסבר קצר
                        </label>
                        <input
                          type="text"
                          value={step.description}
                          onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="מה קורה בשלב הזה..."
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                        הוראות מפורטות
                      </label>
                      <textarea
                        value={step.content}
                        onChange={(e) => updateStep(step.id, 'content', e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="הוראות מפורטות לביצוע השלב..."
                        dir="rtl"
                      />
                    </div>

                    {/* העלאת קבצים */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700" dir="rtl">
                          קבצים נלווים
                        </label>
                        <label className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-gray-600 transition-colors flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span dir="rtl">העלה קובץ</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(step.id, file);
                            }}
                          />
                        </label>
                      </div>
                      
                      {step.files.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {step.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="bg-gray-50 p-2 rounded-lg flex items-center space-x-2">
                              {file.type.startsWith('image/') ? (
                                <Image className="w-4 h-4 text-blue-500" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-500" />
                              )}
                              <span className="text-xs text-gray-700 truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {currentProcess.steps.length === 0 && (
                <div className="text-center py-8 text-gray-500" dir="rtl">
                  <Code className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>לא הוגדרו שלבים עדיין</p>
                  <p className="text-sm">לחץ על "הוסף שלב" כדי להתחיל</p>
                </div>
              )}
            </div>

            {/* תצוגה מקדימה של הPrompt */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800" dir="rtl">תצוגה מקדימה - Prompt מלא</h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateFullPrompt())}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span dir="rtl">העתק</span>
                  </button>
                </div>
                
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap" dir="rtl">
                  {generateFullPrompt() || 'אין תוכן להצגה...'}
                </pre>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}