import { Award, Settings, HelpCircle, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

const Profile = () => {
  const stats = {
    level: 3,
    totalXP: 445,
    nextLevelXP: 500,
    totalCheckins: 35,
    currentStreak: 7,
  };

  const progress = (stats.totalXP / stats.nextLevelXP) * 100;

  const menuItems = [
    { icon: Settings, label: "Settings", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: LogOut, label: "Sign Out", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <span className="text-3xl font-medium">U</span>
          </div>
          <div>
            <h1 className="text-2xl font-medium text-foreground">Your Profile</h1>
            <p className="text-base text-muted-foreground font-light">Level {stats.level} Intuitive</p>
          </div>
        </div>

        {/* XP Progress */}
        <Card className="bg-card border-border p-6 rounded-3xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Award className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-light">Progress to Level {stats.level + 1}</p>
                <p className="text-base font-medium text-foreground">{stats.totalXP} / {stats.nextLevelXP} XP</p>
              </div>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border p-6 rounded-3xl text-center">
            <p className="text-3xl font-medium text-foreground mb-1">{stats.currentStreak}</p>
            <p className="text-sm text-muted-foreground font-light">Day Streak</p>
          </Card>
          <Card className="bg-card border-border p-6 rounded-3xl text-center">
            <p className="text-3xl font-medium text-foreground mb-1">{stats.totalCheckins}</p>
            <p className="text-sm text-muted-foreground font-light">Check-ins</p>
          </Card>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-foreground">Recent Achievements</h2>
          
          {[
            { name: "First Voice Check", xp: 10, date: "2 days ago" },
            { name: "Week Warrior", xp: 50, date: "Yesterday" },
            { name: "Pattern Spotter", xp: 25, date: "Today" },
          ].map((achievement) => (
            <Card key={achievement.name} className="bg-card border-border p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-foreground">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground font-light">{achievement.date}</p>
                </div>
                <span className="text-sm font-medium text-foreground">+{achievement.xp} XP</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-2 pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-card transition-colors"
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-base font-light text-foreground">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
