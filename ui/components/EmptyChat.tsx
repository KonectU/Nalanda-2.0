import { Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import SettingsDialog from './SettingsDialog';
import { useState } from 'react';
import { File } from './ChatWindow';
import image from '../public/apple-touch-icon.png';
import { Pencil, BookText, Search } from 'lucide-react';

const focusModes = [
  {
    key: 'writingAssistant',
    title: 'SOP Analyzer',
    description: 'Analyze your SOP',
    icon: <Pencil size={20} />,
  },
  {
    key: 'wolframAlphaSearch',
    title: 'Resume Analyzer',
    description: 'Analyze your Resume',
    icon: <BookText size={20} />,
  },
  {
    key: 'redditSearch',
    title: 'College Finder',
    description: 'Helps Find right Colleges and Courses',
    icon: <Search size={20} />,
  },
];

const EmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleFocusSelect = (focus: string) => {
    setFocusMode(focus);
    setSelectedFocus(focus);
  };

  const handleAdminLogin = (event: React.FormEvent) => {
    event.preventDefault();

    // Simple password check (replace with a more secure method in a real app)
    const correctPassword = 'admin123'; // You can change this to your desired password
    if (adminPassword === correctPassword) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      // Login Page
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
        <img src={image.src} alt="Company Logo" className="w-24 h-20 mb-4" />
        <h1
          className="text-3xl font-bold"
          style={{
            background: 'linear-gradient(to right, #FFD700, #FFFFFF, #FD7217)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Admin Login
        </h1>
        <form onSubmit={handleAdminLogin} className="space-x-4 space-y-4">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="p-2 border rounded"
            placeholder="Enter password"
            required
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative">
      <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      <div className="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
        <Settings
          className="cursor-pointer lg:hidden"
          onClick={() => setIsSettingsOpen(true)}
        />
      </div>
      {selectedFocus === null ? (
        // Focus Selection Page
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
          {/* Logo */}
          <img src={image.src} alt="Company Logo" className="w-24 h-20 mb-4" />
          <h1
            className="text-3xl font-bold"
            style={{
              background: 'linear-gradient(to right, #FFD700, #FFFFFF, #FD7217)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Choose Your Focus
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {focusModes.map((mode) => (
              <div
                key={mode.key}
                onClick={() => handleFocusSelect(mode.key)}
                className="p-4 border rounded-lg hover:shadow-lg cursor-pointer flex flex-col items-center space-y-4"
              >
                {mode.icon}
                <h2
                  className="text-xl font-semibold"
                  style={{
                    background: 'linear-gradient(to right, #FFD700, #FFFFFF, #FD7217)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {mode.title}
                </h2>
                <p className="text-sm text-center">{mode.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Main Chat Page
        <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-8">
          {/* Logo and Title */}
          <header className="flex flex-col items-center p-4 space-y-2">
            <img src={image.src} alt="Company Logo" className="w-24 h-20" />
            <h1
              className="text-2xl lg:text-3xl font-bold"
              style={{
                background: 'linear-gradient(to right, #FFD700, #FFFFFF, #FD7217)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Konect U
            </h1>
          </header>
          <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium -mt-8">
            HEY THERE, I AM NALANDA
          </h2>
          <EmptyChatMessageInput
            sendMessage={sendMessage}
            focusMode={focusMode}
            setFocusMode={setFocusMode}
            optimizationMode={optimizationMode}
            setOptimizationMode={setOptimizationMode}
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files}
            setFiles={setFiles}
          />
        </div>
      )}
    </div>
  );
};

export default EmptyChat;
