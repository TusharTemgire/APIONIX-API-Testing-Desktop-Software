'use client';

import { ChevronsRight, CodeXml, AlertCircle, CheckCircle, Lightbulb, ChevronsUpDown, Plus, X, Trash2, KeyRound, Eye, EyeClosed, GripVertical, GlobeLock, Loader, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

declare global {
  interface Window {
    electron: {
      saveData: any;
      getSystemInfo: any;
      showMessageBox(arg0: { type: string; title: string; message: string; buttons: string[]; }): unknown;
      sendMessage: (msg: string) => void;
      onMessage: (callback: (msg: string) => void) => void;
    }
  }
}

interface JsonError {
  line: number;
  col: number;
  message: string;
  suggestion?: string;
}

interface JsonSuggestion {
  type: 'format' | 'fix' | 'complete';
  description: string;
  correctedJson: string;
}

interface Tab {
  id: string;
  url: string;
  method: string;
  name: string;
  bodyData: string;
  isActive: boolean;
}

export default function Home() {
  const [msg, setMsg] = useState("");
  const [bodyData, setBodyData] = useState("");
  const [rowCount, setRowCount] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);
  const [jsonErrors, setJsonErrors] = useState<JsonError[]>([]);
  const [jsonSuggestions, setJsonSuggestions] = useState<JsonSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("POST");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [activeRequestTab, setActiveRequestTab] = useState("Body");
  const [activeResponseTab, setActiveResponseTab] = useState("Response");
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      url: 'api.dos9rental.in/api/sites',
      method: 'POST',
      name: 'api.dos9rental.in/api/sites',
      bodyData: '',
      isActive: true
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveToLocalStorage = () => {
    if (!isLoaded) return;

    const appState = {
      msg,
      bodyData,
      selectedMethod,
      authToken,
      activeRequestTab,
      activeResponseTab,
      tabs,
      activeTabId,
      isExpanded,
      isResponseExpanded,
      showToken
    };

    try {
      localStorage.setItem('apionix-app-state', JSON.stringify(appState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedState = localStorage.getItem('apionix-app-state');
      if (savedState) {
        const appState = JSON.parse(savedState);

        setMsg(appState.msg || "");
        setBodyData(appState.bodyData || "");
        setSelectedMethod(appState.selectedMethod || "POST");
        setAuthToken(appState.authToken || "");
        setActiveRequestTab(appState.activeRequestTab || "Body");
        setActiveResponseTab(appState.activeResponseTab || "Response");
        setActiveTabId(appState.activeTabId || '1');
        setIsExpanded(appState.isExpanded || false);
        setIsResponseExpanded(appState.isResponseExpanded || false);
        setShowToken(appState.showToken || false);

        if (appState.tabs && appState.tabs.length > 0) {
          setTabs(appState.tabs);
        } else {
          setTabs([
            {
              id: '1',
              url: 'api.dos9rental.in/api/sites',
              method: 'POST',
              name: 'api.dos9rental.in/api/sites',
              bodyData: '',
              isActive: true
            }
          ]);
        }

        if (appState.bodyData) {
          const lines = appState.bodyData.split('\n').length;
          setRowCount(Math.max(1, lines));
        }
      } else {
        setTabs([
          {
            id: '1',
            url: 'api.dos9rental.in/api/sites',
            method: 'POST',
            name: 'api.dos9rental.in/api/sites',
            bodyData: '',
            isActive: true
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      setTabs([
        {
          id: '1',
          url: 'api.dos9rental.in/api/sites',
          method: 'POST',
          name: 'api.dos9rental.in/api/sites',
          bodyData: '',
          isActive: true
        }
      ]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [msg, bodyData, selectedMethod, authToken, activeRequestTab, activeResponseTab, tabs, activeTabId, isExpanded, isResponseExpanded, showToken, isLoaded]);


  const httpMethods = [
    { name: "GET", color: "#73DC8C" },
    { name: "POST", color: "#DBDE52" },
    { name: "PUT", color: "#FF9500" },
    { name: "PATCH", color: "#50C7E3" },
    { name: "DELETE", color: "#FF6B6B" },
    { name: "HEAD", color: "#9B59B6" },
    { name: "OPTIONS", color: "#95A5A6" }
  ];

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    window.electron?.onMessage((data) => {
      setMsg(data);
    });
  }, []);

  useEffect(() => {
    if (activeTab) {
      setMsg(activeTab.url);
      setSelectedMethod(activeTab.method);
      setBodyData(activeTab.bodyData);
      const lines = activeTab.bodyData.split('\n').length;
      setRowCount(Math.max(1, lines));
    }
  }, [activeTabId, activeTab]);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setShowMethodDropdown(false);
    updateActiveTab({ method });
  };

  const handleAuthTokenChange = (value: string) => {
    setAuthToken(value);
  };

  const handleActiveRequestTabChange = (tab: string) => {
    setActiveRequestTab(tab);
  };

  const handleActiveResponseTabChange = (tab: string) => {
    setActiveResponseTab(tab);
  };

  const toggleMethodDropdown = () => {
    setShowMethodDropdown(!showMethodDropdown);
  };

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, ...updates }
          : tab
      )
    );
  };

  const handleUrlChange = (url: string) => {
    setMsg(url);
    updateActiveTab({ url, name: url || 'New Request' });
  };

  const addNewTab = () => {
    const newTabId = Date.now().toString();
    const newTab: Tab = {
      id: newTabId,
      url: '',
      method: 'GET',
      name: 'New Request',
      bodyData: '',
      isActive: false
    };

    setTabs(prevTabs => [
      ...prevTabs.map(tab => ({ ...tab, isActive: false })),
      { ...newTab, isActive: true }
    ]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (tabs.length === 1) return;

    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    if (tabId === activeTabId) {
      const newActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0;
      const newActiveTabId = newTabs[newActiveIndex]?.id;
      setActiveTabId(newActiveTabId);
    }

    setTabs(newTabs);
  };

  const switchTab = (tabId: string) => {
    if (activeTab) {
      updateActiveTab({
        url: msg,
        bodyData,
        method: selectedMethod,
        name: msg || 'New Request'
      });
    }

    setTabs(prevTabs =>
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }))
    );
    setActiveTabId(tabId);

    const newActiveTab = tabs.find(tab => tab.id === tabId);
    if (newActiveTab) {
      const lines = newActiveTab.bodyData.split('\n').length;
      setRowCount(Math.max(1, lines));
    }
  };

  const getMethodColor = (method: string) => {
    return httpMethods.find(m => m.name === method)?.color || "#73DC8C";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.method-dropdown')) {
        setShowMethodDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateAndSuggestJson = (text: string) => {
    const errors: JsonError[] = [];
    const suggestions: JsonSuggestion[] = [];

    if (!text.trim()) {
      setJsonErrors([]);
      setJsonSuggestions([]);
      return;
    }

    try {
      JSON.parse(text);
      const formatted = JSON.stringify(JSON.parse(text), null, 2);
      if (formatted !== text) {
        suggestions.push({
          type: 'format',
          description: 'Format JSON with proper indentation',
          correctedJson: formatted
        });
      }
    } catch (error: any) {
      const errorMessage = error.message;
      let line = 1, col = 1;
      const positionMatch = errorMessage.match(/position (\d+)/);
      if (positionMatch) {
        const position = parseInt(positionMatch[1]);
        const textBeforeError = text.substring(0, position);
        line = (textBeforeError.match(/\n/g) || []).length + 1;
        col = position - textBeforeError.lastIndexOf('\n');
      }

      let suggestion = '';
      let correctedJson = text;

      if (errorMessage.includes('Unexpected token') || errorMessage.includes('Expected')) {
        const fixes = [
          { pattern: /(\w+)(\s*):/g, replacement: '"$1"$2:' },
          { pattern: /'/g, replacement: '"' },
          { pattern: /,(\s*[}\]])/g, replacement: '$1' },
          { pattern: /}(\s*){/g, replacement: '},$1{' },
          { pattern: /](\s*)\[/g, replacement: '],$1[' },
          { pattern: /"(\s*)"(?=\s*[^\s,}\]])/g, replacement: '"$1",' },
        ];

        for (const fix of fixes) {
          const fixedText = text.replace(fix.pattern, fix.replacement);
          try {
            JSON.parse(fixedText);
            correctedJson = fixedText;
            suggestion = 'Auto-fix common JSON syntax errors';
            break;
          } catch {
            continue;
          }
        }
      }

      errors.push({ line, col, message: errorMessage, suggestion });

      if (correctedJson !== text) {
        suggestions.push({
          type: 'fix',
          description: suggestion || 'Fix JSON syntax errors',
          correctedJson
        });
      }

      if (text.trim().endsWith('{') || text.trim().endsWith('[')) {
        const completed = text.trim().endsWith('{') ? text + '\n}' : text + '\n]';
        suggestions.push({
          type: 'complete',
          description: 'Complete JSON structure',
          correctedJson: completed
        });
      }
    }

    setJsonErrors(errors);
    setJsonSuggestions(suggestions);
  };

  const applySuggestion = (suggestion: JsonSuggestion) => {
    setBodyData(suggestion.correctedJson);
    const lines = suggestion.correctedJson.split('\n').length;
    setRowCount(Math.max(1, lines));
    validateAndSuggestJson(suggestion.correctedJson);
    setShowSuggestions(false);
    updateActiveTab({ bodyData: suggestion.correctedJson });
  };

  const handleBodyDataChange = (value: string) => {
    setBodyData(value);
    const lines = value.split('\n').length;
    setRowCount(Math.max(1, lines));
    validateAndSuggestJson(value);
    updateActiveTab({ bodyData: value });
  };

  const handleHello = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async () => {
    if (msg) {
      setIsLoading(true);
      try {
        window.electron?.sendMessage(msg);
      } catch (error) {
        console.error("Request failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please enter a valid API URL.");
    }
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  const handleResponseExpand = () => {
    setIsResponseExpanded(!isResponseExpanded);
  };

  const formatJsonText = (text: string) => {
    if (!text.trim()) return text;
    try {
      JSON.parse(text);
      let formatted = text;
      formatted = formatted.replace(/:\s*"([^"]*)"/g, ': <span style="color: #73DC8C">"$1"</span>');
      formatted = formatted.replace(/"([^"]+)"(\s*):/g, '<span style="color: #FA9BFA">"$1"</span>$2<span style="color: #FA9BFA">:</span>');
      formatted = formatted.replace(/:\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, ': <span style="color: #73DC8C">$1</span>');
      formatted = formatted.replace(/:\s*(true|false|null)(?=\s*[,}\]])/g, ': <span style="color: #73DC8C">$1</span>');
      formatted = formatted.replace(/([{}[\]])/g, '<span style="color: #FA9BFA">$1</span>');
      formatted = formatted.replace(/,(?=\s*["\]}])/g, '<span style="color: #FA9BFA">,</span>');
      return formatted;
    } catch {
      return `<span style="color: #ffffff80">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center gap-1 justify-center bg-[#191515]">
        <Loader className='animate-spin' size={14}/>
        <div className="text-white/60 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#191515] p-2">
      {/* <h1 className="text-3xl text-white font-medium mb-2">ElectronJS</h1> */}
      <div className="w-full mb-1">
        <div className="flex items-center">
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`
                    group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer
                    transition-all duration-200 min-w-[100px] max-w-[200px]
                    ${tab.isActive
                      ? 'bg-[#201C1C]'
                      : 'hover:bg-[#242424]'
                    }
                  `}
                  onClick={() => switchTab(tab.id)}
                >
                  <span
                    className="text-[10px] font-medium px-1 py-0.5 rounded"
                    style={{ color: getMethodColor(tab.method) }}
                  >
                    {tab.method}
                  </span>

                  <span className="text-white/80 text-[10px] truncate flex-1 min-w-0">
                    {tab.name || 'New Request'}
                  </span>
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => closeTab(tab.id, e)}
                      className="hover:bg-white/10 bg-white/5 p-0.5 rounded transition-all duration-200"
                    >
                      <X size={10} className="text-white/60 hover:text-white/80" />
                    </button>
                  )}
                </div>
              ))}
              <div className="w-px h-5 bg-gray-600/20 mx-1 flex-shrink-0"></div>
              <button
                onClick={addNewTab}
                className="p-1 hover:bg-white/5 rounded-md transition-colors duration-200 flex-shrink-0"
              >
                <Plus size={14} className="text-white/60 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1C1818] w-full p-1.5 border flex items-center justify-center border-gray-600/20 rounded-lg mb-2">
        <div className="relative method-dropdown">
          <button
            onClick={toggleMethodDropdown}
            className="hover:bg-white/5 flex justify-center gap-1 items-center text-xs px-2 py-1 rounded-md"
            style={{ color: httpMethods.find(m => m.name === selectedMethod)?.color }}
          >
            {selectedMethod}
            <ChevronsUpDown size={14} />
          </button>

          {showMethodDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-[#2a2a2a] border border-gray-600/20 rounded-lg shadow-lg z-50 min-w-[100px]">
              {httpMethods.map((method) => (
                <button
                  key={method.name}
                  onClick={() => handleMethodSelect(method.name)}
                  className="w-full px-3 py-1 font-medium text-xs hover:bg-white/5 first:rounded-t-md last:rounded-b-md transition-colors"
                  style={{ color: method.color }}
                >
                  {method.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="https://api.example.com"
          className="flex-1 bg-transparent  placeholder:text-white/40 text-white text-sm outline-none border-gray-600/20 mr-2 px-1 py-1"
          value={msg}
          onChange={(e) => handleUrlChange(e.target.value)}
          onMouseEnter={(e) => (e.target as HTMLInputElement).placeholder = "Enter API URL, e.g., https://api.example.com"}
          onMouseLeave={(e) => (e.target as HTMLInputElement).placeholder = "https://api.example.com"}
        />
        <div className="flex gap-1.5">
        <button
          onClick={handleHello}
          disabled={isLoading}
          className={`
            flex justify-center items-center text-black text-xs px-2 py-1 rounded-md shadow-[0_0_5px_rgba(115,220,140,0.2)]
            transition-all duration-200
            ${isLoading 
              ? 'bg-[#5ea372] cursor-not-allowed' 
              : 'bg-[#73DC8C] hover:bg-[#66c97f]'
            }
          `}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin mr-1" size={12} />
              Sending
            </>
          ) : (
            'Send'
          )}
        </button>
        <button
          className="hover:bg-[#1a1a1a] bg-[#2a2a2a] border border-gray-600/20 p-1 flex justify-center items-center text-white rounded-md"
        >
          <GlobeLock size={14} />
        </button>
        </div>
      </div>

      <div className='w-full h-[calc(100vh-200px)]'>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <div className="bg-[#1C1818] w-full h-full p-2 border border-gray-600/20 rounded-lg">
              <div className="flex items-center justify-start gap-1 mb-3">
                <button
                  onClick={() => handleActiveRequestTabChange("Params")}
                  className={`border border-gray-500/20 flex justify-center items-center text-xs px-2 py-1 rounded-md transition-colors ${activeRequestTab === "Params"
                    ? "bg-black/5 text-white border-gray-500/20"
                    : "bg-black/20 hover:bg-black/5 text-white/50"
                    }`}
                >
                  Params
                </button>
                <button
                  onClick={() => handleActiveRequestTabChange("Headers")}
                  className={`border border-gray-500/20 flex justify-center items-center text-xs px-2 py-1 rounded-md transition-colors ${activeRequestTab === "Headers"
                    ? "bg-black/5 text-white border-gray-500/20"
                    : "bg-black/20 hover:bg-black/5 text-white/50"
                    }`}
                >
                  Headers
                </button>
                <button
                  onClick={() => handleActiveRequestTabChange("Auth")}
                  className={`border border-gray-500/20 flex justify-center items-center text-xs px-2 py-1 rounded-md transition-colors ${activeRequestTab === "Auth"
                    ? "bg-black/5 text-white border-gray-500/20"
                    : "bg-black/20 hover:bg-black/5 text-white/50"
                    }`}
                >
                  Auth
                </button>
                <button
                  onClick={() => handleActiveRequestTabChange("Body")}
                  className={`border border-gray-500/20 flex justify-center items-center text-xs px-2 py-1 rounded-md transition-colors ${activeRequestTab === "Body"
                    ? "bg-black/5 text-white border-gray-500/20"
                    : "bg-black/20 hover:bg-black/5 text-white/50"
                    }`}
                >
                  Body
                </button>
                <div className='flex justify-end w-full gap-2'>
                  {activeRequestTab === "Body" && bodyData.trim() && (
                    <div className="flex items-center gap-1">
                      {jsonErrors.length > 0 ? (
                        <AlertCircle size={14} className="text-red-400" />
                      ) : (
                        <CheckCircle size={14} className="text-green-400" />
                      )}
                      <span className={`text-xs ${jsonErrors.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {jsonErrors.length > 0 ? 'Invalid JSON' : 'Valid JSON'}
                      </span>
                    </div>
                  )}

                  {activeRequestTab === "Body" && jsonSuggestions.length > 0 && (
                    <button
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-600/20 p-1 flex justify-center items-center text-yellow-400 rounded-md relative"
                    >
                      <Lightbulb size={14} />
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {jsonSuggestions.length}
                      </span>
                    </button>
                  )}
                  <button
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-600/20 p-1 flex justify-center items-center text-white rounded-md"
                  >
                    <CodeXml size={14} />
                  </button>
                </div>
              </div>

              {activeRequestTab === "Auth" && (
                <div className="h-[calc(100%-60px)]">
                  <div className='flex items-center gap-2 border rounded-lg hover:border-[#4B78E6]/50 border-gray-600/20 px-2 py-1 mt-2'>
                    <KeyRound className='text-white/50' size={14} />
                    <input
                      type={showToken ? "text" : "password"}
                      placeholder="Authorization token"
                      className="flex-1 bg-transparent placeholder:text-white/40 text-white text-xs outline-none"
                      value={authToken}
                      onChange={(e) => handleAuthTokenChange(e.target.value)}
                    />
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                    >
                      {showToken ? (
                        <EyeClosed className='text-white/50 hover:text-white/70' size={14} />
                      ) : (
                        <Eye className='text-white/50 hover:text-white/70' size={14} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeRequestTab === "Body" && (
                <>
                  {showSuggestions && jsonSuggestions.length > 0 && (
                    <div className="mb-2 bg-black/30 border border-yellow-400/20 rounded-xl p-2">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Lightbulb size={14} className="text-yellow-400" />
                        <h3 className="text-yellow-400 text-xs font-medium">JSON Suggestions</h3>
                      </div>
                      <div className="space-y-1.5">
                        {jsonSuggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between bg-black/20 p-1.5 rounded border border-gray-600/20">
                            <div className="flex-1">
                              <p className="text-white/80 text-xs">{suggestion.description}</p>
                              <p className="text-white/50 text-[10px] capitalize">{suggestion.type}</p>
                            </div>
                            <button
                              onClick={() => applySuggestion(suggestion)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {jsonErrors.length > 0 && (
                    <div className="mb-3 bg-red-900/20 border border-red-400/20 rounded-xl p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={14} className="text-red-400" />
                        <h3 className="text-red-400 text-xs font-medium">JSON Errors</h3>
                      </div>
                      <div className="space-y-1.5">
                        {jsonErrors.map((error, index) => (
                          <div key={index} className="bg-black/20 p-1.5 rounded border border-red-600/20">
                            <p className="text-red-300 text-xs">Line {error.line}, Column {error.col}</p>
                            <p className="text-white/80 text-xs">{error.message}</p>
                            {error.suggestion && (
                              <p className="text-yellow-300 text-xs mt-0.5">💡 {error.suggestion}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="relative h-[calc(100%-60px)]">
                    <div className="absolute left-0 top-0 w-8 h-full border-gray-600/20 flex flex-col text-white/30 text-xs font-mono pt-1">
                      {Array.from({ length: rowCount }, (_, i) => (
                        <div
                          key={i + 1}
                          className={`h-[1.4em] flex items-center justify-center leading-none ${jsonErrors.some(error => error.line === i + 1) ? 'text-red-400 bg-red-900/20' : ''
                            }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div className="relative w-full h-full">
                      <textarea
                        className="absolute inset-0 w-full h-full bg-transparent placeholder:text-white/5 text-transparent text-xs outline-none pl-10 pr-2 py-1 resize-none font-mono z-10"
                        placeholder="Enter body data here..."
                        value={bodyData}
                        onChange={(e) => handleBodyDataChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setRowCount(prev => Math.min(prev + 1, 100));
                          }
                          if (e.key === 'Backspace') {
                            const textarea = e.target as HTMLTextAreaElement;
                            const cursorPos = textarea.selectionStart;
                            const textBefore = textarea.value.substring(0, cursorPos);
                            if (cursorPos > 0 && textBefore.endsWith('\n')) {
                              setTimeout(() => {
                                const newLines = textarea.value.split('\n').length;
                                setRowCount(Math.max(1, newLines));
                              }, 0);
                            }
                          }
                        }}
                        style={{
                          lineHeight: '1.4',
                          caretColor: 'white'
                        }}
                      />
                      <pre
                        className="absolute inset-0 w-full h-full text-xs pl-10 pr-2 py-1 font-mono pointer-events-none overflow-hidden whitespace-pre-wrap"
                        style={{
                          lineHeight: '1.4',
                          color: '#ffffff80'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: bodyData ? formatJsonText(bodyData) : '<span style="color: #ffffff40">Enter body data here...</span>'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeRequestTab === "Params" && (
                <div className="h-[calc(100%-60px)] flex items-center justify-center">
                  <p className="text-white/50 text-sm">Params configuration coming soon...</p>
                </div>
              )}

              {activeRequestTab === "Headers" && (
                <div className="h-[calc(100%-60px)] overflow-y-auto">
                  <div className="flex flex-col gap-1">
                    <div className='flex items-center gap-1 '>
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="accent-[#DBDE52] h-3 w-3 cursor-pointer"
                        />
                        <GripVertical size={14} className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing" />
                      </div>
                      <input
                        type="text"
                        placeholder="Content-Type"
                        className="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="application/json"
                        className="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5"
                      />
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                      >
                        <Trash2 className='text-white/50 hover:text-white/70' size={14} />
                      </button>
                    </div>

                    <div className='flex items-center gap-1'>
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="accent-[#DBDE52] h-3 w-3 cursor-pointer"
                        />
                        <GripVertical size={14} className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing" />
                      </div>
                      <input
                        type="text"
                        placeholder="Authorization"
                        className="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Bearer token"
                        className="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5"
                      />
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                      >
                        <Trash2 className='text-white/50 hover:text-white/70' size={14} />
                      </button>
                    </div>

                    <div className='flex items-center gap-1'>
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="accent-[#DBDE52] h-3 w-3 cursor-pointer"
                        />
                        <GripVertical size={14} className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing" />
                      </div>
                      <input
                        type="text"
                        placeholder="Accept"
                        className="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="application/json"
                        className="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5"
                      />
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                      >
                        <Trash2 className='text-white/50 hover:text-white/70' size={14} />
                      </button>
                    </div>

                    <div className='flex items-center gap-1 mt-1'>
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="accent-[#DBDE52] h-3 w-3 cursor-pointer"
                        />
                        <GripVertical size={14} className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing" />
                      </div>
                      <input
                        type="text"
                        value="Content-Type"
                        readOnly
                        className="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 text-white/70 text-xs outline-none px-2 py-1.5"
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value="multipart/form-data"
                          readOnly
                          className="w-full bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 text-white/70 text-xs outline-none px-2 py-1.5"
                        />
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              console.log("File selected:", file.name);
                            }
                          }}
                        />
                      </div>
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                      >
                        <Trash2 className='text-white/50 hover:text-white/70' size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const headerRow = document.createElement('div');
                        headerRow.className = 'flex items-center gap-1 mt-1';
                        headerRow.innerHTML = `
                          <div class="flex items-center gap-1">
                            <input type="checkbox" checked class="accent-[#DBDE52] h-3 w-3 cursor-pointer">
                            <svg class="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 6V8M9 12V14M9 18V20M15 6V8M15 12V14M15 18V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          </div>
                          <input type="text" placeholder="Header name" class="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5">
                          <input type="text" placeholder="Header value" class="flex-1 bg-transparent border rounded-lg border-gray-600/20 hover:border-[#4B78E6]/50 placeholder:text-white/40 text-white text-xs outline-none px-2 py-1.5">
                          <button class="p-1 hover:bg-white/10 rounded transition-colors duration-200">
                            <svg class="text-white/50 hover:text-white/70" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6H5M5 6H21M5 6V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V6M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M10 11V17M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          </button>
                        `;

                        const addButton = document.querySelector('.flex.items-center.gap-1\\.5.text-\\[\\#4B78E6\\]');
                        if (addButton && addButton.parentNode) {
                          addButton.parentNode.insertBefore(headerRow, addButton);
                        }
                      }}
                      className="flex items-center gap-1.5 text-[#4B78E6] text-xs border border-dashed border-gray-600/20 hover:border-[#4B78E6]/50 rounded-lg px-2 py-1.5 mt-1 transition-colors"
                    >
                      <Plus size={12} />
                      Add New Header
                    </button>

                    <div className="flex items-center gap-1.5 text-[#73DC8C] text-xs border border-dashed border-gray-600/20 hover:border-[#73DC8C]/50 rounded-lg px-2 py-1.5 mt-1 transition-colors cursor-pointer">
                      <Plus size={12} />
                      <label className="flex-1 cursor-pointer">
                        Add File Upload
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              console.log("File selected for upload:", file.name);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="mt-4 bg-black/20 rounded-lg p-2 border border-gray-600/20">
                      <p className="text-white/60 text-xs mb-1">Common Headers:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-[#4B78E6] text-xs">Content-Type</span>
                        <span className="text-white/50 text-xs">application/json</span>

                        <span className="text-[#4B78E6] text-xs">Accept</span>
                        <span className="text-white/50 text-xs">application/json</span>

                        <span className="text-[#4B78E6] text-xs">Authorization</span>
                        <span className="text-white/50 text-xs">Bearer token</span>

                        <span className="text-[#4B78E6] text-xs">Content-Type</span>
                        <span className="text-white/50 text-xs">multipart/form-data</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 cursor-col-resize" />

          <Panel defaultSize={50} minSize={30}>
            <div className="bg-[#201C1C] w-full h-full p-2 border border-gray-600/20 rounded-lg">
              <div className="flex items-center justify-start gap-1 mb-1.5">
                <button
                  onClick={() => handleActiveResponseTabChange("Request")}
                  className={`hover:bg-black/10 border border-gray-500/20 flex gap-1 justify-center items-center text-xs px-2 py-1 rounded-md transition-colors ${activeResponseTab === "Request"
                      ? "bg-black/5 text-white border-gray-500/20"
                      : "text-white/50"
                    }`}
                >
                  Request
                  <h2 className="text-[#73DC8C] text-xs">{selectedMethod}</h2>
                </button>
                <button
                  onClick={() => handleActiveResponseTabChange("Response")}
                  className={`hover:bg-black/10 border border-gray-500/20 flex gap-1 justify-center items-center text-xs px-2 py-1 rounded-md transition-colors ${activeResponseTab === "Response"
                      ? "bg-black/5 text-white border-gray-500/20"
                      : "text-white/50"
                    }`}
                >
                  Response
                  <h2 className="text-[#73DC8C] text-xs">200</h2>
                </button>
              </div>

              <div className="">
                {activeResponseTab === "Request" && (
                  <div>
                    <div
                      className={`
                        overflow-hidden rounded-md -mt-1
                        transition-all duration-300 ease-in-out
                        ${isExpanded ? 'max-h-96' : 'max-h-12'}
                      `}
                    >
                      <div
                        className="hover:bg-black/10 flex gap-1 justify-start items-center text-white/50 text-xs px-2 py-1"
                      >
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className={`
                            bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-600/20 p-1 
                            flex justify-center items-center text-white rounded-md
                            transition-transform duration-300 ease-in-out
                            ${isExpanded ? 'rotate-90' : 'rotate-0'}
                          `}
                        >
                          <ChevronsRight size={14} />
                        </button>
                        <h2 className="text-[#73DC8C] flex items-center gap-1 text-[13px] whitespace-nowrap overflow-hidden">
                          <span>{selectedMethod}</span>
                          <span className="text-white font-mono truncate max-w-[200px]">
                            {msg || 'https://apionix/api/users'}
                          </span>
                          <span className="text-white/40 border border-gray-700/50 shadow-sm bg-white/5 px-1.5 rounded text-[10px] font-mono flex-shrink-0">HTTP/1.1</span>
                        </h2>
                      </div>

                      <div className={`
                        pb-2 text-white/50 text-xs space-y-2
                        transition-opacity duration-300 ease-in-out
                        ${isExpanded ? 'opacity-100' : 'opacity-0'}
                      `}>
                        <div className="bg-black/20 p-3 rounded-md">
                          <p className="text-[#73DC8C] font-extrabold mb-1">{selectedMethod}</p>
                          <div className='border-t border-gray-600/10'></div>
                          <div className="space-y-2 mt-1 text-white/60">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-[#4B78E6]">Content-Type</span>
                              <span>application/json</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-[#4B78E6]">Host</span>
                              <span>{msg ? new URL(`https://${msg.replace(/^https?:\/\//, '')}`).hostname : 'api.dos9rental.in'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-[#4B78E6]">User-Agent</span>
                              <span>APIONIX</span>
                            </div>
                            {authToken && (
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-[#4B78E6]">Authorization</span>
                                <span>Bearer {authToken.substring(0, 20)}...</span>
                              </div>
                            )}
                          </div>
                          {bodyData && (
                            <>
                              <div className='border-t border-gray-600/10 mt-2'></div>
                              <div className="mt-2">
                                <p className="text-[#4B78E6] text-xs mb-1">Request Body:</p>
                                <pre className="text-white/60 text-xs whitespace-pre-wrap break-words">
                                  {bodyData}
                                </pre>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeResponseTab === "Response" && (
                  <div>
                    <div
                      className={`
                        overflow-hidden rounded-md -mt-1
                        transition-all duration-300 ease-in-out
                        ${isResponseExpanded ? 'max-h-96' : 'max-h-12'}
                      `}
                    >
                      <div
                        className="hover:bg-black/10 flex gap-1 justify-start items-center text-white/50 text-xs px-2 py-1"
                      >
                        <button
                          onClick={handleResponseExpand}
                          className={`
                            bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-600/20 p-1 
                            flex justify-center items-center text-white rounded-md
                            transition-transform duration-300 ease-in-out
                            ${isResponseExpanded ? 'rotate-90' : 'rotate-0'}
                          `}
                        >
                          <ChevronsRight size={14} />
                        </button>

                        <h2 className="text-[#73DC8C] text-[13px]">200 OK</h2>
                      </div>

                      <div className={`
                        pb-2 text-white/50 text-xs space-y-2
                        transition-opacity duration-300 ease-in-out
                        ${isResponseExpanded ? 'opacity-100' : 'opacity-0'}
                      `}>
                        <div className="bg-black/20 p-2 sm:p-3 rounded-md overflow-x-auto">
                          <div className="flex items-center justify-end">
                            <p className="text-[#73DC8C] text-xs font-extrabold mb-1">HTTP/1.1 200 OK</p>
                            <span className="text-white/40 text-[10px] ml-auto">200ms</span>
                          </div>
                          <div className='border-t border-gray-600/10'></div>
                          <div className="space-y-2 text-white/60 mt-1 min-w-[300px] style={{ fontFamily: 'PolySansMono,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace' }}">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Access-Control-Allow-Origin</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">*</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Connection</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">close</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Content-Length</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">2</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Content-Type</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">application/json; charset=utf-8</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Date</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">Tue, 03 Jun 2025 11:04:57 GMT</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Etag</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Server</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">nginx/1.24.0 (Ubuntu)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">Set-Cookie</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">connect.sid=s%3A2jkIfL-OH0Qrxph37ZL8qMvw9EgAcwXX.crDNns9zlgPrCc9pO4n%2B%2B5V7m7O6NRYyEbW1qitXTxs; Path=/; HttpOnly</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <span className="text-[#4B78E6] text-xs">X-Powered-By</span>
                              <span className="text-xs break-all ml-4 sm:ml-0">Express</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <h3 className="text-[#73DC8C] text-xs font-medium mb-1">Response Body</h3>
                      <textarea
                        className="w-full h-80 bg-black/20 backdrop-blur-md p-2 rounded-md overflow-x-auto text-white/80 text-xs whitespace-pre-wrap break-words outline-none resize-none"
                        style={{
                          fontFamily: 'PolySansMono,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace'
                        }}
                        value="Cannot GET /api/users"
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}