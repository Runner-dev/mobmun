import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useTransition } from "remix";

export default function useUpdating() {
  const transition = useTransition();
  const toastRef = useRef<string>();

  const prevTransitionState = useRef<string>();
  useEffect(() => {
    if (
      prevTransitionState &&
      prevTransitionState.current !== transition.state
    ) {
      switch (transition.state) {
        case "idle": {
          if (toastRef.current) {
            toast.success("Atualizado com sucesso", { id: toastRef.current });
            toastRef.current = "";
          }
          break;
        }
        case "submitting": {
          const updating =
            transition.submission.formData.get("_action") === "update";

          if (updating) toastRef.current = toast.loading("Atualizando");
        }
      }
    }

    prevTransitionState.current = transition.state;
  });
}
