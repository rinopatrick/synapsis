"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface Skill {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  category: string;
}

const skills: Skill[] = [
  { name: "HTML", level: 3, xp: 250, maxXp: 400, category: "frontend" },
  { name: "CSS", level: 2, xp: 180, maxXp: 300, category: "frontend" },
  { name: "JavaScript", level: 4, xp: 380, maxXp: 500, category: "frontend" },
  { name: "React", level: 2, xp: 150, maxXp: 300, category: "frontend" },
  { name: "TypeScript", level: 1, xp: 80, maxXp: 200, category: "frontend" },
  { name: "Node.js", level: 2, xp: 200, maxXp: 300, category: "backend" },
  { name: "Git", level: 3, xp: 300, maxXp: 400, category: "tools" },
  { name: "Testing", level: 1, xp: 50, maxXp: 200, category: "quality" },
];

const recentActivities = [
  { action: "Completed", item: "Todo App Tutorial", time: "2 hours ago", xp: 50 },
  { action: "Learned", item: "React Hooks", time: "Yesterday", xp: 30 },
  { action: "Built", item: "REST API", time: "2 days ago", xp: 40 },
  { action: "Mastered", item: "CSS Flexbox", time: "3 days ago", xp: 25 },
];

const achievements = [
  { icon: "🏆", name: "First Project", desc: "Complete your first project", unlocked: true },
  { icon: "💡", name: "Quick Learner", desc: "Complete 5 tutorials", unlocked: true },
  { icon: "🔥", name: "Streak Master", desc: "7-day learning streak", unlocked: false },
  { icon: "🎯", name: "Bug Hunter", desc: "Fix 10 bugs", unlocked: false },
  { icon: "⭐", name: "Code Master", desc: "Reach level 10", unlocked: false },
];

export function LearningDashboard() {
  const { userLevel, learningMode } = useIDEStore();

  const totalXp = skills.reduce((sum, s) => sum + s.xp, 0);
  const totalMaxXp = skills.reduce((sum, s) => sum + s.maxXp, 0);
  const overallLevel = Math.floor(totalXp / 500) + 1;

  return (
    <div className="h-full bg-[#1e1e1e] overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Learning Dashboard</h1>
          <p className="text-gray-400">Track your progress and achievements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#252526] border-[#3c3c3c]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{totalXp}</div>
              <div className="text-sm text-gray-400">Total XP</div>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-400">Level {overallLevel}</div>
              <div className="text-sm text-gray-400">Overall Level</div>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{skills.length}</div>
              <div className="text-sm text-gray-400">Skills</div>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {achievements.filter((a) => a.unlocked).length}/{achievements.length}
              </div>
              <div className="text-sm text-gray-400">Achievements</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Skills */}
          <div className="col-span-2">
            <Card className="bg-[#252526] border-[#3c3c3c]">
              <CardHeader>
                <CardTitle className="text-white">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-300">{skill.name}</div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#3c3c3c] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right text-xs text-gray-400">
                        Lv.{skill.level} {skill.xp}/{skill.maxXp}
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
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                        +{activity.xp}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-200">
                          <span className="text-gray-400">{activity.action}</span>{" "}
                          {activity.item}
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6">
          <Card className="bg-[#252526] border-[#3c3c3c]">
            <CardHeader>
              <CardTitle className="text-white">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-4 rounded-lg border text-center",
                      achievement.unlocked
                        ? "bg-yellow-500/10 border-yellow-500/30"
                        : "bg-[#1e1e1e] border-[#3c3c3c] opacity-50"
                    )}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-sm font-medium text-white">{achievement.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{achievement.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Path */}
        <div className="mt-6">
          <Card className="bg-[#252526] border-[#3c3c3c]">
            <CardHeader>
              <CardTitle className="text-white">Recommended Learning Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {[
                  { title: "HTML Basics", status: "completed", icon: "✅" },
                  { title: "CSS Fundamentals", status: "completed", icon: "✅" },
                  { title: "JavaScript Essentials", status: "completed", icon: "✅" },
                  { title: "React Basics", status: "current", icon: "📚" },
                  { title: "TypeScript", status: "next", icon: "🔒" },
                  { title: "Next.js", status: "next", icon: "🔒" },
                  { title: "Database", status: "next", icon: "🔒" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm whitespace-nowrap",
                        step.status === "completed" && "bg-green-500/10 border-green-500/30 text-green-400",
                        step.status === "current" && "bg-blue-500/10 border-blue-500/30 text-blue-400",
                        step.status === "next" && "bg-[#1e1e1e] border-[#3c3c3c] text-gray-500"
                      )}
                    >
                      <span className="mr-2">{step.icon}</span>
                      {step.title}
                    </div>
                    {i < 6 && <span className="text-gray-600">→</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
