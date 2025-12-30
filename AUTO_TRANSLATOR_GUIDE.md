# Руководство по созданию автотранслейтера

Это руководство покажет вам, как создать систему автотрансляции для любого React-проекта, точно такую же, как в GlobalOlimpiad.

## 📋 Содержание

1. [Установка](#установка)
2. [Создание TranslationContext](#создание-translationcontext)
3. [Интеграция в приложение](#интеграция-в-приложение)
4. [Использование](#использование)
5. [Настройки UI](#настройки-ui)
6. [Примеры](#примеры)

---

## 📦 Установка

Для этой системы **не требуется установка дополнительных пакетов** - она использует только встроенные возможности React и Google Translate API.

---

## 🔧 Создание TranslationContext

Создайте файл `src/context/TranslationContext.jsx` (или `src/contexts/TranslationContext.jsx`):

```jsx
import { createContext, useContext, useState, useEffect } from "react";

const TranslationContext = createContext(null);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
};

// Ключи для localStorage (измените на свои)
const STORAGE_KEY = "my_app_auto_translate";
const STORAGE_LANGUAGE_KEY = "my_app_translate_language";

// Маппинг локали браузера на код языка Google Translate
const mapGoogleLocaleToLanguage = (locale) => {
  if (!locale) return "en";
  const localeLower = locale.toLowerCase();
  const langCode = localeLower.split("-")[0];
  
  // Список поддерживаемых языков Google Translate
  const supportedCodes = [
    "en", "es", "fr", "de", "ru", "zh", "ja", "ar", "pt", "it", "ko", "hi",
    "tr", "pl", "nl", "sv", "da", "fi", "no", "cs", "hu", "ro", "bg", "hr",
    "sk", "sl", "et", "lv", "lt", "uk", "el", "he", "th", "vi", "id", "ms",
    "fil", "sw", "uz"
  ];
  
  return supportedCodes.includes(langCode) ? langCode : "en";
};

// Функция перевода текста через Google Translate API
const translateText = async (text, targetLanguage) => {
  if (!text || targetLanguage === "en") return text;
  
  try {
    // Используем бесплатный публичный эндпоинт Google Translate
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
    );
    
    if (!response.ok) {
      console.error("Translation API error:", response.status);
      return text;
    }
    
    const data = await response.json();
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

// Переводит все текстовые узлы в элементе
const translateElement = async (element, targetLanguage) => {
  if (!element || targetLanguage === "en") return;
  
  // Создаем TreeWalker для обхода всех текстовых узлов
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    // Пропускаем элементы с data-translate="false"
    if (node.parentElement?.getAttribute("data-translate") === "false") {
      continue;
    }
    
    // Пропускаем скрипты и стили
    const parentTag = node.parentElement?.tagName?.toLowerCase();
    if (parentTag === "script" || parentTag === "style") {
      continue;
    }
    
    const text = node.textContent.trim();
    // Переводим только текст длиной от 1 до 500 символов
    if (text && text.length > 0 && text.length < 500) {
      textNodes.push({ node, text });
    }
  }
  
  // Переводим текстовые узлы по очереди
  for (const { node, text } of textNodes) {
    try {
      const translated = await translateText(text, targetLanguage);
      if (translated && translated !== text) {
        node.textContent = translated;
      }
    } catch (error) {
      console.error("Error translating text:", error);
    }
  }
  
  // Переводим атрибуты элементов с data-translate-attr
  const elementsWithAttributes = element.querySelectorAll("[data-translate-attr]");
  for (const el of elementsWithAttributes) {
    const attrs = el.getAttribute("data-translate-attr").split(",");
    for (const attr of attrs) {
      const value = el.getAttribute(attr.trim());
      if (value) {
        try {
          const translated = await translateText(value, targetLanguage);
          if (translated && translated !== value) {
            el.setAttribute(attr.trim(), translated);
          }
        } catch (error) {
          console.error("Error translating attribute:", error);
        }
      }
    }
  }
};

export const TranslationProvider = ({ children }) => {
  // Состояние автотрансляции (по умолчанию включено)
  const [autoTranslate, setAutoTranslate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? saved === "true" : true;
  });
  
  // Состояние целевого языка
  const [targetLanguage, setTargetLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_LANGUAGE_KEY);
    if (saved) return saved;
    
    // Определяем язык из браузера
    const browserLang = navigator.language || navigator.userLanguage;
    return mapGoogleLocaleToLanguage(browserLang);
  });
  
  const [isTranslating, setIsTranslating] = useState(false);

  // Инициализация языка из Google локали (опционально)
  const initializeFromGoogleLocale = (googleLocale) => {
    if (googleLocale && !localStorage.getItem(STORAGE_LANGUAGE_KEY)) {
      const mappedLang = mapGoogleLocaleToLanguage(googleLocale);
      setTargetLanguage(mappedLang);
      localStorage.setItem(STORAGE_LANGUAGE_KEY, mappedLang);
    }
  };

  // Включить/выключить автотрансляцию
  const toggleAutoTranslate = (enabled) => {
    setAutoTranslate(enabled);
    localStorage.setItem(STORAGE_KEY, enabled.toString());
    
    if (enabled) {
      translatePage(targetLanguage);
    } else {
      // Перезагружаем страницу для отображения оригинального текста
      window.location.reload();
    }
  };

  // Изменить целевой язык
  const changeLanguage = (lang) => {
    if (lang === targetLanguage) return;
    
    setTargetLanguage(lang);
    localStorage.setItem(STORAGE_LANGUAGE_KEY, lang);
    
    if (autoTranslate) {
      // Перезагружаем страницу для применения нового языка
      window.location.reload();
    }
  };

  // Перевести всю страницу
  const translatePage = async (lang) => {
    if (!lang || lang === "en") return;
    
    setIsTranslating(true);
    try {
      // Переводим навбар (если есть класс .navbar)
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        await translateElement(navbar, lang);
      }
      
      // Переводим основной контент
      const mainContent = document.querySelector(".main-content") || document.body;
      await translateElement(mainContent, lang);
    } catch (error) {
      console.error("Error translating page:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Автоперевод при монтировании компонента
  useEffect(() => {
    if (autoTranslate && targetLanguage !== "en") {
      // Ждем загрузки страницы
      const timer = setTimeout(() => {
        translatePage(targetLanguage);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoTranslate, targetLanguage]);

  // Переводчик новый контент при изменении DOM (например, при смене роута)
  useEffect(() => {
    if (autoTranslate && targetLanguage !== "en") {
      let timeoutId;
      const observer = new MutationObserver(() => {
        if (!isTranslating) {
          // Debounce для избежания слишком частых запросов
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            translatePage(targetLanguage);
          }, 500);
        }
      });
      
      // Отслеживаем изменения в навбаре и основном контенте
      const navbar = document.querySelector(".navbar");
      const mainContent = document.querySelector(".main-content") || document.body;
      
      if (navbar) {
        observer.observe(navbar, {
          childList: true,
          subtree: true,
        });
      }
      
      if (mainContent) {
        observer.observe(mainContent, {
          childList: true,
          subtree: true,
        });
      }
      
      return () => {
        observer.disconnect();
        clearTimeout(timeoutId);
      };
    }
  }, [autoTranslate, targetLanguage, isTranslating]);

  // Список доступных языков
  const value = {
    autoTranslate,
    targetLanguage,
    isTranslating,
    toggleAutoTranslate,
    changeLanguage,
    translatePage,
    initializeFromGoogleLocale,
    availableLanguages: [
      { code: "en", name: "English" },
      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
      { code: "de", name: "Deutsch" },
      { code: "ru", name: "Русский" },
      { code: "zh", name: "中文" },
      { code: "ja", name: "日本語" },
      { code: "ar", name: "العربية" },
      { code: "pt", name: "Português" },
      { code: "it", name: "Italiano" },
      { code: "ko", name: "한국어" },
      { code: "hi", name: "हिन्दी" },
      { code: "tr", name: "Türkçe" },
      { code: "uz", name: "Oʻzbek" },
      { code: "pl", name: "Polski" },
      { code: "nl", name: "Nederlands" },
      { code: "sv", name: "Svenska" },
      { code: "da", name: "Dansk" },
      { code: "fi", name: "Suomi" },
      { code: "no", name: "Norsk" },
      { code: "uk", name: "Українська" },
      // Добавьте больше языков по необходимости
    ],
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
```

---

## 🔌 Интеграция в приложение

Оберните ваше приложение в `TranslationProvider`:

```jsx
// src/App.jsx
import { TranslationProvider } from "./context/TranslationContext";

function App() {
  return (
    <TranslationProvider>
      {/* Ваше приложение */}
    </TranslationProvider>
  );
}
```

Или если используете Router:

```jsx
// src/main.jsx или src/App.jsx
import { BrowserRouter } from "react-router-dom";
import { TranslationProvider } from "./context/TranslationContext";

function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        {/* Ваши роуты */}
      </BrowserRouter>
    </TranslationProvider>
  );
}
```

---

## 🎯 Использование

### В компонентах

```jsx
import { useTranslation } from '../context/TranslationContext';

function MyComponent() {
  const { 
    autoTranslate,
    targetLanguage,
    toggleAutoTranslate,
    changeLanguage,
    isTranslating,
    availableLanguages
  } = useTranslation();

  return (
    <div>
      <h1>Мой компонент</h1>
      <button onClick={() => toggleAutoTranslate(!autoTranslate)}>
        {autoTranslate ? 'Выключить перевод' : 'Включить перевод'}
      </button>
      
      <select 
        value={targetLanguage} 
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Исключение элементов из перевода

Добавьте атрибут `data-translate="false"`:

```jsx
<button data-translate="false">
  Этот текст не будет переведен
</button>
```

### Перевод атрибутов

Для перевода атрибутов (например, `title`, `placeholder`):

```jsx
<input 
  type="text"
  placeholder="Введите имя"
  data-translate-attr="placeholder,title"
  title="Введите ваше имя"
/>
```

---

## 🎨 Настройки UI

### Простой компонент настроек

```jsx
// src/components/TranslationSettings.jsx
import { useTranslation } from '../context/TranslationContext';

export default function TranslationSettings() {
  const {
    autoTranslate,
    targetLanguage,
    toggleAutoTranslate,
    changeLanguage,
    isTranslating,
    availableLanguages
  } = useTranslation();

  return (
    <div className="translation-settings">
      <h2>🌐 Автоперевод</h2>
      
      <label>
        <input
          type="checkbox"
          checked={autoTranslate}
          onChange={(e) => toggleAutoTranslate(e.target.checked)}
          data-translate="false"
        />
        Включить автоперевод
      </label>
      
      {autoTranslate && (
        <div data-translate="false">
          <label>
            Язык перевода:
            <select
              value={targetLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              disabled={isTranslating}
              data-translate="false"
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code} data-translate="false">
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>
          </label>
          
          {isTranslating && <p data-translate="false">Переводится...</p>}
        </div>
      )}
    </div>
  );
}
```

---

## 🔍 Важные моменты

### 1. Селекторы элементов

В функции `translatePage` используются селекторы `.navbar` и `.main-content`. Измените их на селекторы вашего проекта:

```jsx
// В функции translatePage
const navbar = document.querySelector(".your-navbar-class"); // или "#navbar"
const mainContent = document.querySelector(".your-main-class") || document.body;
```

### 2. Ключи localStorage

Измените ключи на уникальные для вашего проекта:

```jsx
const STORAGE_KEY = "my_app_auto_translate";
const STORAGE_LANGUAGE_KEY = "my_app_translate_language";
```

### 3. Ограничения Google Translate API

- Бесплатный эндпоинт может иметь лимиты на количество запросов
- Для продакшена рекомендуется использовать официальный Google Cloud Translation API
- Текст переводится по частям (до 500 символов)

### 4. Производительность

- Перевод происходит асинхронно
- Используется debounce для избежания частых запросов
- MutationObserver отслеживает только изменения в определенных областях

---

## 🚀 Пример полной интеграции

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "./context/TranslationContext";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <div className="app">
          <nav className="navbar">
            {/* Навбар - будет автоматически переведен */}
          </nav>
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;
```

---

## 📝 Примечания

1. **Бесплатный API**: Используется публичный эндпоинт Google Translate, который может иметь ограничения
2. **CORS**: Эндпоинт работает из браузера, но может блокироваться некоторыми расширениями
3. **Качество перевода**: Качество зависит от Google Translate
4. **Производительность**: Для больших страниц перевод может занять время

---

## ✅ Готово!

Теперь у вас есть полнофункциональная система автотрансляции, точно такая же, как в GlobalOlimpiad! 🎉

