// Reciclaí — Contexto de acessibilidade
// Design: Floresta Tecnológica com controles claros, foco visível e preferências persistentes.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type FontSize = "normal" | "large" | "xlarge";
type ContrastMode = "normal" | "high" | "dark";

interface AccessibilityContextValue {
  fontSize: FontSize;
  contrastMode: ContrastMode;
  reducedMotion: boolean;
  speechSupported: boolean;
  isSpeaking: boolean;
  speechEnabled: boolean;
  librasEnabled: boolean;
  setFontSize: (size: FontSize) => void;
  setContrastMode: (mode: ContrastMode) => void;
  setReducedMotion: (enabled: boolean) => void;
  setSpeechEnabled: (enabled: boolean) => void;
  setLibrasEnabled: (enabled: boolean) => void;
  readText: (text: string) => void;
  readCurrentPage: () => void;
  stopReading: () => void;
}

const STORAGE_KEY = "reciclai-accessibility-preferences";

interface AccessibilityPreferences {
  fontSize: FontSize;
  contrastMode: ContrastMode;
  reducedMotion: boolean;
  speechEnabled: boolean;
  librasEnabled: boolean;
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: "normal",
  contrastMode: "normal",
  reducedMotion: false,
  speechEnabled: false,
  librasEnabled: false,
};

const validFontSizes: FontSize[] = ["normal", "large", "xlarge"];
const validContrastModes: ContrastMode[] = ["normal", "high", "dark"]; 

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

function getStoredPreferences(): AccessibilityPreferences {
  if (typeof window === "undefined") return defaultPreferences;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultPreferences;

    const parsed = JSON.parse(stored) as Partial<AccessibilityPreferences>;
    return {
      fontSize: parsed.fontSize && validFontSizes.includes(parsed.fontSize) ? parsed.fontSize : "normal",
      contrastMode: parsed.contrastMode && validContrastModes.includes(parsed.contrastMode) ? parsed.contrastMode : "normal",
      reducedMotion: Boolean(parsed.reducedMotion),
      speechEnabled: Boolean(parsed.speechEnabled),
      librasEnabled: Boolean(parsed.librasEnabled),
    };
  } catch {
    return defaultPreferences;
  }
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState(getStoredPreferences);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-font-large", preferences.fontSize === "large");
    root.classList.toggle("a11y-font-xlarge", preferences.fontSize === "xlarge");
    root.classList.toggle("a11y-contrast-high", preferences.contrastMode === "high");
    root.classList.toggle("a11y-contrast-dark", preferences.contrastMode === "dark");
    root.classList.toggle("a11y-reduced-motion", preferences.reducedMotion);
    root.dataset.fontSize = preferences.fontSize;
    root.dataset.contrast = preferences.contrastMode;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (!speechSupported) return;

    const handleEnd = () => setIsSpeaking(false);
    window.speechSynthesis.addEventListener("end", handleEnd);
    window.speechSynthesis.addEventListener("error", handleEnd);

    return () => {
      window.speechSynthesis.removeEventListener("end", handleEnd);
      window.speechSynthesis.removeEventListener("error", handleEnd);
      window.speechSynthesis.cancel();
    };
  }, [speechSupported]);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setPreferences((current) => ({ ...current, fontSize }));
  }, []);

  const setContrastMode = useCallback((contrastMode: ContrastMode) => {
    setPreferences((current) => ({ ...current, contrastMode }));
  }, []);

  const setReducedMotion = useCallback((reducedMotion: boolean) => {
    setPreferences((current) => ({ ...current, reducedMotion }));
  }, []);

  const setLibrasEnabled = useCallback((librasEnabled: boolean) => {
    setPreferences((current) => ({ ...current, librasEnabled }));
  }, []);

  const setSpeechEnabled = useCallback((speechEnabled: boolean) => {
    setPreferences((current) => ({ ...current, speechEnabled }));
    if (!speechEnabled && speechSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [speechSupported]);

  const stopReading = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [speechSupported]);

  const readText = useCallback((text: string) => {
    if (!speechSupported || !text.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim().slice(0, 5000));
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [speechSupported]);

  const readCurrentPage = useCallback(() => {
    const page = document.querySelector<HTMLElement>("[data-page-content]") || document.querySelector<HTMLElement>("main") || document.querySelector<HTMLElement>("#root");
    if (!page) return;

    const text = Array.from(page.querySelectorAll("h1, h2, h3, p, label, button, li, [aria-label]"))
      .filter((element) => !element.closest("[data-accessibility-panel]"))
      .map((element) => element.getAttribute("aria-label") || element.textContent || "")
      .join(". ");

    readText(text);
  }, [readText]);

  const value = useMemo<AccessibilityContextValue>(() => ({
    fontSize: preferences.fontSize,
    contrastMode: preferences.contrastMode,
    reducedMotion: preferences.reducedMotion,
    speechSupported,
    isSpeaking,
    speechEnabled: preferences.speechEnabled,
    librasEnabled: preferences.librasEnabled,
    setFontSize,
    setContrastMode,
    setReducedMotion,
    setSpeechEnabled,
    setLibrasEnabled,
    readText,
    readCurrentPage,
    stopReading,
  }), [preferences, speechSupported, isSpeaking, setFontSize, setContrastMode, setReducedMotion, setSpeechEnabled, setLibrasEnabled, readText, readCurrentPage, stopReading]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  }
  return context;
}
