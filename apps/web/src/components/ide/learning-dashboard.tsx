"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface Skill {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  category: string;
  icon: string;
}

const skills: Skill[] = [
  { name: "HTML", level: 3, xp: 250, maxXp: 400, category: "frontend", icon: "🌐" },
  { name: "CSS", level: 2, xp: 180, maxXp: 300, category: "frontend", icon: "🎨" },
  { name: "JavaScript", level: 4, xp: 380, maxXp: 500, category: "frontend", icon: "⚡" },
  { name: "React", level: 2, xp: 150, maxXp: 300, category: "frontend", icon: "⚛️" },
  { name: "TypeScript", level: 1, xp: 80, maxXp: 200, category: "frontend", icon: "🔷" },
  { name: "Node.js", level: 2, xp: 200, maxXp: 300, category: "backend", icon: "🟢" },
  { name: "Git", level: 3, xp: 300, maxXp: 400, category: "tools", icon: "🔀" },
  { name: "Testing", level: 1, xp: 50, maxXp: 200, category: "quality", icon: "🧪" },
];

const recentActivities = [
  { action: "Completed", item: "Todo App Tutorial", time: "2 hours ago", xp: 50, icon: "✅" },
  { action: "Learned", item: "React Hooks", time: "Yesterday", xp: 30, icon: "📚" },
  { action: "Built", item: "REST API", time: "2 days ago", xp: 40, icon: "🔨" },
  { action: "Mastered", item: "CSS Flexbox", time: "3 days ago", xp: 25, icon: "⭐" },
];

const achievements = [
  { icon: "🏆", name: "First Project", desc: "Complete your first project", unlocked: true, date: "Jan 15" },
  { icon: "💡", name: "Quick Learner", desc: "Complete 5 tutorials", unlocked: true, date: "Jan 20" },
  { icon: "🔥", name: "Streak Master", desc: "7-day learning streak", unlocked: false, date: null },
  { icon: "🎯", name: "Bug Hunter", desc: "Fix 10 bugs", unlocked: false, date: null },
  { icon: "⭐", name: "Code Master", desc: "Reach level 10", unlocked: false, date: null },
];

const learningPath = [
  { title: "HTML Basics", status: "completed", icon: "✅" },
  { title: "CSS Fundamentals", status: "completed", icon: "✅" },
  { title: "JavaScript Essentials", status: "completed", icon: "✅" },
  { title: "React Basics", status: "current", icon: "📚" },
  { title: "TypeScript", status: "next", icon: "🔒" },
  { title: "Next.js", status: "next", icon: "🔒" },
  { title: "Database", status: "next", icon: "🔒" },
];

