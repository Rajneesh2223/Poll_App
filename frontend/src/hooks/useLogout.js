import { toast } from "react-toastify";
import useUserStore from "../store/useStore";
import { useMutation } from "react-query";
import logoutService from "../services/logoutService";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const mutation = useMutation(logoutService, {
    onSuccess: (data) => {
      setUser({});
      toast.success(data?.message);
      navigate('/');
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return { handleLogout };
}

export default useLogout;
