// 檔案位置：src/components/admin/RichTextEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link,
  Image,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "開始撰寫你的文章內容...",
  minHeight = "400px" 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 工具列按鈕配置
  const toolbarButtons = [
    { command: 'undo', icon: Undo, title: '復原' },
    { command: 'redo', icon: Redo, title: '重做' },
    '|',
    { command: 'formatBlock', value: '<h1>', icon: Heading1, title: '標題 1' },
    { command: 'formatBlock', value: '<h2>', icon: Heading2, title: '標題 2' },
    { command: 'formatBlock', value: '<h3>', icon: Heading3, title: '標題 3' },
    { command: 'formatBlock', value: '<p>', icon: Type, title: '段落' },
    '|',
    { command: 'bold', icon: Bold, title: '粗體' },
    { command: 'italic', icon: Italic, title: '斜體' },
    { command: 'underline', icon: Underline, title: '底線' },
    '|',
    { command: 'justifyLeft', icon: AlignLeft, title: '靠左對齊' },
    { command: 'justifyCenter', icon: AlignCenter, title: '置中對齊' },
    { command: 'justifyRight', icon: AlignRight, title: '靠右對齊' },
    '|',
    { command: 'insertUnorderedList', icon: List, title: '無序清單' },
    { command: 'insertOrderedList', icon: ListOrdered, title: '有序清單' },
    { command: 'formatBlock', value: '<blockquote>', icon: Quote, title: '引言' },
    '|',
    { command: 'createLink', icon: Link, title: '插入連結' },
    { command: 'insertImage', icon: Image, title: '插入圖片' },
    { command: 'formatBlock', value: '<pre>', icon: Code, title: '程式碼' },
  ];

  // 初始化編輯器內容
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value;
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // 執行編輯命令
  const executeCommand = (command: string, value?: string) => {
    if (command === 'createLink') {
      const url = prompt('請輸入連結網址:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'insertImage') {
      const url = prompt('請輸入圖片網址:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, value);
    }
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleContentChange();
  };

  // 內容變更處理
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // 鍵盤快捷鍵處理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          if (!e.shiftKey) {
            e.preventDefault();
            executeCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          executeCommand('redo');
          break;
      }
    }
  };

  // 處理貼上事件
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleContentChange();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* 工具列 */}
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((button, index) => {
            if (button === '|') {
              return (
                <div key={index} className="w-px h-6 bg-gray-300 mx-1" />
              );
            }

            const ButtonIcon = (button as any).icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => executeCommand((button as any).command, (button as any).value)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title={(button as any).title}
              >
                <ButtonIcon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 編輯區域 */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="p-4 focus:outline-none min-h-96"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />

      {/* 內嵌樣式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            pointer-events: none;
          }
          
          [contenteditable] h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
            line-height: 1.2;
          }
          
          [contenteditable] h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.75em 0;
            line-height: 1.3;
          }
          
          [contenteditable] h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 0.83em 0;
            line-height: 1.4;
          }
          
          [contenteditable] p {
            margin: 1em 0;
            line-height: 1.6;
          }
          
          [contenteditable] blockquote {
            margin: 1em 0;
            padding: 0 1em;
            border-left: 4px solid #E5E7EB;
            background-color: #F9FAFB;
            font-style: italic;
          }
          
          [contenteditable] ul, [contenteditable] ol {
            margin: 1em 0;
            padding-left: 2em;
          }
          
          [contenteditable] li {
            margin: 0.5em 0;
          }
          
          [contenteditable] pre {
            background-color: #F3F4F6;
            padding: 1em;
            border-radius: 0.375rem;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
            white-space: pre-wrap;
          }
          
          [contenteditable] a {
            color: #3B82F6;
            text-decoration: underline;
          }
          
          [contenteditable] img {
            max-width: 100%;
            height: auto;
            border-radius: 0.375rem;
            margin: 1em 0;
          }
          
          [contenteditable] strong {
            font-weight: bold;
          }
          
          [contenteditable] em {
            font-style: italic;
          }
          
          [contenteditable] u {
            text-decoration: underline;
          }
        `
      }} />
    </div>
  );
}