export function LearningDashboard() {
  const { userLevel, learningMode } = useIDEStore();
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "achievements">("overview");

  const totalXp = skills.reduce((sum, s) => sum + s.xp, 0);
  const totalMaxXp = skills.reduce((sum, s) => sum + s.maxXp, 0);
  const overallLevel = Math.floor(totalXp / 500) + 1;
  const xpForNextLevel = 500 - (totalXp % 500);
  const levelProgress = ((totalXp % 500) / 500) * 100;
  const streakDays = 5;

  return (
    <div className="h-full bg-[#1e1e1e] overflow-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Learning Dashboard</h1>
            <p className="text-gray-400 text-sm">Track your progress and achievements</p>
          </div>
          <div className="flex items-center gap-2">
            {(["overview", "skills", "achievements"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors capitalize",
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-[#252526] text-gray-400 hover:text-white hover:bg-[#333]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#252526] border-[#3c3c3c] overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{totalXp}</div>
                  <div className="text-xs text-gray-400">Total XP</div>
                </div>
                <div className="text-3xl opacity-30">⚡</div>
              </div>
              <div className="mt-2 h-1 bg-[#3c3c3c] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(totalXp / totalMaxXp) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c] overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">Lv.{overallLevel}</div>
                  <div className="text-xs text-gray-400">Overall Level</div>
                </div>
                <div className="text-3xl opacity-30">🎯</div>
              </div>
              <div className="mt-2">
                <div className="h-1 bg-[#3c3c3c] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${levelProgress}%` }} />
                </div>
                <div className="text-[10px] text-gray-500 mt-1">{xpForNextLevel} XP to next level</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c] overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{skills.length}</div>
                  <div className="text-xs text-gray-400">Skills</div>
                </div>
                <div className="text-3xl opacity-30">📊</div>
              </div>
              <div className="flex gap-0.5 mt-2">
                {skills.map((s, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full bg-purple-500" style={{ opacity: 0.3 + (s.level / 5) * 0.7 }} />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c] overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-yellow-400">{streakDays}</span>
                    <span className="text-yellow-400">🔥</span>
                  </div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
                <div className="text-3xl opacity-30">📅</div>
              </div>
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <div key={d} className={cn("flex-1 h-1 rounded-full", d <= streakDays ? "bg-yellow-500" : "bg-[#3c3c3c]")} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Learning Path */}
            <Card className="bg-[#252526] border-[#3c3c3c] mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {learningPath.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={cn(
                        "px-3 py-2 rounded-lg border text-xs whitespace-nowrap flex items-center gap-1.5 transition-colors",
                        step.status === "completed" && "bg-green-500/10 border-green-500/30 text-green-400",
                        step.status === "current" && "bg-blue-500/10 border-blue-500/30 text-blue-400 ring-1 ring-blue-500/20",
                        step.status === "next" && "bg-[#1e1e1e] border-[#3c3c3c] text-gray-500"
                      )}>
                        <span>{step.icon}</span>
                        <span>{step.title}</span>
                      </div>
                      {i < learningPath.length - 1 && (
                        <span className={cn("text-xs", step.status === "completed" ? "text-green-500" : "text-gray-600")}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              {/* Skills */}
              <div className="col-span-2">
                <Card className="bg-[#252526] border-[#3c3c3c]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm">Skills</CardTitle>
                      <span className="text-xs text-gray-400">{skills.length} skills</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm">{skill.icon}</span>
                            <span className="w-20 text-sm text-gray-300">{skill.name}</span>
                            <div className="flex-1">
                              <div className="h-2 bg-[#3c3c3c] rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full transition-all duration-500", skill.category === "frontend" ? "bg-blue-500" : skill.category === "backend" ? "bg-green-500" : skill.category === "tools" ? "bg-purple-500" : "bg-yellow-500")}
                                  style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-24 text-right text-xs text-gray-400">
                              <span className="text-white font-medium">Lv.{skill.level}</span> {skill.xp}/{skill.maxXp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card className="bg-[#252526] border-[#3c3c3c]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivities.map((activity, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm shrink-0">
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-200 truncate">
                              <span className="text-gray-400">{activity.action}</span>{" "}
                              <span className="group-hover:text-blue-400 transition-colors">{activity.item}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{activity.time}</span>
                              <span className="text-xs text-green-400 font-medium">+{activity.xp} XP</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === "skills" && (
          <div className="grid grid-cols-2 gap-4">
            {["frontend", "backend", "tools", "quality"].map(category => {
              const categorySkills = skills.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;
              return (
                <Card key={category} className="bg-[#252526] border-[#3c3c3c]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm capitalize">{category} Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categorySkills.map(skill => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span>{skill.icon}</span>
                              <span className="text-sm text-white font-medium">{skill.name}</span>
                            </div>
                            <span className="text-xs text-gray-400">Level {skill.level}</span>
                          </div>
                          <div className="h-3 bg-[#3c3c3c] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-400"
                              style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-gray-500">{skill.xp} XP</span>
                            <span className="text-[10px] text-gray-500">{skill.maxXp} XP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement, i) => (
              <Card key={i} className={cn("border transition-all", achievement.unlocked ? "bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50" : "bg-[#252526] border-[#3c3c3c] opacity-60")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("text-3xl", !achievement.unlocked && "grayscale")}>{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white">{achievement.name}</h3>
                        {achievement.unlocked && <span className="text-[10px] text-yellow-400 bg-yellow-500/20 px-1.5 py-0.5 rounded">Unlocked</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{achievement.desc}</p>
                      {achievement.date && <p className="text-[10px] text-gray-500 mt-2">Earned {achievement.date}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
