// Reciclaí — Painel global de acessibilidade
// Design: Floresta Tecnológica, alto contraste, controles textuais e navegação por teclado.

import { useEffect, useState } from "react";
import { Contrast, Eye, Hand, Pause, Play, RotateCcw, Square, Type, Volume2, X } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import VLibrasWidget from "@/components/VLibrasWidget";

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize,
    contrastMode,
    reducedMotion,
    speechSupported,
    isSpeaking,
    speechEnabled,
    librasEnabled,
    setFontSize,
    setContrastMode,
    setReducedMotion,
    setSpeechEnabled,
    setLibrasEnabled,
    readCurrentPage,
    stopReading,
  } = useAccessibility();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const resetPreferences = () => {
    setFontSize("normal");
    setContrastMode("normal");
    setReducedMotion(false);
    setSpeechEnabled(false);
    setLibrasEnabled(false);
    stopReading();
  };

  return (
    <div className="contents" data-accessibility-panel>
      {isOpen && (
        <section
          id="accessibility-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="accessibility-title"
          className="fixed bottom-24 right-4 z-[60] mb-3 max-h-[calc(100vh-8rem)] w-[min(360px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border-2 border-[#006633] bg-white text-[#006633] shadow-2xl sm:right-6"
        >
          <div className="flex items-start justify-between gap-3 bg-[#006633] px-4 py-3 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B8F28B]">Inclusão digital</p>
              <h2 id="accessibility-title" className="mt-1 text-base font-extrabold">Acessibilidade</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar painel de acessibilidade"
              className="rounded-lg p-2 text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8F28B]"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-5 p-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Type size={18} aria-hidden="true" />
                <h3 className="font-bold">Tamanho do texto</h3>
              </div>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Tamanho da fonte">
                <button
                  type="button"
                  onClick={() => setFontSize("normal")}
                  aria-pressed={fontSize === "normal"}
                  className={`rounded-xl border-2 px-2 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A] ${fontSize === "normal" ? "border-[#006633] bg-[#E8F5E9]" : "border-gray-200 bg-white text-gray-700"}`}
                >
                  A padrão
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize("large")}
                  aria-pressed={fontSize === "large"}
                  className={`rounded-xl border-2 px-2 py-2 text-base font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A] ${fontSize === "large" ? "border-[#006633] bg-[#E8F5E9]" : "border-gray-200 bg-white text-gray-700"}`}
                >
                  A maior
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize("xlarge")}
                  aria-pressed={fontSize === "xlarge"}
                  className={`rounded-xl border-2 px-2 py-2 text-lg font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A] ${fontSize === "xlarge" ? "border-[#006633] bg-[#E8F5E9]" : "border-gray-200 bg-white text-gray-700"}`}
                >
                  A grande
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Contrast size={18} aria-hidden="true" />
                <h3 className="font-bold">Contraste</h3>
              </div>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Modo de contraste">
                <button
                  type="button"
                  onClick={() => setContrastMode("normal")}
                  aria-pressed={contrastMode === "normal"}
                  className={`rounded-xl border-2 px-2 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A] ${contrastMode === "normal" ? "border-[#006633] bg-[#E8F5E9]" : "border-gray-200 bg-white text-gray-700"}`}
                >
                  Padrão
                </button>
                <button
                  type="button"
                  onClick={() => setContrastMode("high")}
                  aria-pressed={contrastMode === "high"}
                  className={`rounded-xl border-2 bg-black px-2 py-2 text-sm font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A] ${contrastMode === "high" ? "border-[#B8F28B]" : "border-black"}`}
                >
                  Alto
                </button>
                <button
                  type="button"
                  onClick={() => setContrastMode("dark")}
                  aria-pressed={contrastMode === "dark"}
                  className={`rounded-xl border-2 bg-[#17231D] px-2 py-2 text-sm font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8F28B] ${contrastMode === "dark" ? "border-[#B8F28B]" : "border-[#17231D]"}`}
                >
                  Escuro
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Volume2 size={18} aria-hidden="true" />
                <h3 className="font-bold">Leitura por voz</h3>
              </div>
              {!speechSupported ? (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
                  A leitura por voz não está disponível neste navegador.
                </p>
              ) : (
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-[#F5F7F4] px-3 py-2 text-sm font-semibold">
                    <span>Ativar leitura por voz</span>
                    <input
                      type="checkbox"
                      checked={speechEnabled}
                      onChange={(event) => setSpeechEnabled(event.target.checked)}
                      className="h-5 w-5 accent-[#006633]"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={readCurrentPage}
                      disabled={!speechEnabled || isSpeaking}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#006633] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#005522] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A]"
                    >
                      <Play size={16} aria-hidden="true" />
                      Ler tela
                    </button>
                    <button
                      type="button"
                      onClick={stopReading}
                      disabled={!isSpeaking}
                      className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#006633] bg-white px-3 py-2.5 text-sm font-bold text-[#006633] transition hover:bg-[#E8F5E9] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A]"
                    >
                      <Square size={15} aria-hidden="true" />
                      Parar
                    </button>
                  </div>
                  <p className="text-xs text-gray-600" role="status" aria-live="polite">
                    {isSpeaking ? "Leitura em andamento…" : speechEnabled ? "Pronto para ler o conteúdo desta tela." : "Ative a opção para usar a leitura por voz."}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 rounded-2xl border border-[#B8DDBB] bg-[#F7FBF7] p-3">
              <div className="flex items-center gap-2">
                <Hand size={18} aria-hidden="true" />
                <h3 className="font-bold">Libras</h3>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold shadow-sm">
                <span>Mostrar intérprete</span>
                <input
                  type="checkbox"
                  checked={librasEnabled}
                  onChange={(event) => setLibrasEnabled(event.target.checked)}
                  className="h-5 w-5 accent-[#006633]"
                />
              </label>
              {librasEnabled && (
                <div className="overflow-hidden rounded-xl border border-[#B8DDBB] bg-[#123D2A] text-white" role="region" aria-label="Área do intérprete de Libras">
                  <div className="flex items-center justify-between border-b border-white/15 px-3 py-2 text-xs font-bold">
                    <span>Intérprete de Libras</span>
                    <span className="rounded-full bg-[#7ED957] px-2 py-0.5 text-[#123D2A]">Protótipo</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] ${isSpeaking ? "libras-avatar-speaking" : ""}`} aria-hidden="true">
                      <svg viewBox="0 0 80 80" className="h-14 w-14 text-[#006633]" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="40" cy="20" r="9" fill="#7ED957" />
                        <path d="M25 67c2-15 8-24 15-24s13 9 15 24" />
                        <path d="M30 48 17 35M50 48l13-13" />
                        <path d="M12 31 6 24M68 31l6-7" />
                        <path d="M29 55 19 70M51 55l10 15" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{isSpeaking ? "Acompanhando a leitura" : "Pronto para interpretar"}</p>
                      <p className="mt-1 text-xs text-[#D8F4DD]">A janela está preparada para receber vídeos de interpretação em Libras vinculados ao conteúdo falado.</p>
                    </div>
                  </div>
                </div>
              )}
              <VLibrasWidget enabled={librasEnabled} />
              <p className="text-xs text-[#4A7656]">O VLibras é automático e não substitui um intérprete humano. Para conteúdo crítico, use vídeos de interpretação revisados.</p>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#B8DDBB] px-3 py-2 text-sm font-semibold">
              <span className="flex items-center gap-2"><Pause size={16} aria-hidden="true" /> Reduzir animações</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
                className="h-5 w-5 accent-[#006633]"
              />
            </label>

            <button
              type="button"
              onClick={resetPreferences}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#2FAF4A] px-3 py-2.5 text-sm font-bold text-[#006633] transition hover:bg-[#F5F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2FAF4A]"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Restaurar padrão
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={isOpen ? "Fechar opções de acessibilidade" : "Abrir opções de acessibilidade"}
        className="fixed bottom-4 right-4 z-[61] flex min-h-14 min-w-14 items-center justify-center gap-2 rounded-full border-2 border-white bg-[#006633] px-4 text-white shadow-xl transition hover:bg-[#005522] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7ED957] sm:right-6"
      >
        <Eye size={23} aria-hidden="true" />
        <span className="hidden text-sm font-extrabold sm:inline">Acessibilidade</span>
      </button>
    </div>
  );
}
