import React from "react";
import FadeInSection from "../Animations/FadeInSection.jsx"; // استيراد مكون التأثير التدريجي
import { useTranslation } from "react-i18next"; // استيراد هوك الترجمة

const SearchInput = ({ setSearchTerm }) => {
  const { t } = useTranslation(); // استخدام هوك الترجمة للحصول على النص المترجم

  return (
    <FadeInSection delay={0.1}>
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder={t('search_input.placeholder')} // استخدام الترجمة من i18n.js
          className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring focus:ring-[#A67C52] focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)} // ✅ تحديث البحث عند تغيير الإدخال
        />
      </div>
    </FadeInSection>
  );
};

export default SearchInput;

