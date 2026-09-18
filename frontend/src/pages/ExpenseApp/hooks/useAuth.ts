import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { clearToken, getToken, saveToken } from "../auth";
import { AuthUser, fetchCurrentUser } from "../authApi";

interface UseAuthResult {
  user: AuthUser | null;
  /** 保存済みトークンの確認が終わったか (終わるまで画面の出し分けを保留する) */
  checked: boolean;
  authenticate: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setChecked(true);
      return;
    }

    fetchCurrentUser()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setChecked(true));
  }, []);

  const authenticate = useCallback((token: string, authUser: AuthUser) => {
    saveToken(token);
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    // 次にログインした人へ前のユーザーのデータが残らないようキャッシュを破棄する
    queryClient.clear();
  }, [queryClient]);

  return { user, checked, authenticate, logout };
}
