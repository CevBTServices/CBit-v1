import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  schema?: object;
}

const DEFAULT_TITLE = "CBIT | Bilgi ve İletişim Teknolojileri";
const DEFAULT_DESCRIPTION =
  "Cevahir Bilgi ve İletişim Teknolojileri (CBIT) kurumsal düzeyde bilgi ve iletişim teknolojileri (ICT) alanında sistem entegrasyonu, veri merkezi, bulut bilişim ve siber güvenlik çözümleri sunar.";
const SITE_URL = "https://cbit.com.tr";
const DEFAULT_KEYWORDS = "CBIT, Cevahir Bilişim, Cevahir Bilgi ve İletişim Teknolojileri, Cevahir Teknoloji, Bilişim Teknolojileri (ICT), Sistem entegrasyonu, IT altyapı çözümleri, Kurumsal donanım tedariki, Sunucu ve depolama sistemleri, Veri merkezi (Data Center) çözümleri, Dijital dönüşüm, Ağ ve iletişim altyapısı, Siber güvenlik çözümleri, Bilgi güvenliği, Firewall ve ağ güvenliği, Bulut bilişim hizmetleri, Yönetilen IT hizmetleri, IT danışmanlık hizmetleri, Teknik destek ve bakım";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  url,
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title ? `CBIT | ${title}` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper function to set or create meta tags
    const setMetaTag = (nameAttr: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);

    // 3. OpenGraph Tags
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", url || window.location.href);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", "CBIT");

    // 4. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", url || `${SITE_URL}${window.location.pathname}`);

    // 6. JSON-LD Schema
    let scriptTag = document.getElementById("json-ld-schema") as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "json-ld-schema";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, url, schema]);

  return null;
}
