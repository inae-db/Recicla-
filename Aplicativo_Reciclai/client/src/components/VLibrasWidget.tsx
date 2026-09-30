// Reciclaí — Integração oficial com VLibras
// Design: a janela de Libras respeita a identidade Floresta Tecnológica e mantém fallback acessível.

import { useEffect, useState } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

let vlibrasScriptPromise: Promise<void> | null = null;

function loadVLibrasScript() {
  if (window.VLibras) return Promise.resolve();
  if (vlibrasScriptPromise) return vlibrasScriptPromise;

  vlibrasScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-vlibras-script]");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Não foi possível carregar o VLibras.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.dataset.vlibrasScript = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Não foi possível carregar o VLibras."));
    document.body.appendChild(script);
  });

  return vlibrasScriptPromise;
}

const VLibrasContainer = "div" as any;

export default function VLibrasWidget({ enabled }: { enabled: boolean }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    loadVLibrasScript()
      .then(() => {
        if (!active || !window.VLibras) return;
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="mt-2" aria-live="polite">
      <VLibrasContainer vw="enabled" className="vlibras-embed" aria-label="Widget oficial VLibras">
        <div vw-access-button="active" className="active" />
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper" />
        </div>
      </VLibrasContainer>
      {status === "loading" && <p className="text-xs text-[#4A7656]">Carregando o avatar oficial do VLibras…</p>}
      {status === "ready" && <p className="text-xs text-[#4A7656]">Avatar VLibras disponível para traduzir o conteúdo em português.</p>}
      {status === "error" && <p className="rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-900">O widget não carregou agora. Verifique a conexão e tente novamente.</p>}
    </div>
  );
}
