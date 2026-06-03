import { cookies } from "next/headers";
import { dictionaries, Locale, DictionaryKey } from "./dictionaries";

export async function getServerTranslations() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value as Locale) || "en";
  
  return {
    t: (key: DictionaryKey) => dictionaries[locale]?.[key] || dictionaries["en"][key] || key,
    locale
  };
}
