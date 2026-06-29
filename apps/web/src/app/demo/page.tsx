"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Sidebar } from "@/components/sidebar";
import { DecisionCard, type DecisionOption } from "@/components/decision-card";
import { GradualReveal, type RevealStep } from "@/components/gradual-reveal";
import { WhyButton } from "@/components/why-button";
import { CodeReview, type CodeIssue } from "@/components/code-review";
import { InlineHint, InlineHintGroup } from "@/components/inline-hint";
import { SessionRecap } from "@/components/session-recap";
import { SkillTree, type Skill } from "@/components/skill-tree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Demo data
const demoDecisionOptions: DecisionOption[] = [
  {
    id: "react",
    label: "React",
    description: "Populer, ecosystem besar, flexible",
    value: "react",
  },
  {
    id: "vue",
    label: "Vue",
    description: "Mudah dipelajari, documentation bagus",
    value: "vue",
  },
  {
    id: "svelte",
    label: "Svelte",
    description: "Performa tinggi, syntax clean",
    value: "svelte",
  },
];

const demoRevealSteps: RevealStep[] = [
  {
    level: 1,
    type: "hint",
    content:
      "Pertimbangkan framework yang populer dan memiliki komunitas besar untuk dukungan jangka panjang.",
  },
  {
    level: 2,
    type: "options",
    content:
      "React, Vue, dan Svelte adalah pilihan populer. Masing-masing punya kelebihan: React untuk fleksibilitas, Vue untuk kemudahan, Svelte untuk performa.",
  },
  {
    level: 3,
    type: "explanation",
    content:
      "React direkomendasikan karena ecosystem yang besar, banyak tutorial, dan banyak perusahaan menggunakannya. Ini membuat skill React sangat valuable di pasar kerja.",
  },
];

const demoCodeIssues: CodeIssue[] = [
  {
    line: 3,
    severity: "warning",
    message: "Variable 'x' is declared but never used",
    suggestion: "Remove unused variable or use it in your code",
  },
  {
    line: 5,
    severity: "error",
    message: "Cannot find name 'console'",
    suggestion: "Add 'console' to your TypeScript config lib array",
  },
  {
    line: 7,
    severity: "info",
    message: "Consider using const instead of let",
    suggestion: "This variable is never reassigned",
  },
];

const demoSkills: Skill[] = [
  { id: "html", name: "HTML", category: "frontend", xp: 150, level: 2, mastered: false },
  { id: "css", name: "CSS", category: "frontend", xp: 200, level: 3, mastered: false },
  { id: "js", name: "JavaScript", category: "frontend", xp: 350, level: 4, mastered: false },
  { id: "react", name: "React", category: "frontend", xp: 100, level: 2, mastered: false },
  { id: "node", name: "Node.js", category: "backend", xp: 250, level: 3, mastered: false },
  { id: "express", name: "Express", category: "backend", xp: 150, level: 2, mastered: false },
  { id: "sql", name: "SQL", category: "database", xp: 180, level: 2, mastered: false },
  { id: "git", name: "Git", category: "devops", xp: 300, level: 4, mastered: false },
];

type DemoView =
  | "chat"
  | "decisions"
  | "reveal"
  | "review"
  | "hints"
  | "recap"
  | "skills";

export default function DemoPage() {
  const [view, setView] = useState<DemoView>("chat");
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const handleDecisionSelect = (option: DecisionOption) => {
    setSelectedDecision(option.id);
  };

  const renderView = () => {
    switch (view) {
      case "chat":
        return <ChatInterface />;

      case "decisions":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Decision Cards</h2>
            <DecisionCard
              id="framework"
              topic="framework"
              question="Framework mana yang akan kamu gunakan?"
              hint="Pertimbangkan popularitas, learning curve, dan kebutuhan project."
              options={demoDecisionOptions}
              difficulty="medium"
              onSelect={handleDecisionSelect}
              onWhy={() => {}}
              onHint={() => {}}
              selectedOption={selectedDecision}
            />
            <WhyButton
              topic="framework"
              answer="React"
              explanation="React memiliki ecosystem terbesar dan paling banyak digunakan di industri. Ini membuatnya menjadi investasi skill yang baik untuk karir jangka panjang."
              tradeoffs={[
                "React lebih verbose dibanding Vue untuk hal sederhana",
                "Learning curve lebih curam dari Svelte",
                "Bundle size lebih besar dari alternatif lain",
              ]}
            />
          </div>
        );

      case "reveal":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Gradual Reveal</h2>
            <GradualReveal
              question="Mengapa React direkomendasikan untuk project ini?"
              steps={demoRevealSteps}
              onComplete={() => {}}
            />
          </div>
        );

      case "review":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Code Review</h2>
            <CodeReview
              code={`function greet(name) {
  let x = 5;
  const message = "Hello, " + name;
  
  console.log(message)
  
  let result = x * 2;
  return result;
}`}
              language="javascript"
              issues={demoCodeIssues}
              onExplain={(line) => console.log("Explain line", line)}
              onFix={(issue) => console.log("Fix issue", issue)}
            />
          </div>
        );

      case "hints":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Inline Hints</h2>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Coba selesaikan soal ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Buatlah fungsi yang mengembalikan array yang sudah diurutkan
                  tanpa menggunakan method sort() bawaan.
                </p>

                <InlineHint
                  hint="Kamu bisa menggunakan algoritma Bubble Sort, Selection Sort, atau Insertion Sort."
                  level={1}
                />

                <InlineHintGroup
                  hints={[
                    "Bubble Sort bekerja dengan membandingkan elemen bersebelahan dan menukarnya jika tidak urut.",
                    "Untuk setiap iterasi, elemen terbesar akan 'menggelembung' ke akhir array.",
                    "Gunakan nested loop: outer loop untuk iterasi, inner loop untuk perbandingan.",
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "recap":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Session Recap</h2>
            <SessionRecap
              duration={25}
              decisionsCount={5}
              skillsImproved={[
                { name: "JavaScript", xpGained: 50 },
                { name: "React", xpGained: 30, newLevel: 2 },
                { name: "Problem Solving", xpGained: 20 },
              ]}
              learningPoints={[
                "Cara memilih framework berdasarkan kebutuhan project",
                "Perbedaan antara SPA dan SSR",
                "Kapan menggunakan useState vs useReducer",
              ]}
              nextSteps={[
                "Praktek membuat komponen React",
                "Pelajari tentang state management",
                "Coba build project kecil dengan React",
              ]}
              onClose={() => setView("chat")}
              onContinue={() => setView("chat")}
            />
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skill Tree</h2>
            <SkillTree
              skills={demoSkills}
              totalXP={1680}
              overallLevel={5}
              onSkillClick={(skill) => console.log("Skill clicked:", skill)}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4 overflow-auto">
        {/* Navigation */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { id: "chat", label: "💬 Chat" },
            { id: "decisions", label: "🎯 Decisions" },
            { id: "reveal", label: "💡 Gradual Reveal" },
            { id: "review", label: "📝 Code Review" },
            { id: "hints", label: "🔍 Hints" },
            { id: "recap", label: "🎉 Session Recap" },
            { id: "skills", label: "⭐ Skill Tree" },
          ].map((item) => (
            <Button
              key={item.id}
              variant={view === item.id ? "default" : "outline"}
              size="sm"
              onClick={() => setView(item.id as DemoView)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {renderView()}
      </main>
    </div>
  );
}
