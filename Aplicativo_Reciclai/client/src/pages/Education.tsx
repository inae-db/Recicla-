// Reciclaí — Tela Educativa
// Neo-Natureza Minimalista: conteúdo educativo, quiz e os 5 Rs
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { quizQuestions } from "@/lib/materials";

const fiveRs = [
  {
    r: "Recusar",
    icon: "🚫",
    color: "bg-red-50 border-red-200",
    iconBg: "bg-red-100",
    description: "Recuse produtos com excesso de embalagem, sacolas plásticas e itens descartáveis desnecessários.",
    examples: ["Sacola plástica", "Canudo descartável", "Embalagens excessivas"],
  },
  {
    r: "Reduzir",
    icon: "📉",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
    description: "Consuma menos. Compre apenas o necessário e prefira produtos com maior durabilidade.",
    examples: ["Comprar menos roupas", "Usar menos água", "Economizar energia"],
  },
  {
    r: "Reutilizar",
    icon: "🔄",
    color: "bg-yellow-50 border-yellow-200",
    iconBg: "bg-yellow-100",
    description: "Dê nova vida aos objetos antes de descartá-los. Conserte, doe ou transforme.",
    examples: ["Potes de vidro", "Roupas usadas", "Móveis reformados"],
  },
  {
    r: "Reciclar",
    icon: "♻️",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    description: "Separe corretamente os resíduos para que possam ser transformados em novos produtos.",
    examples: ["Papel e papelão", "Plástico", "Vidro e metal"],
  },
  {
    r: "Recuperar",
    icon: "🌱",
    color: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100",
    description: "Transforme resíduos orgânicos em adubo através da compostagem.",
    examples: ["Compostagem", "Biogás", "Aproveitamento energético"],
  },
];

const binColors = [
  { color: "Azul", emoji: "🔵", bg: "bg-blue-600", material: "Papel e Papelão", examples: "Jornais, revistas, caixas, papelão" },
  { color: "Vermelho", emoji: "🔴", bg: "bg-red-600", material: "Plástico", examples: "Garrafas PET, embalagens, sacolas" },
  { color: "Verde", emoji: "🟢", bg: "bg-green-700", material: "Vidro", examples: "Garrafas, potes, frascos" },
  { color: "Amarelo", emoji: "🟡", bg: "bg-yellow-400", material: "Metal", examples: "Latas, alumínio, aço" },
  { color: "Marrom", emoji: "🟤", bg: "bg-amber-800", material: "Orgânico", examples: "Restos de comida, folhas, cascas" },
  { color: "Preto", emoji: "⚫", bg: "bg-gray-800", material: "Rejeito", examples: "O que não pode ser reciclado" },
  { color: "Laranja", emoji: "🟠", bg: "bg-orange-600", material: "Perigosos", examples: "Pilhas, baterias, óleo" },
  { color: "Roxo", emoji: "🟣", bg: "bg-purple-700", material: "Radioativo", examples: "Lâmpadas fluorescentes" },
];

type QuizState = "idle" | "playing" | "finished";

