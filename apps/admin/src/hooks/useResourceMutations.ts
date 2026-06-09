// CRUD 뮤테이션 공통 처리: 저장(성공 시 true)·삭제(confirm 후 실행).
// 성공 시 reload로 재동기화, 실패 시 setError + console.error.
export const useResourceMutations = (
  reload: () => void,
  setError: (message: string | null) => void
) => {
  const runSave = async (
    mutate: () => Promise<unknown>,
    errorMessage: string
  ): Promise<boolean> => {
    try {
      await mutate();
      reload();
      return true;
    } catch (err) {
      setError(errorMessage);
      console.error(err);
      return false;
    }
  };

  const runDelete = async (
    mutate: () => Promise<unknown>,
    errorMessage: string,
    confirmMessage = "정말 삭제하시겠습니까?"
  ) => {
    if (!confirm(confirmMessage)) return;
    try {
      await mutate();
      reload();
    } catch (err) {
      setError(errorMessage);
      console.error(err);
    }
  };

  return { runSave, runDelete };
};
