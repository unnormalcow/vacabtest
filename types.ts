export interface WordItem {
  word: string;
  meaning: string; // Chinese meaning
  sentence: string; // Example sentence with blank or full
  hint?: string;
}

export interface MaskedWord {
  original: WordItem;
  maskedWord: (string | null)[]; // null represents a missing letter
  userInput: string[];
  isRevealed: boolean;
}

export type GradeLevel = 'grade7' | 'grade8' | 'grade9' | 'grade10' | 'grade11' | 'grade12';

export interface DailyStat {
  date: string; // YYYY-MM-DD
  wordsLearned: number;
  mistakesMade: number;
  correctCount: number;
}

export interface User {
  id: string;
  name: string;
  grade: GradeLevel;
  avatarDesc: string;
  avatarUrl?: string; // Base64 data URI
  mistakes: WordItem[];
  history: DailyStat[];
  createdAt: number;
}

export enum AppState {
  AUTH,
  WELCOME,
  LOADING,
  PLAYING,
  RESULTS,
  MISTAKES,
  STATS,
  ERROR
}

export interface GameStats {
  total: number;
  correct: number;
  streak: number;
  mistakes: WordItem[];
}

export type Language = 'en' | 'zh';

export const TRANSLATIONS = {
  en: {
    title: "VocabQuest",
    subtitle: "Master English vocabulary with your AI companion.",
    chooseTopic: "Choose a Topic",
    wordCount: "Number of Words",
    daily: "Daily Life",
    school: "School & Study",
    travel: "Travel & Food",
    nature: "Nature & Animals",
    feelings: "Feelings & Emotions",
    start: "Start Adventure",
    poweredBy: "Powered by Google Gemini 2.5 Flash",
    loadingTitle: "Generating Study Plan...",
    loadingDesc: "AI is crafting your vocabulary list based on Renjiao Jingtong edition",
    generatingAvatar: "Painting your avatar...",
    progress: "Progress",
    score: "Score",
    streak: "Streak",
    giveUp: "I give up",
    check: "Check Answer",
    next: "Next Word",
    correctMsg: "Correct! Great job!",
    wrongMsg: "Not quite right. Try again!",
    sessionComplete: "Session Complete!",
    perfect: "Perfect Score!",
    awesome: "Awesome Job!",
    good: "Well Done!",
    effort: "Good effort!",
    accuracy: "Accuracy",
    playAgain: "Play Again",
    reviewMistakes: "Review Mistakes",
    practiceMistakes: "Practice These Words",
    practiceMode: "Review Mode",
    home: "Back to Home",
    viewStats: "View Statistics",
    statsTitle: "Learning Progress",
    wordsLearned: "Words Learned",
    mistakesMade: "Mistakes",
    mistakeTitle: "Mistake Notebook",
    mistakeEmpty: "No mistakes made yet!",
    mistakeCleared: "Mistake cleared!",
    mistakeKeep: "Keep trying!",
    errorTitle: "Oops! Something went wrong",
    retry: "Try Again",
    // Auth & Profile
    welcomeBack: "Welcome Back",
    createProfile: "Create New Profile",
    enterName: "Enter your name",
    selectGrade: "Select Grade",
    grade7: "Grade 7 (Junior 1)",
    grade8: "Grade 8 (Junior 2)",
    grade9: "Grade 9 (Junior 3)",
    grade10: "Grade 10 (Senior 1)",
    grade11: "Grade 11 (Senior 2)",
    grade12: "Grade 12 (Senior 3)",
    avatarDesc: "Describe yourself for a cartoon avatar",
    avatarPlaceholder: "e.g., A cool cat with glasses...",
    createAndStart: "Create & Start",
    switchUser: "Switch Account",
    login: "Login",
    noUsers: "No accounts found. Create one to start!",
    deleteUser: "Delete"
  },
  zh: {
    title: "单词大冒险",
    subtitle: "您的AI英语学习伙伴",
    chooseTopic: "选择一个主题",
    wordCount: "背词数量",
    daily: "日常生活",
    school: "学校与学习",
    travel: "旅行与美食",
    nature: "自然与动物",
    feelings: "情感与情绪",
    start: "开始冒险",
    poweredBy: "由 Google Gemini 2.5 Flash 提供支持",
    loadingTitle: "正在生成学习计划...",
    loadingDesc: "AI 正在基于人教精通版为您定制词汇",
    generatingAvatar: "正在绘制您的头像...",
    progress: "进度",
    score: "得分",
    streak: "连胜",
    giveUp: "我放弃",
    check: "检查答案",
    next: "下一个",
    correctMsg: "回答正确！太棒了！",
    wrongMsg: "不太对哦，再试一次！",
    sessionComplete: "练习完成！",
    perfect: "完美得分！",
    awesome: "表现出色！",
    good: "做得很好！",
    effort: "继续加油！",
    accuracy: "准确率",
    playAgain: "再玩一次",
    reviewMistakes: "查看错题本",
    practiceMistakes: "复习这些单词",
    practiceMode: "错题复习模式",
    home: "返回首页",
    viewStats: "查看统计",
    statsTitle: "学习统计",
    wordsLearned: "学习单词",
    mistakesMade: "错误数",
    mistakeTitle: "错题本",
    mistakeEmpty: "还没有错题记录哦！",
    mistakeCleared: "已移出错题本！",
    mistakeKeep: "继续加油！",
    errorTitle: "哎呀！出错了",
    retry: "重试",
    // Auth & Profile
    welcomeBack: "欢迎回来",
    createProfile: "创建新档案",
    enterName: "输入你的名字",
    selectGrade: "选择年级",
    grade7: "初一 (七年级)",
    grade8: "初二 (八年级)",
    grade9: "初三 (九年级)",
    grade10: "高一 (十年级)",
    grade11: "高二 (十一年级)",
    grade12: "高三 (十二年级)",
    avatarDesc: "描述一下你自己 (生成卡通头像)",
    avatarPlaceholder: "例如：一只戴眼镜的酷猫...",
    createAndStart: "创建并开始",
    switchUser: "切换账号",
    login: "登录",
    noUsers: "暂无账号，快去创建一个吧！",
    deleteUser: "删除"
  }
};