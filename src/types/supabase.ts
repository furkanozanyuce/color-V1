export interface Database {
    public: {
      Tables: {
        game_sessions: {
          Row: {
            id: string;
            user_nickname: string;
            score: number;
            level_reached: number;
            created_at: string;
            ended_at: string | null;
          };
          Insert: {
            user_nickname: string;
            score?: number;
            level_reached?: number;
            ended_at?: string | null;
          };
          Update: {
            score?: number;
            level_reached?: number;
            ended_at?: string | null;
          };
        };
      };
    };
  }