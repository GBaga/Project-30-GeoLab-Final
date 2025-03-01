import { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageChanger = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  const languages = [
    { code: "ka", label: "ქარ", flag: "🇬🇪" },
    { code: "en", label: "Eng", flag: "🇬🇧" },
  ];

  return (
    <div className=" flex flex-col gap-0">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          className={`text-white px-3 py-1 rounded flex items-center gap-1 ${
            currentLang === code ? "bg-blue-600" : ""
          }`}
          onClick={() => changeLanguage(code)}
        >
          <span>{flag}</span> {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageChanger;