export default function Education() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"learn" | "quiz">("learn");
  const [expandedR, setExpandedR] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = quizQuestions[currentQuestion].options[index].correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, isCorrect]);

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(q => q + 1);
        setSelectedAnswer(null);
      } else {
        setQuizState("finished");
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizState("idle");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
  };

  return (
    <div className="mobile-app bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-gray-900 font-bold text-lg font-['Plus_Jakarta_Sans']">
            Educação Ambiental
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("learn")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 font-['Plus_Jakarta_Sans'] ${
              activeTab === "learn"
                ? "bg-white text-[#2D6A4F] shadow-sm"
                : "text-gray-500"
            }`}
          >
            Aprender
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 font-['Plus_Jakarta_Sans'] ${
              activeTab === "quiz"
                ? "bg-white text-[#2D6A4F] shadow-sm"
                : "text-gray-500"
            }`}
          >
            Quiz Ecológico 🌿
          </button>
        </div>
      </div>

      <div className="overflow-y-auto pb-24">
        {activeTab === "learn" && (
          <div className="px-5 pt-5 space-y-5">
            {/* Education banner */}
            <div className="relative rounded-3xl overflow-hidden h-36">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663670387059/dXLAGAphvpS78habUgFtR5/reciclai-education-bg-2rFUXf7VVzqMEiXBqCx9Gj.webp"
                alt="Educação Ambiental"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/80 to-transparent flex items-center px-5">
                <div>
                  <p className="text-white font-bold text-lg font-['Plus_Jakarta_Sans'] leading-tight">
                    Os 5 Rs da<br />Sustentabilidade
                  </p>
                  <p className="text-green-200 text-xs font-['Nunito_Sans'] mt-1">
                    Princípios para um consumo consciente
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Rs */}
            <div>
              <h2 className="text-gray-800 font-bold text-base mb-3 font-['Plus_Jakarta_Sans']">
                Os 5 Rs da Sustentabilidade
              </h2>
              <div className="space-y-3">
                {fiveRs.map(({ r, icon, color, iconBg, description, examples }) => (
                  <button
                    key={r}
                    onClick={() => setExpandedR(expandedR === r ? null : r)}
                    className={`w-full rounded-2xl p-4 border text-left transition-all duration-200 ${color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-xl flex-shrink-0`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-bold text-sm font-['Plus_Jakarta_Sans']">
                          {r}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${expandedR === r ? "rotate-90" : ""}`}
                      />
                    </div>
                    {expandedR === r && (
                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <p className="text-gray-700 text-sm font-['Nunito_Sans'] leading-relaxed mb-3">
                          {description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {examples.map((ex) => (
                            <span
                              key={ex}
                              className="bg-white/60 text-gray-600 text-xs px-2.5 py-1 rounded-full font-['Nunito_Sans']"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bin colors guide */}
            <div>
              <h2 className="text-gray-800 font-bold text-base mb-3 font-['Plus_Jakarta_Sans']">
                Cores das Lixeiras
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {binColors.map(({ color, emoji, bg, material, examples }) => (
                  <div
                    key={color}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-xl mb-2`}>
                      🗑️
                    </div>
                    <p className="text-gray-900 font-bold text-xs font-['Plus_Jakarta_Sans'] mb-0.5">
                      {emoji} {color}
                    </p>
                    <p className="text-gray-700 text-xs font-semibold font-['Nunito_Sans']">
                      {material}
                    </p>
                    <p className="text-gray-400 text-xs font-['Nunito_Sans'] mt-0.5 leading-tight">
                      {examples}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact facts */}
            <div className="bg-[#2D6A4F] rounded-3xl p-5 text-white">
              <h2 className="font-bold text-base mb-4 font-['Plus_Jakarta_Sans']">
                🌍 Impacto Ambiental
              </h2>
              <div className="space-y-3">
                {[
                  { icon: "💧", fact: "1 litro de óleo contamina até 1 milhão de litros de água" },
                  { icon: "🌳", fact: "1 tonelada de papel reciclado salva 15 árvores" },
                  { icon: "⚡", fact: "Reciclar alumínio economiza 95% de energia" },
                  { icon: "🔋", fact: "Uma pilha pode contaminar 600 litros de água" },
                ].map(({ icon, fact }) => (
                  <div key={fact} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <p className="text-green-100 text-sm font-['Nunito_Sans'] leading-relaxed">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="px-5 pt-5">
            {quizState === "idle" && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌿</div>
                <h2 className="text-gray-900 font-bold text-xl mb-2 font-['Plus_Jakarta_Sans']">
                  Quiz Ecológico
                </h2>
                <p className="text-gray-500 text-sm mb-6 font-['Nunito_Sans']">
                  Teste seus conhecimentos sobre reciclagem e sustentabilidade!
                </p>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 text-left">
                  <p className="text-gray-700 text-sm font-['Nunito_Sans']">
                    📝 {quizQuestions.length} perguntas sobre reciclagem<br />
                    ⏱ Sem limite de tempo<br />
                    🏆 Veja sua pontuação no final
                  </p>
                </div>
                <button
                  onClick={() => setQuizState("playing")}
                  className="bg-[#2D6A4F] text-white px-8 py-4 rounded-2xl font-bold text-base font-['Plus_Jakarta_Sans'] shadow-lg"
                >
                  Começar Quiz!
                </button>
              </div>
            )}

            {quizState === "playing" && (
              <div className="fade-slide-up">
                {/* Progress */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2D6A4F] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs font-['Nunito_Sans'] flex-shrink-0">
                    {currentQuestion + 1}/{quizQuestions.length}
                  </span>
                </div>

                {/* Question */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                  <p className="text-gray-900 font-bold text-base font-['Plus_Jakarta_Sans'] leading-relaxed">
                    {quizQuestions[currentQuestion].question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, i) => {
                    const isCorrect = option.correct;
                    let optionClass = "bg-white border border-gray-200 text-gray-700";
                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        optionClass = "bg-green-50 border-2 border-green-500 text-green-700";
                      } else if (i === selectedAnswer && !isCorrect) {
                        optionClass = "bg-red-50 border-2 border-red-400 text-red-700";
                      } else {
                        optionClass = "bg-gray-50 border border-gray-200 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-4 rounded-2xl text-left text-sm font-['Nunito_Sans'] font-semibold transition-all duration-200 flex items-center gap-3 ${optionClass}`}
                      >
                        <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {option.text}
                        {selectedAnswer !== null && isCorrect && (
                          <CheckCircle size={18} className="text-green-600 ml-auto" />
                        )}
                        {selectedAnswer === i && !isCorrect && (
                          <XCircle size={18} className="text-red-500 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {selectedAnswer !== null && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 fade-slide-up">
                    <p className="text-blue-700 text-sm font-['Nunito_Sans'] leading-relaxed">
                      💡 {quizQuestions[currentQuestion].explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {quizState === "finished" && (
              <div className="text-center py-8 fade-slide-up">
                <div className="text-6xl mb-4">
                  {score >= 4 ? "🏆" : score >= 2 ? "🌱" : "📚"}
                </div>
                <h2 className="text-gray-900 font-bold text-2xl mb-2 font-['Plus_Jakarta_Sans']">
                  {score >= 4 ? "Excelente!" : score >= 2 ? "Bom trabalho!" : "Continue aprendendo!"}
                </h2>
                <p className="text-gray-500 text-sm mb-6 font-['Nunito_Sans']">
                  Você acertou {score} de {quizQuestions.length} perguntas
                </p>

                {/* Score display */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                  <div className="text-5xl font-black text-[#2D6A4F] font-['Plus_Jakarta_Sans'] mb-1">
                    {score}/{quizQuestions.length}
                  </div>
                  <div className="flex justify-center gap-2 mt-3">
                    {answers.map((correct, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          correct ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {correct ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Tentar novamente
                  </button>
                  <button
                    onClick={() => setActiveTab("learn")}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold font-['Plus_Jakarta_Sans']"
                  >
                    Aprender mais
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
