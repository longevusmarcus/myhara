import { Award, Calendar, Target } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const stats = {
    totalCheckins: 35,
    currentStreak: 7,
    totalXP: 445,
    level: 3,
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow">
            U
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Journey</h1>
            <p className="text-muted-foreground">Level {stats.level} Intuitive</p>
          </div>
        </div>

        {/* XP Progress */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Award className="w-5 h-5 text-primary" />
              Experience Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total XP</span>
                <span className="text-2xl font-bold text-primary">{stats.totalXP}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full"
                  style={{ width: "45%" }}
                />
              </div>
              <p className="text-sm text-muted-foreground">55 XP to Level 4</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-primary" />
                <p className="text-3xl font-bold text-foreground">{stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Target className="w-8 h-8 mx-auto text-accent" />
                <p className="text-3xl font-bold text-foreground">{stats.totalCheckins}</p>
                <p className="text-sm text-muted-foreground">Check-ins</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "First Voice Check", xp: 10, date: "2 days ago" },
              { name: "Week Warrior", xp: 50, date: "Yesterday" },
              { name: "Pattern Spotter", xp: 25, date: "Today" },
            ].map((achievement) => (
              <div
                key={achievement.name}
                className="p-4 rounded-xl bg-background/50 border border-border flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.date}</p>
                </div>
                <span className="text-primary font-bold">+{achievement.xp} XP</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
