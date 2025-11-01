interface GamificationData {
  totalXP: number;
  totalCheckins: number;
  currentStreak: number;
  lastCheckInDate: string | null;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  unlockedAt: string;
  icon: string;
}

const STORAGE_KEY = "gamification_data";

export const getGamificationData = (): GamificationData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return {
      totalXP: 0,
      totalCheckins: 0,
      currentStreak: 0,
      lastCheckInDate: null,
      achievements: [],
    };
  }
  return JSON.parse(data);
};

const saveGamificationData = (data: GamificationData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const calculateLevel = (xp: number): { level: number; nextLevelXP: number; progress: number } => {
  // XP needed: Level 1: 0-100, Level 2: 100-250, Level 3: 250-500, etc.
  const levels = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];
  
  let level = 1;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  
  const currentLevelXP = levels[level - 1] || 0;
  const nextLevelXP = levels[level] || currentLevelXP + 2000;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  return { level, nextLevelXP, progress };
};

export const getLevelName = (level: number): string => {
  const names = [
    "The Listener",
    "The Aware",
    "The Seeker",
    "The Trusting",
    "The Intuitive",
    "The Aligned",
    "The Wise",
    "The Centered",
    "The Awakened",
    "The Master"
  ];
  return names[level - 1] || "The Master";
};

export const addCheckIn = (xp: number): GamificationData => {
  const data = getGamificationData();
  const today = new Date().toDateString();
  
  // Update XP and check-ins
  data.totalXP += xp;
  data.totalCheckins += 1;
  
  // Update streak
  if (data.lastCheckInDate) {
    const lastDate = new Date(data.lastCheckInDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.toDateString() === yesterday.toDateString()) {
      // Consecutive day
      data.currentStreak += 1;
    } else if (lastDate.toDateString() === today) {
      // Already checked in today, don't update streak
    } else {
      // Streak broken
      data.currentStreak = 1;
    }
  } else {
    // First check-in
    data.currentStreak = 1;
  }
  
  data.lastCheckInDate = today;
  
  // Check for new achievements
  checkAchievements(data);
  
  saveGamificationData(data);
  return data;
};

const checkAchievements = (data: GamificationData) => {
  const achievements: { id: string; name: string; description: string; xp: number; condition: () => boolean; icon: string }[] = [
    {
      id: "first_check",
      name: "First Steps",
      description: "Completed your first check-in",
      xp: 10,
      condition: () => data.totalCheckins === 1,
      icon: "Sparkles"
    },
    {
      id: "five_checks",
      name: "Getting Started",
      description: "Completed 5 check-ins",
      xp: 25,
      condition: () => data.totalCheckins === 5,
      icon: "Target"
    },
    {
      id: "streak_3",
      name: "3-Day Warrior",
      description: "Maintained a 3-day streak",
      xp: 30,
      condition: () => data.currentStreak === 3,
      icon: "Flame"
    },
    {
      id: "streak_7",
      name: "Week Warrior",
      description: "Maintained a 7-day streak",
      xp: 50,
      condition: () => data.currentStreak === 7,
      icon: "Award"
    },
    {
      id: "streak_14",
      name: "Two Week Champion",
      description: "Maintained a 14-day streak",
      xp: 100,
      condition: () => data.currentStreak === 14,
      icon: "Trophy"
    },
    {
      id: "streak_30",
      name: "Month Master",
      description: "Maintained a 30-day streak",
      xp: 200,
      condition: () => data.currentStreak === 30,
      icon: "Crown"
    },
    {
      id: "twenty_checks",
      name: "Pattern Spotter",
      description: "Completed 20 check-ins",
      xp: 50,
      condition: () => data.totalCheckins === 20,
      icon: "Eye"
    },
    {
      id: "fifty_checks",
      name: "Gut Guardian",
      description: "Completed 50 check-ins",
      xp: 100,
      condition: () => data.totalCheckins === 50,
      icon: "Shield"
    },
    {
      id: "hundred_checks",
      name: "Intuition Master",
      description: "Completed 100 check-ins",
      xp: 250,
      condition: () => data.totalCheckins === 100,
      icon: "Star"
    }
  ];
  
  const now = new Date().toISOString();
  
  for (const achievement of achievements) {
    const alreadyUnlocked = data.achievements.some(a => a.id === achievement.id);
    if (!alreadyUnlocked && achievement.condition()) {
      data.achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        xp: achievement.xp,
        unlockedAt: now,
        icon: achievement.icon
      });
      data.totalXP += achievement.xp;
    }
  }
};

export const getRecentAchievements = (limit: number = 3): Achievement[] => {
  const data = getGamificationData();
  return data.achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, limit);
};

export const formatTimeAgo = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};