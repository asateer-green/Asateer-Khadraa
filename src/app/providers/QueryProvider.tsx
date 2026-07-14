import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // إعدادات افتراضية ذكية ومريحة للـ Dashboard:
            staleTime: 1000 * 60 * 5, // البيانات تعتبر طازة (Fresh) لمدة 5 دقائق قبل ما يحاول يجددها كاش
            gcTime: 1000 * 60 * 10, // الاحتفاظ بالبيانات في الكاش الميت لمدة 10 دقائق (كانت تسمى cacheTime سابقاً)
            refetchOnWindowFocus: false, // يمنع إعادة جلب البيانات تلقائياً كل ما المستحدم يقلب بين التابات (مريحة جداً في التطوير)
            retry: 1, // في حال فشل الطلب، يعيد المحاولة مرة واحدة فقط بدل 3 مرات افتراضياً
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
