import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase/client";

export function useLogoDesigns() {
  return useQuery({
    queryKey: ["logoDesigns"],
    queryFn: async () => {
      // جلب البيانات من جدول logo_designs في Supabase
      const { data, error } = await supabase
        .from("logo_designs")
        .select("*")
        .eq("is_active", true) // جلب الشعارات النشطة فقط
        .order("sort_order", { ascending: true }); // ترتيبها تصاعدياً حسب رغبتكِ

      if (error) throw new Error(error.message);
      return data;
    },
  });
}