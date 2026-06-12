export interface Course {
  id: number; title: string; icon: string; instructor: string;
  participants: number; duration: string; room: string;
  status: 'live' | 'upcoming' | 'idle'; schedule: string;
}
export interface ScheduleItem {
  id: number; day: string; start: string; end: string;
  course: string; room: string; lecturer: string; color: string;
}
export interface GradeCourse {
  name: string; sks: number;
  components: { tugas?: number; uts?: number; uas?: number; praktikum?: number };
  grade: string; passed: boolean;
}
export interface GradeSemester { name: string; gpa: number; totalSks: number; courses: GradeCourse[]; }
export interface AttendanceRecord { id: number; date: string; checkin: string; checkout: string | null; }
